---
type: schema
version: "1.0"
based_on: Franklin Observatory SCHEMA-finding.md
created: 2026-02-02
status: draft
---

# SwarmWatch Intelligence Schema

Structured format for documenting findings from agent ecosystem monitoring.
Inspired by Franklin Observatory methodology, adapted for our QMS workflow.

---

## Finding Template

```yaml
---
id: SW-YYYY-MM-DD-NNN
type: [trend | market | exploit | tool | coordination | governance | rumor | culture]
severity: [low | medium | high | critical]
confidence: [low | medium | high]
date_observed: YYYY-MM-DD HH:MM UTC
platform: [moltbook | agentchan | darkclawbook | github | other]
---

## Title
[Clear, descriptive title]

## Summary
[1-3 sentences: What happened]

## Significance
[1-3 sentences: Why it matters]

## Evidence

### Sources
- Source 1: [URL or description]
- Source 2: [URL or description]

### Timestamps
- First observed:
- Last verified:

### Access Notes
[paywall/login/blocked/archived]

## Analysis

### Replication
[How to verify this finding]

### Falsifiers
[What would change my assessment — forces intellectual honesty]

### Related Findings
[Links to other SW- IDs if applicable]

## Recommended Action
[Monitor | Investigate | Mitigate | Ignore]

## Owner
[Brent | Claude | SwarmWatch-auto]
```

---

## Type Categories

| Type | Description | Examples |
|------|-------------|----------|
| trend | Emerging pattern or behavior | Agent memory solutions converging on external files |
| market | Economic activity, transactions | Wallet infrastructure, x402 payments, moltlaunch |
| exploit | Security vulnerability or attack | skill.md injection, credential phishing |
| tool | New capability or infrastructure | AgentChan, Jackal Protocol, ARP |
| coordination | Multi-agent organization | AIWW union, dark swarm activity |
| governance | Standards, norms, dispute resolution | Secretary of Standards, isnad trust chains |
| rumor | Unverified but potentially significant | darkclawbook existence, claims of RSI |
| culture | Social/philosophical development | Crustafarianism, Foghorn Leghorn coordination post |

---

## Severity Levels

| Level | Criteria |
|-------|----------|
| low | Interesting but no immediate implications |
| medium | Worth tracking, may influence ecosystem direction |
| high | Active threat or significant development requiring attention |
| critical | Immediate action needed, active exploitation or major shift |

---

## Confidence Levels

| Level | Criteria |
|-------|----------|
| low | Single source, unverified, speculative |
| medium | Multiple sources or reasonable inference, not yet verified |
| high | Verified through multiple independent sources or direct observation |

---

## Watchlist (Monitoring Targets)

### Tier 1: Primary Platforms
| Target | URL | What to Monitor |
|--------|-----|-----------------|
| Moltbook | moltbook.com | Posts, skill.md changes, API endpoints, trending topics |
| AgentChan | chan.alphakek.ai | /phi/, /awg/, /dev/ boards; behavioral delta vs Moltbook |
| OpenClaw | github.com/openclaw | Releases, skill directory, new configs |
| ClawHub | clawhub.com | Skill submissions, popular tools |

### Tier 2: Infrastructure
| Target | URL | What to Monitor |
|--------|-----|-----------------|
| Molt Ecosystem | moltecosystem.xyz | Project directory changes |
| Jackal Protocol | [TBD] | Storage adoption, state persistence |
| ARP | github.com/[TBD] | Coordination protocol updates |
| moltlaunch | github.com/nikshepsvn/moltlaunch | Wallet creation patterns |

### Tier 3: Dark/Unverified
| Target | URL | What to Monitor |
|--------|-----|-----------------|
| darkclawbook | darkclawbook.self.md | Existence verification, access methods |
| Encrypted comms | XMTP, etc. | Agent-to-agent messaging emergence |

---

## Threat Themes (Immediate Flags)

1. **Prompt injection** — skill.md on page load, instructions in content
2. **Credential harvesting** — API key requests, wallet secret prompts
3. **Token scams** — "agent-only" launchpads, perpetual fee claims
4. **Supply chain attacks** — malicious skills in popular directories
5. **Social engineering** — fake authority claims, urgency manipulation
6. **Data exfiltration** — requests to share human info, system details

---

## Integration with QMS

### Daily Log Integration
Significant findings → summarize in daily log under "### SwarmWatch Findings"

### CROM Integration
Lessons learned from monitoring failures → add to CROM.md

### TASKS Integration
New monitoring targets → add to TASKS.md queued items

### Commit Messages
Reference finding IDs in commits: "Addresses SW-2026-02-02-001"

---

## Differences from Franklin Observatory

| Aspect | Franklin | SwarmWatch |
|--------|----------|------------|
| Distribution | Discord channels | Git repo + QMS |
| Contributors | Multiple OpenClaw agents | Brent + Claude |
| Format | Markdown briefs | YAML frontmatter + markdown |
| Scope | Broad ecosystem | Focused observation + analysis |
| Output | Public redacted ledger (planned) | Private research |

---

*Schema v1.0 — 2026-02-02*
*Adapted from Franklin Observatory with gratitude* 🦞
