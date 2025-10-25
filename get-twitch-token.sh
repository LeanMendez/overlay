#!/bin/bash

# Script para obtener Access Token de Twitch usando Twitch CLI
# Documentación: https://dev.twitch.tv/docs/cli/

echo "🎮 Twitch Token Generator Script"
echo "================================="
echo ""

# Verificar si Twitch CLI está instalado
if ! command -v twitch &> /dev/null
then
    echo "❌ Twitch CLI no está instalado"
    echo ""
    echo "📦 Para instalar Twitch CLI:"
    echo ""
    echo "En Linux/WSL:"
    echo "  sudo apt update"
    echo "  sudo apt install snapd"
    echo "  sudo snap install twitch-cli"
    echo ""
    echo "En macOS:"
    echo "  brew install twitch-cli"
    echo ""
    echo "En Windows:"
    echo "  scoop install twitch-cli"
    echo ""
    echo "O descarga desde: https://github.com/twitchdev/twitch-cli/releases"
    exit 1
fi

echo "✅ Twitch CLI encontrado"
echo ""

# Pedir Client ID y Secret
echo "📋 Necesitarás tu Client ID y Client Secret de:"
echo "   https://dev.twitch.tv/console/apps"
echo ""

read -p "Ingresa tu Client ID: " CLIENT_ID
read -p "Ingresa tu Client Secret: " CLIENT_SECRET

echo ""
echo "🔐 Configurando Twitch CLI..."

# Configurar Twitch CLI
twitch configure --client-id "$CLIENT_ID" --client-secret "$CLIENT_SECRET"

echo ""
echo "🎯 Generando token con los scopes necesarios..."
echo ""

# Generar token con los scopes necesarios
twitch token -u -s "user:read:chat channel:read:subscriptions bits:read moderator:read:followers"

echo ""
echo "✅ Token generado!"
echo ""
echo "⚠️  IMPORTANTE: Copia el Access Token que aparece arriba"
echo "    y guárdalo en /twitch-setup en el navegador"
echo ""
