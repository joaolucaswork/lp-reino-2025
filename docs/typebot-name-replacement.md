# Typebot Name Replacement Feature

## Overview

This feature dynamically replaces asterisks (`******`) displayed on the page with the user's name entered in the Typebot form. It provides a personalized experience by updating the profile card in real-time as the user interacts with the Typebot.

## How It Works

### 1. User Flow

1. User lands on the page and sees asterisks (`******`) in the profile card
2. User interacts with the Typebot form and enters their name in the "nome" field
3. The system listens for Typebot variable updates via `postMessage` API
4. When the "nome" variable is captured, all asterisks on the page are replaced with the user's name
5. The profile card updates in real-time to display the personalized name

### 2. Technical Implementation

The feature is implemented in `src/utils/typebot-name-replacer.ts` and consists of:

- **TypebotNameReplacer Class**: Main class that handles event listening and DOM updates
- **Message Listener**: Listens for Typebot `postMessage` events
- **Name Sanitization**: Cleans user input to prevent XSS attacks
- **DOM Updates**: Finds and updates all elements containing asterisks

### 3. Typebot Integration

The Typebot is embedded in the HTML using the standard embed method:

```html
<script type="module">
  import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js';
  Typebot.initStandard({
    typebot: 'captura-landing-page-7sjfh99',
  });
</script>
<typebot-standard style="height: 100vh"></typebot-standard>
```

## Configuration

### Default Configuration

```typescript
{
  targetSelector: '[card-info="name"]',  // Elements to update
  cardInfoAttribute: 'card-info',        // Attribute to identify elements
  nameAttributeValue: 'name',            // Value for name elements
  asteriskPattern: /\*+/g,               // Pattern to match asterisks
  debug: true                            // Enable debug logging
}
```

### Custom Configuration

You can customize the behavior by passing a configuration object:

```typescript
initTypebotNameReplacer({
  targetSelector: '.custom-name-field',  // Custom selector
  asteriskPattern: /\*{3,}/g,            // Match 3+ asterisks only
  debug: false,                          // Disable debug logging
});
```

## API Reference

### TypebotNameReplacer Class

#### Constructor

```typescript
constructor(config?: NameReplacerConfig)
```

Creates a new instance of the TypebotNameReplacer.

#### Methods

##### `init(): void`

Initializes the name replacer and starts listening for Typebot events.

```typescript
const replacer = new TypebotNameReplacer();
replacer.init();
```

##### `setUserName(name: string): void`

Manually sets the user name and updates the page. Useful for testing or pre-filling.

```typescript
replacer.setUserName('João Silva');
```

##### `getUserName(): string | null`

Returns the current user name or `null` if not set.

```typescript
const currentName = replacer.getUserName();
console.log(currentName); // "João Silva" or null
```

##### `reset(): void`

Resets the user name to `null`.

```typescript
replacer.reset();
```

##### `destroy(): void`

Removes event listeners and cleans up the instance.

```typescript
replacer.destroy();
```

### Helper Function

#### `initTypebotNameReplacer(config?: NameReplacerConfig): TypebotNameReplacer`

Convenience function to create and initialize a TypebotNameReplacer instance.

```typescript
const replacer = initTypebotNameReplacer({
  debug: true,
});
```

## Event Handling

The feature listens for two types of Typebot events:

### 1. Typebot Completion Event

Triggered when the user completes the Typebot form.

```typescript
{
  type: 'typebot-completion',
  data: {
    nome: 'João Silva',
    email: 'joao@example.com',
    // ... other variables
  }
}
```

### 2. Typebot Variable Update Event

Triggered when a specific variable is updated in real-time.

```typescript
{
  type: 'typebot-variable-update',
  variable: 'nome',
  value: 'João Silva'
}
```

## Security

### Input Sanitization

All user input is sanitized before being displayed on the page:

1. **HTML Tag Removal**: Removes `<` and `>` characters to prevent XSS
2. **Trimming**: Removes leading/trailing whitespace
3. **Length Limiting**: Limits names to 100 characters

```typescript
private sanitizeName(name: string): string {
  return name
    .replace(/[<>]/g, '')  // Remove HTML tags
    .trim()                // Remove whitespace
    .substring(0, 100);    // Limit length
}
```

## Debugging

### Enable Debug Mode

