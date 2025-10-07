# Paleta de Cores das Categorias

## Visão Geral

Este documento centraliza todas as cores utilizadas para as categorias de investimento no projeto Calculadora Reino Capital. As cores são aplicadas consistentemente em todos os componentes visuais, incluindo gráficos de donut, checkboxes, badges e elementos interativos.

---

## Paleta Completa de Cores

| Categoria | Nome da Cor | Código Hex | RGB | Preview |
|-----------|-------------|------------|-----|---------|
| **Renda Fixa** | Dourado Escuro | `#a2883b` | rgb(162, 136, 59) | ![#a2883b](https://via.placeholder.com/50/a2883b/000000?text=+) |
| **Fundo de Investimento** | Dourado Brilhante | `#e3ad0c` | rgb(227, 173, 12) | ![#e3ad0c](https://via.placeholder.com/50/e3ad0c/000000?text=+) |
| **Renda Variável** | Bronze Escuro | `#5d4e2a` | rgb(93, 78, 42) | ![#5d4e2a](https://via.placeholder.com/50/5d4e2a/000000?text=+) |
| **Internacional** | Dourado Claro | `#bdaa6f` | rgb(189, 170, 111) | ![#bdaa6f](https://via.placeholder.com/50/bdaa6f/000000?text=+) |
| **COE** | Laranja Escuro | `#d17d00` | rgb(209, 125, 0) | ![#d17d00](https://via.placeholder.com/50/d17d00/000000?text=+) |
| **Previdência** | Marrom Escuro | `#8c5e00` | rgb(140, 94, 0) | ![#8c5e00](https://via.placeholder.com/50/8c5e00/000000?text=+) |
| **Outros** | Cinza Escuro | `#4f4f4f` | rgb(79, 79, 79) | ![#4f4f4f](https://via.placeholder.com/50/4f4f4f/000000?text=+) |
| **Fallback** | Prata | `#c0c0c0` | rgb(192, 192, 192) | ![#c0c0c0](https://via.placeholder.com/50/c0c0c0/000000?text=+) |

---

## Cores com Transparência (Efeitos Ripple)

Para efeitos visuais como ripple/pulse nos checkboxes, utilizamos as mesmas cores com 60% de opacidade:

| Categoria | Código RGBA | Uso |
|-----------|-------------|-----|
| **Renda Fixa** | `rgba(162, 136, 59, 0.6)` | Efeito ripple em checkboxes |
| **Fundo de Investimento** | `rgba(227, 173, 12, 0.6)` | Efeito ripple em checkboxes |
| **Renda Variável** | `rgba(93, 78, 42, 0.6)` | Efeito ripple em checkboxes |
| **Internacional** | `rgba(189, 170, 111, 0.6)` | Efeito ripple em checkboxes |
| **COE** | `rgba(209, 125, 0, 0.6)` | Efeito ripple em checkboxes |
| **Previdência** | `rgba(140, 94, 0, 0.6)` | Efeito ripple em checkboxes |
| **Outros** | `rgba(79, 79, 79, 0.6)` | Efeito ripple em checkboxes |
| **Fallback** | `rgba(212, 171, 7, 0.6)` | Efeito ripple padrão (dourado) |

---

## Aplicações das Cores

### 1. Gráfico de Donut (D3.js)

As cores são definidas no objeto `categoryColors` em `src/modules/d3-donut-chart-section5.js`:

```javascript
this.categoryColors = {
  'Renda Fixa': '#a2883b',
  'Fundo de Investimento': '#e3ad0c',
  'Renda Variável': '#5d4e2a',
  'Internacional': '#bdaa6f',
  'COE': '#d17d00',
  'Previdência': '#8c5e00',
  'Outro': '#4f4f4f',
  'Outros': '#4f4f4f',
};
```

### 2. Checkboxes de Seleção

Aplicadas em `src/css/asset-selection-filter.css` usando seletores de atributo:

```css
/* Exemplo: Renda Fixa */
.ativos_item[ativo-category='Renda Fixa'] .asset-checkbox:hover {
  border-color: #a2883b;
}

.ativos_item[ativo-category='Renda Fixa'] .asset-checkbox:checked {
  background-color: #a2883b;
  border-color: #a2883b;
}
```

### 3. Badges de Categoria (::before)

Aplicadas em `src/css/categoria-ativo-styling.css`:

```css
/* Exemplo: Renda Fixa */
.categoria-ativo[ativo-category="Renda Fixa"]::before {
  background-color: #a2883b;
}
```

### 4. Efeitos de Hover

Aplicadas em elementos interativos para feedback visual consistente.

---

## Histórico de Mudanças

### Atualização: Renda Variável (09/01/2025)

- **Cor Anterior:** `#776a41` (oliva escuro)
- **Cor Nova:** `#5d4e2a` (bronze escuro)
- **Motivo:** Melhorar diferenciação visual em relação à Renda Fixa (`#a2883b`)
- **Benefícios:**
  - Maior contraste entre categorias
  - Mantém harmonia com paleta existente
  - Melhora acessibilidade para usuários com daltonismo

---

## Princípios de Design

### 1. Consistência

Todas as cores são aplicadas de forma consistente em todos os componentes do sistema.

### 2. Acessibilidade

As cores foram escolhidas para proporcionar contraste adequado e diferenciação clara entre categorias.

### 3. Harmonia Visual

A paleta utiliza tons quentes (dourados, marrons, laranjas) que transmitem confiança e profissionalismo, adequados ao contexto financeiro.

### 4. Hierarquia

- **Cores mais brilhantes** (Fundo de Investimento): Maior destaque
- **Cores médias** (Renda Fixa, Internacional): Destaque moderado
- **Cores escuras** (Renda Variável, Previdência): Menor destaque
- **Cinza** (Outros): Categoria neutra/residual

---

## Arquivos que Utilizam as Cores

### JavaScript

- `src/modules/d3-donut-chart-section5.js` - Definição principal das cores

### CSS

- `src/css/asset-selection-filter.css` - Checkboxes e efeitos ripple
- `src/css/categoria-ativo-styling.css` - Badges de categoria
- `src/css/category-hover-effects.css` - Efeitos de hover

### Documentação

- `docs/category-color-system.md` - Sistema de cores completo
- `docs/checkbox-color-synchronization.md` - Sincronização de cores
- `.augment/rules/cor-sistema.md` - Regras do sistema de cores

---

## Uso Recomendado

### Para Desenvolvedores

1. **Sempre use as cores definidas neste documento** para manter consistência
2. **Não invente novas cores** sem documentar e atualizar este arquivo
3. **Use o atributo `ativo-category`** para aplicar cores automaticamente via CSS
4. **Teste a acessibilidade** ao adicionar novos componentes com cores

### Para Designers

1. **Mantenha a paleta existente** ao criar novos componentes
2. **Considere contraste e legibilidade** ao usar as cores
3. **Documente qualquer nova aplicação** das cores neste arquivo

---

## Referências Técnicas

### Seletores CSS Utilizados

```css
/* Seletor por atributo de categoria */
[ativo-category="Nome da Categoria"]

/* Exemplos de aplicação */
.ativos_item[ativo-category="Renda Fixa"]
.categoria-ativo[ativo-category="Fundo de Investimento"]
.patrimonio_interactive_item[ativo-category="Internacional"]
```

### Estrutura de Dados JavaScript

```javascript
// Objeto de mapeamento categoria → cor
const categoryColors = {
  'Nome da Categoria': '#hexcode',
  // ...
};

// Uso com D3.js
const color = d3.scaleOrdinal()
  .domain(categories)
  .range(Object.values(categoryColors));
```

---

## Notas Importantes

1. **Cor Fallback:** `#c0c0c0` (prata) é usada para categorias não mapeadas
2. **Variações "Outro" vs "Outros":** Ambas usam a mesma cor `#4f4f4f`
3. **Arquivos Read-Only:** Os arquivos em `static_files/` (Webflow) não devem ser editados manualmente
4. **Sincronização:** Qualquer mudança de cor deve ser propagada para todos os arquivos listados acima

---

## Contato e Suporte

Para dúvidas sobre o sistema de cores ou sugestões de melhorias, consulte:

- Documentação técnica em `docs/category-color-system.md`
- Regras do sistema em `.augment/rules/cor-sistema.md`

---

**Última Atualização:** Janeiro 2025  
**Versão:** 1.1  
**Status:** ✅ Ativo e em uso
