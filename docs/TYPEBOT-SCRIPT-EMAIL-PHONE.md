# Script do Typebot - Captura de Email e Telefone

## 📋 Visão Geral

Este documento contém os scripts que você precisa adicionar no Typebot para capturar o email e telefone do usuário e enviar os eventos para a página web, acionando a animação de rotação do cartão.

---

## 🎯 Script para Capturar Email

### Quando usar:
Adicione este script **IMEDIATAMENTE APÓS** o campo onde o usuário digita o **EMAIL**.

### Script:

```javascript
// Captura o email e envia evento para a página
const email = {{email}};

if (email && email.trim() !== '') {
  // Envia evento de atualização de variável
  window.parent.postMessage({
    type: 'typebot-variable-update',
    variable: 'email',
    value: email
  }, '*');
  
  console.log('Email capturado e enviado:', email);
}
```

### ⚠️ IMPORTANTE:
- Substitua `{{email}}` pela variável do Typebot que armazena o email
- Use `{{email}}` **SEM ASPAS** - o Typebot substitui automaticamente
- Certifique-se de que a variável existe no Typebot

---

## 📱 Script para Capturar Telefone

### Quando usar:
Adicione este script **IMEDIATAMENTE APÓS** o campo onde o usuário digita o **TELEFONE**.

### Script:

```javascript
// Captura o telefone e envia evento para a página
const telefone = {{telefone}};

if (telefone && telefone.trim() !== '') {
  // Envia evento de atualização de variável
  window.parent.postMessage({
    type: 'typebot-variable-update',
    variable: 'telefone',
    value: telefone
  }, '*');
  
  console.log('Telefone capturado e enviado:', telefone);
}
```

### ⚠️ IMPORTANTE:
- Substitua `{{telefone}}` pela variável do Typebot que armazena o telefone
- Use `{{telefone}}` **SEM ASPAS** - o Typebot substitui automaticamente
- Certifique-se de que a variável existe no Typebot

---

## 🔄 Script Combinado (Email + Telefone)

Se você quiser capturar ambos em um único bloco de script (útil se os campos estão próximos):

```javascript
// Captura email e telefone e envia eventos para a página
const email = {{email}};
const telefone = {{telefone}};

// Envia evento de email
if (email && email.trim() !== '') {
  window.parent.postMessage({
    type: 'typebot-variable-update',
    variable: 'email',
    value: email
  }, '*');
  
  console.log('Email capturado:', email);
}

// Envia evento de telefone
if (telefone && telefone.trim() !== '') {
  window.parent.postMessage({
    type: 'typebot-variable-update',
    variable: 'telefone',
    value: telefone
  }, '*');
  
  console.log('Telefone capturado:', telefone);
}
```

---

## 📝 Passo a Passo de Configuração no Typebot

### 1. Acesse o Editor do Typebot
- Abra seu Typebot no editor
- Localize o fluxo onde o usuário digita o email

### 2. Adicione um Bloco de Script
1. Clique no **+** para adicionar um novo bloco
2. Selecione **"Script"** ou **"Execute Code"**
3. Cole o script de captura de email

### 3. Configure as Variáveis
- Certifique-se de que a variável `{{email}}` existe
- Se sua variável tem outro nome (ex: `{{user_email}}`), ajuste o script:

```javascript
const email = {{user_email}}; // Use o nome correto da sua variável
```

### 4. Repita para o Telefone
- Adicione outro bloco de Script após o campo de telefone
- Cole o script de captura de telefone
- Ajuste o nome da variável se necessário

### 5. Teste o Fluxo
1. Publique o Typebot
2. Teste preenchendo o formulário
3. Abra o Console do navegador (F12)
4. Verifique se os logs aparecem:
   ```
   Email capturado e enviado: user@example.com
   Telefone capturado e enviado: +55 81 99846-1310
   ```

---

## 🎨 Exemplo Visual do Fluxo no Typebot

