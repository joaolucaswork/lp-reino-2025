# 🧪 Guia de Testes no Webflow

## ❌ Problema: Localhost não funciona no Webflow

Quando você tenta usar `http://localhost:3000/index.js` no Webflow, não funciona porque:

1. **Mixed Content:** Webflow usa HTTPS, mas localhost usa HTTP
2. **Acesso Local:** Webflow não consegue acessar sua máquina local
3. **CORS:** Navegador bloqueia requisições cross-origin

---

## ✅ Solução 1: Túnel HTTPS com ngrok (Recomendado)

### Passo 1: Instalar ngrok

```bash
# macOS (Homebrew)
brew install ngrok

# Ou baixar de: https://ngrok.com/download
```

### Passo 2: Iniciar servidor local

```bash
# Terminal 1: Inicia o servidor de desenvolvimento
pnpm dev
```

Você verá:
```
┌─────────┬──────────────────────────────────────────────────┐
│ (index) │ File Location                                    │
├─────────┼──────────────────────────────────────────────────┤
│    0    │ http://localhost:3000/index.js                   │
└─────────┴──────────────────────────────────────────────────┘
```

### Passo 3: Criar túnel HTTPS

```bash
# Terminal 2: Cria túnel público HTTPS
ngrok http 3000
```

Você verá algo como:
```
ngrok

Session Status                online
Account                       seu-email@example.com
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

### Passo 4: Copiar URL HTTPS

```
https://abc123.ngrok-free.app/index.js
```

### Passo 5: Adicionar no Webflow

1. Abra seu projeto no Webflow
2. Vá em **Project Settings** → **Custom Code**
3. Cole no **Footer Code**:

```html
<script defer src="https://abc123.ngrok-free.app/index.js"></script>
```

4. Clique em **Save Changes**
5. Clique em **Preview** (não precisa publicar)

### Passo 6: Testar

1. Abra o preview do Webflow
2. Abra DevTools (F12)
3. Vá na aba **Console**
4. Você deve ver:
   ```
   ✅ Webflow.push() chamado
   Card Info Elements State
     wrapper: ✓ Found
     name: ✓ Found
     title: ✓ Found
     date: ✓ Found
   ```

5. Observe o card:
   - ✅ Data atualizada para hoje
   - ✅ Título rotacionando a cada 3 segundos

---

## ✅ Solução 2: Cloudflare Tunnel (Alternativa)

### Passo 1: Instalar cloudflared

```bash
# macOS (Homebrew)
brew install cloudflare/cloudflare/cloudflared

# Ou baixar de: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
```

### Passo 2: Iniciar servidor local

```bash
# Terminal 1
pnpm dev
```

### Passo 3: Criar túnel

```bash
# Terminal 2
cloudflared tunnel --url http://localhost:3000
```

Você verá:
```
2025-01-07T12:00:00Z INF +--------------------------------------------------------------------------------------------+
2025-01-07T12:00:00Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable): |
2025-01-07T12:00:00Z INF |  https://abc-def-ghi.trycloudflare.com                                                     |
2025-01-07T12:00:00Z INF +--------------------------------------------------------------------------------------------+
```

### Passo 4: Usar URL no Webflow

```html
<script defer src="https://abc-def-ghi.trycloudflare.com/index.js"></script>
```

---

## ✅ Solução 3: Deploy Temporário (Mais Estável)

Se você quer algo mais estável para testes, faça deploy temporário:

### Opção A: Netlify Drop

1. Acesse: https://app.netlify.com/drop
2. Arraste a pasta `dist/` para o site
3. Copie a URL gerada: `https://random-name.netlify.app/index.js`
4. Use no Webflow

### Opção B: Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
pnpm build
vercel dist --prod

# Copiar URL gerada
```

### Opção C: GitHub Pages (Rápido)

```bash
# 1. Build
pnpm build

# 2. Commit e push
git add dist/index.js
git commit -m "Test build"
git push

# 3. Ativar GitHub Pages
# Settings → Pages → Source: main branch → /dist folder

