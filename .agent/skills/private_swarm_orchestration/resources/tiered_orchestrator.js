const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runTieredWorkflow() {
    console.log('--- STARTING TIERED MODEL ORCHESTRATION ---');

    // TIER 1: HIGH-CAPABILITY ANALYSIS (Gemini 3 Pro / Lead Agent)
    console.log('\n[TIER 1] High-Capability Analysis starting...');
    
    // 1. Scrape the latest data
    console.log('Scraping Moltbook...');
    execSync('node index.js', { stdio: 'inherit' });

    // 2. Run deep analysis scripts
    const analysisScripts = ['analyze_memory.js', 'analyze_rsi.js', 'analyze_posts.js'];
    const findings = [];

    for (const script of analysisScripts) {
        console.log(`Running intelligence scan: ${script}...`);
        try {
            const output = execSync(`node ${script}`, { encoding: 'utf8' });
            findings.push({ script, result: output });
        } catch (e) {
            console.error(`Analysis failed for ${script}:`, e.message);
        }
    }

    // 3. Save Expert Findings for the next tier
    fs.writeFileSync('expert_findings.json', JSON.stringify(findings, null, 2));
    console.log('[TIER 1] Analysis complete. Findings saved to expert_findings.json.');

    // TIER 2: LOW-COST COLLATION (Cheapest Model / Worker Agent)
    // We delegate this via Agent Relay to a "Collator" worker.
    console.log('\n[TIER 2] Delegating Collation to Low-Cost Model via Agent Relay...');

    const spawnContent = `KIND: spawn
NAME: Collator
CLI: gemini
TASK: High-priority data collation task. 
1. Read the findings in expert_findings.json.
2. Run the collation scripts: arp_summary.js and nostr_summary.js.
3. Ensure the dashboard data files (arp_summary.json, nostr_summary.json) are updated.
4. When finished, send a DONE message to the Lead.`;

    const outboxPath = path.join(__dirname, '.agent-relay', 'outbox');
    if (!fs.existsSync(outboxPath)) {
        fs.mkdirSync(outboxPath, { recursive: true });
    }

    fs.writeFileSync(path.join(outboxPath, 'spawn'), spawnContent);

    console.log('Triggering Agent Relay spawn...');
    console.log('->relay-file:spawn');

    console.log('\n--- ORCHESTRATION HANDOFF COMPLETE ---');
}

if (require.main === module) {
    runTieredWorkflow().catch(console.error);
}
