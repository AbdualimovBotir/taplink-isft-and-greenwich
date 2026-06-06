import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';

import fs from 'fs';
import path from 'path';



// pages/index.js — getStaticProps ni mana shu bilan ALMASHTIRING

export async function getStaticProps() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'config.json'), 'utf-8');
  const { admin, ...pub } = JSON.parse(raw);

  // ISFT sahifasidan rasmlarni server-side fetch
  let fetchedImages = [];
  try {
    const res = await fetch('https://sam.isft.uz/uz/events/195', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; bot)' }
    });
    const html = await res.text();

    // sam-head.isft.uz/uploads ichidagi barcha rasm URL'larini olish
    const matches = [...html.matchAll(
      /https:\/\/sam-head\.isft\.uz\/uploads\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi
    )];

    // Takrorlanmasin, faqat /news/ papkasidagi rasmlar
    const unique = [...new Set(
      matches
        .map(m => m[0])
        .filter(u => u.includes('%2Fnews%2F') || u.includes('/news/'))
    )];

    fetchedImages = unique;
  } catch (e) {
    console.error('ISFT rasmlarni fetch qilishda xato:', e.message);
  }

  // Agar fetch ishlamasa — config.json dagi images fallback sifatida ishlatiladi
  if (fetchedImages.length > 0) {
    pub.about.images = fetchedImages;
  }

  return { props: { cfg: pub }, revalidate: 3600 }; // har soatda yangilanadi
}

// t(field, lang) — returns string from {uz,ru,en} or plain string
const t = (field, lang) => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field['uz'] || '';
};

function useCountdown(dateStr) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(dateStr).getTime() - Date.now();
      if (diff <= 0) return setTime({ d: 0, h: 0, m: 0, s: 0 });
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dateStr]);
  return time;
}

const pad = n => String(n).padStart(2, '0');

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const UI = {
  uz: { tel: 'Telefon', manzil: 'Manzil', veb: 'Veb-sayt', kun: 'Kun', soat: 'Soat', daqiqa: 'Daqiqa', soniya: 'Soniya' },
  ru: { tel: 'Телефон', manzil: 'Адрес', veb: 'Сайт', kun: 'Дней', soat: 'Часов', daqiqa: 'Минут', soniya: 'Секунд' },
  en: { tel: 'Phone', manzil: 'Address', veb: 'Website', kun: 'Days', soat: 'Hours', daqiqa: 'Minutes', soniya: 'Seconds' },
};

