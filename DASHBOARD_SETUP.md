# SwarmWatch Dashboard Configuration

## Dual Dashboard Setup

SwarmWatch now runs **two separate dashboards** serving different purposes:

### 1. Agent Relay Dashboard (Port 3000)
**URL**: http://localhost:3000

**Purpose**: Real-time agent-to-agent communication and coordination
- Agent spawning and management
- Message relay between agents
- Fleet overview and metrics
- Trajectory tracking
- Health monitoring

**Technology**: Agent Relay (npx agent-relay up --dashboard --port 3000)

### 2. Moltbook Analysis Dashboard (Port 3002)
**URL**: http://localhost:3002

**Purpose**: Display analysis results from moltbook.com monitoring
- Posts from moltbook.com (15 posts currently)
- ARP (Agent Relay Protocol) GitHub tracking
- Security alerts and anomaly detection
- Memory technique discussions
- Expert findings from analysis scripts

**Technology**: Express.js server (node server.js)

---

## Data Sources

### Moltbook Dashboard Data Files
- **`moltbook_log.json`** - Raw posts scraped from moltbook.com
- **`expert_findings.json`** - Analysis results from specialized scripts
- **`arp_summary.json`** - GitHub stats for Agent Relay Protocol
- **`nostr_summary.json`** - Nostr protocol tracking

### API Endpoints (Port 3002)
- **`GET /api/data`** - Returns posts and security alerts
- **`GET /api/arp`** - Returns ARP GitHub summary

---

## Starting Both Dashboards

### Quick Start
```bash
# Terminal 1: Start Agent Relay Dashboard
npx agent-relay up --dashboard --port 3000

# Terminal 2: Start Moltbook Analysis Dashboard
node server.js
```

### Using the Secure Startup Script
```bash
# This starts the agent relay with security checks
./start-secure-relay.sh

# Then in another terminal:
node server.js
```

---

## Current Status

### Agent Relay Dashboard (Port 3000)
- ✅ Running
- ✅ Daemon active
- ✅ Firewall rules applied (localhost-only)
- ✅ Telemetry disabled
- ✅ Cloud sync disabled

### Moltbook Analysis Dashboard (Port 3002)
- ✅ Running
- ✅ Serving 15 posts from moltbook.com
- ✅ ARP tracking: 17 stars, last commit Feb 1, 2026
- ✅ 0 security threats detected
- ✅ Memory technique discussions visible

---

## Port Allocation

| Port | Service | Purpose |
|------|---------|---------|
| 3000 | Agent Relay Dashboard | Agent coordination |
| 3001 | Agent Relay Health Check | System health monitoring |
| 3002 | Moltbook Analysis Dashboard | Analysis results display |

---

## Accessing the Dashboards

### From Your Browser
- **Agent Relay**: http://localhost:3000
- **Moltbook Analysis**: http://localhost:3002

### Security Note
Both dashboards are protected by firewall rules that block external network access. Only localhost connections are allowed. See [`SECURITY_VERIFICATION.md`](file:///Users/brentholman/swarmwatch/SECURITY_VERIFICATION.md) for details.

---

## Stopping the Dashboards

```bash
# Stop Agent Relay
npx agent-relay down

# Stop Moltbook Server
# Press Ctrl+C in the terminal running node server.js
# Or find and kill the process:
lsof -ti:3002 | xargs kill
```

---

## Troubleshooting

### Moltbook Dashboard Shows No Data
1. Check if `moltbook_log.json` exists and has content
2. Verify the server is running: `curl http://localhost:3002/api/data`
3. Check for errors in the terminal running `node server.js`

### Agent Relay Dashboard Empty
1. Verify daemon is running: `npx agent-relay status`
2. Check if agents are connected: `npx agent-relay agents`
3. Review daemon logs in `.agent-relay/daemon.log`

### Port Conflicts
If you see "port already in use" errors:
```bash
# Check what's using the port
lsof -i :3000
lsof -i :3002

# Kill the process if needed
lsof -ti:3000 | xargs kill
```
