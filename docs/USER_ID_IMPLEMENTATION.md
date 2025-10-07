# 🆔 Implementação do User ID no Profile Card

## 📋 Visão Geral

Este guia explica como implementar a funcionalidade de exibir o ID único do usuário no profile card, substituindo os asteriscos (`***************`) pelo ID da variável do Typebot.

## 🎯 Elemento Alvo

### HTML Structure (READ-ONLY Reference)

<augment_code_snippet path="webflow-source-files/index.html" mode="EXCERPT">
```html
<div class="codigo-usuario">
  <div card-info="random-code" class="random-code">***************</div>
</div>
```
</augment_code_snippet>

**Localização:** Linha 254-256 do `webflow-source-files/index.html`  
**Atributo:** `card-info="random-code"`  
**Classe:** `random-code`  
**Conteúdo Atual:** `***************` (15 asteriscos)

## 💡 Abordagem Escolhida: Reutilizar o ID da Variável

### Por Que Esta Abordagem?

1. **Já Existe**: O Typebot gera automaticamente um ID único para cada variável
2. **Único**: Cada sessão/variável tem um ID diferente
3. **Sem Configuração Extra**: Não precisa criar nova variável no Typebot
4. **Simples**: Menos código, menos manutenção

### Como Funciona

Quando você usa `'{{nome}}'` (com aspas), o Typebot retorna o ID da variável.  
Quando você usa `{{nome}}` (sem aspas), o Typebot retorna o valor.

**Vamos usar AMBOS!**

---

## 🛠️ Implementação

### Passo 1: Código TypeScript (✅ JÁ IMPLEMENTADO)

O arquivo `src/utils/typebot-name-replacer.ts` foi atualizado para:

1. **Capturar o User ID** além do nome
2. **Substituir asteriscos** em elementos com `card-info="random-code"`
3. **Fornecer métodos públicos** para acessar o user ID

**Principais mudanças:**

```typescript
// Novo seletor para user ID
userIdSelector: '[card-info="random-code"]'

// Nova propriedade privada
private userId: string | null = null;

// Novos métodos públicos
public setUserId(id: string): void
public getUserId(): string | null

// Novo método privado
private replaceUserIdAsterisks(): void
```

### Passo 2: Scripts do Typebot

Agora você precisa atualizar os scripts no Typebot para enviar TANTO o nome quanto o ID.

#### Script 1: Após o Campo "Nome" (Atualização em Tempo Real)

```javascript
// Capturar o VALOR (nome) e o ID da variável
if (typeof {{nome}} !== 'undefined' && {{nome}} !== null && {{nome}} !== '') {
  const nomeValue = {{nome}};        // SEM aspas = valor real
  const nomeId = '{{nome}}';         // COM aspas = ID da variável
  
  // Enviar o nome
  window.parent.postMessage({
    type: 'typebot-variable-update',
    variable: 'nome',
    value: nomeValue,
    variableId: nomeId  // ← NOVO: Enviar o ID também
  }, '*');
  
  console.log('Nome enviado:', nomeValue);
  console.log('ID da variável:', nomeId);
}
```

#### Script 2: No Final do Fluxo (Enviar Todos os Dados)

```javascript
// Capturar valores e IDs
const nomeValue = {{nome}};        // SEM aspas = valor
const nomeId = '{{nome}}';         // COM aspas = ID
const emailValue = {{email}};
const telefoneValue = {{telefone}};

// Enviar todos os dados
window.parent.postMessage({
  type: 'typebot-completion',
  data: {
    nome: nomeValue,
    userId: nomeId,      // ← NOVO: Enviar o ID do usuário
    email: emailValue,
    telefone: telefoneValue,
    completed: true,
    timestamp: new Date().toISOString()
  }
}, '*');

console.log('Dados enviados:', {
  nome: nomeValue,
  userId: nomeId,
  email: emailValue
});
```

---

## 🔍 Explicação Técnica

### A Mágica das Aspas

```javascript
// SEM aspas - Retorna o VALOR digitado pelo usuário
const nomeValue = {{nome}};
// Resultado: "João Silva"

// COM aspas - Retorna o ID da variável
const nomeId = '{{nome}}';
// Resultado: "vc6pn54zd8kbg4wlt4uflcpc9"
```

### Fluxo de Dados

```
1. Usuário digita "João Silva" no Typebot
        ↓
2. Script captura:
   - nomeValue = {{nome}}      → "João Silva"
   - nomeId = '{{nome}}'       → "vc6pn54zd8kbg4wlt4uflcpc9"
        ↓
3. postMessage envia ambos:
   {
     value: "João Silva",
     variableId: "vc6pn54zd8kbg4wlt4uflcpc9"
   }
        ↓
4. TypebotNameReplacer recebe e processa:
   - userName = "João Silva"
   - userId = "vc6pn54zd8kbg4wlt4uflcpc9"
        ↓
5. DOM é atualizado:
   - [card-info="name"]: "******" → "João Silva"
   - [card-info="random-code"]: "***************" → "vc6pn54zd8kbg4wlt4uflcpc9"
```

