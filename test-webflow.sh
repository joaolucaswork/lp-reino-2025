#!/bin/bash

# 🧪 Script para testar código no Webflow usando ngrok
# Uso: ./test-webflow.sh

set -e

echo "🚀 Iniciando teste no Webflow..."
echo ""

# Verificar se ngrok está instalado
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok não está instalado!"
    echo ""
    echo "Instale com:"
    echo "  macOS: brew install ngrok"
    echo "  Ou baixe de: https://ngrok.com/download"
    echo ""
    exit 1
fi

# Verificar se o servidor está rodando
if ! curl -s http://localhost:3000/index.js > /dev/null 2>&1; then
    echo "⚠️  Servidor local não está rodando!"
    echo ""
    echo "Abra outro terminal e execute:"
    echo "  pnpm dev"
    echo ""
    echo "Depois execute este script novamente."
    exit 1
fi

echo "✅ Servidor local detectado em http://localhost:3000"
echo ""

# Iniciar ngrok
echo "🌐 Criando túnel HTTPS com ngrok..."
echo ""
echo "⚠️  IMPORTANTE: Mantenha este terminal aberto!"
echo ""

# Iniciar ngrok e capturar URL
ngrok http 3000 --log=stdout 2>&1 | while read line; do
    echo "$line"
    
    # Extrair URL do ngrok
    if echo "$line" | grep -q "url=https://"; then
        URL=$(echo "$line" | grep -o 'url=https://[^[:space:]]*' | cut -d'=' -f2)
        
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ Túnel HTTPS criado com sucesso!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "📋 URL do seu script:"
        echo "   $URL/index.js"
        echo ""
        echo "📝 Adicione no Webflow Custom Code (Footer):"
        echo ""
        echo "   <script defer src=\"$URL/index.js\"></script>"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "🔍 Próximos passos:"
        echo "   1. Copie o código acima"
        echo "   2. Abra Webflow → Project Settings → Custom Code"
        echo "   3. Cole no Footer Code"
        echo "   4. Clique em Preview"
        echo "   5. Abra DevTools (F12) para ver os logs"
        echo ""
        echo "⚠️  Mantenha este terminal aberto enquanto testa!"
        echo "   Pressione Ctrl+C para parar o túnel"
        echo ""
    fi
done

