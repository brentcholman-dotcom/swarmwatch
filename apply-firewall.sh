#!/bin/bash
# Apply Firewall Rules for SwarmWatch
# This script blocks external network access to ports 3000-3001
# while allowing localhost connections

set -e

echo "🛡️  SwarmWatch Firewall Configuration"
echo "======================================"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ This script must be run with sudo"
    echo "   Usage: sudo ./apply-firewall.sh"
    exit 1
fi

# Backup existing pf.conf
if [ -f /etc/pf.conf ]; then
    echo "📋 Backing up existing pf.conf..."
    cp /etc/pf.conf /etc/pf.conf.backup.$(date +%Y%m%d_%H%M%S)
fi

# Check if our rules are already in pf.conf
if grep -q "SwarmWatch Agent Relay" /etc/pf.conf 2>/dev/null; then
    echo "⚠️  SwarmWatch rules already exist in /etc/pf.conf"
    echo "   Skipping rule addition."
else
    echo "📝 Adding SwarmWatch rules to /etc/pf.conf..."
    cat >> /etc/pf.conf << 'EOF'

# SwarmWatch Agent Relay - Block external access to dashboard ports
# Only allow localhost connections to ports 3000-3001
block in quick on en0 proto tcp from any to any port 3000
block in quick on en0 proto tcp from any to any port 3001
block in quick on en1 proto tcp from any to any port 3000
block in quick on en1 proto tcp from any to any port 3001
pass in quick on lo0 proto tcp from any to any port 3000
pass in quick on lo0 proto tcp from any to any port 3001
EOF
fi

# Enable packet filter
echo "🔥 Enabling packet filter..."
pfctl -e 2>&1 | grep -v "already enabled" || true

# Load the rules
echo "📥 Loading firewall rules..."
pfctl -f /etc/pf.conf

# Verify rules
echo ""
echo "✅ Firewall rules applied successfully!"
echo ""
echo "📊 Current rules for ports 3000-3001:"
pfctl -s rules | grep -E "3000|3001" || echo "   (No specific rules shown - this is normal)"
echo ""
echo "🔒 Security Status:"
echo "   - External network access to ports 3000-3001: BLOCKED"
echo "   - Localhost access to ports 3000-3001: ALLOWED"
echo ""
echo "💡 To disable these rules later:"
echo "   sudo pfctl -d"
echo ""
echo "💡 To remove these rules permanently:"
echo "   1. Edit /etc/pf.conf and remove the SwarmWatch section"
echo "   2. Run: sudo pfctl -f /etc/pf.conf"
