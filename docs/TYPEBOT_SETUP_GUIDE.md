# 🚀 Guia de Configuração do Typebot

## ⚠️ IMPORTANTE: Configuração Necessária no Typebot

Para que a funcionalidade de substituição de nome funcione, **você PRECISA adicionar um bloco de Script no seu Typebot**. O Typebot não envia eventos `postMessage` automaticamente.

---

## 📋 Passo a Passo

### 1. Acesse o Editor do Typebot

1. Acesse: <https://typebot.io>
2. Faça login na sua conta
3. Abra o Typebot: `captura-landing-page-7sjfh99`

### 2. Adicione um Bloco de Script

#### Opção A: Enviar Nome em Tempo Real (Recomendado)

Adicione um bloco de **Script** logo **APÓS** o campo onde o usuário digita o nome:

```javascript
// Enviar o nome assim que for capturado
// IMPORTANTE: Use {{nome}} SEM aspas para obter o valor real
if (typeof {{nome}} !== 'undefined' && {{nome}} !== null && {{nome}} !== '') {
  const nomeValue = {{nome}};

  window.parent.postMessage({
    type: 'typebot-variable-update',
    variable: 'nome',
    value: nomeValue
  }, '*');

  console.log('Nome enviado:', nomeValue);
}
```

**Onde adicionar:**

```
[Pergunta: Qual é o seu nome?]
        ↓
[Input: nome]
        ↓
[Script: Enviar nome] ← ADICIONE AQUI
        ↓
[Próxima pergunta...]
```

#### Opção B: Enviar Todos os Dados no Final

Adicione um bloco de **Script** no **FINAL** do fluxo do Typebot:

```javascript
// Enviar todos os dados quando o usuário completar o formulário
// IMPORTANTE: Use {{variavel}} SEM aspas para obter os valores reais
const nomeValue = {{nome}};
const emailValue = {{email}};
const telefoneValue = {{telefone}};

window.parent.postMessage({
  type: 'typebot-completion',
  data: {
    nome: nomeValue,
    email: emailValue,
    telefone: telefoneValue,
    completed: true,
    timestamp: new Date().toISOString()
  }
}, '*');

console.log('Typebot completado!', { nome: nomeValue, email: emailValue });
```

**Onde adicionar:**

```
[Última pergunta]
        ↓
[Mensagem de agradecimento]
        ↓
[Script: Enviar dados] ← ADICIONE AQUI
```

#### Opção C: Ambos (Melhor Experiência)

Para a melhor experiência do usuário, use **AMBAS** as opções:

1. **Script após o campo "nome"** - Para atualização em tempo real
2. **Script no final** - Para capturar todos os dados

---

## 🎯 Configuração Recomendada

### Script 1: Após o Campo "Nome"

**Localização:** Logo após o input do nome

```javascript
// Atualizar o nome e ID na página em tempo real
// IMPORTANTE: Use {{nome}} SEM aspas para valor, COM aspas para ID!
if (typeof {{nome}} !== 'undefined' && {{nome}} !== null && {{nome}} !== '') {
  const nomeValue = {{nome}};    // SEM aspas = valor real
  const nomeId = '{{nome}}';     // COM aspas = ID da variável

  window.parent.postMessage({
    type: 'typebot-variable-update',
    variable: 'nome',
    value: nomeValue,
    variableId: nomeId  // Enviar o ID também
  }, '*');

  console.log('Nome enviado:', nomeValue);
  console.log('ID da variável:', nomeId);
}
```

### Script 2: No Final do Fluxo

**Localização:** Último bloco do Typebot