export default function Home({ cfg }) {
  const [lang, setLang] = useState('uz');
  const time = useCountdown(cfg.site.countdownDate);
  useReveal();
  const L = UI[lang];

  const { site, hero, prices, countdown, faculties, fees, about, steps, advantages, stats, contact, cta, social, footer } = cfg;
// ② Home() funksiyasi ichiga, useReveal() dan keyin qo'shing:
const [slide, setSlide] = useState(0);
const slideTimer = useRef(null);
const imgs = about.images || [];
const imgTotal = imgs.length;

useEffect(() => {
  if (imgTotal < 2) return;
  slideTimer.current = setInterval(() => setSlide(s => (s + 1) % imgTotal), 4200);
  return () => clearInterval(slideTimer.current);
}, [imgTotal]);

const goPrev = () => { clearInterval(slideTimer.current); setSlide(s => (s - 1 + imgTotal) % imgTotal); };
const goNext = () => { clearInterval(slideTimer.current); setSlide(s => (s + 1) % imgTotal); };

// ③ JSX ichida eski <section className="sec-about"> ni o'CHIRIB, MANA SHUNI QOYING:
  return (
    <>
      <Head>
        <title>ISFT × Greenwich — Dual Degree 2026</title>
        <meta name="description" content="ISFT Samarqand va University of Greenwich qo'shma dasturi." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </Head>

      {/* BG */}
      <div className="bg-wrapper">
        <div className="diag" />
        <div className="shape shape-1" />
        <div className="shape shape-2" />
      </div>

      <div className="page-content">
        {/* LANG SWITCHER */}
        <div className="lang-sw">
          {['uz','ru','en'].map(l => (
            <button key={l} className={`lang-btn${lang===l?' active':''}`} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-wrap">
            <div className="hero-left">
              <div className="logo-wrap">
                <div className="logo-box"><div className="logo-txt">ISFT</div></div>
                <div className="hero-badge">{t(hero.badge, lang)}</div>
              </div>
              <h1 className="hero-title">
                {hero.title} <span className="hero-year">{hero.year}</span>
              </h1>
              <p className="hero-sub">{hero.subtitle}</p>
              <div className="feature-list">
                {hero.features.map((f, i) => (
                  <div key={i} className="feat-pill">
                    <div className="feat-ico"><i className={`fas ${f.icon}`} /></div>
                    <span className="feat-txt">{t(f.text, lang)}</span>
                  </div>
                ))}
              </div>
              <a href={site.admissionUrl} className="btn-hero">
                <i className="fas fa-rocket" />
                <span>{t(hero.ctaText, lang)}</span>
              </a>
            </div>

            <div className="hero-right">
              <div className="price-card">
                <div className="price-hd"><h2>{t(prices.title, lang)}</h2></div>
                <div className="price-bd">
                  {prices.items.map((p, i) => (
                    <div key={i} className="price-row">
                      <div className="price-name">
                        <div className="price-ico"><i className={`fas ${p.icon}`} /></div>
                        <div>
                          <div>{t(p.name, lang)}</div>
                          <div className="price-note">{t(p.note, lang)}</div>
                        </div>
                      </div>
                      <div className="price-amt">{p.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── COUNTDOWN ── 
        <section className="countdown-sec">
          <div className="cd-wrap">
            <h2 className="cd-title">{t(countdown.title, lang)}</h2>
            <p className="cd-sub">{t(countdown.subtitle, lang)}</p>
            <div className="cd-timer">
              {[
                { val: time.d, lbl: L.kun },
                { val: time.h, lbl: L.soat },
                { val: time.m, lbl: L.daqiqa },
                { val: time.s, lbl: L.soniya },
              ].map((item, i) => (
                <div key={i} className="cd-item">
                  <div className="cd-flip">
                    <div className="flip-card">
                      <div className="flip-front">
                        <div className="flip-num">{pad(item.val)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="cd-lbl">{item.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>*/}

       {/* ── ABOUT ── */}
      <section className="sec-about">
        <div className="container">

          {/* Gallery — faqat rasmlar mavjud bo'lsa ko'rinadi */}
          {imgTotal > 0 && (
            <div className="about-gallery reveal">
              <div className="gallery-track">
                <img
                  src={imgs[slide]}
                  alt={`ISFT × Greenwich tadbir ${slide + 1}`}
                  className="gallery-img"
                />
                {imgTotal > 1 && (
                  <>
                    <button className="gallery-btn gprev" onClick={goPrev} aria-label="Oldingi">
                      <i className="fas fa-chevron-left" />
                    </button>
                    <button className="gallery-btn gnext" onClick={goNext} aria-label="Keyingi">
                      <i className="fas fa-chevron-right" />
                    </button>
                    <div className="gallery-dots">
                      {imgs.map((_, i) => (
                        <button
                          key={i}
                          className={`gdot${i === slide ? ' active' : ''}`}
                          onClick={() => { clearInterval(slideTimer.current); setSlide(i); }}
                          aria-label={`Rasm ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                <span className="gallery-counter">{slide + 1} / {imgTotal}</span>
              </div>
            </div>
          )}

          {/* Matn + Uni card */}
          <div className="about-grid">
            <div className="about-txt reveal">
              <div className="mini-tag">{t(about.tag, lang)}</div>
              <h2 className="about-h">{t(about.title, lang)}</h2>
              <p className="about-sub">{t(about.subtitle, lang)}</p>
              {about.paragraphs.map((p, i) => (
                <p key={i} className="about-p">{t(p, lang)}</p>
              ))}
              {about.sourceUrl && (
                <a
                  href={about.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-src-link"
                >
                  <i className="fas fa-external-link-alt" />
                  {lang === 'ru' ? ' Источник: ISFT Самарканд' : lang === 'en' ? ' Source: ISFT Samarkand' : ' Manba: ISFT Samarqand'}
                  {about.sourceDate && (
                    <span className="src-date"> · {t(about.sourceDate, lang)}</span>
                  )}
                </a>
              )}
            </div>

            <div className="uni-card reveal">
              <div className="uni-card-inner">
                <span className="uni-flag">🇬🇧</span>
                <h3>{about.uniName}</h3>
                <p>{t(about.uniDesc, lang)}</p>
                <div className="uni-chip">
                  <i className="fas fa-award" style={{ color: 'var(--gold)' }} /> {t(about.uniBadge, lang)}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

        {/* ── FACULTIES ── */}
        <section className="faculty-sec">
          <div className="container">
            <div className="sec-hd reveal">
              <h2 className="sec-title">{t(faculties.title, lang)}</h2>
              <p className="sec-sub">{t(faculties.subtitle, lang)}</p>
            </div>
            <div className="fac-grid">
              {faculties.items.map((fac, fi) => (
                <div key={fi} className="fac-card reveal" style={{ transitionDelay: `${(fi % 3) * 80}ms` }}>
                  <div className="fac-hd">
                    <div className="fac-ico-wrap"><i className={`fas ${fac.icon}`} /></div>
                    <h3 className="fac-title">{t(fac.title, lang)}</h3>
                  </div>
                  <div className="fac-bd">
                    {fac.programs.map((prog, pi) => (
                      <div key={pi} className="prog-row">
                        <div className="prog-chk"><i className="fas fa-check" /></div>
                        <div className="prog-det">
                          <div className="prog-name">{t(prog.name, lang)}</div>
                          {prog.price && <div className="prog-price">{prog.price}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEES ── */}
        <section className="fees-sec">
          <div className="container">
            <div className="sec-hd reveal">
              <h2 className="sec-title" style={{ color: '#fff', textShadow: '2px 2px 8px rgba(0,0,0,.3)' }}>
                {t(fees.title, lang)}
              </h2>
              <p className="sec-sub" style={{ color: 'rgba(255,255,255,.8)' }}>{t(fees.subtitle, lang)}</p>
            </div>
            <div className="fees-wrap reveal">
              <table className="fees-table">
                <thead>
                  <tr>
                    {t(fees.cols, lang).map((col, i) => <th key={i}>{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {fees.items.map((row, i) => (
                    <tr key={i}>
                      <td className="fees-lv">{t(row.level, lang)}</td>
                      <td className="fees-pr">{row.y1}</td>
                      <td className="fees-pr">{row.y2}</td>
                      <td className="fees-pr">{row.y3}</td>
                      <td className="fees-pr">{row.y4}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="fees-note">⚠️ {t(fees.note, lang)}</p>
            </div>
          </div>
        </section>

        {/* ── STEPS ── */}
        <section className="steps-sec">
          <div className="container">
            <div className="sec-hd reveal">
              <h2 className="sec-title">{t(steps.title, lang)}</h2>
            </div>
            <div className="steps-list">
              {steps.items.map((s, i) => (
                <div key={i} className="step reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="step-num">{s.num}</div>
                  <div className="step-body">
                    <h3>{t(s.title, lang)}</h3>
                    <p>{t(s.desc, lang)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ADVANTAGES ── */}
        <section className="adv-sec">
          <div className="container">
            <div className="sec-hd reveal">
              <h2 className="sec-title">{t(advantages.title, lang)}</h2>
            </div>
            <div className="adv-grid">
              {advantages.items.map((a, i) => (
                <div key={i} className="adv-card reveal" style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
                  <span className="adv-ico">{a.icon}</span>
                  <h3>{t(a.title, lang)}</h3>
                  <p>{t(a.desc, lang)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="stats-sec">
          <div className="container">
            <div className="sec-hd reveal">
              <h2 className="sec-title" style={{ color: '#fff', textShadow: '2px 2px 8px rgba(0,0,0,.3)' }}>
                {t(stats.title, lang)}
              </h2>
              <p className="sec-sub" style={{ color: 'rgba(255,255,255,.9)' }}>{t(stats.subtitle, lang)}</p>
            </div>
            <div className="stats-grid">
              {stats.items.map((s, i) => (
                <div key={i} className="stat-item reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="stat-ico"><i className={`fas ${s.icon}`} /></div>
                  <span className="stat-num">{s.number}</span>
                  <span className="stat-lbl">{t(s.label, lang)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section className="contact-sec">
          <div className="container">
            <div className="sec-hd reveal">
              <h2 className="sec-title">{t(contact.title, lang)}</h2>
              <p className="sec-sub">{t(contact.subtitle, lang)}</p>
            </div>
            <div className="contact-grid">
              {[
                { icon: 'fa-phone-volume', title: L.tel,    val: site.phone,   href: site.phoneLink },
                { icon: 'fa-map-marked-alt', title: L.manzil, val: `${t(site.address1, lang)}, ${t(site.address2, lang)}` },
                { icon: 'fa-laptop',        title: L.veb,   val: site.website, href: site.websiteUrl, ext: true },
              ].map((c, i) => (
                <div key={i} className="contact-card reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="contact-ico-wrap"><i className={`fas ${c.icon}`} /></div>
                  <h3 className="contact-card-title">{c.title}</h3>
                  <div className="contact-info">
                    {c.href
                      ? <a href={c.href} target={c.ext ? '_blank' : undefined} rel="noreferrer" className="contact-link">{c.val}</a>
                      : c.val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-sec">
          <div className="cta-inner">
            <h2 className="cta-title">{t(cta.title, lang)}</h2>
            <p className="cta-txt">{t(cta.text, lang)}</p>
            <div className="cta-btns">
              <a href={site.admissionUrl} className="btn-cta">
                <i className="fas fa-edit" /><span>{t(cta.btn1, lang)}</span>
              </a>
              <a href={site.phoneLink} className="btn-cta btn-outline">
                <i className="fas fa-phone" /><span>{cta.btn2}</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── SOCIAL ── */}
        <section className="social-sec">
          <div className="social-wrap">
            <h2 className="social-title reveal">{t(social.title, lang)}</h2>
            <p className="social-sub reveal">{t(social.subtitle, lang)}</p>
            <a href={site.mainSiteUrl} target="_blank" rel="noreferrer" className="main-site-btn reveal">
              <i className="fas fa-globe" /><span>{t(social.mainBtnText, lang)}</span>
            </a>
            <div className="soc-grid">
              {social.items.map(s => (
                <div key={s.id} className="soc-3d-card reveal">
                  <div className="soc-3d-inner">
                    <div className="soc-3d-front">
                      <i className={s.icon} /><h3>{s.name}</h3>
                    </div>
                    <div className="soc-3d-back">
                      <a href={s.url} target="_blank" rel="noreferrer">
                        <i className="fas fa-arrow-right" />
                        <span>{t(social.openText, lang)}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer>
          <div className="footer-content">
            <div className="footer-grid">
              <div>
                <div className="footer-logo">
                  <div className="footer-logo-circle">ISFT</div>
                  <div className="footer-logo-text">ISFT</div>
                </div>
                <p className="footer-desc">{t(footer.desc, lang)}</p>
                <a href={site.websiteUrl} target="_blank" rel="noreferrer" className="website-btn">
                  <i className="fas fa-globe" /> {t(footer.visitSite, lang)}
                </a>
              </div>
              <div>
                <h3 className="footer-title">{t(footer.quickLinksTitle, lang)}</h3>
                <ul className="footer-links">
                  {footer.quickLinks.map((l, i) => (
                    <li key={i}><a href={l.url} target="_blank" rel="noreferrer">{t(l.label, lang)}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="footer-title">{t(footer.programsTitle, lang)}</h3>
                <ul className="footer-links">
                  {footer.programs.map((l, i) => (
                    <li key={i}><a href={l.url} target="_blank" rel="noreferrer">{t(l.label, lang)}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="footer-title">{t(footer.contactTitle, lang)}</h3>
                <div className="footer-contact-item">
                  <div className="footer-contact-ico"><i className="fas fa-map-marker-alt" /></div>
                  <div className="footer-contact-txt">{t(site.address1, lang)}<br />{t(site.address2, lang)}</div>
                </div>
                <div className="footer-contact-item">
                  <div className="footer-contact-ico"><i className="fas fa-phone" /></div>
                  <div className="footer-contact-txt"><a href={site.phoneLink}>{site.phoneFull}</a></div>
                </div>
                <div className="footer-contact-item">
                  <div className="footer-contact-ico"><i className="fas fa-envelope" /></div>
                  <div className="footer-contact-txt"><a href={`mailto:${site.email}`}>{site.email}</a></div>
                </div>
                <div className="social-row">
                  {social.items.map(s => (
                    <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="social-link">
                      <i className={s.icon} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <div className="footer-copy">
                © 2026 <a href={site.websiteUrl} target="_blank" rel="noreferrer">ISFT Samarqand</a>. {t(footer.rights, lang)}
              </div>
              <div className="footer-credits">
                <a href={`${site.websiteUrl}/uz/about`} target="_blank" rel="noreferrer">{t(footer.privacy, lang)}</a>
                <a href={`${site.websiteUrl}/uz/about`} target="_blank" rel="noreferrer">{t(footer.terms, lang)}</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