# 4. URL: https://joaolucaswork.github.io/lp-reino-2025/index.js
```

---

## 🔧 Fluxo de Desenvolvimento Recomendado

### Durante Desenvolvimento:

```
┌─────────────────────────────────────────────────────────────┐
│ Terminal 1: pnpm dev                                        │
│ Terminal 2: ngrok http 3000                                 │
│ Webflow: <script src="https://ngrok-url/index.js">         │
│ Preview: Testa mudanças em tempo real                      │
└─────────────────────────────────────────────────────────────┘
```

**Vantagens:**
- ✅ Hot reload funciona
- ✅ Mudanças aparecem instantaneamente no Webflow Preview
- ✅ Não precisa fazer deploy a cada mudança

### Para Produção:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. pnpm build                                               │
│ 2. Deploy para CDN (GitHub Pages / Netlify / Cloudflare)   │
│ 3. Webflow: <script src="https://cdn-url/index.js">        │
│ 4. Publish: Publica o site                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Problema: "ERR_CONNECTION_REFUSED"

**Causa:** Servidor local não está rodando

**Solução:**
```bash
# Certifique-se que o servidor está ativo
pnpm dev
```

---

### Problema: "Mixed Content Block"

**Causa:** Tentando carregar HTTP em página HTTPS

**Solução:**
- ✅ Use ngrok ou Cloudflare Tunnel (HTTPS)
- ❌ Não use `http://localhost:3000` diretamente

---

### Problema: "Script não carrega no Webflow Preview"

**Causa:** URL do túnel expirou ou mudou

**Solução:**
1. Verifique se ngrok/cloudflared ainda está rodando
2. Copie a nova URL se mudou
3. Atualize no Webflow Custom Code
4. Recarregue o preview

---

### Problema: "Elementos não encontrados"

**Console:**
```
Card Info Elements State
  wrapper: ✗ Missing
  name: ✗ Missing
```

**Causa:** Script carregando antes do Webflow

**Solução:**
Certifique-se que o script está no **Footer Code** (não Header):
```html
<!-- Footer Code (Before </body> tag) -->
<script defer src="https://seu-tunnel.ngrok-free.app/index.js"></script>
```

---

## 📋 Checklist de Teste

### Antes de Testar:

- [ ] ✅ `pnpm dev` rodando (Terminal 1)
- [ ] ✅ ngrok/cloudflared rodando (Terminal 2)
- [ ] ✅ URL HTTPS copiada
- [ ] ✅ Script adicionado no Webflow Footer Code
- [ ] ✅ Webflow Preview aberto

### Durante o Teste:

- [ ] ✅ Abrir DevTools Console (F12)
- [ ] ✅ Verificar se script carregou (Network tab)
- [ ] ✅ Verificar se não há erros no Console
- [ ] ✅ Verificar se data está atualizada
- [ ] ✅ Verificar se título rotaciona a cada 3s

### Se Algo Não Funcionar:

1. ✅ Verificar Console para erros
2. ✅ Verificar Network tab se script carregou
3. ✅ Verificar se túnel ainda está ativo
4. ✅ Verificar se URL está correta no Webflow
5. ✅ Recarregar página do Webflow Preview

---

## 🎯 Exemplo Completo de Sessão de Teste

```bash
# Terminal 1: Servidor de desenvolvimento
$ pnpm dev
┌─────────┬──────────────────────────────────────────────────┐
│ (index) │ File Location                                    │
├─────────┼──────────────────────────────────────────────────┤
│    0    │ http://localhost:3000/index.js                   │
└─────────┴──────────────────────────────────────────────────┘

# Terminal 2: Túnel HTTPS
$ ngrok http 3000
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000

# Webflow Custom Code (Footer):
<script defer src="https://abc123.ngrok-free.app/index.js"></script>

# Resultado no Webflow Preview:
✅ Data: 07.01.2025 (atualizada)
✅ Título: Rotacionando a cada 3s
✅ Console: Sem erros
```

---

## ✅ Resumo

| Método | Velocidade | Estabilidade | Recomendado Para |
|--------|-----------|--------------|------------------|
| **ngrok** | ⚡ Rápido | ⭐⭐⭐ Boa | Desenvolvimento ativo |
| **Cloudflare Tunnel** | ⚡ Rápido | ⭐⭐⭐⭐ Muito boa | Desenvolvimento ativo |
| **Netlify Drop** | 🐢 Lento | ⭐⭐⭐⭐⭐ Excelente | Testes pontuais |
| **GitHub Pages** | 🐢 Lento | ⭐⭐⭐⭐⭐ Excelente | Produção |

**Recomendação:** Use **ngrok** durante desenvolvimento e **GitHub Pages** para produção.

