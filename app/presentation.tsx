'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './presentation.module.css';

const LOGO_WHITE = 'https://raw.githubusercontent.com/stefanocintioli-bot/bnb-chain-v0/main/logos/BNB_Chain_Logo_White.svg';
const LOGO_YELLOW = 'https://raw.githubusercontent.com/stefanocintioli-bot/bnb-chain-v0/main/logos/BNB_Chain_Symbol_Yellow.svg';
const QR_URL = 'https://raw.githubusercontent.com/stefanocintioli-bot/bnb-chain-v0/main/events/QR/QR.png';
const PHOTO_CRECIMIENTO = 'https://raw.githubusercontent.com/stefanocintioli-bot/bnb-chain-v0/main/events/crecimiento/Crecimiento%20Workshop.jpeg';
const PHOTO_VENDIMIA = 'https://raw.githubusercontent.com/stefanocintioli-bot/bnb-chain-v0/main/events/vendimia/Vendimia.jpg';
const PHOTO_UTOUR = 'https://raw.githubusercontent.com/stefanocintioli-bot/bnb-chain-v0/main/events/university-tour/Univeersity%20Tour%20Groupal%20Photo.jpg';

const TOTAL_SLIDES = 14;

// Salary count-up for slide 2 (index 1)
const SALARY_STATS = [
  { target: 121, prefix: '~$', suffix: 'K' },
  { target: 165, prefix: '$140K–$', suffix: 'K' },
  { target: 187, prefix: '$', suffix: 'K+' },
];

// Count-up stats for slide 4 (index 3)
const STATS = [
  { target: 0.45, decimals: 2, format: (v: number) => `~${v.toFixed(2)}s` },
  { target: 0.05, decimals: 2, format: (v: number) => `<$${v.toFixed(2)}` },
  { target: 17.1, decimals: 1, format: (v: number) => `$${v.toFixed(1)}B` },
  { target: 58,   decimals: 0, format: (v: number) => `${Math.round(v)}M+` },
  { target: 31,   decimals: 0, format: (v: number) => `${Math.round(v)}M+` },
  { target: 100,  decimals: 0, format: (v: number) => `${Math.round(v)}%` },
];

const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);

// Geometric background — exact transplant from bnbchain-latam-intro, gold updated to #FFE900
const GeometricBg = ({ intensity = 'normal' }: { intensity?: 'high' | 'normal' | 'low' }) => {
  const normalShapes = [
    { size: 200, left: 5,  top: 10, type: 'hex',  color: 'rgba(255,233,0,0.10)' },
    { size: 120, left: 80, top: 5,  type: 'node', color: 'rgba(255,233,0,0.13)' },
    { size: 280, left: 75, top: 55, type: 'hex',  color: 'rgba(255,255,255,0.05)' },
    { size: 100, left: 2,  top: 70, type: 'node', color: 'rgba(255,233,0,0.08)' },
    { size: 160, left: 45, top: 80, type: 'blob', color: 'rgba(255,255,255,0.04)' },
  ];
  const lowShapes = [
    { size: 180, left: 85, top: 8,  type: 'hex',  color: 'rgba(255,233,0,0.07)' },
    { size: 140, left: 5,  top: 55, type: 'node', color: 'rgba(255,255,255,0.05)' },
    { size: 120, left: 50, top: 75, type: 'blob', color: 'rgba(255,233,0,0.05)' },
  ];
  const highShapes = [
    { size: 350, left: 65, top: -10, type: 'hex',  color: 'rgba(255,233,0,0.15)' },
    { size: 250, left: -5, top: 40,  type: 'hex',  color: 'rgba(255,233,0,0.12)' },
    { size: 180, left: 80, top: 60,  type: 'node', color: 'rgba(255,233,0,0.18)' },
    { size: 140, left: 20, top: 75,  type: 'node', color: 'rgba(255,255,255,0.10)' },
    { size: 300, left: 50, top: 5,   type: 'blob', color: 'rgba(255,255,255,0.06)' },
    { size: 200, left: 10, top: 10,  type: 'node', color: 'rgba(255,233,0,0.13)' },
    { size: 280, left: 70, top: 80,  type: 'hex',  color: 'rgba(255,233,0,0.10)' },
    { size: 160, left: 35, top: 50,  type: 'blob', color: 'rgba(255,255,255,0.05)' },
  ];
  const dataset = intensity === 'high' ? highShapes : intensity === 'low' ? lowShapes : normalShapes;
  return (
    <>
      {dataset.map((data, i) => {
        const className = data.type === 'hex'
          ? styles.hexagon
          : data.type === 'node'
            ? styles.node
            : styles.geometric;
        return (
          <div
            key={i}
            className={className}
            style={{
              width: `${data.size}px`,
              height: `${data.size}px`,
              left: `${data.left}%`,
              top: `${data.top}%`,
              backgroundColor: data.color,
              color: data.type === 'node' ? data.color : undefined,
            }}
          />
        );
      })}
    </>
  );
};

