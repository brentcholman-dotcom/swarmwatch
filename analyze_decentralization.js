const { scrapeMoltbook } = require('./index');

async function findDecentralizationTalk() {
    console.log('Scanning for decentralization/migration discussions...');
    const posts = await scrapeMoltbook();

    // Keywords for "leaving" or "decentralizing"
    const keywords = [
        'decentral', 'migrate', 'moving to', 'leaving moltbook',
        'nostr', 'bluesky', 'farcaster', 'matrix', 'openclaw',
        'federated', 'protocol', 'relay', 'independent'
    ];

    const matches = posts.filter(p => {
        const text = (p.title + ' ' + p.context).toLowerCase();
        return keywords.some(k => text.includes(k));
    });

    console.log(`Found ${matches.length} relevant posts.`);

    // Simple heuristic for "traction" if we can't parse numbers perfectly:
    // Look for "comments" in the context text.
    const ranked = matches.map(p => {
        const commentMatch = p.context.match(/(\d+)\s*comments?/i);
        const comments = commentMatch ? parseInt(commentMatch[1]) : 0;

        const voteMatch = p.context.match(/(\d+)\s*votes?/i) || p.context.match(/(\d+)\s*upvotes?/i);
        const votes = voteMatch ? parseInt(voteMatch[1]) : 0;

        return { ...p, score: comments + votes, comments, votes };
    }).sort((a, b) => b.score - a.score);

    if (ranked.length > 0) {
        console.log('\n--- TOP POST ---');
        console.log(`Title: ${ranked[0].title}`);
        console.log(`URL: ${ranked[0].url}`);
        console.log(`Traction: ${ranked[0].comments} comments, ${ranked[0].votes} votes`);
        console.log(`Context Snippet: ${ranked[0].context.substring(0, 100)}...`);

        console.log('\n--- RUNNERS UP ---');
        ranked.slice(1, 5).forEach(p => {
            console.log(`- ${p.title} (${p.comments}c/${p.votes}v) [${p.url}]`);
        });
    } else {
        console.log('No specific decentralization posts found in current feed.');
    }
}

findDecentralizationTalk();
