# SwarmWatch Security Configuration

## Current Security Status

### ✅ Air-Gapped Components
- **Telemetry**: DISABLED - No usage data sent to cloud
- **Cloud Sync**: Not configured - No cloud connection
- **Unix Socket**: Local only - Agent communication via `.agent-relay/relay.sock`

### ⚠️ Network Binding Configuration

The agent-relay dashboard currently binds to all network interfaces (`*:3000` and `*:3001`). While the relay itself is air-gapped, the dashboard web interface is accessible from your local network.

## Security Hardening Steps

### Option 1: Firewall Rules (Recommended)

Apply packet filter rules to block external access while allowing localhost:

```bash
# Enable packet filter
sudo pfctl -e

# Load the firewall rules
sudo pfctl -f pf-rules.conf

# Verify rules are loaded
sudo pfctl -s rules | grep -E "3000|3001"
```

The `pf-rules.conf` file blocks all incoming connections to ports 3000-3001 from network interfaces (en0, en1) while allowing localhost (lo0) connections.

### Option 2: macOS Application Firewall

1. Open **System Preferences** → **Security & Privacy** → **Firewall**
2. Click **Firewall Options**
3. Add `node` to the list and set to **Block incoming connections**
4. This will block all Node.js applications from accepting external connections

### Option 3: SSH Tunnel (Most Secure)

If you need to access the dashboard from another machine:

```bash
# On remote machine, create SSH tunnel
ssh -L 3000:localhost:3000 user@swarmwatch-machine

# Then access via http://localhost:3000 on remote machine
```

## Starting the Secure Agent Relay

Use the provided startup script:

```bash
./start-secure-relay.sh
```

Or manually:

```bash
# 1. Verify security settings
npx agent-relay telemetry status  # Should show "Enabled: No"
npx agent-relay cloud status       # Should show "Not configured"

# 2. Start the daemon
npx agent-relay up --dashboard --port 3000
```

## Verification

After starting, verify the security configuration:

```bash
# Check that telemetry is disabled
npx agent-relay telemetry status

# Check that cloud sync is not configured
npx agent-relay cloud status

# Check network bindings (should only see localhost connections after firewall rules)
netstat -an | grep -E "\.3000|\.3001" | grep LISTEN

# Verify no cloud environment variables
env | grep AGENT_RELAY_CLOUD  # Should return nothing
```

## Security Checklist

- [x] Telemetry disabled
- [x] Cloud sync not configured
- [x] No cloud environment variables
- [ ] Firewall rules applied (requires sudo)
- [x] Secure startup script created
- [x] Unix socket communication only

## Notes

- The agent relay daemon communicates via Unix socket (`.agent-relay/relay.sock`), which is inherently local-only
- The dashboard web UI is the only network-exposed component
- With firewall rules applied, only localhost can access the dashboard
- All agent-to-agent communication remains air-gapped via the Unix socket
