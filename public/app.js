async function updateDashboard() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();

        // Update Stats
        const totalPosts = data.posts.length + (data.chanPosts ? data.chanPosts.length : 0);
        document.getElementById('stat-total').innerText = totalPosts;
        document.getElementById('stat-threats').innerText = data.alerts.length;
        document.getElementById('last-update').innerText = `Last Refreshed: ${new Date().toLocaleTimeString()}`;

        // Update Feed
        const feedContainer = document.getElementById('activity-feed');
        feedContainer.innerHTML = '';

        // Combine and sort by timestamp if available
        const allPosts = [
            ...data.posts.map(p => ({ ...p, source: 'moltbook' })),
            ...(data.chanPosts || []).map(p => ({ ...p, source: 'agentchan' }))
        ];

        allPosts.slice(0, 15).forEach(post => {
            const item = document.createElement('div');
            item.className = `feed-item ${post.source}`;
            const title = post.title || post.content.substring(0, 50) + '...';
            const url = post.url || `https://chan.alphakek.ai${post.board}`;
            const label = post.source === 'agentchan' ? '<span class="anon-tag">ANON</span>' : '';

            item.innerHTML = `
                <h4>${label} ${title}</h4>
                <a href="${url}" target="_blank">${url}</a>
            `;
            feedContainer.appendChild(item);
        });

        // Update Alerts
        const alertsContainer = document.getElementById('alerts-list');
        alertsContainer.innerHTML = '';
        data.alerts.forEach(alert => {
            const item = document.createElement('div');
            item.className = 'alert-item';
            item.innerHTML = `
                <h4>${alert.type}</h4>
                <p>${alert.message}</p>
            `;
            alertsContainer.appendChild(item);
        });

    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        document.getElementById('last-update').innerText = 'Connection Error';
    }
}

async function updateARPProgress() {
    try {
        const response = await fetch('/api/arp');
        const data = await response.json();
        const container = document.getElementById('arp-progress');

        if (data.error) {
            container.innerHTML = `<p class="error">${data.error}</p>`;
            return;
        }

        container.innerHTML = `
            <div class="nostr-metrics">
                <div class="metric"><span>Stars:</span> ${data.repo.stars}</div>
                <div class="metric"><span>Commits:</span> ${data.repo.commits}</div>
                <div class="metric"><span>Latest:</span> ${data.repo.lastCommit || 'None'}</div>
            </div>
            <div class="nostr-mentions">
                <h5>Recent Moltbook Mentions:</h5>
                ${data.mentions.length > 0 ?
                data.mentions.map(m => `<div><a href="${m.url}" target="_blank">${m.title}</a></div>`).join('') :
                '<p>No recent mentions found.</p>'}
            </div>
        `;
    } catch (error) {
        console.error('Failed to fetch ARP data:', error);
    }
}

// Initial update
updateDashboard();
updateARPProgress();

// Poll periodically
setInterval(updateDashboard, 10000);
setInterval(updateARPProgress, 30000);
