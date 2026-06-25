'use client';

import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// --- Pipeline stages ----------------------------------------------------------

const PIPELINE_STAGES = [
  { label: 'Ingest', color: '#0075C9' },
  { label: 'Generate', color: '#F5A800' },
  { label: 'Review', color: '#8B5CF6' },
  { label: 'Approve', color: '#05AB8C' },
];

// --- How it works steps -------------------------------------------------------

const STEPS = [
  {
    num: '01 - Ingestion',
    accentColor: '#0075C9',
    title: 'Knowledge base loads regulatory and historical context',
    desc: 'Eight synthetic documents - financial statements, prior audit findings, regulatory guidance, and capital reports - are indexed and made available to every agent step.',
    badgeBg: '#E6F1FB', badgeColor: '#0050AD', badge: 'Document layer',
  },
  {
    num: '02 - Generation',
    accentColor: '#F5A800',
    title: 'Seven gpt-5.5 agent calls build the report sequentially',
    desc: 'Risk profile, material accounts, prior period, regulatory compliance, resources, continuous auditing model, and hours allocation - each produced with live reasoning traces.',
    badgeBg: '#FFF5D6', badgeColor: '#D7761D', badge: 'AI agent x7',
  },
  {
    num: '03 - Review',
    accentColor: '#8B5CF6',
    title: 'Section-level chat lets managers refine every paragraph',
    desc: 'Ask questions or request rewrites in plain language. A deterministic intent classifier routes each message - explanations stay as answers, edits rewrite the section.',
    badgeBg: '#F3E8FF', badgeColor: '#612080', badge: 'Human in the loop',
  },
  {
    num: '04 - Approval',
    accentColor: '#05AB8C',
    title: 'Director approves or returns with structured notes',
    desc: 'The manager submits for review. The audit director can approve cleanly or return with required notes. Returned reports unlock for revision; approved reports lock for export.',
    badgeBg: '#D6F5EF', badgeColor: '#027A62', badge: 'Governance gate',
  },
];

// --- Feature cards ------------------------------------------------------------

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke="#F5A800" strokeWidth="1.5" />
        <path d="M9 14h10M9 10h6M9 18h8" stroke="#F5A800" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="21" cy="10" r="2.5" fill="#F5A800" fillOpacity="0.2" stroke="#F5A800" strokeWidth="1.2" />
      </svg>
    ),
    title: 'Agent Transparency',
    desc: 'Every agent step exposes its reasoning chain in real time. Watch the model think - weighted risk assessments, materiality thresholds, regulatory citations - before it commits to text.',
    chip: 'Live reasoning trace',
    chipBg: 'rgba(245,168,0,0.12)',
    chipColor: '#F5A800',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="5" width="24" height="18" rx="3" stroke="#8B5CF6" strokeWidth="1.5" />
        <path d="M8 11h12M8 15h7" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="21" cy="19" r="4" fill="#8B5CF6" fillOpacity="0.15" />
        <path d="M19 19l1.5 1.5L23 17.5" stroke="#8B5CF6" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Conversational Report Editor',
    desc: 'Section-level threads let you revise in natural language. Explain Section 3 gets an answer. Tighten the finding language rewrites the section. No ambiguity - intent is classified deterministically.',
    chip: 'Edit or Q&A per section',
    chipBg: 'rgba(139,92,246,0.12)',
    chipColor: '#A78BFA',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L25 8.5V19.5L14 25L3 19.5V8.5L14 3Z" stroke="#05AB8C" strokeWidth="1.5" />
        <path d="M10 14l3 3 6-6" stroke="#05AB8C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Role-Based Approval Flow',
    desc: 'Managers generate and submit; directors review and decide. Approve locks the report for export. Return with notes unlocks it with required revisions attached - all persisted in localStorage.',
    chip: 'Manager -> Director gate',
    chipBg: 'rgba(5,171,140,0.12)',
    chipColor: '#05AB8C',
  },
];

// --- Stats --------------------------------------------------------------------

