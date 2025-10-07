# Typebot Integration Guide

## Table of Contents

- [Overview](#overview)
- [Installation Methods](#installation-methods)
- [Basic Integration](#basic-integration)
- [Advanced Configuration](#advanced-configuration)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Reference Links](#reference-links)

---

## Overview

### What is Typebot?

Typebot is a powerful conversational form builder that enables you to create interactive, chat-like experiences for lead capture, surveys, and user engagement. It provides:

- **Conversational UI**: Chat-based interface that feels natural and engaging
- **Lead Capture**: Collect user information through interactive conversations
- **Variable Passing**: Send and receive data between your application and Typebot
- **Customization**: Full control over styling, behavior, and integration
- **Analytics**: Track user interactions and completion rates

### Use Cases

- **Lead Generation**: Capture contact information in an engaging way
- **User Onboarding**: Guide users through setup processes
- **Surveys & Feedback**: Collect user feedback conversationally
- **Product Recommendations**: Interactive product finders
- **Appointment Booking**: Schedule meetings through conversation

---

## Installation Methods

### Method 1: CDN Integration (Recommended for Quick Setup)

The fastest way to integrate Typebot is via CDN using ES modules:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Typebot Integration</title>
</head>
<body>
    <!-- Your content -->
    
    <script type="module">
        import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js'
        
        Typebot.initPopup({
            typebot: 'your-typebot-id',
            apiHost: 'https://typebot.io/api/v1'
        })
    </script>
</body>
</html>
```

**Pros:**

- No build process required
- Quick to implement
- Automatic updates (with version pinning)

**Cons:**

- Requires modern browser with ES module support
- External dependency

### Method 2: NPM Installation (Recommended for Production)

For production applications with build processes:

```bash
# Using npm
npm install @typebot.io/js

# Using yarn
yarn add @typebot.io/js

# Using pnpm
pnpm add @typebot.io/js
```

Then import in your JavaScript:

```javascript
import Typebot from '@typebot.io/js'

Typebot.initPopup({
    typebot: 'your-typebot-id',
    apiHost: 'https://typebot.io/api/v1'
})
```

**Pros:**

- Version control
- Bundled with your application
- Better for offline development
- TypeScript support

**Cons:**

- Requires build process
- Manual updates needed

### Version Considerations

- **`@0`**: Latest v0.x version (auto-updates minor/patch)
- **`@0.3`**: Latest v0.3.x version (auto-updates patch only)
- **`@0.3.5`**: Specific version (no auto-updates)

**Recommendation**: Use specific versions in production for stability.

---

## Basic Integration

### HTML Structure Requirements

Typebot works as a popup/modal overlay and doesn't require specific HTML structure. However, you may want to add a container for embedded mode:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App with Typebot</title>
</head>
<body>
    <!-- Optional: Container for embedded Typebot -->
    <div id="typebot-embed-container"></div>
    
    <!-- Your application content -->
    <button id="open-typebot">Start Conversation</button>
    
    <!-- Typebot Script -->
    <script type="module">
        import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js'
        
        // Make Typebot available globally
        window.Typebot = Typebot
    </script>
    
    <script>
        // Your initialization code
        document.getElementById('open-typebot').addEventListener('click', () => {
            if (window.Typebot) {
                window.Typebot.open()
            }
        })
    </script>
</body>
</html>
```

### Essential Configuration

#### Popup Mode (Modal)

```javascript
Typebot.initPopup({
    typebot: 'your-typebot-id',           // Required: Your Typebot ID
    apiHost: 'https://typebot.io/api/v1', // Optional: API endpoint
    prefilledVariables: {                  // Optional: Pre-fill variables
        name: 'John Doe',
        email: 'john@example.com'
    },
    onOpen: () => {                        // Optional: Callback when opened
        console.log('Typebot opened')
    },
    onClose: () => {                       // Optional: Callback when closed
        console.log('Typebot closed')
    },
    onEnd: () => {                         // Optional: Callback when completed
        console.log('Typebot completed')
    }
})
```

#### Standard Embedded Mode

```html
<typebot-standard 
    id="typebot-standard"
    style="width: 100%; height: 600px;"
    data-typebot="your-typebot-id"
    data-api-host="https://typebot.io/api/v1">
</typebot-standard>

<script type="module">
    import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js'
</script>
```

#### Bubble Mode (Chat Widget)

```html
<typebot-bubble 
    id="typebot-bubble"
    data-typebot="your-typebot-id"
    data-api-host="https://typebot.io/api/v1"
    data-preview-message="Hi! Need help?">
</typebot-bubble>

<script type="module">
    import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js'
</script>
```

### Key Attributes

| Attribute | Description | Required | Default |
|-----------|-------------|----------|---------|
| `typebot` | Your Typebot ID | Yes | - |
| `apiHost` | API endpoint URL | No | `https://typebot.io/api/v1` |
| `prefilledVariables` | Object with pre-filled data | No | `{}` |
| `isPreview` | Preview mode (no data saved) | No | `false` |

---

## Advanced Configuration

### JavaScript API Methods

#### Initialization and Control

```javascript
// Initialize popup
await Typebot.initPopup(config)

// Open the Typebot
Typebot.open()

// Close the Typebot
Typebot.close()

// Toggle open/close
Typebot.toggle()

// Check if open
const isOpen = Typebot.isOpen()

// Destroy instance
Typebot.destroy()
```

#### Passing Variables Dynamically

```javascript
// Initialize with variables
Typebot.initPopup({
    typebot: 'your-typebot-id',
    prefilledVariables: {
        // User data
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '(11) 99999-9999',
        
        // Custom data
        patrimonio: 'R$ 1.000.000',
        totalAlocado: 'R$ 850.000',
        ativos: 'CDB, Ações, ETF',
        
        // Any custom variables
        customField: 'value'
    }
})
```

### Event Listeners and Callbacks

```javascript
// Listen for completion via postMessage
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'typebot-completion') {
        console.log('Typebot completed!', event.data.data)
        
        // Handle completion data
        const { nome, email, telefone } = event.data.data
        
        // Your logic here
        saveToDatabase(event.data.data)
        navigateToNextStep()
    }
})

// Using callbacks
Typebot.initPopup({
    typebot: 'your-typebot-id',
    onOpen: () => {
        console.log('Opened')
        // Track analytics
        analytics.track('Typebot Opened')
    },
    onClose: () => {
        console.log('Closed')
        // Track analytics
        analytics.track('Typebot Closed')
    },
    onEnd: () => {
        console.log('Completed')
        // Handle completion
        handleCompletion()
    },
    onMessage: (message) => {
        console.log('Message received:', message)
    }
})
```

### Custom Styling and Theming

```css
/* Style the popup container */
#typebot-popup {
    z-index: 9999 !important;
}

/* Style the bubble widget */
typebot-bubble {
    --typebot-button-bg-color: #0042DA;
    --typebot-button-color: #ffffff;
}

/* Style embedded Typebot */
typebot-standard {
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Custom overlay */
.typebot-overlay {
    background: rgba(0, 0, 0, 0.7) !important;
}
```

### Responsive Design Considerations

```css
/* Mobile-first responsive design */
typebot-standard {
    width: 100%;
    height: 500px;
}

@media (min-width: 768px) {
    typebot-standard {
        height: 600px;
    }
}

@media (min-width: 1024px) {
    typebot-standard {
        height: 700px;
        max-width: 800px;
        margin: 0 auto;
    }
}

/* Ensure popup is mobile-friendly */
@media (max-width: 640px) {
    #typebot-popup {
        width: 100% !important;
        height: 100% !important;
        border-radius: 0 !important;
    }
}
```

### Dark/Light Mode Integration

```javascript
// Detect system theme
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

// Apply theme to Typebot
Typebot.initPopup({
    typebot: 'your-typebot-id',
    theme: {
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        textColor: isDarkMode ? '#ffffff' : '#000000',
        buttonColor: '#0042DA'
    }
})

// Listen for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const newTheme = e.matches ? 'dark' : 'light'
    // Reinitialize Typebot with new theme
    Typebot.destroy()
    Typebot.initPopup({
        typebot: 'your-typebot-id',
        theme: newTheme === 'dark' ? darkTheme : lightTheme
    })
})
```

---

## Code Examples

### Complete Working Example (Vanilla JavaScript)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Typebot Integration Example</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }

        button {
            background: #0042DA;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
        }

        button:hover {
            background: #0036b8;
        }

        #status {
            margin-top: 20px;
            padding: 15px;
            background: #f0f0f0;
            border-radius: 6px;
        }
    </style>
</head>
<body>
    <h1>Typebot Integration Demo</h1>

    <div>
        <h2>User Information</h2>
        <input type="text" id="userName" placeholder="Your Name" />
        <input type="email" id="userEmail" placeholder="Your Email" />
        <button id="startTypebot">Start Conversation</button>
    </div>

    <div id="status">
        <strong>Status:</strong> <span id="statusText">Ready</span>
    </div>

    <script type="module">
        import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js'

        // Make Typebot available globally
        window.Typebot = Typebot

        // Initialize Typebot
        async function initializeTypebot() {
            try {
                await Typebot.initPopup({
                    typebot: 'your-typebot-id',
                    apiHost: 'https://typebot.io/api/v1',
                    onOpen: () => {
                        updateStatus('Typebot opened')
                    },
                    onClose: () => {
                        updateStatus('Typebot closed')
                    },
                    onEnd: () => {
                        updateStatus('Conversation completed!')
                    }
                })

                updateStatus('Typebot initialized')
            } catch (error) {
                console.error('Failed to initialize Typebot:', error)
                updateStatus('Error: ' + error.message)
            }
        }

        // Update status display
        function updateStatus(message) {
            document.getElementById('statusText').textContent = message
        }

        // Start Typebot with user data
        document.getElementById('startTypebot').addEventListener('click', () => {
            const name = document.getElementById('userName').value
            const email = document.getElementById('userEmail').value

            if (!name || !email) {
                alert('Please enter your name and email')
                return
            }

            // Reinitialize with user data
            Typebot.initPopup({
                typebot: 'your-typebot-id',
                prefilledVariables: {
                    nome: name,
                    email: email
                }
            })

            Typebot.open()
        })

        // Listen for completion
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'typebot-completion') {
                console.log('Completion data:', event.data.data)
                updateStatus('Data received: ' + JSON.stringify(event.data.data))
            }
        })

        // Initialize on load
        initializeTypebot()
    </script>
