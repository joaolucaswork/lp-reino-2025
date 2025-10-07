# Configuração de Elementos Ativos - Sistema Flexível

## 📋 Visão Geral

Este documento explica como o sistema de ativação de elementos foi refatorado para ser mais configurável e menos "hard-coded". Agora você pode facilmente adicionar novos elementos que devem receber a classe `active` sem precisar modificar a lógica principal.

## 🎯 Problema Resolvido

**Antes:** Para adicionar um novo elemento que deveria receber a classe `active`, era necessário:
1. Criar uma nova constante para o seletor
2. Criar uma nova constante para a classe
3. Adicionar lógica específica na função de toggle
4. Repetir isso em múltiplos arquivos

**Depois:** Agora basta adicionar uma linha na configuração!

## 🔧 Arquivos Modificados

### 1. `src/utils/profile-card-toggle.ts`

Este arquivo gerencia o toggle do profile card quando o usuário clica nele.

#### Configuração

```typescript
/**
 * Configuration for additional elements to toggle
 */
interface AdditionalToggleElement {
  /** CSS selector for the element (relative to profile card) */
  selector: string;
  /** Class name to toggle */
  activeClass: string;
}

/**
 * Additional elements to toggle when profile card is activated
 */
const ADDITIONAL_TOGGLE_ELEMENTS: AdditionalToggleElement[] = [
  { selector: '.visual-block-card', activeClass: 'active' },
  { selector: '.shadow-yellow', activeClass: 'active' },
];
```

#### Como Adicionar Novos Elementos

Para adicionar um novo elemento que deve ser ativado quando o card é clicado:

```typescript
const ADDITIONAL_TOGGLE_ELEMENTS: AdditionalToggleElement[] = [
  { selector: '.visual-block-card', activeClass: 'active' },
  { selector: '.shadow-yellow', activeClass: 'active' },
  { selector: '.seu-novo-elemento', activeClass: 'active' }, // ← Adicione aqui!
];
```

### 2. `src/utils/typebot-name-replacer.ts`

Este arquivo gerencia a ativação do profile card quando o nome é preenchido no Typebot.

#### Configuração

```typescript
/**
 * Configuration for the name replacer
 */
interface NameReplacerConfig {
  // ... outras configurações
  /** Additional elements to activate (relative to profile card) */
  additionalActiveElements?: string[];
  // ...
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<NameReplacerConfig> = {
  // ... outras configurações
  additionalActiveElements: ['.shadow-yellow', '.visual-block-card'],
  // ...
};
```

#### Como Adicionar Novos Elementos

Para adicionar um novo elemento que deve ser ativado quando o nome é preenchido:

```typescript
const DEFAULT_CONFIG: Required<NameReplacerConfig> = {
  // ... outras configurações
  additionalActiveElements: [
    '.shadow-yellow',
    '.visual-block-card',
    '.seu-novo-elemento', // ← Adicione aqui!
  ],
  // ...
};
```

Ou ao instanciar a classe:

```typescript
const nameReplacer = new TypebotNameReplacer({
  additionalActiveElements: [
    '.shadow-yellow',
    '.visual-block-card',
    '.meu-elemento-customizado',
  ],
});
```

## 📝 Exemplos de Uso

### Exemplo 1: Adicionar um Novo Elemento de Sombra

Suponha que você queira adicionar um elemento `.shadow-blue` que deve ser ativado junto com o card:

**profile-card-toggle.ts:**
```typescript
const ADDITIONAL_TOGGLE_ELEMENTS: AdditionalToggleElement[] = [
  { selector: '.visual-block-card', activeClass: 'active' },
  { selector: '.shadow-yellow', activeClass: 'active' },
  { selector: '.shadow-blue', activeClass: 'active' }, // Novo!
];
```

**typebot-name-replacer.ts:**
```typescript
const DEFAULT_CONFIG: Required<NameReplacerConfig> = {
  // ...
  additionalActiveElements: [
    '.shadow-yellow',
    '.visual-block-card',
    '.shadow-blue', // Novo!
  ],
  // ...
};
```

### Exemplo 2: Usar Classes Diferentes

Se você quiser usar uma classe diferente de `active`:

**profile-card-toggle.ts:**
```typescript
const ADDITIONAL_TOGGLE_ELEMENTS: AdditionalToggleElement[] = [
  { selector: '.visual-block-card', activeClass: 'active' },
  { selector: '.shadow-yellow', activeClass: 'active' },
  { selector: '.special-element', activeClass: 'highlighted' }, // Classe diferente!
];
```

**typebot-name-replacer.ts:**
```typescript
// Nota: O typebot-name-replacer usa a mesma classe para todos os elementos
// Se precisar de classes diferentes, você pode modificar a lógica em activateProfileCard()
```

## 🎨 Estrutura HTML Esperada

Os elementos adicionais devem estar **dentro** do `.profile-card_wrapper`:

```html
<div class="profile-card_wrapper">
  <!-- Conteúdo do card -->
  <div class="visual-block-card"></div>
  <div class="shadow-yellow"></div>
  <!-- Seus novos elementos aqui -->
</div>
```

## ✅ Benefícios da Nova Abordagem

1. **Menos Código Duplicado**: A lógica de toggle é centralizada
2. **Fácil Manutenção**: Adicionar/remover elementos é trivial
3. **Mais Legível**: A configuração está claramente separada da lógica
4. **Type-Safe**: TypeScript garante que a configuração está correta
5. **Flexível**: Suporta diferentes seletores e classes

## 🔍 Como Funciona Internamente

### profile-card-toggle.ts

```typescript
const toggleAllCards = (isActive: boolean): void => {
  const cards = document.querySelectorAll<HTMLElement>(PROFILE_CARD_SELECTOR);
  cards.forEach((card) => {
    // Toggle no card principal
    card.classList.toggle(ACTIVE_CLASS, isActive);

    // Toggle em todos os elementos adicionais
    ADDITIONAL_TOGGLE_ELEMENTS.forEach(({ selector, activeClass }) => {
      const element = card.querySelector<HTMLElement>(selector);
      if (element) {
        element.classList.toggle(activeClass, isActive);
      }
    });
  });
};
```

### typebot-name-replacer.ts

```typescript
private activateProfileCard(): void {
  const profileCard = document.querySelector(this.config.profileCardSelector);
  if (!profileCard) return;

  // Ativa o card principal
  profileCard.classList.add(this.config.activeClass);

  // Ativa todos os elementos adicionais
  this.config.additionalActiveElements.forEach((selector) => {
    const element = profileCard.querySelector(selector);
    if (element) {
      element.classList.add(this.config.activeClass);
    }
  });
}
```

## 🚀 Próximos Passos

Se você precisar de ainda mais flexibilidade, considere:

1. **Configuração Externa**: Mover a configuração para um arquivo JSON
2. **Classes Diferentes por Elemento**: Permitir classes diferentes no typebot-name-replacer
3. **Callbacks Customizados**: Permitir funções customizadas para cada elemento
4. **Animações**: Adicionar suporte para animações específicas por elemento

## 📚 Referências

- [Webflow Source Files](../webflow-source-files/)
- [Profile Card Toggle](../src/utils/profile-card-toggle.ts)
- [Typebot Name Replacer](../src/utils/typebot-name-replacer.ts)

---

**Última atualização:** 2025-01-07

