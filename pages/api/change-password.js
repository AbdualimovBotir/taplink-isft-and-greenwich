import fs from 'fs';
import path from 'path';

const LOCAL = path.join(process.cwd(), 'data', 'config.json');

async function readConfig() {
  if (process.env.JSONBIN_KEY && process.env.JSONBIN_ID) {
    const r = await fetch(`https://api.jsonbin.io/v3/b/${process.env.JSONBIN_ID}`, {
      headers: { 'X-Master-Key': process.env.JSONBIN_KEY, 'X-Bin-Versioning': 'false' },
    });
    return (await r.json()).record;
  }
  return JSON.parse(fs.readFileSync(LOCAL, 'utf-8'));
}

async function writeConfig(data) {
  if (process.env.JSONBIN_KEY && process.env.JSONBIN_ID) {
    await fetch(`https://api.jsonbin.io/v3/b/${process.env.JSONBIN_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': process.env.JSONBIN_KEY, 'X-Bin-Versioning': 'false' },
      body: JSON.stringify(data),
    });
    return;
  }
  fs.writeFileSync(LOCAL, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const existing = await readConfig();
    const adminPass = process.env.ADMIN_PASSWORD || existing.admin?.password || 'isft2026admin';
    const { currentPassword, newPassword } = req.body;
    if (currentPassword !== adminPass) return res.status(401).json({ error: "Joriy parol noto'g'ri" });
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Kamida 6 ta belgi kerak' });
    existing.admin.password = newPassword;
    await writeConfig(existing);
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
