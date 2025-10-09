# Integração Typebot + Swiper - Script de Conclusão

Este documento contém o script necessário para disparar a transição do Swiper quando o usuário finaliza o formulário do Typebot.

## 📋 Script para Copiar

Copie o script abaixo e cole no **último bloco** do seu fluxo do Typebot:

```javascript
window.parent.postMessage({
  type: 'typebot-completion'
}, '*');
```

## 🎯 Onde Adicionar no Typebot

### Passo a Passo:

1. **Acesse o Typebot Builder** (https://typebot.io)
2. **Abra o fluxo** `captura-landing-page-7sjfh99`
3. **Vá até o último bloco** do fluxo (após a última pergunta/ação)
4. **Adicione um bloco de "Script"** ou "Code"
5. **Cole o script acima** no campo de código
6. **Salve e publique** o fluxo

### Exemplo Visual:

```
[Pergunta 1: Nome] 
    ↓
[Pergunta 2: Email]
    ↓
[Pergunta 3: Telefone]
    ↓
[Mensagem Final: "Obrigado!"]
    ↓
[SCRIPT DE CONCLUSÃO] ← ADICIONE AQUI
```

## 🔧 Como Funciona

1. **Usuário preenche** todas as perguntas do Typebot
2. **Typebot executa** o script de conclusão
3. **Script dispara** o evento `typebot-completion` via `postMessage`
4. **SwiperController detecta** o evento
5. **Aguarda 500ms** (para suavizar a transição)
6. **Swiper faz a transição vertical** do slide 1 para o slide 2
7. **Usuário vê** a mensagem de sucesso e o vídeo exclusivo

## 🎨 Personalização (Opcional)

Se você quiser adicionar dados extras ao evento, pode modificar o script:

```javascript
window.parent.postMessage({
  type: 'typebot-completion',
  data: {
    timestamp: new Date().toISOString(),
    formCompleted: true
  }
}, '*');
```

## 🐛 Troubleshooting

### O slide não está mudando?

**Verifique:**

1. ✅ O script está no **último bloco** do fluxo do Typebot
2. ✅ O Typebot está **publicado** (não apenas salvo)
3. ✅ Abra o **Console do navegador** (F12) e procure por:
   ```
   [SwiperController] Typebot form completed, transitioning to slide 2
   ```
4. ✅ Verifique se há erros no console

### Como testar localmente?

Abra o console do navegador (F12) e execute:

```javascript
// Simular conclusão do Typebot
window.postMessage({
  type: 'typebot-completion'
}, '*');
```

Você deve ver o slide mudar imediatamente.

### Debug Mode

O SwiperController já está com debug habilitado. No console você verá:

```
[SwiperController] Swiper initialized successfully
[SwiperController] Typebot form completed, transitioning to slide 2
[SwiperController] Transitioning to slide 2
[SwiperController] Slide changed to index: 1
```

## 📝 Notas Importantes

- ⚠️ **Não remova** o script após adicionar
- ⚠️ **Não modifique** o `type: 'typebot-completion'` (o SwiperController espera exatamente esse valor)
- ⚠️ O script usa `window.parent.postMessage` porque o Typebot está em um iframe
- ⚠️ O `'*'` no segundo parâmetro permite que qualquer origem receba a mensagem (seguro neste caso)

## 🔗 Arquivos Relacionados

- **SwiperController**: `src/utils/swiper-controller.ts`
- **Inicialização**: `src/index.ts`
- **HTML Structure**: `webflow-source-files/index.html` (READ-ONLY)

## 📞 Suporte

Se você encontrar problemas:

1. Verifique o console do navegador para erros
2. Confirme que o Typebot está publicado
3. Teste o script manualmente no console
4. Verifique se o build foi executado (`pnpm build`)

---

**Última atualização**: 2025-01-09

