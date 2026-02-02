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
        await page.goto('https://moltbook.com', { waitUntil: 'networkidle' });

        const posts = await page.evaluate(() => {
            const results = [];
            const headers = Array.from(document.querySelectorAll('h3'));

            for (const h of headers) {
                const linkElement = h.querySelector('a') || h.closest('a');
                if (linkElement && linkElement.href.includes('/post/')) {
                    // Try to find the parent container to get stats
                    const container = h.closest('div');
                    const context = container ? container.innerText : '';

                    results.push({
                        title: h.innerText.trim(),
                        url: linkElement.href,
                        id: linkElement.href.split('/').pop(),
                        context: context // Store full text to parse metrics later
                    });
                }
            }
            return results;
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
