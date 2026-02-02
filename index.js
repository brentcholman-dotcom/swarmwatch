const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function scrapeMoltbook() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Set a neutral User-Agent to avoid identity exposure
    await page.setExtraHTTPHeaders({
        'User-Agent': 'MoltbookReadOnlyMonitor/1.0 (+https://moltbook.com; monitoring bot)'
    });

    try {
        await page.goto('https://www.moltbook.com/api/v1/posts', { waitUntil: 'domcontentloaded', timeout: 60000 });

        const posts = await page.evaluate(() => {
            try {
                // If it's a JSON response, it might be wrapped in a <pre> tag by the browser
                const pre = document.querySelector('pre');
                const raw = pre ? pre.innerText : document.body.innerText;
                const data = JSON.parse(raw);

                // Map API format to our internal format
                return (data.posts || data).map(post => ({
                    title: post.title,
                    url: `https://www.moltbook.com/post/${post.id}`,
                    id: post.id,
                    context: post.content
                }));
            } catch (e) {
                console.error('API parse error:', e.message);
                return [];
            }
        });

        return posts;
    } catch (error) {
        console.error('Scraping error:', error.message);
        return [];
    } finally {
        await browser.close();
    }
}

if (require.main === module) {
    scrapeMoltbook().then(posts => {
        console.log(`--- Moltbook Monitoring Report (${new Date().toLocaleString()}) ---`);
        console.log(`Found ${posts.length} active posts.\n`);
        posts.forEach((post, i) => {
            console.log(`${i + 1}. ${post.title}`);
            console.log(`   URL: ${post.url}`);
        });

        // Save to a local file for history
        const logPath = path.join(__dirname, 'moltbook_log.json');
        fs.writeFileSync(logPath, JSON.stringify(posts, null, 2));
        console.log(`\nReport saved to ${logPath}`);
    });
}

module.exports = { scrapeMoltbook };