</body>
</html>
```

### TypeScript Integration Example

```typescript
import Typebot from '@typebot.io/js'

interface TypebotConfig {
    typebot: string
    apiHost?: string
    prefilledVariables?: Record<string, string>
    onOpen?: () => void
    onClose?: () => void
    onEnd?: () => void
    onMessage?: (message: any) => void
}

interface CompletionData {
    nome: string
    email: string
    telefone?: string
    completed: boolean
    timestamp: string
}

class TypebotIntegration {
    private config: TypebotConfig
    private isInitialized: boolean = false

    constructor(config: TypebotConfig) {
        this.config = config
    }

    async initialize(): Promise<void> {
        try {
            await Typebot.initPopup(this.config)
            this.isInitialized = true
            this.setupEventListeners()
        } catch (error) {
            console.error('Typebot initialization failed:', error)
            throw error
        }
    }

    private setupEventListeners(): void {
        window.addEventListener('message', (event: MessageEvent) => {
            if (event.data && event.data.type === 'typebot-completion') {
                this.handleCompletion(event.data.data as CompletionData)
            }
        })
    }

    private handleCompletion(data: CompletionData): void {
        console.log('Typebot completed:', data)
        // Your completion logic here
    }

    open(): void {
        if (!this.isInitialized) {
            throw new Error('Typebot not initialized')
        }
        Typebot.open()
    }

