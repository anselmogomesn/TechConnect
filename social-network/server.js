const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BASE = __dirname;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
};

http.createServer((req, res) => {
    let url = req.url.split('?')[0];
    if (url === '/') url = '/preview.html';

    let filePath = path.join(BASE, url);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            // Try with .html extension
            if (!path.extname(url)) {
                const htmlPath = path.join(BASE, url + '.html');
                return fs.readFile(htmlPath, (err2, data2) => {
                    if (err2) {
                        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end('<h1>404 - Arquivo não encontrado</h1>');
                        return;
                    }
                    const ext = path.extname(htmlPath);
                    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/html' });
                    res.end(data2);
                });
            }
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>404 - Arquivo não encontrado</h1>');
            return;
        }

        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
    });
}).listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║     SocialNet - Preview Server Running!       ║
║═══════════════════════════════════════════════║
║                                               ║
║  ► http://localhost:${PORT}                    ║
║                                               ║
║  Landing Page:  http://localhost:${PORT}       ║
║                                               ║
╚═══════════════════════════════════════════════╝
`);
});
