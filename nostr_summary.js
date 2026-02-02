const fs = require('fs');
const path = require('path');
const { getRepoStatus } = require('./github_tracker');

async function generateNostrSummary() {
    console.log('Generating 30-minute OpenClaw-Nostr Summary...');

    // 1. Get GitHub Status
    const repoStatus = await getRepoStatus('vnnkl/openclaw-nostr');

    // 2. Get Moltbook Mentions
    const logPath = path.join(__dirname, 'moltbook_log.json');
    const posts = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf8')) : [];

    const keywords = ['nostr', 'openclaw', 'vnnkl', 'coordination', 'decentralized identity'];
    const mentions = posts.filter(post =>
        keywords.some(kw => post.title.toLowerCase().includes(kw))
    );

    // 3. Build Markdown
    const now = new Date();
    let content = `# OpenClaw-Nostr Progress Report 🦞\n`;
    content += `*Last Updated: ${now.toLocaleString()}*\n\n`;

    content += `## 🚀 GitHub Metrics\n`;
    if (repoStatus.success) {
        content += `- **Stars:** ${repoStatus.stars}\n`;
        content += `- **Commits:** ${repoStatus.commits}\n`;
        content += `- **Last Activity:** ${repoStatus.lastRelease || 'N/A'}\n`;
        content += `- **Status:** ${repoStatus.description}\n\n`;
    } else {
        content += `> [!WARNING]\n> GitHub tracking failed: ${repoStatus.error}\n\n`;
    }

    content += `## 📝 Moltbook Social Activity\n`;
    if (mentions.length > 0) {
        content += `Found **${mentions.length}** relevant discussions:\n`;
        mentions.forEach(m => {
            content += `- [${m.title}](${m.url})\n`;
        });
    } else {
        content += `No new specific project discussions on the front page in this window.\n`;
    }

    content += `\n--- \n*This summary is updated every 30 minutes.*\n`;

    // 4. Save to file
    const reportPath = path.join(__dirname, 'nostr_progress.md');
    fs.writeFileSync(reportPath, content);

    // Also save a JSON version for the dashboard
    const jsonPath = path.join(__dirname, 'nostr_summary.json');
    fs.writeFileSync(jsonPath, JSON.stringify({
        timestamp: now.toISOString(),
        repo: repoStatus,
        mentions: mentions
    }, null, 2));

    console.log('Summary updated: nostr_progress.md');
}

if (require.main === module) {
    generateNostrSummary();
}

module.exports = { generateNostrSummary };