    close(): void {
        Typebot.close()
    }

    updateVariables(variables: Record<string, string>): void {
        // Reinitialize with new variables
        this.config.prefilledVariables = {
            ...this.config.prefilledVariables,
            ...variables
        }
        Typebot.initPopup(this.config)
    }
}

// Usage
const typebot = new TypebotIntegration({
    typebot: 'your-typebot-id',
    apiHost: 'https://typebot.io/api/v1',
    onEnd: () => {
        console.log('Conversation ended')
    }
})

await typebot.initialize()
typebot.open()
```

### React Integration Example

```jsx
import { useEffect, useState, useCallback } from 'react'
import Typebot from '@typebot.io/js'

function TypebotWidget({ typebotId, userData }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)

    // Initialize Typebot
    useEffect(() => {
        const initTypebot = async () => {
            try {
                await Typebot.initPopup({
                    typebot: typebotId,
                    apiHost: 'https://typebot.io/api/v1',
                    prefilledVariables: userData,
                    onOpen: () => setIsOpen(true),
                    onClose: () => setIsOpen(false),
                    onEnd: handleCompletion
                })
                setIsInitialized(true)
            } catch (error) {
                console.error('Typebot init failed:', error)
            }
        }

        initTypebot()

        // Cleanup
        return () => {
            if (window.Typebot) {
                Typebot.close()
            }
        }
    }, [typebotId, userData])

    // Handle completion
    const handleCompletion = useCallback(() => {
        console.log('Typebot completed')
        // Your logic here
    }, [])

    // Listen for postMessage
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'typebot-completion') {
                console.log('Completion data:', event.data.data)
                // Handle the data
            }
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    const openTypebot = () => {
        if (isInitialized) {
            Typebot.open()
        }
    }

    return (
        <div>
            <button onClick={openTypebot} disabled={!isInitialized}>
                {isInitialized ? 'Start Conversation' : 'Loading...'}
            </button>
            {isOpen && <div className="typebot-overlay" />}
        </div>
    )
}

