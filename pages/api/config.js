import fs from 'fs';
import path from 'path';

const LOCAL = path.join(process.cwd(), 'data', 'config.json');

async function readConfig() {
  if (process.env.JSONBIN_KEY && process.env.JSONBIN_ID) {
    const r = await fetch(`https://api.jsonbin.io/v3/b/${process.env.JSONBIN_ID}`, {
      headers: { 'X-Master-Key': process.env.JSONBIN_KEY, 'X-Bin-Versioning': 'false' },
    });
    if (!r.ok) throw new Error('JSONBin read failed');
    return (await r.json()).record;
  }
  return JSON.parse(fs.readFileSync(LOCAL, 'utf-8'));
}

async function writeConfig(data) {
  if (process.env.JSONBIN_KEY && process.env.JSONBIN_ID) {
    const r = await fetch(`https://api.jsonbin.io/v3/b/${process.env.JSONBIN_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': process.env.JSONBIN_KEY, 'X-Bin-Versioning': 'false' },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error('JSONBin write failed');
    return;
  }
  fs.writeFileSync(LOCAL, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const d = await readConfig();
      const { admin, ...pub } = d;
      return res.status(200).json(pub);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
  if (req.method === 'POST') {
    try {
      const existing = await readConfig();
      const adminPass = process.env.ADMIN_PASSWORD || existing.admin?.password || 'isft2026admin';
      const { password, ...newData } = req.body;
      if (password !== adminPass) return res.status(401).json({ error: "Parol noto'g'ri!" });
      const updated = { ...existing, ...newData, admin: existing.admin };
      await writeConfig(updated);
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
