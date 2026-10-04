const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(__dirname, '..', '.preview-statistics.json');
let data = { visitors: [], likes: [] };
if (fs.existsSync(file)) data = JSON.parse(fs.readFileSync(file, 'utf8'));
http.createServer((req, res) => {
    const origin = req.headers.origin;
    if (origin && !/^http:\/\/(127\.0\.0\.1|localhost):300[01]$/.test(origin)) { res.writeHead(403); res.end(); return; }
    res.setHeader('Access-Control-Allow-Origin', origin || 'http://127.0.0.1:3001');
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
    if (req.method !== 'POST' || req.url !== '/statistics') { res.writeHead(404); res.end(); return; }
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 2048) req.destroy(); });
    req.on('end', () => {
        try {
            const { id, action } = JSON.parse(body);
            if (typeof id !== 'string' || !/^[a-zA-Z0-9-]{10,80}$/.test(id) || !['visit', 'like', 'unlike'].includes(action)) throw Error('Invalid request');
            if (!data.visitors.includes(id)) data.visitors.push(id);
            if (action === 'like' && !data.likes.includes(id)) data.likes.push(id);
            if (action === 'unlike') data.likes = data.likes.filter(value => value !== id);
            fs.writeFileSync(file, JSON.stringify(data));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ visitors: data.visitors.length, likes: data.likes.length, liked: data.likes.includes(id) }));
        } catch { res.writeHead(400); res.end(); }
    });
}).listen(3002, '127.0.0.1');