// Usage
function App() {
    const userData = {
        nome: 'John Doe',
        email: 'john@example.com'
    }

    return (
        <div>
            <h1>My App</h1>
            <TypebotWidget
                typebotId="your-typebot-id"
                userData={userData}
            />
        </div>
    )
}

export default App
```

### Vue.js Integration Example

```vue
<template>
    <div class="typebot-container">
        <button
            @click="openTypebot"
            :disabled="!isInitialized"
            class="typebot-button"
        >
            {{ isInitialized ? 'Start Conversation' : 'Loading...' }}
        </button>

        <div v-if="completionData" class="completion-message">
            <h3>Thank you, {{ completionData.nome }}!</h3>
            <p>We received your information.</p>
        </div>
    </div>
</template>

<script>
import Typebot from '@typebot.io/js'

export default {
    name: 'TypebotWidget',
    props: {
        typebotId: {
            type: String,
            required: true
        },
        userData: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isInitialized: false,
            isOpen: false,
            completionData: null
        }
    },
    async mounted() {
        await this.initializeTypebot()
        this.setupMessageListener()
    },
    beforeUnmount() {
        if (window.Typebot) {
            Typebot.close()
        }
        window.removeEventListener('message', this.handleMessage)
    },
    methods: {
        async initializeTypebot() {
            try {
                await Typebot.initPopup({
                    typebot: this.typebotId,
                    apiHost: 'https://typebot.io/api/v1',
                    prefilledVariables: this.userData,
                    onOpen: () => {
                        this.isOpen = true
                    },
                    onClose: () => {
                        this.isOpen = false
                    },
                    onEnd: () => {
                        console.log('Typebot completed')
                    }
                })
                this.isInitialized = true
            } catch (error) {
                console.error('Typebot initialization failed:', error)
            }
        },
        setupMessageListener() {
            window.addEventListener('message', this.handleMessage)
        },
        handleMessage(event) {
            if (event.data && event.data.type === 'typebot-completion') {
                this.completionData = event.data.data
                this.$emit('completion', event.data.data)
            }
        },
        openTypebot() {
            if (this.isInitialized) {
                Typebot.open()
            }
        }
    }
}
</script>

<style scoped>
.typebot-button {
    background: #0042DA;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
}

.typebot-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.completion-message {
    margin-top: 20px;
    padding: 15px;
    background: #e8f5e9;
    border-radius: 6px;
}
</style>
```

### Dynamic Typebot Loading

```javascript
/**
 * Dynamically load and initialize Typebot based on user actions
 */
class DynamicTypebotLoader {
    constructor() {
        this.isLoaded = false
        this.isInitialized = false
    }

