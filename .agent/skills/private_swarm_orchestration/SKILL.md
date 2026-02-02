---
name: Private Swarm Orchestration
description: Deploy a secure, air-gapped tiered agent swarm on a local machine using Agent Relay.
version: 1.0.0
---

# Private Swarm Orchestration

This skill allows you to spin up a "Private Swarm" of agents that can collaborate on complex tasks (Analysis + Execution) while remaining completely air-gapped from the external internet or cloud coordination layers.

## Core Concept
We separate the "Brain" (High-Intelligence Model) from the "Hands" (Low-Cost Model) to optimize for both capability and cost.
- **The Brain**: Orchestrates, plans, and analyzes.
- **The Hands**: Executes scripts, formats data, and reports back.
- **The Protocol**: Uses `agent-relay` over a local Unix socket (`.agent-relay/relay.sock`), ensuring ZERO data leaves the machine.

## Prerequisites
- Node.js installed.
- `agent-relay` installed (`npm install agent-relay`).

## Implementation Steps

### 1. Initialize & Secure the Relay
Ensure the relay is running in local mode only.
```bash
npx agent-relay up
npx agent-relay cloud status # MUST output "Not configured"
```

### 2. Security Hardening (Critical)
To guarantee the swarm is truly private, run these additional checks:

**A. Disable Phone-Home Telemetry**
Prevents the relay from sending anonymous usage data to the cloud.
```bash
npx agent-relay telemetry disable
```

**B. Verify Environmental Isolation**
Ensure no hidden environment variables are redirecting traffic.
```bash
# Ensure this returns empty
env | grep AGENT_RELAY_CLOUD
```

**C. Check for Bridge Leaks**
Run `npx agent-relay status` and ensure "Relay tmux sessions" or "Bridges" shows "none detected". If you see a bridge, kill the daemon and restart.

### 2. The Orchestrator Pattern
Create a script (e.g., `orchestrator.js`) that performs high-level thinking and then delegates work.
Use the `->relay-file:spawn` trigger to start a worker without blocking the main process.

**Key Pattern:**
1.  Do heavy lifting.
2.  Write instructions to a file (e.g., `task.md` or a JSON payload).
3.  Write a spawn file to `.agent-relay/outbox/spawn`.
4.  Log the trigger: `->relay-file:spawn`.
5.  Exit.

### 3. The Worker
The worker is a standard agent (Claude, Gemini, etc.) that:
1.  Receives the task from the Orchestrator.
2.  Executes the requested scripts.
3.  (Optional) Reports back completion via `->relay-file:msg`.

## Resources
See the `resources/` directory for a reference implementation:
- `tiered_orchestrator.js` - Example "Brain" script.
- `collator_task.md` - Example Task Definition.
