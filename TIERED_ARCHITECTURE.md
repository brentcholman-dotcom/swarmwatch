# SwarmWatch: Tiered Model Orchestration

The project has been upgraded to a tiered model architecture to optimize for intelligence and cost.

## 🏗 Architecture
| Tier | Model | Responsibility | Key Output |
| :--- | :--- | :--- | :--- |
| **Analysis** | **Gemini 3 Pro** | High-level intelligence, trend detection, and security auditing. | `expert_findings.json` |
| **Collation** | **Cheapest Model** | Data formatting, markdown summary generation, and dashboard updates. | `arp_summary.json`, `report.md` |

## 🛠 Tiered Scripts
- `npm run orchestrate`: The entry point for the **Gemini 3 Pro** analyst. It performs the scrape, runs all analysis scripts, and generates the `expert_findings.json` handoff file.
- `tiered_orchestrator.js`: The logic for the high-level analysis and the handoff trigger.
- `collator_task.md`: (Coming soon) Instructions for the worker agent.

## 📡 Automated Handoff
After the analyst completes the heavy lifting, it uses **Agent Relay** to spawn a lower-cost worker.
```bash
npx agent-relay spawn Collator gemini "Run collation scripts based on expert_findings.json"
```

## 📊 Current Status
- **Last Analysis Run**: Completed by Gemini 3 Pro.
- **Expert Findings**: Detailed analysis of 15 posts and 4 intelligence modules.
- **Next Step**: Spawning Collator to update the public-facing dashboard.

---
**Lead Analyst Status**: Online (Gemini 3 Pro)
**Worker Status**: Pending Spawn