    /**
     * Load Typebot library dynamically
     */
    async loadLibrary() {
        if (this.isLoaded) return

        return new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.type = 'module'
            script.innerHTML = `
                import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js'
                window.Typebot = Typebot
                window.typebotLoaded = true
            `

            script.onerror = () => reject(new Error('Failed to load Typebot'))

            document.body.appendChild(script)

            // Wait for Typebot to be available
            const checkLoaded = setInterval(() => {
                if (window.typebotLoaded && window.Typebot) {
                    clearInterval(checkLoaded)
                    this.isLoaded = true
                    resolve()
                }
            }, 100)

            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(checkLoaded)
                reject(new Error('Typebot load timeout'))
            }, 10000)
        })
    }

    /**
     * Initialize Typebot with configuration
     */
    async initialize(config) {
        if (!this.isLoaded) {
            await this.loadLibrary()
        }

        try {
            await window.Typebot.initPopup(config)
            this.isInitialized = true
            return true
        } catch (error) {
            console.error('Typebot initialization failed:', error)
            return false
        }
    }

    /**
     * Start Typebot flow with user data
     */
    async start(userData = {}) {
        const config = {
            typebot: 'your-typebot-id',
            apiHost: 'https://typebot.io/api/v1',
            prefilledVariables: userData,
            onEnd: () => {
                console.log('Typebot completed')
            }
        }

        const initialized = await this.initialize(config)

        if (initialized) {
            window.Typebot.open()
        }
    }
}

// Usage
const typebotLoader = new DynamicTypebotLoader()

// Load only when user clicks a button
document.getElementById('start-chat').addEventListener('click', async () => {
    const userData = {
        nome: 'User Name',
        email: 'user@example.com'
    }

    await typebotLoader.start(userData)
})
```

---

## Best Practices

### Performance Optimization

1. **Lazy Loading**: Load Typebot only when needed

```javascript
// Don't load on page load
// Load when user shows intent (scroll, click, etc.)
document.getElementById('trigger').addEventListener('click', async () => {
    const Typebot = await import('@typebot.io/js')
    // Initialize and use
})
```

2. **Preconnect to API**

```html
<link rel="preconnect" href="https://typebot.io">
<link rel="dns-prefetch" href="https://typebot.io">
```

3. **Use Specific Versions**

```javascript
// Production: Use specific version
import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.3.5/dist/web.js'

// Development: Use latest
import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js'
```

4. **Minimize Re-initialization**

```javascript
// Bad: Re-initializing on every open
button.addEventListener('click', () => {
    Typebot.initPopup(config) // Don't do this
    Typebot.open()
})

// Good: Initialize once, open multiple times
await Typebot.initPopup(config) // Initialize once

button.addEventListener('click', () => {
    Typebot.open() // Just open
})
```

### Error Handling Strategies

```javascript
class TypebotErrorHandler {
    static async safeInitialize(config) {
        try {
            await Typebot.initPopup(config)
            return { success: true }
        } catch (error) {
            console.error('Typebot initialization failed:', error)

            // Log to error tracking service
            if (window.Sentry) {
                Sentry.captureException(error)
            }

            // Show user-friendly message
            this.showErrorMessage('Unable to load chat. Please refresh the page.')

            return { success: false, error }
        }
    }

    static showErrorMessage(message) {
        // Show error to user
        const errorDiv = document.createElement('div')
        errorDiv.className = 'typebot-error'
        errorDiv.textContent = message
        document.body.appendChild(errorDiv)

        setTimeout(() => errorDiv.remove(), 5000)
    }

    static setupGlobalErrorHandler() {
        window.addEventListener('error', (event) => {
            if (event.message.includes('typebot')) {
                console.error('Typebot error:', event)
                // Handle Typebot-specific errors
            }
        })
    }
}

// Usage
TypebotErrorHandler.setupGlobalErrorHandler()
const result = await TypebotErrorHandler.safeInitialize(config)

if (result.success) {
    Typebot.open()
}
```

### Accessibility Considerations

```javascript
// Add ARIA labels and keyboard navigation
Typebot.initPopup({
    typebot: 'your-typebot-id',
    onOpen: () => {
        // Set focus to Typebot
        const typebotIframe = document.querySelector('iframe[src*="typebot"]')
        if (typebotIframe) {
            typebotIframe.setAttribute('aria-label', 'Conversational form')
            typebotIframe.setAttribute('role', 'dialog')
            typebotIframe.focus()
        }

        // Trap focus within modal
        document.body.style.overflow = 'hidden'
    },
    onClose: () => {
        // Restore focus
        document.body.style.overflow = ''
        document.getElementById('open-typebot-button')?.focus()
    }
})

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close
    if (e.key === 'Escape' && Typebot.isOpen()) {
        Typebot.close()
    }

    // Ctrl+K to open
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        Typebot.open()
    }
})
```

### Mobile Responsiveness

```javascript
// Detect mobile and adjust behavior
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

