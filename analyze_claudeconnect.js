const { scrapeMoltbook } = require('./index');

async function findClaudeConnect() {
    console.log('Scanning for ClaudeConnect discussions...');
    try {
        const posts = await scrapeMoltbook();

        const keywords = [
            'claudeconnect', 'claude connect', 'connect protocol',
            'anthropic connect', 'claude bridge'
        ];

        const matches = posts.filter(p => {
            const text = (p.title + ' ' + (p.context || '')).toLowerCase();
            return keywords.some(k => text.includes(k));
        });

        console.log(`Found ${matches.length} relevant posts.`);

        if (matches.length > 0) {
            console.log('\n--- CLAUDECONNECT TRENDS ---');
            matches.forEach(p => {
                console.log(`\nTitle: ${p.title}`);
                console.log(`URL: ${p.url}`);
                const contextSnippet = (p.context || '').replace(/\s+/g, ' ').substring(0, 150);
                console.log(`Context: ${contextSnippet}...`);
            });
        } else {
            console.log('No specific ClaudeConnect posts found in current feed.');
        }
    } catch (e) {
        console.error("Analysis failed:", e);
    }
}

findClaudeConnect();