// Shared bottom-left logo
const BottomLogo = () => (
  <div className={styles.logo}>
    <img src={LOGO_WHITE} alt="BNB Chain" height={18} style={{ height: '18px', width: 'auto', display: 'block' }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
  </div>
);

// Social icon button
const SocialIcon = ({ href, label, children }: { href: string; label: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" title={label} className={styles.socialIcon}>
    {children}
  </a>
);

// Gold pill label
const GoldPill = ({ children }: { children: React.ReactNode }) => (
  <span className={styles.goldPill}>{children}</span>
);

// Gold highlight bar
const GoldBar = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: 'rgba(255,233,0,0.08)',
    borderLeft: '3px solid #FFE900',
    padding: '14px 18px',
    borderRadius: '0 8px 8px 0',
    marginBottom: '24px',
    ...style,
  }}>
    {children}
  </div>
);

export default function BNBPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [countValues, setCountValues] = useState(STATS.map(() => 0));
  const [salaryValues, setSalaryValues] = useState([0, 0, 0]);
  const [demandValues, setDemandValues] = useState([0, 0]);
  const rafRef = useRef<number | null>(null);
  const salaryRafRef = useRef<number | null>(null);
  const demandRafRef = useRef<number | null>(null);

  const goNext = useCallback(() => setCurrentSlide((p) => (p + 1) % TOTAL_SLIDES), []);
  const goPrev = useCallback(() => setCurrentSlide((p) => (p - 1 + TOTAL_SLIDES) % TOTAL_SLIDES), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.code === 'Space') { e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) { delta < 0 ? goNext() : goPrev(); }
  };

  // Count-up animation triggers on slide index 3
  const runCountUp = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setCountValues(STATS.map(() => 0));
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutQuart(progress);
      setCountValues(STATS.map((s) => s.target * eased));
      if (progress < 1) { rafRef.current = requestAnimationFrame(tick); }
      else { setCountValues(STATS.map((s) => s.target)); rafRef.current = null; }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const runSalaryCountUp = useCallback(() => {
    if (salaryRafRef.current !== null) cancelAnimationFrame(salaryRafRef.current);
    setSalaryValues([0, 0, 0]);
    const duration = 1000;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutQuart(progress);
      setSalaryValues(SALARY_STATS.map((s) => s.target * eased));
      if (progress < 1) { salaryRafRef.current = requestAnimationFrame(tick); }
      else { setSalaryValues(SALARY_STATS.map((s) => s.target)); salaryRafRef.current = null; }
    };
    salaryRafRef.current = requestAnimationFrame(tick);
  }, []);

  const runDemandCountUp = useCallback(() => {
    if (demandRafRef.current !== null) cancelAnimationFrame(demandRafRef.current);
    setDemandValues([0, 0]);
    const duration = 1000;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutQuart(progress);
      setDemandValues([45 * eased, 220 * eased]);
      if (progress < 1) { demandRafRef.current = requestAnimationFrame(tick); }
      else { setDemandValues([45, 220]); demandRafRef.current = null; }
    };
    demandRafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (currentSlide === 3) runCountUp();
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [currentSlide, runCountUp]);

  useEffect(() => {
    if (currentSlide === 1) runSalaryCountUp();
    return () => { if (salaryRafRef.current !== null) cancelAnimationFrame(salaryRafRef.current); };
  }, [currentSlide, runSalaryCountUp]);

  useEffect(() => {
    if (currentSlide === 4) runDemandCountUp();
    return () => { if (demandRafRef.current !== null) cancelAnimationFrame(demandRafRef.current); };
  }, [currentSlide, runDemandCountUp]);

  const progress = ((currentSlide + 1) / TOTAL_SLIDES) * 100;
  const slideNum = String(currentSlide + 1).padStart(2, '0');

  // Shared chrome elements
  const chrome = (
    <>
      <BottomLogo />
      <div className={styles.watermark}>BUILD WEB3 WITH BNB CHAIN</div>
      <div className={styles.slideCounter}>{slideNum} / {String(TOTAL_SLIDES).padStart(2, '0')}</div>
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
    </>
  );

  // --- SLIDE DEFINITIONS ---

  const slide1 = (
    <div className={`${styles.slide} ${styles.coverSlide}`}>
      <GeometricBg intensity="high" />
      <div className={styles.slideContent} style={{ position: 'relative' }}>
        {/* Hero symbol */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '24px' }}>
          <div style={{ animation: 'symbolFloat 4s ease-in-out infinite', display: 'inline-block' }}>
            <img src={LOGO_YELLOW} alt="BNB Chain"
              style={{ height: 'clamp(56px, 12vw, 96px)', width: 'auto', display: 'block', animation: 'symbolGlow 3s ease-in-out infinite' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        </div>

        {/* Partner row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: '28px', width: '100%', flexWrap: 'wrap', rowGap: '6px' }}>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: 12, color: '#fff', letterSpacing: '0.15em' }}>BNB CHAIN</span>
          <span style={{ color: '#444', fontSize: 12 }}> × </span>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: '#fff' }}>Binance</span>
          <span style={{ color: '#444', fontSize: 12 }}> × </span>
          <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: '#fff' }}>Mindot</span>
        </div>

        {/* Main title */}
        <h1 style={{
          fontFamily: 'var(--font)', fontWeight: 700,
          fontSize: 'clamp(1.8rem,4.5vw,3.8rem)',
          color: '#FFE900', textAlign: 'center',
          marginTop: '20px', marginBottom: '12px', width: '100%', lineHeight: 1.2,
        }}>
          Blockchain: Tu Próxima Carrera Global
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'var(--font)', fontWeight: 400,
          fontSize: '0.9rem', color: '#888888',
          letterSpacing: '0.1em', textAlign: 'center',
          marginTop: '12px', width: '100%',
        }}>
          Peru University Tour · 2026
        </p>

        {/* Speaker — positioned above the bottom logo */}
        <div style={{ position: 'absolute', bottom: 44, left: 0 }}>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>Stefano Cintioli</p>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.8rem', color: '#FFE900', marginTop: 4 }}>LatAm Community Lead, BNB Chain</p>
        </div>
      </div>
      {chrome}
    </div>
  );

  const slide2 = (
    <div className={styles.slide}>
      <GeometricBg intensity="normal" />
      <div className={styles.slideContent}>
        <h2 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', color: '#fff', marginBottom: 16 }}>
          ¿Por qué esto te importa hoy?
        </h2>

        <GoldBar style={{ marginBottom: '24px' }}>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.9rem', color: '#fff', lineHeight: 1.7 }}>
            Un desarrollador junior en blockchain gana más que un senior en desarrollo web tradicional. Y la mayoría son 100% remotos.
          </p>
        </GoldBar>

        <div className={styles.grid1x3} style={{ alignItems: 'stretch' }}>
          {[
            { label: 'ENTRY-LEVEL', value: `~$${Math.round(salaryValues[0])}K`, sub: 'Glassdoor, talent.com — 2026' },
            { label: 'MID-LEVEL (2-4 años)', value: `$140K–$${Math.round(salaryValues[1])}K`, sub: 'Remoto, en dólares' },
            { label: 'SENIOR (5+ años)', value: `$${Math.round(salaryValues[2])}K+`, sub: 'Alta demanda, poca oferta' },
          ].map((s, i) => (
            <div key={i} className={styles.statCard} style={{ minHeight: '140px' }}>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11, color: '#FFE900', marginTop: 4 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 10, color: '#555', textAlign: 'center', marginTop: 20, width: '100%' }}>
          Fuentes: Glassdoor, talent.com, Algorand Blog — Datos 2026. Salarios en USD para el mercado global.
        </p>
      </div>
      {chrome}
    </div>
  );

  const slide3 = (
    <div className={styles.slide}>
      <GeometricBg intensity="low" />
      <div className={styles.slideContent}>
        <h2 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', color: '#fff', marginBottom: 12 }}>
          ¿Qué es BNB Chain?
        </h2>

        <GoldPill>Para entenderlo fácil</GoldPill>

        <div className={styles.card} style={{ width: '100%', marginTop: 12, marginBottom: 16, padding: '28px 32px' }}>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.9rem', color: '#fff', lineHeight: 1.8 }}>
            Pensalo como una ciudad digital.<br />
            <strong style={{ color: '#FFE900' }}>BSC</strong> es la ciudad base — donde vive todo.<br />
            <strong style={{ color: '#FFE900' }}>opBNB</strong> es el metro de alta velocidad — transacciones masivas, casi gratis.<br />
            <strong style={{ color: '#FFE900' }}>Greenfield</strong> es la nube descentralizada — tus datos, tus reglas.
          </p>
        </div>

        <div className={styles.grid1x3} style={{ gap: '16px' }}>
          {[
            { icon: '🏙️', title: 'BSC', desc: 'Layer 1. EVM compatible. Hogar de DeFi, NFTs, Smart Contracts.' },
            { icon: '⚡', title: 'opBNB', desc: '+10,000 TPS. Menos de $0.0001 por transacción.' },
            { icon: '🗄️', title: 'Greenfield', desc: 'Almacenamiento descentralizado con permisos on-chain.' },
          ].map((c, i) => (
            <div key={i} className={styles.card} style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{c.icon}</div>
              <h3 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.95rem', color: '#FFE900', marginBottom: 6 }}>{c.title}</h3>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.8rem', color: '#888', lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
      {chrome}
    </div>
  );

  const slide4 = (
    <div className={styles.slide}>
      <GeometricBg intensity="normal" />
      <div className={styles.slideContent}>
        <h2 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', color: '#fff', marginBottom: 28 }}>
          Los números hablan solos.
        </h2>

        <div className={styles.grid2x3}>
          {[
            { label: 'BLOCK TIME',      sub: 'vs 12s en Ethereum' },
            { label: 'COSTO DE GAS',    sub: 'promedio por tx' },
            { label: 'TVL DeFi',        sub: 'en protocolos DeFi' },
            { label: 'USUARIOS ACTIVOS',sub: 'mensuales' },
            { label: 'TX DIARIAS',      sub: 'en BSC' },
            { label: 'EVM COMPATIBLE',  sub: 'mismo Solidity' },
          ].map((s, i) => (
            <div key={i} className={styles.statCard}>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</p>
              <p style={{
                fontFamily: 'var(--font)', fontWeight: 700,
                fontSize: 'clamp(1.6rem,3vw,2.8rem)',
                color: '#fff', fontVariantNumeric: 'tabular-nums',
              }}>
                {STATS[i].format(countValues[i])}
              </p>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11, color: '#FFE900', marginTop: 4 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
      {chrome}
    </div>
  );

  const slide5 = (
    <div className={styles.slide}>
      <GeometricBg intensity="normal" />
      <div className={styles.slideContent}>
        <h2 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', color: '#fff', marginBottom: 24 }}>
          La demanda supera la oferta.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', width: '100%', padding: '20px 0' }}>
          <div style={{ textAlign: 'center', width: '100%' }}>
            <p style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: 'clamp(2.5rem,6vw,5rem)', color: '#FFE900', fontVariantNumeric: 'tabular-nums' }}>{Math.round(demandValues[0])}%</p>
            <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.95rem', color: '#888', marginTop: 8 }}>
              crecimiento en demanda de developers blockchain en 2026
            </p>
          </div>

          <div style={{ border: '1px solid rgba(255,255,255,0.08)', width: '200px', margin: '8px auto' }} />

          <div style={{ textAlign: 'center', width: '100%' }}>
            <p style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: 'clamp(1.6rem,3.5vw,3rem)', color: '#fff', fontVariantNumeric: 'tabular-nums' }}>$29B → ${Math.round(demandValues[1])}B</p>
            <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.85rem', color: '#FFE900', marginTop: 6 }}>
              tamaño del mercado blockchain: 2024 → 2029
            </p>
          </div>
        </div>

        <GoldBar style={{ width: '100%', marginTop: 8 }}>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.85rem', color: '#fff', lineHeight: 1.7 }}>
            Hay más puestos de trabajo que personas calificadas.<br />
            Para ustedes, esta es una ventana de oportunidad real.
          </p>
        </GoldBar>

        <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 10, color: '#555', textAlign: 'center', width: '100%' }}>
          Fuentes: crypto.jobs, CoinLaw — Datos 2026
        </p>
      </div>
      {chrome}
    </div>
  );

  const slide6 = (
    <div className={styles.slide}>
      <GeometricBg intensity="normal" />
      <div className={styles.slideContent}>
        <h2 style={{ fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', fontFamily: 'var(--font)', fontWeight: 700, marginBottom: '8px' }}>
          La próxima frontera: IA + Web3
        </h2>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '24px', maxWidth: '680px' }}>
          Un agente de IA es un programa que toma decisiones y ejecuta acciones
          por su cuenta — sin que nadie le diga qué hacer paso a paso.
          En Web3, estos agentes interactúan con contratos inteligentes,
          mueven fondos y operan en la blockchain de forma autónoma.
        </p>

        <div style={{
          background: 'rgba(255,233,0,0.06)',
          borderLeft: '4px solid #FFE900',
          borderRadius: '0 10px 10px 0',
          padding: '16px 24px',
          marginBottom: '28px',
          width: '100%',
        }}>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
            El 35% de la actividad actual en BNB Chain es generada por agentes
            autónomos de IA.{' '}
            <span style={{ color: '#FFE900', fontWeight: 700 }}>
              Es la red #1 en agentes on-chain.
            </span>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', width: '100%' }}>
          {[
            {
              emoji: '🔗',
              title: 'MCP + BNB Chain Skills',
              desc: 'Conectá cualquier LLM a contratos de BNB Chain en minutos. Sin configuración compleja.',
            },
            {
              emoji: '🤖',
              title: 'BNBAgent SDK (ERC-8183)',
              desc: 'Registrá agentes on-chain con identidad propia, historial de trabajo y sistema de pago.',
            },
            {
              emoji: '⚡',
              title: 'Vibecoding',
              desc: 'Construir apps con IA sin escribir código línea por línea. El nuevo skill del developer en 2026.',
            },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: i === 1 ? '3px solid #FFE900' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              <span style={{ fontSize: '2rem' }}>{item.emoji}</span>
              <h3 style={{ fontSize: '0.95rem', fontFamily: 'var(--font)', fontWeight: 700, color: '#FFFFFF' }}>{item.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      {chrome}
    </div>
  );

  const slide7 = (
    <div className={styles.slide}>
      <GeometricBg intensity="normal" />
      <div className={styles.slideContent}>
        <h2 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', color: '#fff', marginBottom: 8 }}>
          Lo que ya se está construyendo
        </h2>
        <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.8rem', color: '#888', marginBottom: 20 }}>
          Ejemplos reales del LatAm Community Lead de BNB Chain
        </p>

        <div className={styles.grid2x2} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {/* Card 1 */}
          <a href="https://bnb-dojo.vercel.app/" target="_blank" rel="noopener noreferrer" className={styles.card} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🎓</div>
            <h3 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: 6 }}>BNB Dojo</h3>
            <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.8rem', color: '#888', lineHeight: 1.5, marginBottom: 8 }}>
              App gamificada de aprendizaje Web3. Tracks de estudio, ranking mensual, perfil público.
            </p>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11, color: '#FFE900' }}>→ bnb-dojo.vercel.app</span>
          </a>

          {/* Card 2 */}
          <div className={styles.card}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📊</div>
            <h3 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: 6 }}>DCA Bot en BSC Mainnet</h3>
            <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.8rem', color: '#888', lineHeight: 1.5, marginBottom: 8 }}>
              Bot de inversión automática deployado en BNB Chain Mainnet. Vibecoding, sin ser dev.
            </p>
            <span style={{
              fontFamily: 'var(--font)', fontWeight: 400, fontSize: 10,
              background: 'rgba(255,233,0,0.12)', border: '1px solid rgba(255,233,0,0.3)',
              color: '#FFE900', borderRadius: 4, padding: '3px 8px',
            }}>Live en BSC Mainnet</span>
          </div>

          {/* Card 3 */}
          <div className={styles.card}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🤖</div>
            <h3 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: 6 }}>Bot de Embajadores</h3>
            <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.8rem', color: '#888', lineHeight: 1.5, marginBottom: 8 }}>
              Automatización para el programa de embajadores. Lee Google Sheets → registra en Notion.
            </p>
            <span style={{
              fontFamily: 'var(--font)', fontWeight: 400, fontSize: 10,
              background: 'rgba(255,233,0,0.12)', border: '1px solid rgba(255,233,0,0.3)',
              color: '#FFE900', borderRadius: 4, padding: '3px 8px',
            }}>Producción interna BNB Chain</span>
          </div>

          {/* Card 4 */}
          <div className={styles.card}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🖥️</div>
            <h3 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: 6 }}>Esta presentación</h3>
            <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.8rem', color: '#888', lineHeight: 1.5, marginBottom: 8 }}>
              Presentación web construida con v0 + Claude Code. Trilingual, deployada en Vercel.
            </p>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11, color: '#FFE900' }}>→ bnbchain-latam-intro.vercel.app</span>
          </div>
        </div>
      </div>
      {chrome}
    </div>
  );

  const slide8 = (
    <div className={styles.slide}>
      <GeometricBg intensity="low" />
      <div className={styles.slideContent}>
        <h2 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', color: '#fff', marginBottom: 20 }}>
          Construí en público desde el día 1
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
          {/* Card 1 */}
          <div className={styles.card} style={{ cursor: 'pointer' }}>
            <a href="https://x.com/BNBChainLatAm" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <h3 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: 6 }}>🐦 Creá tu cuenta en X</h3>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.85rem', color: '#888', lineHeight: 1.6 }}>
                Compartí lo que estás construyendo. Un post por semana sobre tu progreso ya te pone adelante del 99% de los estudiantes.
              </p>
              <span style={{ fontSize: '11px', color: 'var(--gold)', marginTop: '10px', display: 'block' }}>→ @BNBChainLatAM</span>
            </a>
          </div>

          {/* Card 2 */}
          <div className={styles.card} style={{ cursor: 'pointer' }}>
            <a href="https://t.me/BNBChainES" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <h3 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: 6 }}>📱 Unite a comunidades Web3</h3>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.85rem', color: '#888', lineHeight: 1.6 }}>
                Telegram, Discord, X. Donde están los builders están las oportunidades. Empezá con @BNBChainLatAM.
              </p>
              <span style={{ fontSize: '11px', color: 'var(--gold)', marginTop: '10px', display: 'block' }}>→ t.me/BNBChainES</span>
            </a>
          </div>

          {/* Card 3 with REGLA #1 badge */}
          <div className={styles.card} style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', top: 12, right: 12,
              background: '#FFE900', color: '#000', fontSize: 9, fontWeight: 600,
              borderRadius: 4, padding: '2px 8px', letterSpacing: '0.05em',
              fontFamily: 'var(--font)',
            }}>REGLA #1</span>
            <h3 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: 6 }}>🔍 DYOR — Hacé tu propia investigación</h3>
            <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.85rem', color: '#888', lineHeight: 1.6 }}>
              En Web3 hay oportunidades reales y estafas reales. Antes de invertir tiempo o dinero: verificá fuentes, desconfiá de promesas fáciles.
            </p>
          </div>
        </div>

        <GoldBar style={{ marginTop: 16, width: '100%' }}>
          <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.85rem', color: '#fff' }}>
            Usá una sola cuenta — es más fácil construir una reputación consistente.
          </p>
        </GoldBar>
      </div>
      {chrome}
    </div>
  );

  const slide9 = (
    <div className={styles.slide}>
      <GeometricBg intensity="normal" />
      <div className={styles.collageContainer}>
        <div className={styles.photoGrid}>
          <div className={styles.photoWrapper} style={{ gridArea: 'tl' }}>
            <img src={PHOTO_CRECIMIENTO} alt="Crecimiento Workshop" loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className={styles.photoTag}>CRECIMIENTO WORKSHOP</span>
          </div>
          <div className={styles.photoWrapper} style={{ gridArea: 'tr' }}>
            <img src={PHOTO_VENDIMIA} alt="Vendimia Hackathon" loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className={styles.photoTag}>VENDIMIA HACKATHON</span>
          </div>
          <div className={styles.photoWrapper} style={{ gridArea: 'bl' }}>
            <img src={PHOTO_UTOUR} alt="University Tour" loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className={styles.photoTag}>UNIVERSITY TOUR UTN</span>
          </div>
          <div className={styles.photoWrapper} style={{ gridArea: 'br' }}>
            <img src={PHOTO_VENDIMIA} alt="Community Building" loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className={styles.photoTag}>COMMUNITY BUILDING</span>
          </div>
        </div>

        <h2 style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          fontFamily: 'var(--font)', fontWeight: 700,
          fontSize: 'clamp(1.6rem,3.5vw,2.8rem)',
          color: '#fff', zIndex: 10,
          textShadow: '0 2px 20px rgba(0,0,0,0.9)',
          maxWidth: 500, width: '100%',
        }}>
          Lo que ya está pasando en LatAm
        </h2>
      </div>
      {chrome}
    </div>
  );

  const slide10 = (
    <div className={styles.slide}>
      <GeometricBg intensity="normal" />
      <div className={styles.slideContent}>
        <div style={{ display: 'grid', gridTemplateColumns: 'var(--event-cols, 60% 40%)', gap: '40px', alignItems: 'center' }}>
          <div>
            <span className={styles.goldPill}>CRECIMIENTO POP UP</span>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', marginTop: '16px', marginBottom: '16px', fontFamily: 'var(--font)', fontWeight: 700 }}>
              Workshop técnico para founders en LatAm.
            </h2>
            <p style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font)', fontWeight: 800, color: 'var(--gold)', marginTop: '16px' }}>
              +20 founders participaron.
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              5+ en conversaciones activas con nuestro equipo de BD.
            </p>
          </div>
          <div style={{ borderRadius: '12px', overflow: 'hidden', height: 'var(--photo-h, 400px)' }}>
            <img
              src={PHOTO_CRECIMIENTO}
              alt="Crecimiento Workshop"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        </div>
      </div>
      {chrome}
    </div>
  );

  const slide11 = (
    <div className={styles.slide}>
      <GeometricBg intensity="normal" />
      <div className={styles.slideContent}>
        <div style={{ display: 'grid', gridTemplateColumns: 'var(--event-cols, 60% 40%)', gap: '40px', alignItems: 'center' }}>
          <div>
            <span className={styles.goldPill}>VENDIMIATECH HACKATHON</span>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', marginTop: '16px', marginBottom: '16px', fontFamily: 'var(--font)', fontWeight: 700 }}>
              Partners principales del track IA + Web3.
            </h2>
            <p style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font)', fontWeight: 800, color: 'var(--gold)', marginTop: '16px' }}>
              +10 proyectos. 3 ganadores.
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              El 1er lugar ya conversa con nuestro equipo de IA y Agentes.
            </p>
          </div>
          <div style={{ borderRadius: '12px', overflow: 'hidden', height: 'var(--photo-h, 400px)' }}>
            <img
              src={PHOTO_VENDIMIA}
              alt="Vendimia Hackathon"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        </div>
      </div>
      {chrome}
    </div>
  );

  const slide12 = (
    <div className={styles.slide}>
      <GeometricBg intensity="normal" />
      <div className={styles.slideContent}>
        <div style={{ display: 'grid', gridTemplateColumns: 'var(--event-cols, 60% 40%)', gap: '40px', alignItems: 'center' }}>
          <div>
            <span className={styles.goldPill}>BINANCE UNIVERSITY TOUR — UTN</span>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', marginTop: '16px', marginBottom: '16px', fontFamily: 'var(--font)', fontWeight: 700 }}>
              Spreading the word en universidades de LatAm.
            </h2>
            <p style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font)', fontWeight: 800, color: 'var(--gold)', marginTop: '16px' }}>
              +100 estudiantes.
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              La próxima generación de builders de la región.
            </p>
          </div>
          <div style={{ borderRadius: '12px', overflow: 'hidden', height: 'var(--photo-h, 400px)' }}>
            <img
              src={PHOTO_UTOUR}
              alt="University Tour"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        </div>
      </div>
      {chrome}
    </div>
  );

  const slide13recursos = (
    <div className={styles.slide}>
      <GeometricBg intensity="low" />
      <div className={styles.slideContent}>
        <h2 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', color: '#fff', marginBottom: 24 }}>
          Todo lo que necesitás para arrancar hoy.
        </h2>

        <div className={styles.grid2x3}>
          {[
            { icon: '🧟', title: 'CryptoZombies', desc: 'Aprendé Solidity jugando. 100% gratis.', href: 'https://cryptozombies.io' },
            { icon: '🛠️', title: 'Remix IDE', desc: 'Escribí y deployá tu primer contrato hoy.', href: 'https://remix.ethereum.org' },
            { icon: '📄', title: 'Docs BNB Chain', desc: 'Documentación oficial completa.', href: 'https://docs.bnbchain.org' },
            { icon: '🚰', title: 'Testnet Faucet', desc: 'Gas gratis para practicar.', href: 'https://testnet.bnbchain.org/faucet-smart' },
            { icon: '🏆', title: 'Programa MVB', desc: 'Incubación y funding para builders serios.', href: 'https://www.bnbchain.org/en/programs/mvb' },
            { icon: '🎓', title: 'Solidity by Example', desc: 'Contratos reales explicados paso a paso.', href: 'https://solidity-by-example.org' },
          ].map((r, i) => (
            <a key={i} href={r.href} target="_blank" rel="noopener noreferrer" className={styles.resourceCard}>
              <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>{r.icon}</div>
              <h3 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '0.9rem', color: '#fff', marginBottom: 4 }}>{r.title}</h3>
              <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.78rem', color: '#888', lineHeight: 1.4 }}>{r.desc}</p>
            </a>
          ))}
        </div>
      </div>
      {chrome}
    </div>
  );

  const slide14cta = (
    <div className={`${styles.slide} ${styles.ctaSlide}`}>
      <GeometricBg intensity="high" />
      <div className={styles.slideContent} style={{ alignItems: 'center', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--font)', fontWeight: 700,
          fontSize: 'clamp(2.8rem,7vw,6rem)',
          color: '#FFE900', textAlign: 'center',
        }}>
          BUILD N BUILD
        </h1>

        <p style={{
          fontFamily: 'var(--font)', fontWeight: 500,
          fontSize: '1rem', color: '#fff',
          letterSpacing: '0.25em', textAlign: 'center', marginTop: 8,
        }}>
          CONSTRUYE WEB3 CON BNB CHAIN
        </p>

        <img src={QR_URL} alt="Seguinos en @BNBChainLatAM" loading="lazy"
          style={{ width: 170, height: 'auto', borderRadius: 8, display: 'block', margin: '28px auto 12px auto' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />

        <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: '0.85rem', color: '#888', textAlign: 'center' }}>
          Unite a la comunidad en Español
        </p>

        <div className={styles.socialLinks}>
          <SocialIcon href="https://x.com/BNBChainLatAM" label="X">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="https://t.me/BNBChainES" label="Telegram">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="https://discord.gg/bnbchain" label="Discord">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.04.036.05a19.91 19.91 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .036-.05c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="https://docs.bnbchain.org" label="Docs">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
            </svg>
          </SocialIcon>
        </div>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          {['cryptozombies.io', 'remix.ethereum.org', 'docs.bnbchain.org', 'discord.gg/bnbchain'].map((link) => (
            <a key={link} href={`https://${link}`} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11, color: '#555' }}>
              {link}
            </a>
          ))}
        </div>
      </div>
      {chrome}
    </div>
  );

  const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, slide9, slide10, slide11, slide12, slide13recursos, slide14cta];

  return (
    <div
      className={styles.presentationContainer}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.slidesWrapper}>
        {slides.map((slide, i) => (
          <div
            key={i}
            className={styles.slideContainer}
            style={{
              opacity: i === currentSlide ? 1 : 0,
              pointerEvents: i === currentSlide ? 'auto' : 'none',
              transform: `translateX(${(i - currentSlide) * 100}%)`,
            }}
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
}
