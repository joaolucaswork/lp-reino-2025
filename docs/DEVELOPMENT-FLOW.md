# 🔄 Fluxo de Desenvolvimento - Reino Capital Landing Page

## 📋 Visão Geral

Este documento explica o fluxo completo de desenvolvimento, desde a escrita do código TypeScript até a integração com o Webflow em produção.

---

## 🏗️ Arquitetura do Projeto

```
Webflow (Design) → webflow-source-files/ (Referência) → src/ (Código TS) 
                                                            ↓
                                                        esbuild
                                                            ↓
                                                        dist/
                                                            ↓
                                    ┌───────────────────────┴──────────────────────┐
                                    ↓                                              ↓
                            Servidor Local (Dev)                          CDN (Produção)
                            http://localhost:3000                         Webflow Custom Code
```

---

## 🔧 Modo Desenvolvimento

### 1. Iniciar Servidor Local

```bash
pnpm dev
```

**O que acontece:**
- ✅ esbuild compila `src/index.ts` → `dist/index.js`
- ✅ Injeta código de live-reload
- ✅ Inicia servidor em `http://localhost:3000`
- ✅ Monitora mudanças em `src/` e recompila automaticamente

**Console output:**
```
┌─────────┬──────────────────────────────────────────────────┐
│ (index) │ File Location                                    │
├─────────┼──────────────────────────────────────────────────┤
│    0    │ http://localhost:3000/index.js                   │
│         │ <script defer src="http://localhost:3000/...">   │
└─────────┴──────────────────────────────────────────────────┘
```

---

### 2. Testar Localmente

Abra o arquivo `test-local.html` no navegador:

```bash
# Opção 1: Abrir diretamente
open test-local.html

# Opção 2: Usar servidor HTTP simples
npx serve .
# Acesse: http://localhost:3000/test-local.html
```

**O que você verá:**
- ✅ Card com estrutura idêntica ao Webflow
- ✅ Data atualizada automaticamente para hoje
- ✅ Título rotacionando a cada 3 segundos
- ✅ Status de inicialização

**Console do navegador:**
```
🚀 Simulando Webflow ready...
✅ Webflow.push() chamado
Card Info Elements State
  wrapper: ✓ Found
  name: ✓ Found
  title: ✓ Found
  date: ✓ Found
```

---

### 3. Desenvolvimento Iterativo

**Fluxo de trabalho:**

1. **Edite código** em `src/`:
   ```typescript
   // src/utils/card-updater.ts
   export const investorTitles = [
     'Investidor Explorador',
     'Novo Título Aqui',  // ← Adicione novo título
   ];
   ```

2. **Salve o arquivo** (Ctrl+S / Cmd+S)

3. **esbuild recompila automaticamente**:
   ```
   [watch] build finished, watching for changes...
   ```

4. **Navegador recarrega automaticamente** (live-reload)

5. **Veja as mudanças instantaneamente**

---

## 🚀 Modo Produção

### 1. Build de Produção

```bash
pnpm build
```

**O que acontece:**
- ✅ Compila TypeScript → JavaScript
- ✅ Minifica o código
- ✅ Remove source maps
- ✅ Otimiza para ES2020
- ✅ Gera `dist/index.js` (pronto para produção)

**Resultado:**
```
dist/
└── index.js  (minificado, ~5-10KB)
```

---

### 2. Hospedar o JavaScript

Faça upload de `dist/index.js` para um CDN ou hosting:

**Opções recomendadas:**

#### A) **GitHub Pages** (Grátis)
```bash
# 1. Commit e push
git add dist/index.js
git commit -m "Build production"
git push

# 2. Ativar GitHub Pages nas configurações do repo
# 3. URL: https://joaolucaswork.github.io/lp-reino-2025/dist/index.js
```

#### B) **Cloudflare Pages** (Grátis + CDN)
```bash
# 1. Conectar repo ao Cloudflare Pages
# 2. Build command: pnpm build
# 3. Output directory: dist
# 4. URL: https://lp-reino.pages.dev/index.js
```

#### C) **Netlify** (Grátis)
```bash
# 1. Conectar repo ao Netlify
# 2. Build command: pnpm build
# 3. Publish directory: dist
# 4. URL: https://lp-reino.netlify.app/index.js
```

#### D) **jsDelivr CDN** (Grátis via GitHub)
```
https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@main/dist/index.js
```

---

### 3. Integrar no Webflow

#### **Passo 1: Abrir Webflow Project Settings**
1. Acesse seu projeto no Webflow
2. Vá em **Project Settings** → **Custom Code**

#### **Passo 2: Adicionar Script no Footer**
```html
<!-- Footer Code (Before </body> tag) -->
<script defer src="https://seu-cdn.com/dist/index.js"></script>
```

**⚠️ IMPORTANTE:** O script deve vir **DEPOIS** do `webflow.js`:
```html
<!-- Ordem correta: -->
<script src="js/webflow.js"></script>
<script defer src="https://seu-cdn.com/dist/index.js"></script>
```