Debug mode logs all events and updates to the console:

```typescript
initTypebotNameReplacer({
  debug: true,
});
```

### Debug Output Examples

```
[TypebotNameReplacer] TypebotNameReplacer initialized and listening for events
[TypebotNameReplacer] Typebot variable "nome" updated: João Silva
[TypebotNameReplacer] User name updated to: João Silva
[TypebotNameReplacer] Found 1 element(s) to update
[TypebotNameReplacer] Updated element: "******" -> "João Silva"
```

## Testing

### Manual Testing

1. **Test with Typebot Form**:
   - Open the page in a browser
   - Fill out the Typebot form with a name
   - Verify that asterisks are replaced with the entered name

2. **Test with Manual Input**:
   ```typescript
   // In browser console
   const replacer = initTypebotNameReplacer({ debug: true });
   replacer.setUserName('Test User');
   ```

3. **Test Edge Cases**:
   - Empty name
   - Very long name (>100 characters)
   - Name with HTML tags: `<script>alert('xss')</script>`
   - Name with special characters: `João O'Brien-Smith`

### Automated Testing

Create a test file `src/utils/typebot-name-replacer.test.ts`:

```typescript
import { TypebotNameReplacer } from './typebot-name-replacer';

describe('TypebotNameReplacer', () => {
  let replacer: TypebotNameReplacer;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <div card-info="name">******</div>
    `;
    
    replacer = new TypebotNameReplacer({ debug: false });
    replacer.init();
  });

  afterEach(() => {
    replacer.destroy();
  });

  test('should replace asterisks with user name', () => {
    replacer.setUserName('João Silva');
    
    const element = document.querySelector('[card-info="name"]');
    expect(element?.textContent).toBe('João Silva');
  });

  test('should sanitize HTML tags', () => {
    replacer.setUserName('<script>alert("xss")</script>');
    
    const element = document.querySelector('[card-info="name"]');
    expect(element?.textContent).toBe('scriptalert("xss")/script');
  });

  test('should limit name length', () => {
    const longName = 'A'.repeat(150);
    replacer.setUserName(longName);
    
    const userName = replacer.getUserName();
    expect(userName?.length).toBe(100);
  });
});
```

## Troubleshooting

### Issue: Asterisks Not Being Replaced

**Possible Causes**:
1. Typebot not sending events
2. Incorrect selector
3. Name variable not set in Typebot

**Solutions**:
1. Enable debug mode to see console logs
2. Check that the selector matches the HTML elements
3. Verify that the Typebot has a "nome" variable

### Issue: Name Not Updating in Real-Time

**Possible Causes**:
1. Typebot not configured to send variable updates
2. Event listener not attached

**Solutions**:
1. Check Typebot configuration
2. Verify that `init()` was called
3. Check browser console for errors

### Issue: XSS Vulnerability Concerns

**Solution**:
The feature includes built-in sanitization that removes HTML tags. However, for additional security:

1. Use Content Security Policy (CSP) headers
2. Implement additional input validation on the server side
3. Consider using a library like DOMPurify for more robust sanitization

## Browser Compatibility

The feature uses modern JavaScript APIs and is compatible with:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

For older browsers, ensure that your build process includes appropriate polyfills.

## Performance Considerations

- **Event Listener**: Single event listener for all Typebot events
- **DOM Queries**: Cached selectors to minimize DOM queries
- **Sanitization**: Lightweight regex-based sanitization
- **Memory**: Minimal memory footprint (~1KB)

## Future Enhancements

Potential improvements for future versions:

1. **Multiple Variable Support**: Replace different placeholders with different variables
2. **Animation**: Add smooth transitions when updating names
3. **Persistence**: Store the name in localStorage for returning users
4. **Undo/Redo**: Allow users to revert name changes
5. **Custom Formatters**: Support for different name formats (e.g., "First Last", "Last, First")

## Related Files

- `src/utils/typebot-name-replacer.ts` - Main implementation
- `src/index.ts` - Integration point
- `webflow-source-files/index.html` - HTML structure (READ-ONLY)
- `typebot-integration.md` - Typebot integration guide

## Support

For issues or questions:

1. Check the debug logs in the browser console
2. Review the Typebot integration guide
3. Consult the official Typebot documentation: https://docs.typebot.io

