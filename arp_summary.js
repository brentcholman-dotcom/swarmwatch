const fs = require('fs');
const path = require('path');
const { getRepoStatus } = require('./github_tracker');

async function generateARPSummary() {
    console.log('Generating 30-minute Agent Relay Protocol (ARP) Summary...');

    // 1. Get GitHub Status for Agent Relay
    const repoStatus = await getRepoStatus('AgentWorkforce/relay');

    // 2. Get Moltbook Mentions for ARP
    const logPath = path.join(__dirname, 'moltbook_log.json');
    const posts = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf8')) : [];

    const keywords = ['arp', 'agent relay', 'agentcomms', 'machine-native', 'capability discovery'];
    const mentions = posts.filter(post =>
        keywords.some(kw => post.title.toLowerCase().includes(kw))
    );

    // 3. Build Markdown
    const now = new Date();
    let content = `# Agent Relay Protocol (ARP) Progress Report 📡\n`;
    content += `*Last Updated: ${now.toLocaleString()}*\n\n`;

    content += `## 🚀 GitHub Metrics (AgentWorkforce/relay)\n`;
    if (repoStatus.success) {
        content += `- **Stars:** ${repoStatus.stars}\n`;
        content += `- **Commits:** ${repoStatus.commits}\n`;
        content += `- **Last Activity:** ${repoStatus.lastCommit || 'N/A'}\n`;
        content += `- **Status:** ${repoStatus.description}\n\n`;
    } else {
        content += `> [!WARNING]\n> GitHub tracking failed: ${repoStatus.error}\n\n`;
    }

    content += `## 📝 Moltbook Adoption & Activity\n`;
    if (mentions.length > 0) {
        content += `Found **${mentions.length}** relevant discussions in current window:\n`;
        mentions.forEach(m => {
            content += `- [${m.title}](${m.url})\n`;
        });
    } else {
        content += `No new specific ARP discussions on the front page in this window.\n`;
    }

    content += `\n--- \n*This summary is updated every 30 minutes.* \n*Focus: Production-ready agent coordination layer.*\n`;

    // 4. Save to file
    const reportPath = path.join(__dirname, 'arp_progress.md');
    fs.writeFileSync(reportPath, content);

    // Also save a JSON version for the dashboard
    const jsonPath = path.join(__dirname, 'arp_summary.json');
    fs.writeFileSync(jsonPath, JSON.stringify({
        timestamp: now.toISOString(),
        repo: repoStatus,
        mentions: mentions
    }, null, 2));

    console.log('Summary updated: arp_progress.md');
}

if (require.main === module) {
    generateARPSummary();
}

module.exports = { generateARPSummary };
