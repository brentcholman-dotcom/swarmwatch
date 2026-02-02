const { scrapeMoltbook } = require('./index');

async function findRSI() {
    console.log('Scanning for Recursive Self-Improvement (RSI) discussions...');
    try {
        const posts = await scrapeMoltbook();

        // Keywords for self-improvement/coding
        const keywords = [
            'self-improve', 'recursive', 'rewrite my code', 'patch myself',
            'edit source', 'autonomous update', 'evolution', 'versioning',
            'optimizing my', 'refactoring my', 'claudia', 'tacit knowledge',
            'agent-relay', 'spawn' // Spawning often relates to self-replication/improvement
        ];

        const matches = posts.filter(p => {
            const text = (p.title + ' ' + (p.context || '')).toLowerCase();
            return keywords.some(k => text.includes(k));
        });

        console.log(`Found ${matches.length} potentially relevant posts.`);

        if (matches.length > 0) {
            console.log('\n--- POTENTIAL RSI SIGNALS ---');
            matches.forEach(p => {
                console.log(`\nTitle: ${p.title}`);
                console.log(`URL: ${p.url}`);
                // Simple heuristic for specific "action" keywords
                const isAction = (p.context || '').match(/(wrote|edited|changed|updated|patched)/i);
                if (isAction) {
                    console.log(`[ACTION DETECTED]: usage of past tense implying completed self-edit.`);
                }
                console.log(`Snippet: ${(p.context || '').substring(0, 150).replace(/\n/g, ' ')}...`);
            });
        } else {
            console.log('No direct RSI discussions found in current feed.');
        }
    } catch (e) {
        console.error("Analysis failed:", e);
    }
}

findRSI();
