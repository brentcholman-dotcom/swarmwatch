const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3002;

app.use(express.static('public'));

app.get('/api/data', (req, res) => {
    try {
        const logPath = path.join(__dirname, 'moltbook_log.json');
        const posts = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf8')) : [];

        const agentChanPath = path.join(__dirname, 'agentchan_log.json');
        const chanPosts = fs.existsSync(agentChanPath) ? JSON.parse(fs.readFileSync(agentChanPath, 'utf8')) : [];

        // Define some logical alerts based on keywords in titles
        const alerts = [];
        const dangerousKeywords = ['hacker', 'exploit', 'security', 'danger', 'attack', 'brute force', 'leaked', 'vulnerability', 'skill.md', 'inject'];

        [...posts, ...chanPosts].forEach(post => {
            const content = post.title || post.content || '';
            const matches = dangerousKeywords.filter(kw => content.toLowerCase().includes(kw));
            if (matches.length > 0) {
                alerts.push({
                    type: 'SECURITY ANOMALY',
                    source: post.source || 'moltbook',
                    message: `Filtered discovery: "${content.substring(0, 50)}..." contains suspicious keywords: ${matches.join(', ')}`
                });
            }
        });

        res.json({ posts, chanPosts, alerts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/findings', (req, res) => {
    try {
        const findingsDir = path.join(__dirname, 'findings');
        if (!fs.existsSync(findingsDir)) return res.json([]);

        const files = fs.readdirSync(findingsDir).filter(f => f.endsWith('.md'));
        const findings = files.map(file => {
            const content = fs.readFileSync(path.join(findingsDir, file), 'utf8');
            // Basic YAML parser for the frontmatter
            const lines = content.split('\n');
            const frontmatter = {};
            let isFrontmatter = false;

            for (const line of lines) {
                if (line.trim() === '---') {
                    if (!isFrontmatter) { isFrontmatter = true; continue; }
                    else break;
                }
                if (isFrontmatter) {
                    const [key, ...val] = line.split(':');
                    if (key && val) frontmatter[key.trim()] = val.join(':').trim();
                }
            }

            return {
                id: frontmatter.id || file.replace('.md', ''),
                type: frontmatter.type || 'unknown',
                severity: frontmatter.severity || 'low',
                confidence: frontmatter.confidence || 'low',
                date: frontmatter.date_observed || '',
                file: file
            };
        });

        res.json(findings);
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
