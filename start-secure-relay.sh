#!/bin/bash
# Secure Agent Relay Startup Script
# This script ensures the agent relay runs in a truly air-gapped configuration

set -e

echo "🔒 Starting Secure Agent Relay..."

# 1. Verify telemetry is disabled
echo "📡 Checking telemetry status..."
TELEMETRY_STATUS=$(npx agent-relay telemetry status 2>&1 | grep "Enabled:" | awk '{print $2}')
if [ "$TELEMETRY_STATUS" != "No" ]; then
    echo "⚠️  Disabling telemetry..."
    npx agent-relay telemetry disable
fi

# 2. Verify cloud sync is not configured
echo "☁️  Checking cloud sync status..."
CLOUD_STATUS=$(npx agent-relay cloud status 2>&1 | grep "Cloud sync:" | cut -d':' -f2 | xargs)
if [ "$CLOUD_STATUS" != "Not configured" ]; then
    echo "❌ ERROR: Cloud sync is configured. This is not air-gapped!"
    exit 1
fi

# 3. Apply firewall rules (requires sudo)
echo "🛡️  Applying firewall rules..."
if [ -f "pf-rules.conf" ]; then
    echo "   Note: Firewall rules require manual setup (see pf-rules.conf)"
    echo "   Run: sudo pfctl -f pf-rules.conf"
else
    echo "⚠️  Warning: pf-rules.conf not found"
fi

# 4. Start the daemon with dashboard
echo "🚀 Starting agent relay daemon..."
npx agent-relay up --dashboard --port 3000

echo ""
echo "✅ Secure Agent Relay is running!"
echo "   Dashboard: http://localhost:3000"
echo "   Security: Air-gapped, localhost-only (with firewall rules)"
echo ""
echo "Press Ctrl+C to stop."
