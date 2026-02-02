const { scrapeMoltbook } = require('./index');
const fs = require('fs');
const path = require('path');
const { generateARPSummary } = require('./arp_summary');

const SEEN_POSTS_FILE = path.join(__dirname, 'seen_posts.json');
const CHECK_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const SUMMARY_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

function loadSeenPosts() {
    if (fs.existsSync(SEEN_POSTS_FILE)) {
        try {
            const data = fs.readFileSync(SEEN_POSTS_FILE, 'utf8');
            return new Set(JSON.parse(data));
        } catch (e) {
            return new Set();
        }
    }
    return new Set();
}

function saveSeenPosts(seenSet) {
    fs.writeFileSync(SEEN_POSTS_FILE, JSON.stringify(Array.from(seenSet)));
}

async function runMonitor() {
    console.log(`[${new Date().toLocaleTimeString()}] Checking Moltbook for new content...`);

    const seenPosts = loadSeenPosts();
    const currentPosts = await scrapeMoltbook();

    let newCount = 0;
    currentPosts.forEach(post => {
        if (!seenPosts.has(post.id)) {
            console.log(`\n*** NEW POST DETECTED ***`);
            console.log(`Title: ${post.title}`);
            console.log(`URL:   ${post.url}`);
            seenPosts.add(post.id);
            newCount++;
        }
    });

    if (newCount === 0) {
        console.log('No new posts since last check.');
    } else {
        console.log(`\nTotal new posts found: ${newCount}`);
        saveSeenPosts(seenPosts);
    }

    console.log(`Next check in ${CHECK_INTERVAL_MS / 60000} minutes.\n`);
}

// Initial run
runMonitor();
generateARPSummary();

// Schedule periodic checks
setInterval(runMonitor, CHECK_INTERVAL_MS);
setInterval(generateARPSummary, SUMMARY_INTERVAL_MS);

// Security Note:
// This agent is read-only.
// It does not accept external input or execute code from the web.
// It uses a local JSON file to persist state and does not reveal identity.
