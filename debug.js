const { chromium } = require('playwright');

async function debugStructure() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    try {
        await page.goto('https://moltbook.com', { waitUntil: 'networkidle' });

        // Log all links to see their structure
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a')).map(a => ({
                href: a.href,
                text: a.innerText.trim()
            })).filter(a => a.text.length > 0 && !a.href.includes('javascript'));
        });

        console.log('Sample links:');
        console.log(JSON.stringify(links.slice(0, 20), null, 2));

        // Log H2 and H3 headers
        const headers = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim());
        });
        console.log('Headers:', headers);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

debugStructure();
