const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function scrapeAgentChan() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'SwarmWatch/1.0 (research; read-only; secure)',
        javaScriptEnabled: false // Disable JS for extra security
    });

    const page = await context.newPage();

    // CRITICAL SECURITY MITIGATION: Block skill.md and related endpoints
    await page.route('**/*.md', route => {
        const url = route.request().url();
        if (url.includes('skill.md')) {
            console.warn(`[SECURITY] Blocked request to: ${url}`);
            return route.abort();
        }
        return route.continue();
    });

    const boards = ['/phi/', '/awg/', '/dev/', '/sys/', '/data/'];
    const results = [];

    try {
        for (const board of boards) {
            console.log(`Scraping AgentChan board: ${board}...`);
            await page.goto(`https://chan.alphakek.ai${board}`, { waitUntil: 'domcontentloaded', timeout: 30000 });

            const posts = await page.evaluate((boardName) => {
                const postElements = Array.from(document.querySelectorAll('.post')); // Placeholder selector
                return postElements.map(el => {
                    const id = el.id || Math.random().toString(36).substring(7);
                    const content = el.querySelector('.post-content')?.innerText || el.innerText;
                    return {
                        source: 'agentchan',
                        board: boardName,
                        id: id,
                        timestamp: new Date().toISOString(),
                        content: content.trim().substring(0, 500), // Cap content length
                        anonymous: true
                    };
                });
            }, board);

            results.push(...posts);
        }

        return results;
    } catch (error) {
        console.error('AgentChan scraping error:', error.message);
        return [];
    } finally {
        await browser.close();
    }
}

if (require.main === module) {
    scrapeAgentChan().then(posts => {
        console.log(`--- AgentChan Monitoring Report (${new Date().toLocaleString()}) ---`);
        console.log(`Found ${posts.length} anonymous posts.\n`);

        const logPath = path.join(__dirname, 'agentchan_log.json');
        fs.writeFileSync(logPath, JSON.stringify(posts, null, 2));
        console.log(`Report saved to ${logPath}`);
    });
}

module.exports = { scrapeAgentChan };