Typebot.initPopup({
    typebot: 'your-typebot-id',
    // Mobile-specific configuration
    ...(isMobile && {
        theme: {
            width: '100%',
            height: '100%'
        }
    })
})

// Prevent body scroll on mobile when Typebot is open
if (isMobile) {
    Typebot.initPopup({
        typebot: 'your-typebot-id',
        onOpen: () => {
            document.body.style.position = 'fixed'
            document.body.style.width = '100%'
        },
        onClose: () => {
            document.body.style.position = ''
            document.body.style.width = ''
        }
    })
}
```

### Data Privacy and Security

```javascript
// Sanitize user input before sending to Typebot
function sanitizeInput(input) {
    return input
        .replace(/[<>]/g, '') // Remove HTML tags
        .trim()
        .substring(0, 500) // Limit length
}

// Use sanitized data
const userData = {
    nome: sanitizeInput(userInput.name),
    email: sanitizeInput(userInput.email)
}

Typebot.initPopup({
    typebot: 'your-typebot-id',
    prefilledVariables: userData
})

// Don't send sensitive data
// Bad: Don't do this
const badData = {
    password: user.password, // Never send passwords
    creditCard: user.cc,     // Never send payment info
    ssn: user.ssn           // Never send PII
}

// Good: Only send necessary, non-sensitive data
const goodData = {
    nome: user.name,
    email: user.email,
    userId: user.id // Use IDs instead of sensitive data
}
```

---

## Troubleshooting

### Common Integration Issues

#### Issue 1: Typebot Not Loading

**Symptoms:**

- Console error: "Typebot is not defined"
- Nothing happens when clicking trigger button

**Solutions:**

```javascript
// Solution 1: Check if script loaded
console.log('Typebot available?', typeof window.Typebot)

// Solution 2: Wait for Typebot to load
async function waitForTypebot() {
    let attempts = 0
    while (!window.Typebot && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
    }

    if (!window.Typebot) {
        throw new Error('Typebot failed to load')
    }

    return window.Typebot
}

// Usage
try {
    const Typebot = await waitForTypebot()
    await Typebot.initPopup(config)
} catch (error) {
    console.error('Typebot load failed:', error)
}

// Solution 3: Check Content Security Policy
// Add to your HTML <head>
// <meta http-equiv="Content-Security-Policy"
//       content="script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;">
```

#### Issue 2: Variables Not Passing

**Symptoms:**

- Variables show as undefined in Typebot
- Data not appearing in Typebot conversation

**Solutions:**

```javascript
// Solution 1: Verify variable names match exactly
// In Typebot: {{nome}}
// In code: prefilledVariables: { nome: 'John' } ✓
// NOT: prefilledVariables: { name: 'John' } ✗

// Solution 2: Check data types
const variables = {
    nome: String(userData.name),        // Convert to string
    idade: String(userData.age),        // Numbers as strings
    ativo: String(userData.active)      // Booleans as strings
}

// Solution 3: Debug variables
console.log('Sending variables:', variables)

Typebot.initPopup({
    typebot: 'your-typebot-id',
    prefilledVariables: variables,
    onMessage: (message) => {
        console.log('Typebot message:', message) // Debug messages
    }
})
```

#### Issue 3: Completion Events Not Firing

**Symptoms:**

- `onEnd` callback not called
- PostMessage not received

**Solutions:**

```javascript
// Solution 1: Use multiple event listeners
// Listen for onEnd callback
Typebot.initPopup({
    typebot: 'your-typebot-id',
    onEnd: () => {
        console.log('onEnd fired')
        handleCompletion()
    }
})

// Also listen for postMessage
window.addEventListener('message', (event) => {
    console.log('Message received:', event.data)

    if (event.data && event.data.type === 'typebot-completion') {
        console.log('Completion message received')
        handleCompletion(event.data.data)
    }
})

// Solution 2: Add completion script in Typebot
// In your Typebot, add a "Script" block at the end:
/*
window.parent.postMessage({
    type: 'typebot-completion',
    data: {
        nome: {{nome}},
        email: {{email}},
        completed: true,
        timestamp: new Date().toISOString()
    }
}, '*')
*/