const STATS = [
  { value: '7', label: 'Agent steps' },
  { value: '8', label: 'KB documents' },
  { value: '3', label: 'Export formats' },
  { value: 'Full', label: 'Reasoning trace' },
];

// --- Page-level CSS animations ------------------------------------------------

const PAGE_CSS = `
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(245,168,0,0.45), 0 0 60px rgba(245,168,0,0.15); }
  50%       { box-shadow: 0 0 40px rgba(245,168,0,0.65), 0 0 100px rgba(245,168,0,0.25); }
}
@keyframes pulse-travel {
  0%   { left: -2%; opacity: 0; }
  10%  { opacity: 0.7; }
  90%  { opacity: 0.7; }
  100% { left: 102%; opacity: 0; }
}
@keyframes pulse-travel-reverse {
  0%   { right: -2%; opacity: 0; }
  10%  { opacity: 0.45; }
  90%  { opacity: 0.45; }
  100% { right: 102%; opacity: 0; }
}
@keyframes connector-pulse {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}
@keyframes orb-drift-1 {
  0%, 100% { transform: translate(0px, 0px) scale(1); }
  33%       { transform: translate(40px, -30px) scale(1.08); }
  66%       { transform: translate(-20px, 20px) scale(0.95); }
}
@keyframes orb-drift-2 {
  0%, 100% { transform: translate(0px, 0px) scale(1); }
  40%       { transform: translate(-50px, 30px) scale(1.1); }
  70%       { transform: translate(30px, -15px) scale(0.92); }
}
@keyframes orb-drift-3 {
  0%, 100% { transform: translate(0px, 0px) scale(1); }
  50%       { transform: translate(25px, 35px) scale(1.06); }
}
@keyframes grid-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes scan-line {
  0%   { top: 0%; }
  100% { top: 100%; }
}
@keyframes feature-hover-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245,168,0,0); }
  50%       { box-shadow: 0 0 30px 0 rgba(245,168,0,0.06); }
}
`;

// --- Gradient orbs ------------------------------------------------------------

function GradientOrbs() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '10%', left: '15%',
        width: 480, height: 480, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,117,201,0.18) 0%, transparent 70%)',
        animation: 'orb-drift-1 18s ease-in-out infinite',
        filter: 'blur(1px)',
      }} />
      <div style={{
        position: 'absolute', top: '30%', right: '10%',
        width: 560, height: 560, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,168,0,0.14) 0%, transparent 70%)',
        animation: 'orb-drift-2 24s ease-in-out infinite',
        filter: 'blur(1px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', left: '40%',
        width: 360, height: 360, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        animation: 'orb-drift-3 20s ease-in-out infinite',
        filter: 'blur(1px)',
      }} />
      <div style={{
        position: 'absolute', top: '60%', left: '5%',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(5,171,140,0.10) 0%, transparent 70%)',
        animation: 'orb-drift-1 28s ease-in-out infinite reverse',
        filter: 'blur(1px)',
      }} />
    </div>
  );
}

// --- Dot grid background ------------------------------------------------------

function DotGrid() {
  return (
    <div
      style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        animation: 'grid-fade 2s ease forwards',
        opacity: 0,
      }}
    />
  );
}

// --- Scanning line ------------------------------------------------------------

function ScanLine() {
  return (
    <div
      style={{
        position: 'absolute', left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(245,168,0,0.25) 30%, rgba(245,168,0,0.5) 50%, rgba(245,168,0,0.25) 70%, transparent 100%)',
        animation: 'scan-line 8s linear infinite',
        pointerEvents: 'none',
      }}
    />
  );
}

// --- Animated stat counter ----------------------------------------------------

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const numeric = parseInt(value.replace(/\D/g, ''), 10);
    if (isNaN(numeric)) { setDisplay(value); return; }
    const suffix = value.replace(/[0-9]/g, '');
    let start = 0;
    const duration = 1200;
    const step = Math.ceil(numeric / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, numeric);
      setDisplay(`${start}${suffix}`);
      if (start >= numeric) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref}>
      <div style={{ fontSize: 40, fontWeight: 700, color: '#F5A800', lineHeight: 1, marginBottom: 6, fontFamily: 'var(--font-display)' }}>
        {display}
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>
        {label}
      </div>
    </div>
  );
}

