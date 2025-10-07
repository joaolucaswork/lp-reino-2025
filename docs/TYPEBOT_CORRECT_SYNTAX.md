# ✅ Sintaxe Correta para Acessar Variáveis do Typebot

## 🚨 Problema Identificado

Quando você usa `const nome = '{{nome}}';` no script do Typebot, ele retorna o **ID da variável** (ex: `vc6pn54zd8kbg4wlt4uflcpc9`) ao invés do **valor digitado pelo usuário**.

**Evidência do problema:**
```
[TypebotNameReplacer] Typebot variable "nome" updated: vc6pn54zd8kbg4wlt4uflcpc9
```

## ✅ Solução: Acessar Variáveis Diretamente

No Typebot, as variáveis são **avaliadas** (evaluated), não **parseadas** (parsed). Isso significa que você deve tratá-las como variáveis JavaScript reais, não como strings.

### ❌ ERRADO (Retorna o ID)

```javascript
const nome = '{{nome}}';  // Retorna: "vc6pn54zd8kbg4wlt4uflcpc9"
```

### ✅ CORRETO (Retorna o valor)

```javascript
const nome = {{nome}};  // Retorna: "João Silva"
```

**Importante:** Remova as aspas ao redor de `{{nome}}`!

---

## 📝 Scripts Corretos para o Typebot

### Script 1: Após o Campo "Nome" (Atualização em Tempo Real)

**Localização:** Logo após o input do nome

```javascript
// Verificar se a variável existe e tem valor
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

### Script 2: No Final do Fluxo (Enviar Todos os Dados)

**Localização:** Último bloco do Typebot

```javascript
// Capturar todas as variáveis
const nomeValue = {{nome}};
const emailValue = {{email}};
const telefoneValue = {{telefone}};

// Enviar todos os dados
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

console.log('Typebot completado com sucesso!');
console.log('Dados:', { nome: nomeValue, email: emailValue, telefone: telefoneValue });
```

---

## 🔍 Por Que Isso Acontece?

Segundo a [documentação oficial do Typebot](https://docs.typebot.io/editor/blocks/logic/script):

> **Variables in script are not parsed, they are evaluated.**
> 
> So it should be treated as if it were real javascript variables.
> 
> You need to write `console.log({{My variable}})` instead of `console.log("{{My variable}}")`

### Explicação Técnica

1. **Com aspas** `'{{nome}}'`:
   - O Typebot trata como uma string literal
   - Retorna o ID interno da variável
   - Resultado: `"vc6pn54zd8kbg4wlt4uflcpc9"`

2. **Sem aspas** `{{nome}}`:
   - O Typebot avalia a variável como JavaScript
   - Retorna o valor real digitado pelo usuário
   - Resultado: `"João Silva"`

---

## 🎯 Exemplo Completo

### Fluxo do Typebot

```
1. [Pergunta: Qual é o seu nome?]
        ↓
2. [Input: nome]
   Variável: nome
        ↓
3. [Script: Enviar Nome]
   if (typeof {{nome}} !== 'undefined' && {{nome}} !== null && {{nome}} !== '') {
     const nomeValue = {{nome}};
     window.parent.postMessage({
       type: 'typebot-variable-update',
       variable: 'nome',
       value: nomeValue
     }, '*');
   }
        ↓
4. [Pergunta: Qual é o seu email?]
        ↓
5. [Input: email]
   Variável: email
        ↓
6. [Mensagem de Agradecimento]
   "Obrigado, {{nome}}!"
        ↓
7. [Script: Enviar Dados Completos]
   const nomeValue = {{nome}};
   const emailValue = {{email}};
   
   window.parent.postMessage({
     type: 'typebot-completion',
     data: {
       nome: nomeValue,
       email: emailValue,
       completed: true,
       timestamp: new Date().toISOString()
     }
   }, '*');
```

---

## ✅ Checklist de Verificação

Antes de testar, certifique-se de que:

- [ ] Removeu as aspas ao redor de `{{nome}}`
- [ ] Usou `const nomeValue = {{nome}};` (sem aspas)
- [ ] Adicionou verificação `typeof {{nome}} !== 'undefined'`
- [ ] Salvou o Typebot
- [ ] Publicou o Typebot
- [ ] Limpou o cache do navegador (Ctrl+Shift+R)

---

## 🧪 Como Testar

1. **Abra o console do navegador** (F12 → Console)
2. **Preencha o Typebot** com um nome (ex: "João Silva")
3. **Verifique os logs**:

```
Nome enviado: João Silva
[TypebotNameReplacer] Typebot variable "nome" updated: João Silva
[TypebotNameReplacer] User name updated to: João Silva
[TypebotNameReplacer] Updated element: "******" -> "João Silva"
```

4. **Verifique visualmente** se os asterisks foram substituídos

---

## 🐛 Troubleshooting

### Problema: Ainda retorna o ID

**Causa:** Você ainda está usando aspas

**Solução:**
```javascript
// ❌ ERRADO
const nome = '{{nome}}';

// ✅ CORRETO
const nome = {{nome}};
```

### Problema: Erro "nome is not defined"

**Causa:** A variável não existe ou não foi preenchida

**Solução:** Adicione verificação:
```javascript
if (typeof {{nome}} !== 'undefined' && {{nome}} !== null) {
  const nomeValue = {{nome}};
  // seu código aqui
}
```

### Problema: Retorna "undefined"

**Causa:** O usuário não preencheu o campo

**Solução:** Adicione validação no Typebot para tornar o campo obrigatório

---

## 📚 Referências

- [Typebot Script Block Documentation](https://docs.typebot.io/editor/blocks/logic/script)
- [Typebot Variables Documentation](https://docs.typebot.io/editor/variables)

---

## 🎉 Resumo

**Use sempre SEM aspas:**
```javascript
const nome = {{nome}};  // ✅ CORRETO
```

**Nunca use COM aspas:**
```javascript
const nome = '{{nome}}';  // ❌ ERRADO
```

**Pronto! Agora vai funcionar perfeitamente! 🚀**

