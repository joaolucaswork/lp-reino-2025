# ⚡ Quick Start - Substituição de Nome com Typebot

## 🎯 O que faz?

Substitui automaticamente os asteriscos (`******`) na página pelo nome que o usuário digita no Typebot.

**Antes:** `******`  
**Depois:** `João Silva`

---

## ⚠️ ATENÇÃO: Configuração Obrigatória

**SEM configurar o Typebot, a funcionalidade NÃO vai funcionar!**

---

## 📝 Checklist Rápido

### ✅ Passo 1: Configure o Typebot

1. Acesse seu Typebot: `captura-landing-page-7sjfh99`
2. Adicione um bloco **Script** após o campo "nome"
3. Cole este código (**IMPORTANTE: SEM aspas ao redor de {{nome}}**):

```javascript
// Use {{nome}} SEM aspas para obter o valor real!
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

4. Adicione outro bloco **Script** no final do fluxo
5. Cole este código (**IMPORTANTE: SEM aspas ao redor das variáveis**):

```javascript
// Use {{variavel}} SEM aspas!
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

console.log('Dados enviados:', { nome: nomeValue, email: emailValue });
```

6. **Salve e Publique** o Typebot

### ✅ Passo 2: Build do Projeto

```bash
pnpm build
```

### ✅ Passo 3: Deploy no Webflow

1. Faça upload do arquivo `dist/index.js` no Webflow
2. Publique o site

### ✅ Passo 4: Teste

1. Abra a página
2. Preencha o Typebot com um nome
3. Veja os asteriscos serem substituídos! 🎉

---

## 🐛 Não está funcionando?

### Verifique

1. ✅ Scripts foram adicionados no Typebot?
2. ✅ Typebot foi publicado?
3. ✅ Projeto foi compilado (`pnpm build`)?
4. ✅ Arquivo `dist/index.js` foi atualizado no Webflow?
5. ✅ Cache do navegador foi limpo? (Ctrl+Shift+R)

### Debug

Abra o Console do navegador (F12) e procure por:

```
[TypebotNameReplacer] TypebotNameReplacer initialized and listening for events
[TypebotNameReplacer] Typebot variable "nome" updated: João Silva
[TypebotNameReplacer] User name updated to: João Silva
[TypebotNameReplacer] Found 1 element(s) to update
[TypebotNameReplacer] Updated element: "******" -> "João Silva"
```

Se não aparecer nada, o Typebot não está enviando os eventos!

---

## 📚 Documentação Completa

- **Guia Completo do Typebot**: `docs/TYPEBOT_SETUP_GUIDE.md`
- **Documentação Técnica**: `docs/typebot-name-replacement.md`
- **Resumo da Implementação**: `IMPLEMENTATION_SUMMARY.md`

---

## 💡 Dica

Teste primeiro no ambiente de desenvolvimento com o console aberto para ver os logs em tempo real!

---

**Pronto! É só isso! 🚀**