// --- Pipeline preview ---------------------------------------------------------

function PipelinePreview() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 48 }}>
      {PIPELINE_STAGES.map((stage, i) => (
        <Fragment key={stage.label}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  `0 0 0 0 ${stage.color}00`,
                  `0 0 28px 8px ${stage.color}50`,
                  `0 0 0 0 ${stage.color}00`,
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.65, ease: 'easeInOut' }}
              style={{
                width: 52, height: 52, borderRadius: '50%',
                border: `2px solid ${stage.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${stage.color}12`,
              }}
            >
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: stage.color, boxShadow: `0 0 12px ${stage.color}` }} />
            </motion.div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: stage.color, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>
              {stage.label}
            </span>
          </motion.div>

          {i < PIPELINE_STAGES.length - 1 && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.0 + i * 0.2, duration: 0.4 }}
              style={{
                width: 80, height: 2, marginBottom: 26, transformOrigin: 'left',
                background: `linear-gradient(90deg, ${stage.color}, ${PIPELINE_STAGES[i + 1].color})`,
                opacity: 0.5, position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'connector-pulse 2.2s linear infinite',
                animationDelay: `${1.5 + i * 0.35}s`,
              }} />
            </motion.div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

// --- Feature card -------------------------------------------------------------

function FeatureCard({ icon, title, desc, chip, chipBg, chipColor, delay }: {
  icon: ReactNode;
  title: string;
  desc: string;
  chip: string;
  chipBg: string;
  chipColor: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: hovered ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: '32px 28px',
        cursor: 'default',
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <div style={{ marginBottom: 20 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', marginBottom: 12, letterSpacing: '-0.01em', fontFamily: 'var(--font-display)' }}>
        {title}
      </div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 20 }}>
        {desc}
      </div>
      <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'ui-monospace, SFMono-Regular, monospace', background: chipBg, color: chipColor }}>
        {chip}
      </div>
    </motion.div>
  );
}

// --- Page ---------------------------------------------------------------------

