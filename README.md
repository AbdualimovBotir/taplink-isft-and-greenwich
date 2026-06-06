# ISFT × Greenwich — Dual Degree Taplink

## 🗂 Loyiha tuzilmasi

```
dual-degree/
├── pages/
│   ├── index.js              ← Asosiy taplink sahifasi
│   ├── _app.js
│   ├── admin/
│   │   └── index.js          ← Admin panel  →  /admin
│   └── api/
│       ├── config.js         ← Ma'lumot o'qish / yozish
│       └── change-password.js
├── data/
│   └── config.json           ← Local dev uchun ma'lumotlar
├── styles/
│   └── globals.css
├── .env.local.example        ← Muhit o'zgaruvchilari namunasi
├── vercel.json
└── package.json
```

---

## 🚀 Vercel'ga deploy — bosqichma-bosqich

### 1-qadam — JSONBin.io sozlash (2 daqiqa, bepul)

Vercel serverless muhitida `data/config.json` ga to'g'ridan-to'g'ri yozib bo'lmaydi.  
Shuning uchun **JSONBin.io** — bepul cloud JSON saqlash xizmati ishlatiladi.

1. **https://jsonbin.io** — bepul ro'yxatdan o'ting
2. **API Keys** → **+ Create API Key** → nomini kiriting → kalitni nusxa oling
3. **Bins** → **Create Bin** tugmasini bosing
4. `data/config.json` ichidagi **butun JSON** ni Bin maydoniga joylashtiring
5. **Create** tugmasini bosing
6. URL dan **Bin ID** ni nusxa oling:  
   `https://api.jsonbin.io/v3/b/`**`6642f1234abc...`** ← shu qism

---

### 2-qadam — GitHub'ga yuklash

```bash
cd dual-degree
git init
git add .
git commit -m "ISFT Greenwich Dual Degree taplink"
git branch -M main
git remote add origin https://github.com/SIZNING/REPO.git
git push -u origin main
```

---

### 3-qadam — Vercel'da deploy

1. **https://vercel.com** → **New Project** → GitHub repo tanlang
2. **Environment Variables** bo'limiga quyidagilarni kiriting:

| O'zgaruvchi | Qiymat |
|---|---|
| `JSONBIN_KEY` | JSONBin.io dan olgan API Key |
| `JSONBIN_ID` | Bin ID (URL dan) |
| `ADMIN_PASSWORD` | `isft2026admin` (o'zingiznikini kiriting) |

3. **Deploy** tugmasini bosing ✅

---

## 💻 Local ishlab chiqish

```bash
# 1. .env.local faylini yarating
cp .env.local.example .env.local
# Keyin .env.local ni tahrirlang

# 2. Paketlarni o'rnating
npm install

# 3. Ishga tushiring
npm run dev
```

- Taplink: **http://localhost:3000**
- Admin: **http://localhost:3000/admin**

> Local'da JSONBin env var bo'lmasa, `data/config.json` ishlatiladi.

---

## 🔐 Admin panel

| | |
|---|---|
| **URL** | `yourdomain.vercel.app/admin` |
| **Default parol** | `isft2026admin` |
| **Parol o'zgartirish** | Admin → 🔐 Xavfsizlik |

---

## ✏️ Nima tahrirlash mumkin?

| Bo'lim | Nima |
|---|---|
| ⚙️ Sayt | Ranglar, URL'lar, telefon, manzil, email |
| 🏠 Hero | Badge, sarlavha, yil, statistika kartochkalari |
| 📖 Haqida | Paragraflar, universitet tavsifi |
| 🎓 Dasturlar | Qo'shish/o'chirish, icon, badge, davomiylik |
| 💰 Narxlar | Yillik to'lov miqdorlari, izoh |
| 📋 Qadamlar | Dual Degree bosqichlari |
| ✅ Afzalliklar | Kartochkalar qo'shish/tahrirlash |
| 📰 Yangilik | Sarlavha, matn, sana |
| 🎯 CTA | Chaqiruv bo'limi |
| 🔗 Ijtimoiy | Barcha social havolalar |
| 🔐 Xavfsizlik | Parol o'zgartirish |

---

## ❓ Tez-tez so'raladigan savollar

**Saqlash ishlamayapti?**  
→ Vercel'da `JSONBIN_KEY` va `JSONBIN_ID` to'g'ri kiritilganligini tekshiring.

**Parol noto'g'ri xatosi?**  
→ `ADMIN_PASSWORD` env var ni tekshiring yoki default: `isft2026admin`.

**Ma'lumotlar yangilanmayapti?**  
→ Sahifani Ctrl+F5 bilan yangilang (cache).

**Local'da ishlayapti lekin Vercel'da yo'q?**  
→ Vercel Dashboard → Settings → Environment Variables tekshiring.