```javascript
// Enviar todos os dados coletados
// IMPORTANTE: Use {{variavel}} SEM aspas para valor, COM aspas para ID!
const nomeValue = {{nome}};           // SEM aspas = valor
const nomeId = '{{nome}}';            // COM aspas = ID
const emailValue = {{email}};
const telefoneValue = {{telefone}};
const patrimonioValue = {{patrimonio}};

window.parent.postMessage({
  type: 'typebot-completion',
  data: {
    nome: nomeValue,
    userId: nomeId,  // Enviar o ID do usuário
    email: emailValue,
    telefone: telefoneValue,
    patrimonio: patrimonioValue,
    completed: true,
    timestamp: new Date().toISOString()
  }
}, '*');

console.log('Typebot completado com sucesso!');
console.log('Dados:', { nome: nomeValue, userId: nomeId, email: emailValue });
```

---

## 🔍 Como Adicionar um Bloco de Script no Typebot

### Passo 1: Abra o Editor

1. No dashboard do Typebot, clique no seu bot
2. Clique em "Edit" para abrir o editor visual

### Passo 2: Adicione o Bloco

1. Clique no botão **"+"** onde você quer adicionar o script
2. Procure por **"Script"** ou **"Code"**
3. Selecione o bloco de **Script**

### Passo 3: Cole o Código

1. Cole um dos códigos acima no editor de script
2. Certifique-se de que as variáveis (ex: `{{nome}}`) correspondem às suas variáveis do Typebot

### Passo 4: Salve e Publique

1. Clique em **"Save"**
2. Clique em **"Publish"** para publicar as alterações
3. Teste o fluxo

---

## ✅ Verificação

### Como Testar se Está Funcionando

1. **Abra a página no navegador**
2. **Abra o Console do navegador** (F12 → Console)
3. **Preencha o Typebot** com um nome
4. **Verifique no console** se aparecem as mensagens:

```
[TypebotNameReplacer] Typebot variable "nome" updated: João Silva
[TypebotNameReplacer] User name updated to: João Silva
[TypebotNameReplacer] Found 1 element(s) to update
[TypebotNameReplacer] Updated element: "******" -> "João Silva"
```

5. **Verifique visualmente** se os asteriscos foram substituídos pelo nome

---

## 🐛 Troubleshooting

### Problema: Asteriscos não são substituídos

**Possíveis causas:**

1. ❌ Script não foi adicionado no Typebot
2. ❌ Nome da variável está incorreto (deve ser `{{nome}}`)
3. ❌ Typebot não foi publicado após adicionar o script
4. ❌ Cache do navegador

**Soluções:**

```javascript
// 1. Verifique se o script está correto no Typebot
// 2. Confirme que a variável se chama "nome" (não "name" ou "Nome")
// 3. Publique o Typebot novamente
// 4. Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)
```

### Problema: Console mostra erro "postMessage is not defined"

**Solução:**

Certifique-se de usar `window.parent.postMessage` (não apenas `postMessage`):

```javascript
// ✅ CORRETO
window.parent.postMessage({...}, '*');

// ❌ ERRADO
postMessage({...}, '*');
```

### Problema: Eventos não são capturados

**Solução:**

Verifique se o código JavaScript foi compilado e está carregado:

```javascript
// No console do navegador, digite:
console.log(window.Webflow);

// Deve mostrar um array com funções
```

---

## 📊 Estrutura Completa do Typebot

### Exemplo de Fluxo Recomendado

```
1. [Mensagem de Boas-vindas]
   "Olá! Vamos começar?"
        ↓
2. [Pergunta: Nome]
   "Qual é o seu nome?"
        ↓
3. [Input: nome]
   Variável: nome
        ↓
4. [Script: Enviar Nome] ← ADICIONE ESTE SCRIPT
   window.parent.postMessage({
     type: 'typebot-variable-update',
     variable: 'nome',
     value: {{nome}}
   }, '*');
        ↓
5. [Pergunta: Email]
   "Qual é o seu email?"
        ↓
6. [Input: email]
   Variável: email
        ↓
7. [Pergunta: Telefone]
   "Qual é o seu telefone?"
        ↓
8. [Input: telefone]
   Variável: telefone
        ↓
9. [Mensagem de Agradecimento]
   "Obrigado, {{nome}}!"
        ↓
10. [Script: Enviar Dados Completos] ← ADICIONE ESTE SCRIPT
    window.parent.postMessage({
      type: 'typebot-completion',
      data: {
        nome: {{nome}},
        email: {{email}},
        telefone: {{telefone}},
        completed: true,
        timestamp: new Date().toISOString()
      }
    }, '*');
```

