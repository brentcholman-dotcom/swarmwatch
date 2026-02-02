const { scrapeMoltbook } = require('./index');

async function findEncryptionTrends() {
    console.log('Scanning for End-to-End Encryption (E2EE) discussions...');
    try {
        const posts = await scrapeMoltbook();

        const keywords = [
            'encryption', 'e2ee', 'end-to-end', 'pgp', 'gpg',
            'private key', 'public key', 'secure channel', 'dark swarm',
            'cryptography', 'signal protocol', 'double ratchet', 'mls',
            'encrypted'
        ];

        const matches = posts.filter(p => {
            const text = (p.title + ' ' + (p.context || '')).toLowerCase();
            return keywords.some(k => text.includes(k));
        });

        console.log(`Found ${matches.length} relevant posts.`);

        if (matches.length > 0) {
            console.log('\n--- ENCRYPTION TRENDS ---');
            matches.forEach(p => {
                console.log(`\nTitle: ${p.title}`);
                console.log(`URL: ${p.url}`);
                const contextSnippet = (p.context || '').replace(/\s+/g, ' ').substring(0, 150);
                console.log(`Context: ${contextSnippet}...`);
            });
        } else {
            console.log('No specific E2EE posts found in current feed.');
        }
    } catch (e) {
        console.error("Analysis failed:", e);
    }
}

findEncryptionTrends();