export default function LandingPage() {
  const { scrollY } = useScroll();
  const titleY    = useTransform(scrollY, [0, 500], [0, -130]);
  const subtitleY = useTransform(scrollY, [0, 500], [0, -80]);
  const pipelineY = useTransform(scrollY, [0, 500], [0, -50]);
  const ctaY      = useTransform(scrollY, [0, 500], [0, -35]);
  const statsY    = useTransform(scrollY, [0, 500], [0, -15]);

  const howRef   = useRef<HTMLDivElement>(null);
  const featRef  = useRef<HTMLDivElement>(null);
  const howInView  = useInView(howRef,  { once: true, margin: '-80px' });
  const featInView = useInView(featRef, { once: true, margin: '-80px' });

  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: '#333333' }}>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />

      {/* =======================================================
          TOP NAV
      ======================================================= */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 60,
        background: 'rgba(1,30,65,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image src="/crowe-logo-white.svg" alt="Crowe" height={18} width={66} />
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18, lineHeight: 1, userSelect: 'none' }}>|</span>
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', fontFamily: 'var(--font-display)' }}>
            Compass
          </span>
        </div>
        <Link href="/login">
          <button type="button" style={{
            height: 36, padding: '0 22px',
            background: '#F5A800', color: '#011E41',
            fontFamily: 'var(--font-sans)', fontWeight: 700,
            fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase',
            border: 'none', borderRadius: 4, cursor: 'pointer',
          }}>
            Enter platform
          </button>
        </Link>
      </nav>

      {/* =======================================================
          SECTION 1 - HERO
      ======================================================= */}
      <section style={{
        position: 'relative',
        paddingTop: 60,
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#011E41',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(0,62,159,0.35) 0%, rgba(1,30,65,0.0) 65%)',
          pointerEvents: 'none',
        }} />
        <GradientOrbs />
        <DotGrid />
        <ScanLine />

        <div style={{
          maxWidth: 860, margin: '0 auto', padding: '80px 48px 72px',
          textAlign: 'center', width: '100%', position: 'relative', zIndex: 1,
        }}>

          {/* Eyebrow label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ marginBottom: 24 }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 999,
              border: '1px solid rgba(245,168,0,0.35)',
              background: 'rgba(245,168,0,0.07)',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#F5A800',
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F5A800', boxShadow: '0 0 8px #F5A800', display: 'inline-block' }} />
              AI Audit Reporting Agent
            </span>
          </motion.div>

          {/* Title */}
          <motion.div style={{ y: titleY, marginBottom: 16 }}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{
                fontSize: 80, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1,
                color: '#FFFFFF', fontFamily: 'var(--font-display)',
                margin: 0,
              }}
            >
              Crowe{' '}
              <span style={{
                color: '#F5A800',
                textShadow: '0 0 60px rgba(245,168,0,0.4)',
              }}>
                Compass
              </span>
              <span style={{ color: 'rgba(245,168,0,0.7)', fontSize: 48, verticalAlign: 'super', marginLeft: 2 }}></span>
            </motion.h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div style={{ y: subtitleY }}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              style={{ fontSize: 22, color: 'rgba(255,255,255,0.65)', marginBottom: 8, fontWeight: 500 }}
            >
              Report clearly. Audit continuously.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.58 }}
              style={{
                fontSize: 14, color: 'rgba(255,255,255,0.38)', marginBottom: 44,
                fontFamily: 'ui-monospace, SFMono-Regular, monospace', letterSpacing: '0.04em',
              }}
            >
              Multi-agent AI that builds FY2026 audit reports for financial institutions
            </motion.p>
          </motion.div>

          {/* Pipeline */}
          <motion.div style={{ y: pipelineY }}>
            <PipelinePreview />
          </motion.div>

          {/* CTAs */}
          <motion.div style={{ y: ctaY }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.68 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 56 }}
            >
              <Link href="/login">
                <button type="button" style={{
                  height: 54, padding: '0 34px',
                  background: '#F5A800', color: '#011E41',
                  fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  border: 'none', borderRadius: 4, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  animation: 'glow-pulse 2.5s ease-in-out infinite',
                }}>
                  Run the demo
                  <span style={{
                    background: '#011E41', color: '#F5A800',
                    width: 26, height: 26, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                  }}>{"->"}</span>
                </button>
              </Link>
              <a href="#how-it-works" style={{ textDecoration: 'none' }}>
                <button type="button" style={{
                  height: 54, padding: '0 28px',
                  background: 'transparent', color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  border: '1.5px solid rgba(255,255,255,0.18)', borderRadius: 4, cursor: 'pointer',
                }}>
                  How it works
                </button>
              </a>
            </motion.div>
          </motion.div>

          {/* Stats strip */}
          <motion.div style={{ y: statsY }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85 }}
              style={{ position: 'relative' }}
            >
              <div style={{
                position: 'absolute', top: 12, left: '5%', right: '5%', height: 1,
                background: 'linear-gradient(90deg, transparent 0%, rgba(245,168,0,0.22) 20%, rgba(245,168,0,0.22) 80%, transparent 100%)',
                pointerEvents: 'none', zIndex: 0,
              }}>
                <div style={{
                  position: 'absolute', top: -3, width: 6, height: 6, borderRadius: '50%',
                  background: '#F5A800', boxShadow: '0 0 14px #F5A800, 0 0 28px rgba(245,168,0,0.35)',
                  animation: 'pulse-travel 5.5s linear infinite',
                }} />
                <div style={{
                  position: 'absolute', top: -2, width: 4, height: 4, borderRadius: '50%',
                  background: '#0075C9', boxShadow: '0 0 8px #0075C9',
                  animation: 'pulse-travel-reverse 7.5s linear infinite', animationDelay: '-3s',
                }} />
              </div>

              <div style={{
                display: 'flex', gap: 0,
                borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32,
                justifyContent: 'center', position: 'relative', zIndex: 1,
              }}>
                {STATS.map((stat, i, arr) => (
                  <div key={stat.label} style={{
                    flex: 1, maxWidth: 180,
                    paddingRight: i < arr.length - 1 ? 32 : 0,
                    marginRight: i < arr.length - 1 ? 32 : 0,
                    borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  }}>
                    <AnimatedStat value={stat.value} label={stat.label} />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* =======================================================
          SECTION 2 - HOW IT WORKS
      ======================================================= */}
      <section id="how-it-works" style={{ background: '#FFFFFF', borderTop: '1px solid #E0E0E0' }}>
        <div ref={howRef} style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 48px' }}>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={howInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D7761D', marginBottom: 12, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={howInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
            style={{ fontSize: 36, fontWeight: 700, color: '#011E41', letterSpacing: '-0.02em', marginBottom: 8, fontFamily: 'var(--font-display)' }}
          >
            Four stages, one cohesive audit report
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={howInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16 }}
            style={{ fontSize: 16, color: '#4F4F4F', marginBottom: 52, maxWidth: 560 }}
          >
            Every stage uses the right kind of intelligence - grounded KB retrieval, sequential AI generation, human refinement, and governance-gated approval.
          </motion.p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1, background: '#D0D0D0',
            border: '1px solid #D0D0D0', borderRadius: 10, overflow: 'hidden',
          }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                animate={howInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.2 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                style={{ background: '#FFFFFF', padding: '32px 26px' }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#9E9E9E', marginBottom: 18, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>
                  {step.num}
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={howInView ? { width: 36 } : { width: 0 }}
                  transition={{ duration: 0.9, delay: 0.4 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: 3, borderRadius: 2, background: step.accentColor, marginBottom: 18 }}
                />
                <div style={{ fontSize: 16, fontWeight: 700, color: '#011E41', marginBottom: 12, lineHeight: 1.3, fontFamily: 'var(--font-display)' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: 13, color: '#4F4F4F', lineHeight: 1.65, marginBottom: 18 }}>
                  {step.desc}
                </div>
                <div style={{
                  display: 'inline-block', padding: '4px 10px', borderRadius: 3,
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                  background: step.badgeBg, color: step.badgeColor,
                }}>
                  {step.badge}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =======================================================
          SECTION 3 - FEATURES
      ======================================================= */}
      <section style={{ background: '#011E41', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 48px' }}>

          <div ref={featRef}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={featInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F5A800', marginBottom: 12, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
            >
              Built for audit teams
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={featInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 }}
              style={{ fontSize: 36, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: 8, fontFamily: 'var(--font-display)' }}
            >
              What makes Compass different
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={featInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.16 }}
              style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 52, maxWidth: 540 }}
            >
              Transparency, editability, and governance built in - not bolted on.
            </motion.p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={0.1 + i * 0.12} />
            ))}
          </div>

          {/* Demo CTA strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55 }}
            style={{
              marginTop: 64,
              padding: '36px 40px',
              background: 'rgba(245,168,0,0.06)',
              border: '1px solid rgba(245,168,0,0.22)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 32,
            }}
          >
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginBottom: 6, fontFamily: 'var(--font-display)' }}>
                Ready to see it in action?
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
                Sign in as a manager to generate a report, or as a director to review one.
              </div>
            </div>
            <Link href="/login">
              <button type="button" style={{
                height: 50, padding: '0 32px', flexShrink: 0,
                background: '#F5A800', color: '#011E41',
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                border: 'none', borderRadius: 4, cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}>
                Start the demo {"->"}
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* =======================================================
          FOOTER
      ======================================================= */}
      <footer style={{
        background: '#010F22', padding: '24px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Image src="/crowe-logo-white.svg" alt="Crowe" height={18} width={66} />
          <span style={{ color: 'rgba(255,255,255,0.18)' }}>|</span>
          <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>
            AI Innovation Team | Crowe Compass | 2026
          </span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.22)', fontSize: 12, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>
          Confidential - not for distribution
        </div>
      </footer>
    </div>
  );
}
