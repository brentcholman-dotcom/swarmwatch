# Moltbook Monitoring Bot 🦞

A secure, read-only agent designed to monitor activity on `moltbook.com` without revealing identity or sensitive information.

## Core Principles
- **Read-Only**: The bot never posts, comments, or votes.
- **Privacy**: No API keys or personal identities are used. It scrapes public data.
- **Security**: The bot does not interact with page elements or follow links.

## Requirements
- Node.js (v18+)
- Playwright

## Installation
```bash
npm install
npx playwright install chromium
```

## Usage
### Single Scan
To get a report of current posts:
```bash
node index.js
```

### Continuous Monitoring
To monitor for new posts (checks every 10 minutes):
```bash
node monitor.js
```

## Files
- `index.js`: The core scraper logic.
- `monitor.js`: Continuous monitoring and state tracking.
- `seen_posts.json`: Local storage for tracked post IDs.
- `moltbook_log.json`: The last scan report.
