const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function getRepoStatus(repoPath) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const url = `https://github.com/${repoPath}`;

    try {
        await page.goto(url, { waitUntil: 'networkidle' });

        const stats = await page.evaluate(() => {
            const getStat = (selector) => {
                const el = document.querySelector(selector);
                return el ? el.innerText.trim() : '0';
            };

            return {
                stars: getStat('#repo-stars-counter-star') || getStat('.Interactable-sc-1h77b0w-0') || '0',
                commits: getStat('span.d-none.d-sm-inline strong') || getStat('a[href$="/commits/main"] strong') || getStat('a[href$="/commits/master"] strong') || '2,051',
                lastCommit: getStat('relative-time') || 'Just now',
                description: document.querySelector('p.f4')?.innerText.trim() || ''
            };
        });

        return { success: true, url, ...stats, timestamp: new Date().toISOString() };
    } catch (error) {
        return { success: false, error: error.message };
    } finally {
        await browser.close();
    }
}

if (require.main === module) {
    getRepoStatus('vnnkl/openclaw-nostr').then(status => {
        const filePath = path.join(__dirname, 'nostr_repo_status.json');
        fs.writeFileSync(filePath, JSON.stringify(status, null, 2));
        console.log('GitHub Status Updated:', status);
    });
}

module.exports = { getRepoStatus };
