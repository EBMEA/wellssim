// Tiny zero-dependency static server for local preview.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const ROOT = join(import.meta.dirname, 'site');
const PORT = 3000;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
};

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);

  // Split on either separator, drop empties and any '..' so requests stay inside ROOT.
  const parts = path.split(/[\/\\]+/).filter((s) => s && s !== '.' && s !== '..');
  if (parts.length === 0 || !extname(parts.at(-1))) parts.push('index.html');

  try {
    const file = join(ROOT, ...parts);
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    res.end('<h1>404 — not found</h1>');
  }
}).listen(PORT, () => console.log(`serving ./site on http://localhost:${PORT}`));