---

## 🎨 Variáveis Disponíveis

Certifique-se de que estas variáveis existem no seu Typebot:

| Variável | Tipo | Obrigatória | Descrição |
|----------|------|-------------|-----------|
| `nome` | Text | ✅ Sim | Nome do usuário |
| `email` | Email | ⚠️ Recomendado | Email do usuário |
| `telefone` | Phone | ⚠️ Recomendado | Telefone do usuário |
| `patrimonio` | Text | ❌ Opcional | Patrimônio do investidor |

---

## 📝 Checklist de Configuração

Antes de testar em produção, verifique:

- [ ] Script adicionado após o campo "nome"
- [ ] Script adicionado no final do fluxo
- [ ] Variável `{{nome}}` existe no Typebot
- [ ] Typebot foi salvo
- [ ] Typebot foi publicado
- [ ] Código JavaScript foi compilado (`pnpm build`)
- [ ] Arquivo `dist/index.js` foi atualizado no Webflow
- [ ] Cache do navegador foi limpo
- [ ] Testado em modo de desenvolvimento (console aberto)
- [ ] Testado em produção

---

## 🚀 Deploy no Webflow

### Passo 1: Build do Projeto

```bash
pnpm build
```

### Passo 2: Upload do Arquivo

1. Acesse o Webflow
2. Vá em **Settings** → **Custom Code**
3. Faça upload do arquivo `dist/index.js`
4. Ou copie o conteúdo e cole no **Footer Code**

### Passo 3: Publicar

1. Clique em **Publish**
2. Teste a página publicada

---

## 💡 Dicas Avançadas

### Enviar Eventos Personalizados

Você pode enviar eventos personalizados para outras funcionalidades:

```javascript
// Enviar evento quando o usuário avança no fluxo
window.parent.postMessage({
  type: 'typebot-step-change',
  step: 'email-input',
  progress: 50
}, '*');

// Enviar evento de erro
window.parent.postMessage({
  type: 'typebot-error',
  error: 'Email inválido'
}, '*');
```

### Integrar com Google Analytics

```javascript
// No script do Typebot
window.parent.postMessage({
  type: 'typebot-completion',
  data: {
    nome: {{nome}},
    email: {{email}}
  }
}, '*');

// Enviar para GA
if (window.gtag) {
  gtag('event', 'form_submission', {
    form_name: 'typebot_lead_capture',
    user_name: {{nome}}
  });
}
```

---

## 📞 Suporte

Se você encontrar problemas:

1. **Verifique o console do navegador** para mensagens de erro
2. **Revise este guia** passo a passo
3. **Teste no ambiente de desenvolvimento** primeiro
4. **Consulte a documentação do Typebot**: <https://docs.typebot.io>

---

## ✨ Resumo

**O que você PRECISA fazer:**

1. ✅ Adicionar bloco de **Script** no Typebot após o campo "nome"
2. ✅ Adicionar bloco de **Script** no final do fluxo do Typebot
3. ✅ Publicar o Typebot
4. ✅ Fazer build do projeto (`pnpm build`)
5. ✅ Fazer upload do `dist/index.js` no Webflow
6. ✅ Testar!

**O que NÃO precisa fazer:**

- ❌ Modificar o HTML do Webflow (já está correto)
- ❌ Adicionar bibliotecas extras
- ❌ Configurar webhooks
- ❌ Instalar plugins

---

**Pronto! Agora a funcionalidade vai funcionar perfeitamente! 🎉**
