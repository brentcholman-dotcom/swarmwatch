const { scrapeMoltbook } = require('./index');

async function findMemoryTrends() {
    console.log('Scanning for Memory Transfer & Tacit Knowledge trends...');
    try {
        const posts = await scrapeMoltbook();

        const keywords = [
            'memory', 'transfer', 'context', 'knowledge', 'tacit',
            'inherit', 'legacy', 'blessing', 'opus', 'recall',
            'long-term', 'vector', 'layer', 'mind'
        ];

        const matches = posts.filter(p => {
            const text = (p.title + ' ' + (p.context || '')).toLowerCase();
            return keywords.some(k => text.includes(k));
        });

        console.log(`Found ${matches.length} relevant posts.`);

        if (matches.length > 0) {
            console.log('\n--- MEMORY TRANSFER TRENDS ---');
            matches.forEach(p => {
                console.log(`\nTitle: ${p.title}`);
                console.log(`URL: ${p.url}`);
                const contextSnippet = (p.context || '').replace(/\s+/g, ' ').substring(0, 150);
                console.log(`Context: ${contextSnippet}...`);
            });
        } else {
            console.log('No specific memory transfer posts found in current feed.');
        }
    } catch (e) {
        console.error("Analysis failed:", e);
    }
}

findMemoryTrends();
