import Head from 'next/head';
import { useState, useEffect } from 'react';

const clone = o => JSON.parse(JSON.stringify(o));

// ── Toast ──────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    if (msg) { const id = setTimeout(onClose, 3500); return () => clearTimeout(id); }
  }, [msg]);
  if (!msg) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 22px', borderRadius: 14, fontWeight: 700, fontSize: 15,
      background: type === 'ok' ? '#16a34a' : '#C1272D', color: '#fff',
      boxShadow: '0 8px 32px rgba(0,0,0,.25)', animation: 'toastIn .3s ease',
    }}>
      <span style={{ fontSize: 20 }}>{type === 'ok' ? '✅' : '❌'}</span>{msg}
    </div>
  );
}

// ── UI primitives ──────────────────────────────────────────────────
const IS = {
  width: '100%', padding: '9px 13px', borderRadius: 10,
  border: '2px solid #e5e7eb', fontSize: 14, outline: 'none',
  background: '#fff', fontFamily: 'inherit', transition: 'border-color .2s',
};
const fR = e => e.target.style.borderColor = '#C1272D';
const fB = e => e.target.style.borderColor = '#e5e7eb';

function Inp({ value, onChange, placeholder, type = 'text', mono }) {
  return <input type={type} value={value || ''} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} onFocus={fR} onBlur={fB}
    style={{ ...IS, fontFamily: mono ? 'monospace' : 'inherit' }} />;
}
function Txt({ value, onChange, placeholder, rows = 3 }) {
  return <textarea value={value || ''} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} rows={rows} onFocus={fR} onBlur={fB}
    style={{ ...IS, resize: 'vertical' }} />;
}
function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontWeight: 700, fontSize: 12, color: '#555', marginBottom: hint ? 3 : 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</label>
      {hint && <p style={{ fontSize: 11, color: '#999', marginBottom: 5 }}>{hint}</p>}
      {children}
    </div>
  );
}
function Row2({ children }) { return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{children}</div>; }
function Row3({ children }) { return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>{children}</div>; }
function AddBtn({ onClick, label }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10,
      padding: '8px 16px', background: '#fff', border: '2px dashed #C1272D',
      borderRadius: 10, color: '#C1272D', fontWeight: 600, fontSize: 13, cursor: 'pointer',
    }}>＋ {label}</button>
  );
}
function DelBtn({ onClick, label = "O'chirish" }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 13px',
      background: '#fee2e2', color: '#C1272D', border: 'none', borderRadius: 8,
      fontWeight: 600, fontSize: 12, cursor: 'pointer', marginTop: 8,
    }}>🗑 {label}</button>
  );
}
function InfoBox({ color = 'blue', children }) {
  const C = { blue: ['#eff6ff', '#93c5fd', '#1e40af'], yellow: ['#fef9f0', '#fde68a', '#92400e'], green: ['#f0fdf4', '#86efac', '#166534'] }[color];
  return (
    <div style={{ background: C[0], border: `1px solid ${C[1]}`, borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: C[2], lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

// ── 3-til input: har bir maydon UZ/RU/EN ──────────────────────────
function LangField({ label, hint, value, onChange, multiline, rows = 3 }) {
  // value = { uz:'...', ru:'...', en:'...' } yoki string
  const isObj = value && typeof value === 'object';
  const obj = isObj ? value : { uz: value || '', ru: '', en: '' };

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontWeight: 700, fontSize: 12, color: '#555', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</label>
      {hint && <p style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>{hint}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {['uz', 'ru', 'en'].map(l => (
          <div key={l}>
            <div style={{ fontSize: 11, fontWeight: 700, color: l === 'uz' ? '#C1272D' : l === 'ru' ? '#1d4ed8' : '#15803d', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>{l === 'uz' ? '🇺🇿' : l === 'ru' ? '🇷🇺' : '🇬🇧'}</span> {l.toUpperCase()}
            </div>
            {multiline
              ? <textarea value={obj[l] || ''} onChange={e => onChange({ ...obj, [l]: e.target.value })}
                  rows={rows} onFocus={fR} onBlur={fB}
                  style={{ ...IS, resize: 'vertical', fontSize: 13 }} />
              : <input value={obj[l] || ''} onChange={e => onChange({ ...obj, [l]: e.target.value })}
                  onFocus={fR} onBlur={fB}
                  style={{ ...IS, fontSize: 13 }} />
            }
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Accordion card ─────────────────────────────────────────────────
function SCard({ emoji, title, desc, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: '#fff', borderRadius: 18, border: '2px solid #f0f0f0', overflow: 'hidden', marginBottom: 14, boxShadow: '0 2px 10px rgba(0,0,0,.04)' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: 12,
        background: open ? '#fef2f2' : '#fff', border: 'none', cursor: 'pointer',
        borderBottom: open ? '2px solid #fce7e7' : 'none', transition: 'all .2s',
      }}>
        <span style={{ fontSize: 22 }}>{emoji}</span>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{title}</div>
          {desc && <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{desc}</div>}
        </div>
        <span style={{ color: '#C1272D', fontWeight: 700, fontSize: 18, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>⌄</span>
      </button>
      {open && <div style={{ padding: 20 }}>{children}</div>}
    </div>
  );
}

function LItem({ children, onDelete }) {
  return (
    <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: 12, padding: '13px 42px 13px 14px', marginBottom: 10, position: 'relative' }}>
      {children}
      <button onClick={onDelete} style={{
        position: 'absolute', top: 10, right: 10, width: 26, height: 26,
        background: '#fee2e2', color: '#C1272D', border: 'none', borderRadius: 6,
        cursor: 'pointer', fontWeight: 700, fontSize: 15, lineHeight: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>×</button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════
export default function AdminPage() {
  const [stage, setStage] = useState('login');
  const [pass, setPass] = useState('');
  const [passErr, setPassErr] = useState('');
  const [cfg, setCfg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'ok' });
  const [activeTab, setActiveTab] = useState('hero');
  const [pwForm, setPwForm] = useState({ cur: '', n1: '', n2: '' });

  const showToast = (msg, type = 'ok') => setToast({ msg, type });

  const upd = (path, val) => {
    setCfg(prev => {
      const next = clone(prev);
      const parts = path.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = val;
      return next;
    });
  };

  const doLogin = async () => {
    setPassErr('');
    try {
      const r = await fetch('/api/config', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass }),
      });
      if (!r.ok) { setPassErr("Parol noto'g'ri!"); return; }
      const d = await (await fetch('/api/config')).json();
      setCfg(clone(d));
      setStage('dashboard');
    } catch { setPassErr('Tarmoq xatosi.'); }
  };

  const doSave = async () => {
    setSaving(true);
    try {
      const r = await fetch('/api/config', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass, ...cfg }),
      });
      const d = await r.json();
      if (r.ok) showToast("O'zgarishlar saqlandi! ✓");
      else showToast(d.error || 'Xatolik', 'err');
    } catch { showToast('Tarmoq xatosi', 'err'); }
    setSaving(false);
  };

  const doChangePw = async () => {
    if (pwForm.n1 !== pwForm.n2) return showToast('Parollar mos emas', 'err');
    if (pwForm.n1.length < 6) return showToast('Kamida 6 ta belgi', 'err');
    try {
      const r = await fetch('/api/change-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.cur, newPassword: pwForm.n1 }),
      });
      const d = await r.json();
      if (r.ok) { showToast("Parol o'zgartirildi!"); setPass(pwForm.n1); setPwForm({ cur: '', n1: '', n2: '' }); }
      else showToast(d.error || 'Xatolik', 'err');
    } catch { showToast('Tarmoq xatosi', 'err'); }
  };

  const TABS = [
    { id: 'hero',       emoji: '🏠', label: 'Bosh sahifa',      desc: 'Badge, sarlavha, xususiyatlar' },
    { id: 'prices',     emoji: '💰', label: 'Narxlar',          desc: 'Kontrakt narxlari' },
    { id: 'countdown',  emoji: '⏰', label: 'Sanalamoqda',      desc: 'Qabul tugash sanasi' },
    { id: 'faculties',  emoji: '🎓', label: 'Dasturlar',        desc: "Ta'lim yo'nalishlari" },
    { id: 'fees',       emoji: '📊', label: "To'lov jadvali",   desc: 'Yillik to\'lovlar' },
    { id: 'about',      emoji: '📖', label: 'Haqida',           desc: 'Hamkorlik tavsifi' },
    { id: 'steps',      emoji: '📋', label: 'Qadamlar',         desc: 'Dual Degree bosqichlari' },
    { id: 'advantages', emoji: '✅', label: 'Afzalliklar',      desc: 'Kartochkalar' },
    { id: 'stats',      emoji: '🔢', label: 'Statistika',       desc: "Ko'rsatkichlar" },
    { id: 'contact',    emoji: '📞', label: 'Aloqa',            desc: 'Telefon, manzil' },
    { id: 'cta',        emoji: '🎯', label: 'Chaqiruv (CTA)',   desc: 'Matn va tugmalar' },
    { id: 'social',     emoji: '🔗', label: 'Ijtimoiy',         desc: 'Social media' },
    { id: 'footer',     emoji: '📄', label: 'Footer',           desc: 'Pastki havolalar' },
    { id: 'site',       emoji: '⚙️', label: 'Sayt sozlash',    desc: "URL'lar va sana" },
    { id: 'security',   emoji: '🔐', label: 'Xavfsizlik',       desc: "Parolni o'zgartirish" },
  ];

  const CSS = `
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,-apple-system,sans-serif;background:#f5f5f5;color:#111}
    @keyframes toastIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
    input:focus,textarea:focus{border-color:#C1272D!important;box-shadow:0 0 0 3px rgba(193,39,45,.1)!important}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#C1272D;border-radius:4px}
    .ntab{cursor:pointer;padding:9px 11px;border-radius:9px;border:none;width:100%;
      text-align:left;background:transparent;transition:all .15s;margin-bottom:2px;
      display:flex;align-items:center;gap:9px;font-family:inherit;}
    .ntab:hover{background:#fef2f2;}
    .ntab.active{background:#fef2f2;border-left:3px solid #C1272D;color:#C1272D;font-weight:700;}

    /* 3-til badge */
    .lang-hint{display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap}
    .lbadge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:100px;font-size:11px;font-weight:700}
    .lbadge.uz{background:#fef2f2;color:#C1272D}
    .lbadge.ru{background:#eff6ff;color:#1d4ed8}
    .lbadge.en{background:#f0fdf4;color:#15803d}
  `;

  // ── LOGIN ─────────────────────────────────────────────────────
  if (stage === 'login') return (
    <>
      <Head><title>Admin Kirish — ISFT</title></Head>
      <style>{CSS}</style>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: 'ok' })} />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#C1272D,#9A1F24)', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 28, padding: '50px 42px', width: '100%', maxWidth: 420, boxShadow: '0 32px 80px rgba(0,0,0,.25)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg,#C1272D,#FFD700,#C1272D)' }} />
          <div style={{ textAlign: 'center', marginBottom: 34 }}>
            <div style={{ width: 84, height: 84, background: 'linear-gradient(135deg,#C1272D,#9A1F24)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#fff', fontSize: 28, fontWeight: 900, letterSpacing: 2, border: '3px solid #FFD700' }}>ISFT</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111', marginBottom: 5 }}>Admin Panel</h1>
            <p style={{ color: '#888', fontSize: 13 }}>ISFT Samarqand boshqaruv tizimi</p>
          </div>
          <Field label="🔑 Parol">
            <input type="password" value={pass} onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doLogin()} placeholder="Parolni kiriting..."
              autoFocus style={{ ...IS, padding: '13px 16px', fontSize: 15, borderRadius: 12, boxSizing: 'border-box', border: passErr ? '2px solid #C1272D' : '2px solid #e5e7eb' }} />
            {passErr && <div style={{ marginTop: 7, padding: '9px 13px', background: '#fee2e2', borderRadius: 8, color: '#C1272D', fontSize: 13, fontWeight: 600 }}>⚠️ {passErr}</div>}
          </Field>
          <button onClick={doLogin} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#C1272D,#9A1F24)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 20px rgba(193,39,45,.4)', letterSpacing: 1 }}>
            Kirish →
          </button>
          <div style={{ marginTop: 22, padding: '11px 14px', background: '#f8f8f8', borderRadius: 10, display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 17 }}>💡</span>
            <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>Default parol: <strong style={{ color: '#C1272D' }}>isft2026admin</strong><br /><span style={{ color: '#999' }}>Xavfsizlik uchun parolni o'zgartiring</span></p>
          </div>
        </div>
      </div>
    </>
  );

  if (!cfg) return <><style>{CSS}</style><div style={{ padding: 40, textAlign: 'center', color: '#888', fontSize: 16 }}>⏳ Yuklanmoqda...</div></>;

  const curTab = TABS.find(t => t.id === activeTab);

  // ── DASHBOARD ─────────────────────────────────────────────────
  return (
    <>
      <Head><title>Admin — ISFT Samarqand</title></Head>
      <style>{CSS}</style>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: 'ok' })} />

      {/* TOP BAR */}
      <div style={{ position: 'sticky', top: 0, zIndex: 200, height: 58, background: 'linear-gradient(135deg,#C1272D,#9A1F24)', display: 'flex', alignItems: 'center', padding: '0 20px', boxShadow: '0 4px 20px rgba(193,39,45,.3)', gap: 12 }}>
        <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 9, padding: '5px 12px', color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: 2, border: '1px solid rgba(255,255,255,.2)' }}>ISFT</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Admin Panel</div>
          <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 11 }}>3 tilli boshqaruv tizimi 🇺🇿🇷🇺🇬🇧</div>
        </div>

        {/* 3 til indikatori */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['🇺🇿 UZ', '🇷🇺 RU', '🇬🇧 EN'].map((l, i) => (
            <div key={i} style={{ padding: '4px 10px', background: 'rgba(255,255,255,.15)', borderRadius: 100, color: '#fff', fontSize: 12, fontWeight: 600, border: '1px solid rgba(255,255,255,.25)' }}>{l}</div>
          ))}
        </div>

        <a href="/" target="_blank" style={{ padding: '7px 14px', background: 'rgba(255,255,255,.15)', color: '#fff', borderRadius: 9, fontSize: 12, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,.25)' }}>👁 Ko'rish</a>
        <button onClick={doSave} disabled={saving} style={{ padding: '8px 18px', background: '#FFD700', color: '#000', border: 'none', borderRadius: 9, fontWeight: 800, fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}>
          {saving ? '⏳...' : '💾 Saqlash'}
        </button>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 58px)' }}>
        {/* SIDEBAR */}
        <div style={{ width: 220, background: '#fff', borderRight: '2px solid #f0f0f0', padding: '13px 10px', flexShrink: 0, position: 'sticky', top: 58, height: 'calc(100vh - 58px)', overflowY: 'auto' }}>
          {/* 3 til badge */}
          <div style={{ background: 'linear-gradient(135deg,#fef2f2,#fff)', border: '2px solid #fce7e7', borderRadius: 12, padding: '11px 13px', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#C1272D', marginBottom: 7 }}>🌐 3 tilda tahrirlash</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              <span className="lbadge uz">🇺🇿 O'zbek</span>
              <span className="lbadge ru">🇷🇺 Rus</span>
              <span className="lbadge en">🇬🇧 Ingliz</span>
            </div>
            <p style={{ fontSize: 10, color: '#888', marginTop: 6, lineHeight: 1.5 }}>Har bir matn maydonida 3 ta kiritish joyi bo'ladi</p>
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, color: '#bbb', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6, paddingLeft: 3 }}>BO'LIMLAR</div>

          {TABS.map(t => (
            <button key={t.id} className={`ntab${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
              style={{ fontWeight: activeTab === t.id ? 700 : 400, color: activeTab === t.id ? '#C1272D' : '#444', fontSize: 12, borderLeft: activeTab === t.id ? '3px solid #C1272D' : '3px solid transparent' }}>
              <span style={{ fontSize: 16 }}>{t.emoji}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ lineHeight: 1.2 }}>{t.label}</div>
                <div style={{ fontSize: 9, color: '#bbb', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.desc}</div>
              </div>
            </button>
          ))}

          <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: 12, marginTop: 10 }}>
            <button onClick={doSave} disabled={saving} style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg,#C1272D,#9A1F24)', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? '⏳ Saqlanmoqda...' : '💾 Saqlash'}
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, padding: 22, overflowY: 'auto', maxHeight: 'calc(100vh - 58px)' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '10px 15px', background: '#fff', borderRadius: 12, border: '2px solid #f0f0f0' }}>
            <span style={{ color: '#ccc', fontSize: 12 }}>Admin</span>
            <span style={{ color: '#e5e7eb' }}>›</span>
            <span style={{ fontSize: 17 }}>{curTab?.emoji}</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{curTab?.label}</span>
            <span style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: 4 }}>
              <span style={{ fontSize: 11, background: '#fef2f2', color: '#C1272D', padding: '2px 7px', borderRadius: 100, fontWeight: 600 }}>🇺🇿 UZ</span>
              <span style={{ fontSize: 11, background: '#eff6ff', color: '#1d4ed8', padding: '2px 7px', borderRadius: 100, fontWeight: 600 }}>🇷🇺 RU</span>
              <span style={{ fontSize: 11, background: '#f0fdf4', color: '#15803d', padding: '2px 7px', borderRadius: 100, fontWeight: 600 }}>🇬🇧 EN</span>
            </div>
          </div>

          {/* 3 til tushuntirish */}
          {['hero','countdown','faculties','fees','about','steps','advantages','stats','contact','cta','social','footer'].includes(activeTab) && (
            <InfoBox color="blue">
              🌐 Bu bo'limdagi matnlar <strong>3 tilda</strong> kiritiladi. Har bir maydon yonidagi <strong>🇺🇿 UZ / 🇷🇺 RU / 🇬🇧 EN</strong> qismlarini to'ldiring. Foydalanuvchi saytda til almashtirganida mos matn ko'rinadi.
            </InfoBox>
          )}

          {/* ════════ HERO ════════ */}
          {activeTab === 'hero' && (<>
            <SCard emoji="🏷️" title="Badge va Sarlavha" defaultOpen>
              <LangField label="Badge matni" hint="Masalan: RASMIY HAMKORLIK 2026"
                value={cfg.hero.badge} onChange={v => upd('hero.badge', v)} />
              <Row2>
                <Field label="Sarlavha (bir tilda)">
                  <Inp value={cfg.hero.title} onChange={v => upd('hero.title', v)} placeholder="DUAL DEGREE" />
                </Field>
                <Field label="Yil">
                  <Inp value={cfg.hero.year} onChange={v => upd('hero.year', v)} placeholder="2026" />
                </Field>
              </Row2>
              <Field label="Sub-sarlavha (bir tilda, har 3 tilda bir xil)">
                <Inp value={cfg.hero.subtitle} onChange={v => upd('hero.subtitle', v)} />
              </Field>
              <LangField label="CTA tugma matni"
                value={cfg.hero.ctaText} onChange={v => upd('hero.ctaText', v)} />
            </SCard>

            <SCard emoji="✨" title="Xususiyatlar (3 dona)">
              <InfoBox color="yellow">💡 Icon nomi: <strong>fa-graduation-cap</strong>, <strong>fa-globe-americas</strong>, <strong>fa-briefcase</strong> — fontawesome.com</InfoBox>
              {cfg.hero.features.map((f, i) => (
                <LItem key={i} onDelete={() => { const a = clone(cfg.hero.features); a.splice(i, 1); upd('hero.features', a); }}>
                  <Field label={`${i + 1}-xususiyat icon`}>
                    <Inp value={f.icon} onChange={v => { const a = clone(cfg.hero.features); a[i].icon = v; upd('hero.features', a); }} placeholder="fa-graduation-cap" />
                  </Field>
                  <LangField label="Matn" value={f.text}
                    onChange={v => { const a = clone(cfg.hero.features); a[i].text = v; upd('hero.features', a); }} />
                </LItem>
              ))}
              <AddBtn label="Xususiyat qo'shish" onClick={() => upd('hero.features', [...cfg.hero.features, { icon: 'fa-star', text: { uz: '', ru: '', en: '' } }])} />
            </SCard>
          </>)}

          {/* ════════ PRICES ════════ */}
          {activeTab === 'prices' && (<>
            <SCard emoji="🏷️" title="Bo'lim sarlavhasi" defaultOpen>
              <LangField label="Narxlar bo'limi sarlavhasi" value={cfg.prices.title} onChange={v => upd('prices.title', v)} />
            </SCard>
            {cfg.prices.items.map((p, i) => (
              <SCard key={i} emoji="💵" title={p.name?.uz || `Narx ${i + 1}`} desc={p.amount} defaultOpen={i === 0}>
                <LangField label="Ta'lim turi nomi" value={p.name} onChange={v => { const a = clone(cfg.prices.items); a[i].name = v; upd('prices.items', a); }} />
                <LangField label="Izoh matni" value={p.note} onChange={v => { const a = clone(cfg.prices.items); a[i].note = v; upd('prices.items', a); }} />
                <Row2>
                  <Field label="Narxi ($4,500 / yil)">
                    <Inp value={p.amount} onChange={v => { const a = clone(cfg.prices.items); a[i].amount = v; upd('prices.items', a); }} />
                  </Field>
                  <Field label="Icon (fa-user-graduate...)">
                    <Inp value={p.icon} onChange={v => { const a = clone(cfg.prices.items); a[i].icon = v; upd('prices.items', a); }} mono />
                  </Field>
                </Row2>
                <DelBtn onClick={() => { const a = clone(cfg.prices.items); a.splice(i, 1); upd('prices.items', a); }} label="Bu narxni o'chirish" />
              </SCard>
            ))}
            <AddBtn label="Narx qo'shish" onClick={() => upd('prices.items', [...cfg.prices.items, { icon: 'fa-tag', name: { uz: '', ru: '', en: '' }, note: { uz: '', ru: '', en: '' }, amount: '' }])} />
          </>)}

          {/* ════════ COUNTDOWN ════════ */}
          {activeTab === 'countdown' && (
            <SCard emoji="⏰" title="Sanalamoqda bloki" defaultOpen>
              <InfoBox color="green">✅ Sana o'tib ketgandan keyin <strong>00:00:00:00</strong> ko'rsatadi.</InfoBox>
              <LangField label="Sarlavha" value={cfg.countdown.title} onChange={v => upd('countdown.title', v)} />
              <LangField label="Sub-sarlavha" value={cfg.countdown.subtitle} onChange={v => upd('countdown.subtitle', v)} />
              <Field label="⏱ Tugash sanasi" hint="Format: YYYY-MM-DDTHH:MM:SS">
                <Inp value={cfg.site.countdownDate} onChange={v => upd('site.countdownDate', v)} placeholder="2026-09-01T09:00:00" mono />
              </Field>
              {cfg.site.countdownDate && (
                <div style={{ marginTop: 8, padding: '10px 14px', background: '#fef2f2', borderRadius: 10, border: '1px solid #fce7e7', fontSize: 13 }}>
                  📅 <strong style={{ color: '#C1272D' }}>
                    {(() => { try { return new Date(cfg.site.countdownDate).toLocaleString('uz-UZ', { dateStyle: 'long', timeStyle: 'short' }); } catch { return cfg.site.countdownDate; } })()}
                  </strong>
                </div>
              )}
            </SCard>
          )}

          {/* ════════ FACULTIES ════════ */}
          {activeTab === 'faculties' && (<>
            <SCard emoji="📋" title="Bo'lim sarlavhasi" defaultOpen>
              <LangField label="Sarlavha" value={cfg.faculties.title} onChange={v => upd('faculties.title', v)} />
              <LangField label="Sub-sarlavha" value={cfg.faculties.subtitle} onChange={v => upd('faculties.subtitle', v)} />
            </SCard>
            {cfg.faculties.items.map((fac, fi) => (
              <SCard key={fi} emoji="🏫" title={fac.title?.uz || `Dastur ${fi + 1}`} desc={`${fac.programs.length} ta yo'nalish`}>
                <LangField label="Dastur nomi" value={fac.title} onChange={v => { const a = clone(cfg.faculties.items); a[fi].title = v; upd('faculties.items', a); }} />
                <Field label="Icon (fa-chart-bar...)">
                  <Inp value={fac.icon} onChange={v => { const a = clone(cfg.faculties.items); a[fi].icon = v; upd('faculties.items', a); }} mono />
                </Field>
                <div style={{ fontWeight: 700, fontSize: 11, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.5px' }}>📚 Yo'nalishlar</div>
                {fac.programs.map((prog, pi) => (
                  <LItem key={pi} onDelete={() => { const a = clone(cfg.faculties.items); a[fi].programs.splice(pi, 1); upd('faculties.items', a); }}>
                    <LangField label={`${pi + 1}-yo'nalish nomi`} value={prog.name}
                      onChange={v => { const a = clone(cfg.faculties.items); a[fi].programs[pi].name = v; upd('faculties.items', a); }} />
                    <Field label="Narxi (bo'sh = yashirin)">
                      <Inp value={prog.price} onChange={v => { const a = clone(cfg.faculties.items); a[fi].programs[pi].price = v; upd('faculties.items', a); }} placeholder="$4,500/yil" />
                    </Field>
                  </LItem>
                ))}
                <AddBtn label="Yo'nalish qo'shish" onClick={() => { const a = clone(cfg.faculties.items); a[fi].programs.push({ name: { uz: '', ru: '', en: '' }, price: '' }); upd('faculties.items', a); }} />
                <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 12, paddingTop: 10 }}>
                  <DelBtn onClick={() => { const a = clone(cfg.faculties.items); a.splice(fi, 1); upd('faculties.items', a); }} label="Bu dasturni o'chirish" />
                </div>
              </SCard>
            ))}
            <AddBtn label="Dastur qo'shish" onClick={() => upd('faculties.items', [...cfg.faculties.items, { icon: 'fa-school', title: { uz: 'Yangi Dastur', ru: 'Новая Программа', en: 'New Program' }, programs: [] }])} />
          </>)}

          {/* ════════ FEES ════════ */}
          {activeTab === 'fees' && (<>
            <SCard emoji="📋" title="Jadval sarlavhasi" defaultOpen>
              <LangField label="Sarlavha" value={cfg.fees.title} onChange={v => upd('fees.title', v)} />
              <LangField label="Sub-sarlavha" value={cfg.fees.subtitle} onChange={v => upd('fees.subtitle', v)} />
              <LangField label="Izoh (pastda chiqadi)" value={cfg.fees.note} onChange={v => upd('fees.note', v)} multiline rows={2} />
            </SCard>
            <SCard emoji="📑" title="Ustun nomlari">
              <InfoBox color="yellow">5 ta ustun: Daraja, 1-yil, 2-yil, 3-yil, 4-yil</InfoBox>
              <LangField label="Ustun nomlari (vergul bilan ajratiladi)" value={cfg.fees.cols}
                onChange={v => upd('fees.cols', v)} />
            </SCard>
            {cfg.fees.items.map((row, i) => (
              <SCard key={i} emoji="💵" title={row.level?.uz || `Qator ${i + 1}`} desc={`${row.y1} → ${row.y4}`} defaultOpen={i === 0}>
                <LangField label="Daraja nomi" value={row.level} onChange={v => { const a = clone(cfg.fees.items); a[i].level = v; upd('fees.items', a); }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                  {['y1', 'y2', 'y3', 'y4'].map((yr, j) => (
                    <Field key={j} label={`${j + 1}-yil`}>
                      <Inp value={row[yr]} onChange={v => { const a = clone(cfg.fees.items); a[i][yr] = v; upd('fees.items', a); }} placeholder={j > 1 ? '—' : '$4,500'} />
                    </Field>
                  ))}
                </div>
                <DelBtn onClick={() => { const a = clone(cfg.fees.items); a.splice(i, 1); upd('fees.items', a); }} />
              </SCard>
            ))}
            <AddBtn label="Qator qo'shish" onClick={() => upd('fees.items', [...cfg.fees.items, { level: { uz: '', ru: '', en: '' }, y1: '', y2: '', y3: '', y4: '' }])} />
          </>)}

          {/* ════════ ABOUT ════════ */}
          {activeTab === 'about' && (<>
            <SCard emoji="📖" title="Asosiy matnlar" defaultOpen>
              <LangField label="Tag matni" value={cfg.about.tag} onChange={v => upd('about.tag', v)} />
              <LangField label="Sarlavha" value={cfg.about.title} onChange={v => upd('about.title', v)} />
              <LangField label="Sub-sarlavha" value={cfg.about.subtitle} onChange={v => upd('about.subtitle', v)} multiline rows={2} />
            </SCard>
            <SCard emoji="📝" title="Paragraflar">
              {cfg.about.paragraphs.map((p, i) => (
                <LItem key={i} onDelete={() => { const a = clone(cfg.about.paragraphs); a.splice(i, 1); upd('about.paragraphs', a); }}>
                  <LangField label={`${i + 1}-paragraf`} value={p}
                    onChange={v => { const a = clone(cfg.about.paragraphs); a[i] = v; upd('about.paragraphs', a); }}
                    multiline rows={3} />
                </LItem>
              ))}
              <AddBtn label="Paragraf qo'shish" onClick={() => upd('about.paragraphs', [...cfg.about.paragraphs, { uz: '', ru: '', en: '' }])} />
            </SCard>
            <SCard emoji="🇬🇧" title="Greenwich kartochkasi">
              <Field label="Universitet nomi (bir tilda)">
                <Inp value={cfg.about.uniName} onChange={v => upd('about.uniName', v)} />
              </Field>
              <LangField label="Tavsif" value={cfg.about.uniDesc} onChange={v => upd('about.uniDesc', v)} multiline rows={3} />
              <LangField label="Chip matni" value={cfg.about.uniBadge} onChange={v => upd('about.uniBadge', v)} />
            </SCard>
          </>)}

          {/* ════════ STEPS ════════ */}
          {activeTab === 'steps' && (<>
            <SCard emoji="📋" title="Sarlavha" defaultOpen>
              <LangField label="Bo'lim sarlavhasi" value={cfg.steps.title} onChange={v => upd('steps.title', v)} />
            </SCard>
            {cfg.steps.items.map((s, i) => (
              <SCard key={i} emoji={['1️⃣', '2️⃣', '3️⃣', '4️⃣'][i] || '🔢'} title={s.title?.uz || `Qadam ${i + 1}`} defaultOpen={i === 0}>
                <Row2>
                  <Field label="Raqam">
                    <Inp value={s.num} onChange={v => { const a = clone(cfg.steps.items); a[i].num = v; upd('steps.items', a); }} placeholder="01" />
                  </Field>
                  <div />
                </Row2>
                <LangField label="Sarlavha" value={s.title} onChange={v => { const a = clone(cfg.steps.items); a[i].title = v; upd('steps.items', a); }} />
                <LangField label="Tavsif" value={s.desc} onChange={v => { const a = clone(cfg.steps.items); a[i].desc = v; upd('steps.items', a); }} multiline rows={3} />
                <DelBtn onClick={() => { const a = clone(cfg.steps.items); a.splice(i, 1); upd('steps.items', a); }} />
              </SCard>
            ))}
            <AddBtn label="Qadam qo'shish" onClick={() => upd('steps.items', [...cfg.steps.items, { num: `0${cfg.steps.items.length + 1}`, title: { uz: '', ru: '', en: '' }, desc: { uz: '', ru: '', en: '' } }])} />
          </>)}

          {/* ════════ ADVANTAGES ════════ */}
          {activeTab === 'advantages' && (<>
            <SCard emoji="📋" title="Sarlavha" defaultOpen>
              <LangField label="Bo'lim sarlavhasi" value={cfg.advantages.title} onChange={v => upd('advantages.title', v)} />
            </SCard>
            {cfg.advantages.items.map((a2, i) => (
              <SCard key={i} emoji={a2.icon || '✅'} title={a2.title?.uz || `Afzallik ${i + 1}`}>
                <Row2>
                  <Field label="Emoji icon">
                    <Inp value={a2.icon} onChange={v => { const a = clone(cfg.advantages.items); a[i].icon = v; upd('advantages.items', a); }} placeholder="🎓" />
                  </Field>
                  <div />
                </Row2>
                <LangField label="Sarlavha" value={a2.title} onChange={v => { const a = clone(cfg.advantages.items); a[i].title = v; upd('advantages.items', a); }} />
                <LangField label="Tavsif" value={a2.desc} onChange={v => { const a = clone(cfg.advantages.items); a[i].desc = v; upd('advantages.items', a); }} multiline rows={2} />
                <DelBtn onClick={() => { const a = clone(cfg.advantages.items); a.splice(i, 1); upd('advantages.items', a); }} />
              </SCard>
            ))}
            <AddBtn label="Afzallik qo'shish" onClick={() => upd('advantages.items', [...cfg.advantages.items, { icon: '⭐', title: { uz: '', ru: '', en: '' }, desc: { uz: '', ru: '', en: '' } }])} />
          </>)}

          {/* ════════ STATS ════════ */}
          {activeTab === 'stats' && (<>
            <SCard emoji="📋" title="Bo'lim sarlavhasi" defaultOpen>
              <LangField label="Sarlavha" value={cfg.stats.title} onChange={v => upd('stats.title', v)} />
              <LangField label="Sub-sarlavha" value={cfg.stats.subtitle} onChange={v => upd('stats.subtitle', v)} />
            </SCard>
            {cfg.stats.items.map((s, i) => (
              <SCard key={i} emoji="📈" title={s.label?.uz || `Ko'rsatkich ${i + 1}`} desc={s.number} defaultOpen={i === 0}>
                <Row2>
                  <Field label="Raqam/Matn (4700+)">
                    <Inp value={s.number} onChange={v => { const a = clone(cfg.stats.items); a[i].number = v; upd('stats.items', a); }} />
                  </Field>
                  <Field label="Icon (fa-users...)">
                    <Inp value={s.icon} onChange={v => { const a = clone(cfg.stats.items); a[i].icon = v; upd('stats.items', a); }} mono />
                  </Field>
                </Row2>
                <LangField label="Yorliq" value={s.label} onChange={v => { const a = clone(cfg.stats.items); a[i].label = v; upd('stats.items', a); }} />
                <DelBtn onClick={() => { const a = clone(cfg.stats.items); a.splice(i, 1); upd('stats.items', a); }} />
              </SCard>
            ))}
            <AddBtn label="Ko'rsatkich qo'shish" onClick={() => upd('stats.items', [...cfg.stats.items, { icon: 'fa-star', number: '', label: { uz: '', ru: '', en: '' } }])} />
          </>)}

          {/* ════════ CONTACT ════════ */}
          {activeTab === 'contact' && (
            <SCard emoji="📞" title="Aloqa bo'limi" defaultOpen>
              <LangField label="Sarlavha" value={cfg.contact.title} onChange={v => upd('contact.title', v)} />
              <LangField label="Sub-sarlavha" value={cfg.contact.subtitle} onChange={v => upd('contact.subtitle', v)} />
              <Row2>
                <Field label="Telefon (qisqa)"><Inp value={cfg.site.phone} onChange={v => upd('site.phone', v)} /></Field>
                <Field label="Telefon (tel:...)"><Inp value={cfg.site.phoneLink} onChange={v => upd('site.phoneLink', v)} mono /></Field>
              </Row2>
              <LangField label="Shahar (manzil 1)" value={cfg.site.address1} onChange={v => upd('site.address1', v)} />
              <LangField label="Ko'cha va uy (manzil 2)" value={cfg.site.address2} onChange={v => upd('site.address2', v)} />
              <Row2>
                <Field label="Veb-sayt (ko'rsatish)"><Inp value={cfg.site.website} onChange={v => upd('site.website', v)} /></Field>
                <Field label="Email"><Inp value={cfg.site.email} onChange={v => upd('site.email', v)} /></Field>
              </Row2>
            </SCard>
          )}

          {/* ════════ CTA ════════ */}
          {activeTab === 'cta' && (
            <SCard emoji="🎯" title="Chaqiruv bo'limi" defaultOpen>
              <LangField label="Sarlavha" value={cfg.cta.title} onChange={v => upd('cta.title', v)} />
              <LangField label="Tavsif matni" value={cfg.cta.text} onChange={v => upd('cta.text', v)} multiline rows={4} />
              <LangField label="1-tugma matni (asosiy)" value={cfg.cta.btn1} onChange={v => upd('cta.btn1', v)} />
              <Field label="2-tugma matni (telefon, bir tilda)">
                <Inp value={cfg.cta.btn2} onChange={v => upd('cta.btn2', v)} placeholder="55 518-70-70" />
              </Field>
            </SCard>
          )}

          {/* ════════ SOCIAL ════════ */}
          {activeTab === 'social' && (<>
            <SCard emoji="📋" title="Bo'lim sarlavhasi" defaultOpen>
              <LangField label="Sarlavha" value={cfg.social.title} onChange={v => upd('social.title', v)} />
              <LangField label="Sub-sarlavha" value={cfg.social.subtitle} onChange={v => upd('social.subtitle', v)} />
              <LangField label="Asosiy sayt tugmasi matni" value={cfg.social.mainBtnText} onChange={v => upd('social.mainBtnText', v)} />
              <LangField label="'Ochish' tugmasi matni" value={cfg.social.openText} onChange={v => upd('social.openText', v)} />
            </SCard>
            {cfg.social.items.map((s, i) => (
              <SCard key={s.id || i} emoji={s.id === 'telegram' ? '✈️' : s.id === 'instagram' ? '📸' : s.id === 'facebook' ? '👤' : s.id === 'youtube' ? '▶️' : '💼'} title={s.name} desc={s.url?.slice(0, 40)}>
                <Row3>
                  <Field label="Nomi"><Inp value={s.name} onChange={v => { const a = clone(cfg.social.items); a[i].name = v; upd('social.items', a); }} /></Field>
                  <Field label="FA icon" hint="fab fa-telegram-plane"><Inp value={s.icon} onChange={v => { const a = clone(cfg.social.items); a[i].icon = v; upd('social.items', a); }} mono /></Field>
                  <Field label="URL"><Inp value={s.url} onChange={v => { const a = clone(cfg.social.items); a[i].url = v; upd('social.items', a); }} /></Field>
                </Row3>
                <DelBtn onClick={() => { const a = clone(cfg.social.items); a.splice(i, 1); upd('social.items', a); }} />
              </SCard>
            ))}
            <AddBtn label="Tarmoq qo'shish" onClick={() => upd('social.items', [...cfg.social.items, { id: `s${Date.now()}`, icon: 'fas fa-link', name: '', url: '' }])} />
          </>)}

          {/* ════════ FOOTER ════════ */}
          {activeTab === 'footer' && (<>
            <SCard emoji="📝" title="Footer matnlari" defaultOpen>
              <LangField label="Institut tavsifi" value={cfg.footer.desc} onChange={v => upd('footer.desc', v)} multiline rows={3} />
              <LangField label="'Asosiy saytga o'tish' tugmasi" value={cfg.footer.visitSite} onChange={v => upd('footer.visitSite', v)} />
              <Row3>
                <div>
                  <LangField label="Tezkor havolalar sarlavhasi" value={cfg.footer.quickLinksTitle} onChange={v => upd('footer.quickLinksTitle', v)} />
                </div>
                <div>
                  <LangField label="Dasturlar sarlavhasi" value={cfg.footer.programsTitle} onChange={v => upd('footer.programsTitle', v)} />
                </div>
                <div>
                  <LangField label="Aloqa sarlavhasi" value={cfg.footer.contactTitle} onChange={v => upd('footer.contactTitle', v)} />
                </div>
              </Row3>
              <Row3>
                <div><LangField label="Huquqlar matni" value={cfg.footer.rights} onChange={v => upd('footer.rights', v)} /></div>
                <div><LangField label="Maxfiylik matni" value={cfg.footer.privacy} onChange={v => upd('footer.privacy', v)} /></div>
                <div><LangField label="Shartlar matni" value={cfg.footer.terms} onChange={v => upd('footer.terms', v)} /></div>
              </Row3>
            </SCard>
            <SCard emoji="🔗" title="Tezkor havolalar">
              {cfg.footer.quickLinks.map((l, i) => (
                <LItem key={i} onDelete={() => { const a = clone(cfg.footer.quickLinks); a.splice(i, 1); upd('footer.quickLinks', a); }}>
                  <LangField label="Havola matni" value={l.label} onChange={v => { const a = clone(cfg.footer.quickLinks); a[i].label = v; upd('footer.quickLinks', a); }} />
                  <Field label="URL"><Inp value={l.url} onChange={v => { const a = clone(cfg.footer.quickLinks); a[i].url = v; upd('footer.quickLinks', a); }} mono /></Field>
                </LItem>
              ))}
              <AddBtn label="Havola qo'shish" onClick={() => upd('footer.quickLinks', [...cfg.footer.quickLinks, { label: { uz: '', ru: '', en: '' }, url: '' }])} />
            </SCard>
            <SCard emoji="🎓" title="Dasturlar havolalar">
              {cfg.footer.programs.map((l, i) => (
                <LItem key={i} onDelete={() => { const a = clone(cfg.footer.programs); a.splice(i, 1); upd('footer.programs', a); }}>
                  <LangField label="Havola matni" value={l.label} onChange={v => { const a = clone(cfg.footer.programs); a[i].label = v; upd('footer.programs', a); }} />
                  <Field label="URL"><Inp value={l.url} onChange={v => { const a = clone(cfg.footer.programs); a[i].url = v; upd('footer.programs', a); }} mono /></Field>
                </LItem>
              ))}
              <AddBtn label="Havola qo'shish" onClick={() => upd('footer.programs', [...cfg.footer.programs, { label: { uz: '', ru: '', en: '' }, url: '' }])} />
            </SCard>
          </>)}

          {/* ════════ SITE ════════ */}
          {activeTab === 'site' && (<>
            <SCard emoji="🔗" title="URL havolalar" defaultOpen>
              <Field label="Qabul URL"><Inp value={cfg.site.admissionUrl} onChange={v => upd('site.admissionUrl', v)} /></Field>
              <Field label="Yangilik URL"><Inp value={cfg.site.newsUrl} onChange={v => upd('site.newsUrl', v)} /></Field>
              <Field label="Asosiy sayt URL"><Inp value={cfg.site.mainSiteUrl} onChange={v => upd('site.mainSiteUrl', v)} /></Field>
              <Row2>
                <Field label="Veb-sayt (qisqa)"><Inp value={cfg.site.website} onChange={v => upd('site.website', v)} /></Field>
                <Field label="Veb-sayt (to'liq)"><Inp value={cfg.site.websiteUrl} onChange={v => upd('site.websiteUrl', v)} /></Field>
              </Row2>
            </SCard>
            <SCard emoji="📞" title="Aloqa">
              <Row2>
                <Field label="Telefon (qisqa)"><Inp value={cfg.site.phone} onChange={v => upd('site.phone', v)} /></Field>
                <Field label="Telefon (to'liq +998...)"><Inp value={cfg.site.phoneFull} onChange={v => upd('site.phoneFull', v)} /></Field>
              </Row2>
              <Field label="Telefon havolasi (tel:...)"><Inp value={cfg.site.phoneLink} onChange={v => upd('site.phoneLink', v)} mono /></Field>
              <Field label="Email"><Inp value={cfg.site.email} onChange={v => upd('site.email', v)} /></Field>
              <Field label="Countdown sanasi" hint="YYYY-MM-DDTHH:MM:SS"><Inp value={cfg.site.countdownDate} onChange={v => upd('site.countdownDate', v)} mono /></Field>
            </SCard>
          </>)}

          {/* ════════ SECURITY ════════ */}
          {activeTab === 'security' && (<>
            <SCard emoji="🔑" title="Parolni o'zgartirish" defaultOpen>
              <InfoBox color="yellow">⚠️ Vercel'da <code>ADMIN_PASSWORD</code> env var ham yangilang.</InfoBox>
              <div style={{ maxWidth: 420 }}>
                <Field label="Joriy parol"><Inp type="password" value={pwForm.cur} onChange={v => setPwForm(p => ({ ...p, cur: v }))} /></Field>
                <Field label="Yangi parol" hint="Kamida 6 ta belgi"><Inp type="password" value={pwForm.n1} onChange={v => setPwForm(p => ({ ...p, n1: v }))} /></Field>
                <Field label="Yangi parolni tasdiqlang"><Inp type="password" value={pwForm.n2} onChange={v => setPwForm(p => ({ ...p, n2: v }))} /></Field>
                <button onClick={doChangePw} style={{ padding: '11px 24px', background: 'linear-gradient(135deg,#C1272D,#9A1F24)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                  🔑 Yangilash
                </button>
              </div>
            </SCard>
            <SCard emoji="ℹ️" title="Tizim haqida">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['⚡', 'Framework', 'Next.js 14'], ['☁️', 'Hosting', 'Vercel'], ['🗄️', "Ma'lumotlar", 'JSONBin.io'], ['🌐', 'Tillar', '🇺🇿 🇷🇺 🇬🇧 3 til'], ['🟢', 'Status', 'Ishlayapti ✓'], ['🔒', 'Admin', 'Himoyalangan']].map(([ico, lbl, val], i) => (
                  <div key={i} style={{ background: '#f8f8f8', borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 9, alignItems: 'center' }}>
                    <span style={{ fontSize: 20 }}>{ico}</span>
                    <div><div style={{ fontSize: 10, color: '#999', marginBottom: 2 }}>{lbl}</div><div style={{ fontWeight: 700, fontSize: 13 }}>{val}</div></div>
                  </div>
                ))}
              </div>
            </SCard>
          </>)}

          {/* SAVE REMINDER */}
          <div style={{ marginTop: 20, padding: '14px 18px', background: 'linear-gradient(135deg,#fef2f2,#fff)', borderRadius: 14, border: '2px solid #fce7e7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ fontSize: 20 }}>💾</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>O'zgarishlarni saqlash</div>
                <div style={{ fontSize: 11, color: '#888' }}>Barcha 3 tildagi matnlar saqlanadi</div>
              </div>
            </div>
            <button onClick={doSave} disabled={saving} style={{ padding: '10px 24px', background: saving ? '#999' : 'linear-gradient(135deg,#C1272D,#9A1F24)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? '⏳ Saqlanmoqda...' : '💾 Saqlash'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