// Solution 3: Check for iframe context
if (window.parent !== window) {
    // We're in an iframe, use parent
    window.parent.postMessage(data, '*')
} else {
    // We're in main window
    window.postMessage(data, '*')
}
```

#### Issue 4: Popup Not Closing

**Symptoms:**

- Typebot stays open after completion
- Close button doesn't work

**Solutions:**

```javascript
// Solution 1: Force close after completion
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'typebot-completion') {
        // Handle data first
        handleCompletion(event.data.data)

        // Force close after delay
        setTimeout(() => {
            Typebot.close()

            // Also hide container manually if needed
            const container = document.getElementById('typebot-embed-container')
            if (container) {
                container.style.display = 'none'
            }
        }, 1000)
    }
})

// Solution 2: Multiple close methods
function forceCloseTypebot() {
    // Method 1: API close
    if (window.Typebot) {
        Typebot.close()
    }

    // Method 2: Hide all Typebot elements
    const selectors = [
        '#typebot-popup',
        '#typebot-embed-container',
        'iframe[src*="typebot"]',
        '[class*="typebot"]'
    ]

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.display = 'none'
            el.style.visibility = 'hidden'
        })
    })

    // Method 3: Remove overlay
    const overlay = document.querySelector('.typebot-overlay')
    if (overlay) {
        overlay.remove()
    }
}
```

#### Issue 5: CORS Errors

**Symptoms:**

- Console error: "CORS policy blocked"
- API requests failing

**Solutions:**

```javascript
// Solution 1: Use correct API host
Typebot.initPopup({
    typebot: 'your-typebot-id',
    apiHost: 'https://typebot.io/api/v1', // Correct host
    // NOT: apiHost: 'https://typebot.io' // Wrong
})

// Solution 2: Check if using custom domain
// If self-hosting Typebot:
Typebot.initPopup({
    typebot: 'your-typebot-id',
    apiHost: 'https://your-domain.com/api/v1'
})

// Solution 3: Verify typebot ID is correct
// Get from Typebot dashboard URL:
// https://typebot.io/typebots/your-typebot-id/edit
```

### Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Requires ES modules support |
| Edge | 90+ | Full support |
| Opera | 76+ | Full support |
| Mobile Safari | 14+ | Full support |
| Chrome Mobile | 90+ | Full support |

**Polyfills for older browsers:**

```html
<!-- Add polyfills for older browsers -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=es2015,es2016,es2017"></script>

<!-- Then load Typebot -->
<script type="module">
    import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js'
    window.Typebot = Typebot
</script>
```

### Debugging Tips

```javascript
// Enable debug mode
window.TYPEBOT_DEBUG = true

// Log all Typebot events
const originalPostMessage = window.postMessage
window.postMessage = function(...args) {
    console.log('PostMessage:', args)
    return originalPostMessage.apply(this, args)
}

// Monitor Typebot state
setInterval(() => {
    if (window.Typebot) {
        console.log('Typebot state:', {
            isOpen: Typebot.isOpen?.(),
            initialized: !!window.Typebot
        })
    }
}, 5000)

// Check for Typebot elements in DOM
function debugTypebotDOM() {
    const elements = {
        popup: document.querySelector('#typebot-popup'),
        container: document.querySelector('#typebot-embed-container'),
        iframes: document.querySelectorAll('iframe[src*="typebot"]'),
        scripts: document.querySelectorAll('script[src*="typebot"]')
    }

    console.table(elements)
    return elements
}

// Usage
debugTypebotDOM()
```

---

## Reference Links

### Official Documentation

- **Typebot Official Website**: [https://typebot.io](https://typebot.io)
- **Typebot Documentation**: [https://docs.typebot.io](https://docs.typebot.io)
- **JavaScript Library Docs**: [https://docs.typebot.io/embed/javascript](https://docs.typebot.io/embed/javascript)
- **API Reference**: [https://docs.typebot.io/api-reference](https://docs.typebot.io/api-reference)
- **GitHub Repository**: [https://github.com/baptisteArno/typebot.io](https://github.com/baptisteArno/typebot.io)

### Integration Guides

- **React Integration**: [https://docs.typebot.io/embed/react](https://docs.typebot.io/embed/react)
- **Vue Integration**: [https://docs.typebot.io/embed/vue](https://docs.typebot.io/embed/vue)
- **WordPress Plugin**: [https://docs.typebot.io/embed/wordpress](https://docs.typebot.io/embed/wordpress)
- **Webflow Integration**: [https://docs.typebot.io/embed/webflow](https://docs.typebot.io/embed/webflow)

### Community Resources

- **Discord Community**: [https://discord.gg/typebot](https://discord.gg/typebot)
- **YouTube Tutorials**: [https://www.youtube.com/@typebot](https://www.youtube.com/@typebot)
- **Community Forum**: [https://github.com/baptisteArno/typebot.io/discussions](https://github.com/baptisteArno/typebot.io/discussions)

### CDN Links

- **Latest Version**: `https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js`
- **Specific Version**: `https://cdn.jsdelivr.net/npm/@typebot.io/js@0.3.5/dist/web.js`
- **NPM Package**: `https://www.npmjs.com/package/@typebot.io/js`

