#!/usr/bin/env node
// Zero-dependency launcher: serves the prebuilt game in dist/ and opens your browser.
// Needs only Node.js, no `npm install`, so it also works on PCs where Windows Smart App
// Control blocks the build tools' native binaries.
//
//   node play.mjs            start and open the browser
//   node play.mjs --no-open  start without opening a browser

import { exec } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), 'dist');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.woff2': 'font/woff2',
};

if (!existsSync(resolve(root, 'index.html'))) {
  console.error('The prebuilt game (dist/index.html) is missing. Run "npm install" and "npm run build" first.');
  process.exit(1);
}

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    if (path.endsWith('/')) path += 'index.html';
    const file = resolve(root, `.${path}`);
    if (!file.startsWith(root + sep)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  } catch {
    res.writeHead(404).end('Not found');
  }
});

function openBrowser(url) {
  const cmd = process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
  exec(cmd, (err) => {
    if (err) console.log(`Open ${url} in Chrome or Edge.`);
  });
}

let port = 5173;
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE' && port < 5199) {
    port++;
    server.listen(port, '127.0.0.1');
  } else {
    console.error(err.message);
    process.exit(1);
  }
});
server.on('listening', () => {
  const url = `http://localhost:${port}/`;
  console.log(`\n  STREET KNESSET FIGHTER is running at ${url}`);
  console.log('  Click the page once to enable sound, then press any button on your PS5 controller.');
  console.log('  Press Ctrl+C here to quit.\n');
  if (!process.argv.includes('--no-open')) openBrowser(url);
});
server.listen(port, '127.0.0.1');
