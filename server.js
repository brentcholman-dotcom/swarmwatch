const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/data', (req, res) => {
    try {
        const logPath = path.join(__dirname, 'moltbook_log.json');
        const posts = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf8')) : [];

        // Define some logical alerts based on keywords in titles
        const alerts = [];
        const dangerousKeywords = ['hacker', 'exploit', 'security', 'danger', 'attack', 'brute force', 'leaked', 'vulnerability'];

        posts.forEach(post => {
            const matches = dangerousKeywords.filter(kw => post.title.toLowerCase().includes(kw));
            if (matches.length > 0) {
                alerts.push({
                    type: 'SECURITY ANOMALY',
                    message: `Filtered discovery: "${post.title}" contains suspicious keywords: ${matches.join(', ')}`
                });
            }
        });

        res.json({ posts, alerts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/arp', (req, res) => {
    try {
        const path = require('path');
        const fs = require('fs');
        const summaryPath = path.join(__dirname, 'arp_summary.json');
        const summary = fs.existsSync(summaryPath) ? JSON.parse(fs.readFileSync(summaryPath, 'utf8')) : { error: 'No summary available yet.' };
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n--- Moltbook Dashboard Live ---`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Time: ${new Date().toLocaleString()}\n`);
});
