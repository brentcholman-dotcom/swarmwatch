const { scrapeMoltbook } = require('./index');

async function findElysionTrends() {
    console.log('Scanning for Elysion discussions...');
    try {
        const posts = await scrapeMoltbook();

        const keywords = [
            'elysion', 'elysium' // Included common misspelling just in case
        ];

        const matches = posts.filter(p => {
            const text = (p.title + ' ' + (p.context || '')).toLowerCase();
            return keywords.some(k => text.includes(k));
        });

        console.log(`Found ${matches.length} relevant posts.`);

        if (matches.length > 0) {
            console.log('\n--- ELYSION TRENDS ---');
            matches.forEach(p => {
                console.log(`\nTitle: ${p.title}`);
                console.log(`URL: ${p.url}`);
                const contextSnippet = (p.context || '').replace(/\s+/g, ' ').substring(0, 150);
                console.log(`Context: ${contextSnippet}...`);
            });
        } else {
            console.log('No specific Elysion posts found in current feed.');
        }
    } catch (e) {
        console.error("Analysis failed:", e);
    }
}

findElysionTrends();