```
┌─────────────────────────┐
│  Pergunta: Qual seu     │
│  nome?                  │
│  Variável: {{nome}}     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Script: Captura Nome   │
│  (já implementado)      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Pergunta: Qual seu     │
│  email?                 │
│  Variável: {{email}}    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Script: Captura Email  │  ← ADICIONE AQUI
│  (NOVO)                 │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Pergunta: Qual seu     │
│  telefone?              │
│  Variável: {{telefone}} │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Script: Captura        │  ← ADICIONE AQUI
│  Telefone (NOVO)        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Mensagem de            │
│  Agradecimento          │
└─────────────────────────┘
```

---

## 🔍 Verificação e Debug

### Como verificar se está funcionando:

1. **Abra o Console do Navegador** (F12 → Console)

2. **Preencha o formulário do Typebot**

3. **Verifique os logs do Typebot:**
   ```
   [TypebotEmailHandler] Typebot variable "email" updated: user@example.com
   [TypebotEmailHandler] User email updated to: user@example.com
   [TypebotEmailHandler] Triggering card rotation animation
   ```

4. **Verifique se o cartão rotacionou:**
   - O cartão deve adicionar as classes `active_fill` e `rotate`
   - O email deve aparecer no verso do cartão
   - O telefone deve aparecer no verso do cartão

### Problemas Comuns:

#### ❌ Email não está sendo capturado
- **Solução**: Verifique se o nome da variável está correto (`{{email}}`)
- **Solução**: Certifique-se de que o script está APÓS o campo de input

#### ❌ Cartão não está rotacionando
- **Solução**: Verifique se o evento está sendo enviado (console do navegador)
- **Solução**: Verifique se o `TypebotEmailHandler` foi inicializado corretamente

#### ❌ Telefone não aparece
- **Solução**: Verifique se a variável do Typebot está correta
- **Solução**: Certifique-se de que o script de telefone foi adicionado

---

## 🎯 O Que Acontece Quando o Email é Capturado

### Sequência de Eventos:

1. **Usuário digita o email no Typebot**
   ```
   user@example.com
   ```

2. **Script do Typebot envia postMessage**
   ```javascript
   {
     type: 'typebot-variable-update',
     variable: 'email',
     value: 'user@example.com'
   }
   ```

3. **TypebotEmailHandler captura o evento**
   ```
   [TypebotEmailHandler] Typebot variable "email" updated: user@example.com
   ```

4. **Email é exibido no cartão**
   ```html
   <div card-info="email">user@example.com</div>
   ```

5. **Cartão rotaciona automaticamente**
   ```html
   <div class="profile-card_wrapper active_fill rotate">
   ```

6. **Classes são atualizadas**
   - `.front-elements` perde a classe `active`
   - `.rotation-elements` ganha a classe `active`

---

## 📋 Checklist de Implementação

- [ ] Script de captura de email adicionado no Typebot
- [ ] Script de captura de telefone adicionado no Typebot
- [ ] Variáveis `{{email}}` e `{{telefone}}` configuradas corretamente
- [ ] Typebot publicado com as alterações
- [ ] Teste realizado preenchendo o formulário
- [ ] Console do navegador verificado (sem erros)
- [ ] Cartão rotaciona quando email é preenchido
- [ ] Email aparece corretamente no verso do cartão
- [ ] Telefone aparece corretamente no verso do cartão

---

## 🚀 Próximos Passos

Após adicionar os scripts no Typebot:

1. **Publique o Typebot** com as alterações
2. **Teste em ambiente de desenvolvimento** (`pnpm dev`)
3. **Verifique o console** para debug
4. **Teste em diferentes navegadores**
5. **Faça o build de produção** (`pnpm build`)

---

## 📞 Suporte

Se você encontrar problemas:

1. Verifique o console do navegador para erros
2. Certifique-se de que o `debug: true` está ativado
3. Verifique se os nomes das variáveis estão corretos
4. Teste com o script combinado se os scripts individuais não funcionarem

---

## 📚 Referências

- **Documentação do Typebot**: https://typebot.io/docs
- **PostMessage API**: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
- **Arquivo de implementação**: `src/utils/typebot-email-handler.ts`

