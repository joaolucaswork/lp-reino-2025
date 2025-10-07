# ⚡ Guia Rápido: Testar no Webflow

## 🎯 Problema

❌ `http://localhost:3000` não funciona no Webflow porque:
- Webflow usa HTTPS
- Localhost não é acessível publicamente

## ✅ Solução Rápida (2 minutos)

### Passo 1: Instalar ngrok

```bash
# macOS
brew install ngrok

# Ou baixe: https://ngrok.com/download
```

### Passo 2: Iniciar servidor

```bash
# Terminal 1
pnpm dev
```

### Passo 3: Criar túnel HTTPS

```bash
# Terminal 2
./test-webflow.sh
```

Ou manualmente:
```bash
ngrok http 3000
```

### Passo 4: Copiar URL

Você verá algo como:
```
✅ Túnel HTTPS criado com sucesso!

📋 URL do seu script:
   https://abc123.ngrok-free.app/index.js

📝 Adicione no Webflow Custom Code (Footer):
   <script defer src="https://abc123.ngrok-free.app/index.js"></script>
```

### Passo 5: Adicionar no Webflow

1. Abra Webflow
2. **Project Settings** → **Custom Code**
3. Cole no **Footer Code**:
   ```html
   <script defer src="https://abc123.ngrok-free.app/index.js"></script>
   ```
4. **Save Changes**
5. Clique em **Preview**

### Passo 6: Testar

1. Abra o Preview
2. Pressione **F12** (DevTools)
3. Vá na aba **Console**
4. Você deve ver:
   ```
   Card Info Elements State
     wrapper: ✓ Found
     name: ✓ Found
     title: ✓ Found
     date: ✓ Found
   ```
5. Observe o card:
   - ✅ Data atualizada
   - ✅ Título rotacionando

---

## 🔄 Fluxo de Trabalho

```
Terminal 1: pnpm dev          → Servidor local
Terminal 2: ./test-webflow.sh → Túnel HTTPS
Webflow: Preview              → Testa mudanças
```

**Vantagem:** Mudanças no código aparecem automaticamente no Webflow!

---

## 🚀 Para Produção

Quando estiver pronto para publicar:

```bash
# 1. Build
pnpm build

# 2. Deploy (escolha uma opção)

# Opção A: GitHub Pages
git add dist/index.js
git commit -m "Production build"
git push
# Ativar GitHub Pages: Settings → Pages → Source: main → /dist

# Opção B: Netlify
# Arraste dist/ em: https://app.netlify.com/drop

# Opção C: Vercel
vercel dist --prod
```

# 3. Atualizar Webflow
```html
<!-- Trocar URL temporária por URL permanente -->
<script defer src="https://seu-cdn.com/index.js"></script>
```

---

## ❓ FAQ

### Q: O túnel ngrok expira?
**A:** Sim, após algumas horas. Basta rodar `./test-webflow.sh` novamente.

### Q: Preciso pagar pelo ngrok?
**A:** Não, a versão gratuita funciona perfeitamente para testes.

### Q: Posso usar outro túnel?
**A:** Sim! Cloudflare Tunnel, localtunnel, etc. Veja `WEBFLOW-TESTING-GUIDE.md`

### Q: Como sei se está funcionando?
**A:** Abra DevTools (F12) no Webflow Preview e veja o Console.

---

## 🎯 Resumo

| Etapa | Comando | Tempo |
|-------|---------|-------|
| 1. Instalar ngrok | `brew install ngrok` | 30s |
| 2. Servidor local | `pnpm dev` | 5s |
| 3. Túnel HTTPS | `./test-webflow.sh` | 5s |
| 4. Adicionar no Webflow | Copiar/colar script | 30s |
| 5. Testar | Preview + F12 | 10s |

**Total: ~2 minutos** ⚡