#### **Passo 3: Publicar o Site**
1. Clique em **Publish** no Webflow
2. Aguarde a publicação
3. Acesse o site publicado

---

## ✅ Validação e Testes

### Checklist de Validação

#### **1. Estrutura HTML (webflow-source-files/index.html)**
- [x] ✅ `<div card-info="bg-text-color">` existe (linha 210)
- [x] ✅ `<div card-info="name">` existe (linha 212)
- [x] ✅ `<div card-info="title">` existe (linha 213)
- [x] ✅ `<div card-info="elements">` existe (linha 248)
- [x] ✅ `<div card-info="mini">` existe (linha 250)
- [x] ✅ `<div card-info="date">` existe (linha 251)
- [x] ✅ `<div card-info="ilustration">` existe (linha 253)

#### **2. Código TypeScript**
- [x] ✅ `CardInfoMapper` mapeia todos os 7 atributos
- [x] ✅ `formatDate()` formata para DD.MM.YYYY
- [x] ✅ `startTitleRotation()` rotaciona títulos a cada 3s
- [x] ✅ `initCardUpdates()` inicializa tudo corretamente
- [x] ✅ Código executa dentro de `window.Webflow.push()`

#### **3. Build e Deploy**
- [ ] ⚠️ `pnpm build` executado com sucesso
- [ ] ⚠️ `dist/index.js` gerado e minificado
- [ ] ⚠️ Arquivo hospedado em CDN/hosting
- [ ] ⚠️ URL do CDN acessível publicamente

#### **4. Integração Webflow**
- [ ] ⚠️ Script adicionado no Custom Code (Footer)
- [ ] ⚠️ Script vem DEPOIS do webflow.js
- [ ] ⚠️ Site publicado no Webflow

#### **5. Testes em Produção**
- [ ] ⚠️ Abrir site publicado no navegador
- [ ] ⚠️ Abrir DevTools Console (F12)
- [ ] ⚠️ Verificar se não há erros no console
- [ ] ⚠️ Verificar se data está atualizada
- [ ] ⚠️ Verificar se título rotaciona a cada 3s

---

## 🐛 Troubleshooting

### Problema: "Elementos não encontrados"

**Console:**
```
Card Info Elements State
  wrapper: ✗ Missing
  name: ✗ Missing
```

**Solução:**
1. Verificar se o HTML do Webflow tem os atributos `card-info`
2. Verificar se o script está carregando DEPOIS do DOM
3. Usar `window.Webflow.push()` para garantir execução após load

---

### Problema: "window.Webflow is undefined"

**Console:**
```
TypeError: Cannot read property 'push' of undefined
```

**Solução:**
1. Verificar se `webflow.js` está carregando antes do seu script
2. Adicionar fallback no código:
   ```typescript
   window.Webflow ||= [];
   window.Webflow.push(() => { /* ... */ });
   ```

---

### Problema: "Script não carrega em produção"

**Possíveis causas:**
- ❌ URL do CDN incorreta
- ❌ CORS bloqueado
- ❌ Arquivo não foi feito upload
- ❌ Cache do navegador

**Solução:**
1. Testar URL diretamente no navegador
2. Verificar Network tab no DevTools
3. Limpar cache (Ctrl+Shift+R / Cmd+Shift+R)
4. Verificar CORS headers do CDN

---

## 📊 Comparação: Dev vs Produção

| Aspecto | Desenvolvimento | Produção |
|---------|----------------|----------|
| **Comando** | `pnpm dev` | `pnpm build` |
| **Servidor** | localhost:3000 | CDN/Hosting |
| **Minificação** | ❌ Não | ✅ Sim |
| **Source Maps** | ✅ Sim | ❌ Não |
| **Live Reload** | ✅ Sim | ❌ Não |
| **Tamanho** | ~50KB | ~5-10KB |
| **Target** | esnext | es2020 |

---

## 🎯 Resumo do Fluxo

```
1. Webflow → Exporta HTML/CSS → webflow-source-files/ (referência)
                                        ↓
2. Desenvolvedor → Analisa estrutura → Escreve TypeScript em src/
                                        ↓
3. pnpm dev → esbuild compila → dist/index.js (com live-reload)
                                        ↓
4. Teste local → test-local.html → Valida funcionamento
                                        ↓
5. pnpm build → esbuild minifica → dist/index.js (produção)
                                        ↓
6. Upload CDN → Hospeda index.js → URL pública
                                        ↓
7. Webflow Custom Code → Adiciona <script src="cdn/index.js">
                                        ↓
8. Publish Webflow → Site ao vivo com funcionalidade
```

---

## ✅ Conclusão

O fluxo está **perfeitamente configurado** para:

- ✅ Desenvolvimento rápido com hot reload
- ✅ Testes locais antes de deploy
- ✅ Build otimizado para produção
- ✅ Integração simples com Webflow
- ✅ Código TypeScript type-safe e modular

**Próximo passo:** Execute `pnpm dev` e abra `test-local.html` para ver tudo funcionando! 🚀