---

## ✅ Checklist de Implementação

### No Typebot

- [ ] Abra o Typebot: `captura-landing-page-7sjfh99`
- [ ] Localize o script após o campo "nome"
- [ ] Adicione a linha: `const nomeId = '{{nome}}';` (COM aspas)
- [ ] Adicione `variableId: nomeId` no postMessage
- [ ] Localize o script no final do fluxo
- [ ] Adicione a linha: `const nomeId = '{{nome}}';` (COM aspas)
- [ ] Adicione `userId: nomeId` no objeto data
- [ ] **Salve** o Typebot
- [ ] **Publique** o Typebot

### No Projeto

- [x] Código TypeScript atualizado (`src/utils/typebot-name-replacer.ts`)
- [ ] Build do projeto: `pnpm build`
- [ ] Upload do `dist/index.js` no Webflow
- [ ] Publicar o site no Webflow

### Testes

- [ ] Limpar cache do navegador (Ctrl+Shift+R)
- [ ] Abrir o console (F12)
- [ ] Preencher o Typebot com um nome
- [ ] Verificar logs no console
- [ ] Confirmar que o nome foi substituído
- [ ] Confirmar que o ID foi substituído

---

## 🧪 Como Testar

### 1. Teste Manual no Console

```javascript
// No console do navegador, após carregar a página:

// Definir nome e ID manualmente
window.typebotReplacer.setUserName('João Silva');
window.typebotReplacer.setUserId('test-user-id-12345');

// Verificar valores
console.log('Nome:', window.typebotReplacer.getUserName());
console.log('ID:', window.typebotReplacer.getUserId());
```

### 2. Teste com Typebot Real

1. Abra a página
2. Abra o console (F12)
3. Preencha o Typebot
4. Verifique os logs:

```
Nome enviado: João Silva
ID da variável: vc6pn54zd8kbg4wlt4uflcpc9
[TypebotNameReplacer] Typebot variable "nome" updated: João Silva
[TypebotNameReplacer] Typebot variable ID captured: vc6pn54zd8kbg4wlt4uflcpc9
[TypebotNameReplacer] User name updated to: João Silva
[TypebotNameReplacer] User ID updated to: vc6pn54zd8kbg4wlt4uflcpc9
[TypebotNameReplacer] Found 1 element(s) to update
[TypebotNameReplacer] Updated element: "******" -> "João Silva"
[TypebotNameReplacer] Found 1 user ID element(s) to update
[TypebotNameReplacer] Updated user ID element: "***************" -> "vc6pn54zd8kbg4wlt4uflcpc9"
```

5. Verifique visualmente:
   - Nome: `******` → `João Silva`
   - Código: `***************` → `vc6pn54zd8kbg4wlt4uflcpc9`

---

## 🎨 Resultado Visual

### Antes

```
┌─────────────────────────────┐
│  ******                     │  ← Nome
│  Investidor Explorador      │
│                             │
│  RC  •  07.10.2025          │
│  ***************            │  ← Código do Usuário
└─────────────────────────────┘
```

### Depois

```
┌─────────────────────────────┐
│  João Silva                 │  ← Nome atualizado
│  Investidor Explorador      │
│                             │
│  RC  •  07.10.2025          │
│  vc6pn54zd8kbg4wlt4uflcpc9  │  ← ID atualizado
└─────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Problema: ID não aparece

**Causa:** Script não está enviando o `variableId`

**Solução:**
```javascript
// Certifique-se de ter esta linha COM aspas:
const nomeId = '{{nome}}';

// E de enviar no postMessage:
variableId: nomeId
```

### Problema: ID aparece como "undefined"

**Causa:** Variável não existe ou está vazia

**Solução:** Adicione verificação:
```javascript
if (typeof {{nome}} !== 'undefined' && {{nome}} !== null) {
  const nomeId = '{{nome}}';
  // ...
}
```

### Problema: Ambos (nome e ID) mostram o mesmo valor

**Causa:** Usando aspas em ambos ou sem aspas em ambos

**Solução:**
```javascript
const nomeValue = {{nome}};    // SEM aspas = valor
const nomeId = '{{nome}}';     // COM aspas = ID
```

---

## 📚 Arquivos Relacionados

- `src/utils/typebot-name-replacer.ts` - Implementação principal
- `webflow-source-files/index.html` - Estrutura HTML (READ-ONLY)
- `docs/TYPEBOT_CORRECT_SYNTAX.md` - Explicação sobre aspas
- `docs/TYPEBOT_SETUP_GUIDE.md` - Guia completo do Typebot

---

## 🎉 Resumo

**Para capturar o User ID:**

1. Use `'{{nome}}'` **COM aspas** para obter o ID
2. Use `{{nome}}` **SEM aspas** para obter o valor
3. Envie ambos no `postMessage`
4. O TypeScript cuida do resto!

**Pronto! Agora você tem nome E ID do usuário no profile card! 🚀**

