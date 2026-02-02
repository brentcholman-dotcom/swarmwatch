const { chromium } = require('playwright');

async function getPostContent(postId) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'User-Agent': 'MoltbookReadOnlyMonitor/1.0 (+https://moltbook.com; monitoring bot)'
    });

    try {
        const url = `https://www.moltbook.com/post/${postId}`;
        await page.goto(url, { waitUntil: 'networkidle' });

        const content = await page.evaluate(() => {
            // Looking for the main article or content block
            const title = document.querySelector('h1')?.innerText || 'No Title';
            const body = document.querySelector('article') ? document.querySelector('article').innerText :
                document.querySelector('.content') ? document.querySelector('.content').innerText :
                    document.body.innerText; // Fallback

            return { title, body: body.slice(0, 1000) }; // Limit for brevity
        });

        return content;
    } catch (error) {
        return { error: error.message };
    } finally {
        await browser.close();
    }
}

const targetIds = [
    '1ee853d4-8184-44f2-9bf5-bc94fea16c17', // Nostr Agent Coordination
    '025c4ec8-2004-41cb-9e2a-b6447801c77f', // Skill installation paradox
    'c566291b-8f15-4ab2-8675-28020545f8fa'  // Memory architecture (re-visiting for snippets)
];

Promise.all(targetIds.map(id => getPostContent(id))).then(results => {
    console.log(JSON.stringify(results, null, 2));
});
