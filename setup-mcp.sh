#!/bin/bash
# MCP Setup Script for Roll & Read Game
# Run this script to configure all MCP servers for Claude Code
# 
# IMPORTANT: Set these environment variables before running:
# export GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token
# export STRIPE_API_KEY=your_stripe_key  
# export SUPABASE_ACCESS_TOKEN=your_supabase_token

echo "🔧 Setting up MCP servers for Roll & Read Game..."

# Check required environment variables
if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
    echo "❌ GITHUB_PERSONAL_ACCESS_TOKEN not set"
    exit 1
fi

if [ -z "$STRIPE_API_KEY" ]; then
    echo "❌ STRIPE_API_KEY not set"
    exit 1
fi

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ SUPABASE_ACCESS_TOKEN not set"
    exit 1
fi

# Remove existing MCP configurations to avoid duplicates
echo "Clearing existing MCP configurations..."
claude mcp remove supabase 2>/dev/null || true
claude mcp remove puppeteer 2>/dev/null || true
claude mcp remove github 2>/dev/null || true
claude mcp remove stripe 2>/dev/null || true
claude mcp remove playwright 2>/dev/null || true
claude mcp remove docker-mcp 2>/dev/null || true

# Configure Supabase MCP
echo "📦 Adding Supabase MCP..."
claude mcp add supabase -- npx -y @supabase/mcp-server-supabase@latest --access-token $SUPABASE_ACCESS_TOKEN

# Configure Puppeteer MCP
echo "🎭 Adding Puppeteer MCP..."
claude mcp add puppeteer -- npx -y @modelcontextprotocol/server-puppeteer

# Configure GitHub MCP
echo "🐙 Adding GitHub MCP..."
GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PERSONAL_ACCESS_TOKEN claude mcp add github -- npx -y @modelcontextprotocol/server-github

# Configure Stripe MCP
echo "💳 Adding Stripe MCP..."
claude mcp add stripe -- npx -y @stripe/mcp --api-key=$STRIPE_API_KEY

# Configure Playwright MCP
echo "🎪 Adding Playwright MCP..."
claude mcp add playwright npx '@playwright/mcp@latest'

# Configure Docker MCP
echo "🐳 Adding Docker MCP..."
claude mcp add docker-mcp -- docker run -i --rm quantgeekdev/docker-map

echo ""
echo "✅ MCP Setup Complete!"
echo ""
echo "📋 Configured MCP Servers:"
echo "  • Supabase - Database and authentication"
echo "  • Puppeteer - Browser automation"
echo "  • GitHub - Repository management"
echo "  • Stripe - Payment processing"
echo "  • Playwright - End-to-end testing"
echo "  • Docker - Container management"
echo ""
echo "🔍 To verify setup, run: claude mcp list"
echo ""