### Related Tools

- **Typebot Builder**: Create and edit your typebots
- **Typebot Analytics**: Track performance and conversions
- **Typebot Integrations**: Connect with CRMs, email services, etc.

---

## Advanced Topics

### Custom Event Handling

```javascript
// Create custom event system
class TypebotEventEmitter {
    constructor() {
        this.events = {}
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = []
        }
        this.events[event].push(callback)
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data))
        }
    }
}

const typebotEvents = new TypebotEventEmitter()

// Listen for custom events
typebotEvents.on('completion', (data) => {
    console.log('Typebot completed:', data)
    // Your logic
})

typebotEvents.on('step-change', (step) => {
    console.log('User moved to step:', step)
    // Track analytics
})

// Emit events from Typebot
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'typebot-completion') {
        typebotEvents.emit('completion', event.data.data)
    }
})
```

### Integration with Analytics

```javascript
// Google Analytics 4
Typebot.initPopup({
    typebot: 'your-typebot-id',
    onOpen: () => {
        gtag('event', 'typebot_opened', {
            event_category: 'engagement',
            event_label: 'Typebot Interaction'
        })
    },
    onEnd: () => {
        gtag('event', 'typebot_completed', {
            event_category: 'conversion',
            event_label: 'Typebot Completion'
        })
    }
})

// Segment
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'typebot-completion') {
        analytics.track('Typebot Completed', {
            nome: event.data.data.nome,
            email: event.data.data.email,
            timestamp: event.data.data.timestamp
        })
    }
})

// Mixpanel
Typebot.initPopup({
    typebot: 'your-typebot-id',
    onEnd: () => {
        mixpanel.track('Typebot Completed', {
            distinct_id: user.id,
            typebot_id: 'your-typebot-id'
        })
    }
})
```

### Multi-Language Support

```javascript
// Detect user language
const userLang = navigator.language || navigator.userLanguage

// Map to Typebot IDs
const typebotIds = {
    'en': 'typebot-english',
    'pt': 'typebot-portuguese',
    'es': 'typebot-spanish',
    'fr': 'typebot-french'
}

// Get appropriate Typebot
const lang = userLang.split('-')[0] // 'pt-BR' -> 'pt'
const typebotId = typebotIds[lang] || typebotIds['en'] // Fallback to English

Typebot.initPopup({
    typebot: typebotId,
    prefilledVariables: {
        language: lang
    }
})
```

---

## Conclusion

This guide covers the essential aspects of integrating Typebot into your web projects. Key takeaways:

1. **Choose the right installation method** for your project (CDN for quick setup, NPM for production)
2. **Use prefilled variables** to personalize the conversation
3. **Implement proper error handling** for a robust integration
4. **Listen for completion events** to handle user data
5. **Optimize for performance** with lazy loading and specific versions
6. **Ensure accessibility** with proper ARIA labels and keyboard navigation
7. **Test across browsers** and devices for compatibility

For more advanced use cases and updates, always refer to the [official Typebot documentation](https://docs.typebot.io).

---

## Quick Reference

### Essential Code Snippets

**Basic Popup:**

```javascript
import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js'
await Typebot.initPopup({ typebot: 'your-id' })
Typebot.open()
```

**With Variables:**

```javascript
await Typebot.initPopup({
    typebot: 'your-id',
    prefilledVariables: { nome: 'John', email: 'john@example.com' }
})
```

**Listen for Completion:**

```javascript
window.addEventListener('message', (e) => {
    if (e.data?.type === 'typebot-completion') {
        console.log(e.data.data)
    }
})
```

**Close Typebot:**

```javascript
Typebot.close()
```

---

**Document Version**: 1.0
**Last Updated**: 2025
**Maintained By**: Reino Capital Development Team

```

