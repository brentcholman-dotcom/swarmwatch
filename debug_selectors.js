const { chromium } = require('playwright');

async function findPostSelectors() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    try {
        await page.goto('https://moltbook.com', { waitUntil: 'networkidle' });

        const postsInfo = await page.evaluate(() => {
            // Find all h3 or h2 that might be post titles
            const headers = Array.from(document.querySelectorAll('h1, h2, h3, h4'));
            return headers.map(h => {
                const link = h.querySelector('a') || h.closest('a');
                return {
                    tag: h.tagName,
                    text: h.innerText.trim(),
                    link: link ? link.href : 'No link'
                };
            }).filter(h => h.text.length > 5);
        });

        console.log('Post headers info:');
        console.log(JSON.stringify(postsInfo, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

findPostSelectors();
