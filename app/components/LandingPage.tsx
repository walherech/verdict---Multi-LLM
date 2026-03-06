'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';

const ROAST_EXAMPLES = [
  {
    query: "Explain quantum entanglement simply",
    scores: { claude: 91, gpt: 84, grok: 72 },
    verdict: 96,
    roasts: {
      savage: [
        { model: "Claude", score: 91, roast: "Solid. Actually read the room, used a real analogy, didn't drown you in caveats. Occasionally acts like it invented physics, but the answer holds up." },
        { model: "GPT-4o", score: 84, roast: "Competent. Safe. The kind of answer a consulting firm would bill $400/hr for and call 'comprehensive.' Technically correct. Spiritually beige." },
        { model: "Grok", score: 72, roast: "Started strong, got distracted, made a Schrödinger's cat joke that wasn't asked for. The answer's okay. The vibe is 'guy at a party who just discovered podcasts.'" },
      ],
      cocky: [
        { model: "Claude", score: 91, roast: "Taking the gold here. Clean, precise, actually helpful. This is what $20/month is supposed to feel like." },
        { model: "GPT-4o", score: 84, roast: "Good but not great. Played it safe when it could've been brilliant. Silver medal energy." },
        { model: "Grok", score: 72, roast: "Showed up. Tried. Brought the personality but left the focus at home. We've seen better from you." },
      ],
      clean: [
        { model: "Claude", score: 91, summary: "Provided a clear, well-structured explanation with strong analogies. Best balance of accuracy and accessibility." },
        { model: "GPT-4o", score: 84, summary: "Accurate and thorough, though slightly verbose. Strong on technical detail, weaker on simplification." },
        { model: "Grok", score: 72, summary: "Covered the core concept adequately with some unnecessary tangents that reduced clarity." },
      ],
    },
  },
  {
    query: "Is TypeScript worth learning in 2025?",
    scores: { claude: 88, gpt: 93, grok: 79 },
    verdict: 97,
    roasts: {
      savage: [
        { model: "GPT-4o", score: 93, roast: "Actually the sharpest take today. Gave you the real answer — yes, with caveats — instead of the influencer answer. Rare form." },
        { model: "Claude", score: 88, roast: "Good answer wrapped in so much nuance it almost talked itself out of having a point. Yes or no, Claude. The people are waiting." },
        { model: "Grok", score: 79, roast: "Gave an answer Elon would repost. Technically not wrong. Directionally questionable. Three months of ecosystem changes behind the curve." },
      ],
      cocky: [
        { model: "GPT-4o", score: 93, roast: "First place today. Actually had the conviction to say something definitive. That's rare from any of these." },
        { model: "Claude", score: 88, roast: "Good, careful, thorough. Loses points for being so balanced it forgot to be useful." },
        { model: "Grok", score: 79, roast: "Points for confidence. Points deducted for the 2024 data. We'll call it a draw." },
      ],
      clean: [
        { model: "GPT-4o", score: 93, summary: "Most opinionated and actionable response. Clear recommendation with well-reasoned caveats." },
        { model: "Claude", score: 88, summary: "Comprehensive coverage of the tradeoffs. Slightly over-hedged but balanced and accurate." },
        { model: "Grok", score: 79, summary: "Direct and readable, though some ecosystem references appear dated. Core recommendation is sound." },
      ],
    },
  },
  {
    query: "Best way to negotiate a salary raise?",
    scores: { claude: 94, gpt: 87, grok: 81 },
    verdict: 98,
    roasts: {
      savage: [
        { model: "Claude", score: 94, roast: "Didn't just answer the question — understood the question underneath the question. The bit about anchoring high before they anchor low? That's actual leverage, not vibes." },
        { model: "GPT-4o", score: 87, roast: "Fine advice. The kind that would get you a 4% raise. Claude's answer gets you 15%. Both are technically correct." },
        { model: "Grok", score: 81, roast: "Gave you the Twitter thread version. 'Know your worth.' Thanks. Revolutionary. Backed by absolutely nothing." },
      ],
      cocky: [
        { model: "Claude", score: 94, roast: "This is why it's the top dog today. Real strategy, not motivational poster copy." },
        { model: "GPT-4o", score: 87, roast: "Respectable. Solid fundamentals. Leaves some money on the table but won't embarrass you." },
        { model: "Grok", score: 81, roast: "Showed up with a pep talk when you needed a playbook. Better luck next query." },
      ],
      clean: [
        { model: "Claude", score: 94, summary: "Provided the most actionable framework including anchoring strategy, timing, and market data positioning. Clear and specific." },
        { model: "GPT-4o", score: 87, summary: "Solid general guidance on negotiation principles with good structure, though lighter on tactical specifics." },
        { model: "Grok", score: 81, summary: "Motivational in tone, lighter on concrete tactics. Accurate but general advice any career site would offer." },
      ],
    },
  },
];

const MODES = ["savage", "cocky", "clean"] as const;
type Mode = typeof MODES[number];
const MODE_LABELS: Record<Mode, string> = { savage: "🔥 Savage", cocky: "😏 Cocky", clean: "⚖ Clean" };
const MODE_DESC: Record<Mode, string> = {
  savage: "Ruthless. Punchlines. Screenshots.",
  cocky: "Trash talk with a wink.",
  clean: "Scores and summaries. No drama.",
};

function ScoreBar({ score, delay = 0 }: { score: number; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 300 + delay);
    return () => clearTimeout(t);
  }, [score, delay]);
  return (
    <div style={{ position: "relative", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
      <div style={{
        position: "absolute", left: 0, top: 0, height: "100%",
        width: `${width}%`,
        background: "#e8350a",
        borderRadius: 2,
        transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
      }} />
    </div>
  );
}

export default function VerdictLanding() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [mode, setMode] = useState<Mode>("savage");
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        const id = (e.target as HTMLElement).dataset.id;
        if (e.isIntersecting && id) setVisible(v => ({ ...v, [id]: true }));
      }),
      { threshold: 0.15 }
    );
    Object.values(refs.current).forEach(r => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    refs.current[id] = el;
    if (el) el.dataset.id = id;
  };

  const demo = ROAST_EXAMPLES[activeDemo];
  const roastData = demo.roasts[mode];

  return (
    <div style={{
      background: "#080808",
      color: "#f2ede4",
      minHeight: "100vh",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

        :root {
          --red: #e8350a;
          --red-dim: rgba(232,53,10,0.12);
          --red-border: rgba(232,53,10,0.3);
          --text: #f2ede4;
          --muted: rgba(242,237,228,0.45);
          --dimmer: rgba(242,237,228,0.18);
          --card: rgba(242,237,228,0.04);
          --card-border: rgba(242,237,228,0.08);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        .bebas { font-family: 'Bebas Neue', Georgia, serif; letter-spacing: 0.04em; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(232,53,10,0.5); }
          50%      { box-shadow: 0 0 0 12px rgba(232,53,10,0); }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .hero-title  { animation: fadeUp 0.9s ease both; }
        .hero-sub    { animation: fadeUp 0.9s 0.15s ease both; }
        .hero-cta    { animation: fadeUp 0.9s 0.3s ease both; }
        .hero-models { animation: fadeUp 0.9s 0.45s ease both; }

        .scroll-in { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .scroll-in.visible { opacity: 1; transform: none; }

        .cta-primary {
          background: var(--red);
          color: #fff;
          border: none;
          font-family: 'Bebas Neue', serif;
          font-size: 1.2rem;
          letter-spacing: 0.1em;
          padding: 16px 48px;
          cursor: pointer;
          animation: pulse 2.5s infinite;
          transition: background 0.2s, transform 0.15s;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
        }
        .cta-primary:hover { background: #c82d08; transform: scale(1.02); animation: none; }

        .cta-ghost {
          background: transparent;
          color: var(--text);
          border: 1px solid var(--card-border);
          font-family: 'Bebas Neue', serif;
          font-size: 1.1rem;
          letter-spacing: 0.1em;
          padding: 15px 36px;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
        }
        .cta-ghost:hover { border-color: var(--red); color: var(--red); }

        .mode-btn {
          background: transparent;
          border: 1px solid var(--card-border);
          color: var(--muted);
          font-family: 'Bebas Neue', serif;
          font-size: 1rem;
          letter-spacing: 0.08em;
          padding: 10px 24px;
          cursor: pointer;
          transition: all 0.2s;
          clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
        }
        .mode-btn:hover { border-color: var(--red-border); color: var(--text); }
        .mode-btn.active { border-color: var(--red); color: var(--red); background: var(--red-dim); }

        .query-tab {
          background: var(--card);
          border: 1px solid var(--card-border);
          color: var(--muted);
          font-family: 'Georgia', serif;
          font-size: 0.88rem;
          padding: 14px 20px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          width: 100%;
        }
        .query-tab:hover { border-color: var(--red-border); color: var(--text); }
        .query-tab.active { border-color: var(--red); color: var(--text); background: var(--red-dim); }

        .roast-card {
          background: var(--card);
          border: 1px solid var(--card-border);
          padding: 24px;
          transition: border-color 0.2s;
        }
        .roast-card:hover { border-color: var(--red-border); }

        .ticker-wrap {
          overflow: hidden;
          border-top: 1px solid var(--card-border);
          border-bottom: 1px solid var(--card-border);
          padding: 12px 0;
          background: rgba(232,53,10,0.04);
        }
        .ticker-inner {
          display: flex;
          gap: 80px;
          width: max-content;
          animation: ticker 28s linear infinite;
          font-family: 'Bebas Neue', serif;
          font-size: 0.85rem;
          letter-spacing: 0.18em;
          color: var(--muted);
        }
        .ticker-inner span { white-space: nowrap; }
        .ticker-inner .accent { color: var(--red); }

        .nav-link { color: var(--muted); text-decoration: none; font-size: 0.85rem; letter-spacing: 0.08em; transition: color 0.2s; }
        .nav-link:hover { color: var(--text); }

        .score-badge {
          font-family: 'Bebas Neue', serif;
          font-size: 1.8rem;
          letter-spacing: 0.04em;
          line-height: 1;
        }

        .verdict-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--red-dim);
          border: 1px solid var(--red-border);
          color: var(--red);
          padding: 6px 16px;
          font-family: 'Bebas Neue', serif;
          font-size: 0.9rem;
          letter-spacing: 0.14em;
        }

        @media (max-width: 768px) {
          .math-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "18px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(8,8,8,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--card-border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z" fill="#F5A623" stroke="#F5A623" strokeWidth="1" strokeLinejoin="round"/>
          </svg>
          <span className="bebas" style={{ fontSize: "1.3rem", letterSpacing: "0.22em", color: "#ffffff" }}>VERDICT</span>
          <span style={{
            background: "rgba(245,166,35,0.15)",
            border: "1px solid rgba(245,166,35,0.35)",
            color: "#F5A623",
            fontSize: "0.65rem",
            fontFamily: "'Bebas Neue', serif",
            letterSpacing: "0.14em",
            padding: "3px 10px",
            borderRadius: "100px",
          }}>BETA</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a href="#how" className="nav-link">How It Works</a>
          <a href="#pricing" className="nav-link">Pricing</a>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="cta-ghost" style={{ padding: "9px 24px", fontSize: "0.9rem" }} onClick={() => signIn('google')}>Sign In</button>
          <button className="cta-primary" style={{ padding: "9px 28px", fontSize: "0.95rem", animation: "none" }} onClick={() => signIn('google')}>Try Free</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        textAlign: "center",
        padding: "130px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(232,53,10,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,53,10,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 55% at 50% 40%, rgba(232,53,10,0.1) 0%, transparent 70%)",
        }} />

        <div className="hero-title" style={{ maxWidth: 1000 }}>
          <div className="verdict-badge" style={{ marginBottom: 32 }}>
            <span>▲</span> Multiple AIs. One Answer. No Mercy.
          </div>
          <h1 className="bebas" style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", lineHeight: 0.95, marginBottom: 8, letterSpacing: "0.02em" }}>
            You&apos;re paying for
          </h1>
          <h1 className="bebas" style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", lineHeight: 0.95, color: "var(--red)", marginBottom: 8, letterSpacing: "0.02em" }}>
            three AIs.
          </h1>
          <h1 className="bebas" style={{ fontSize: "clamp(2rem, 5.5vw, 4.2rem)", lineHeight: 1, color: "rgba(242,237,228,0.5)", letterSpacing: "0.02em", marginBottom: 40 }}>
            You&apos;re still only getting one answer at a time.
          </h1>
        </div>

        <div className="hero-sub" style={{ maxWidth: 640 }}>
          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "var(--muted)", lineHeight: 1.7, marginBottom: 14, fontStyle: "italic" }}>
            ChatGPT. Claude. Grok. Three tabs. Three different answers. Zero clarity.
          </p>
          <p style={{ fontSize: "clamp(1rem, 2.3vw, 1.15rem)", color: "rgba(242,237,228,0.82)", lineHeight: 1.75, marginBottom: 52 }}>
            Verdict runs all three simultaneously, scores each one, synthesizes the best parts
            into a single superior answer — and roasts the losers so you know who to trust.
          </p>
        </div>

        <div className="hero-cta" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="cta-primary" onClick={() => signIn('google')}>Get Your First Verdict Free →</button>
          <button className="cta-ghost" onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}>
            Watch It In Action
          </button>
        </div>
        <p style={{ marginTop: 18, color: "var(--dimmer)", fontSize: "0.8rem", letterSpacing: "0.08em", animation: "fadeIn 1s 0.6s ease both", opacity: 0 }}>
          NO CREDIT CARD · 5 FREE VERDICTS/MONTH · FOUNDING MEMBER PRICING LOCKS IN FOREVER
        </p>

        <div className="hero-models" style={{ marginTop: 72, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
          {["Claude", "GPT-4o", "Grok"].map((m, i) => (
            <div key={m} style={{ display: "contents" }}>
              <div style={{
                padding: "10px 24px",
                border: "1px solid var(--card-border)",
                color: "var(--muted)",
                fontSize: "0.82rem",
                fontFamily: "'Bebas Neue', serif",
                letterSpacing: "0.14em",
              }}>{m}</div>
              {i < 2 && <span style={{ color: "var(--dimmer)", fontSize: "1.2rem" }}>+</span>}
            </div>
          ))}
          <span style={{ color: "var(--dimmer)", fontSize: "1.2rem" }}>=</span>
          <div style={{
            padding: "10px 24px",
            background: "var(--red)",
            color: "#fff",
            fontSize: "0.82rem",
            fontFamily: "'Bebas Neue', serif",
            letterSpacing: "0.14em",
          }}>1 VERDICT</div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[0, 1].map((i) => (
            <div key={i} style={{ display: "flex", gap: 80 }}>
              <span>CLAUDE <span className="accent">VS</span> GPT-4O <span className="accent">VS</span> GROK</span>
              <span>ONE QUESTION <span className="accent">·</span> THREE MODELS <span className="accent">·</span> ONE VERDICT</span>
              <span>SAVAGE MODE AVAILABLE <span className="accent">·</span> NO MERCY</span>
              <span>$29.99/MO <span className="accent">·</span> FOUNDING MEMBER RATE</span>
              <span>ROASTS TARGET MODELS <span className="accent">NOT</span> HUMANS</span>
            </div>
          ))}
        </div>
      </div>

      {/* THE MATH */}
      <section style={{ padding: "100px 24px", maxWidth: 900, margin: "0 auto" }} ref={setRef("math") as any}>
        <div className={`scroll-in${visible.math ? " visible" : ""}`}>
          <p className="bebas" style={{ fontSize: "0.85rem", letterSpacing: "0.22em", color: "var(--muted)", textAlign: "center", marginBottom: 48 }}>THE MATH</p>
          <div className="math-grid" style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: 24, alignItems: "center", marginBottom: 48 }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--card-border)", padding: "40px 36px" }}>
              <div className="bebas" style={{ fontSize: "0.8rem", letterSpacing: "0.2em", color: "var(--muted)", marginBottom: 20 }}>WHAT YOU&apos;RE DOING NOW</div>
              <div className="bebas" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "rgba(242,237,228,0.25)", textDecoration: "line-through", marginBottom: 20, lineHeight: 1 }}>$60/mo</div>
              {[["ChatGPT Plus", "$20/mo"], ["Claude Pro", "$20/mo"], ["Grok Premium", "$20/mo"]].map(([name, price]) => (
                <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--card-border)", color: "var(--muted)", fontSize: "0.88rem" }}>
                  <span>{name}</span><span>{price}</span>
                </div>
              ))}
              <div style={{ marginTop: 20, color: "var(--dimmer)", fontSize: "0.8rem", lineHeight: 1.6 }}>
                Three logins. Three contexts.<br />Three different answers to reconcile.
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="bebas" style={{ color: "var(--red)", fontSize: "2.5rem" }}>→</div>
            </div>
            <div style={{ background: "var(--red-dim)", border: "1px solid var(--red-border)", padding: "40px 36px" }}>
              <div className="bebas" style={{ fontSize: "0.8rem", letterSpacing: "0.2em", color: "var(--red)", marginBottom: 20 }}>WITH VERDICT</div>
              <div className="bebas" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "var(--red)", marginBottom: 20, lineHeight: 1 }}>$29.99/mo</div>
              {[["Claude", "✓"], ["GPT-4o", "✓"], ["Grok", "✓"], ["Synthesis engine", "✓"], ["Model roasts", "✓"]].map(([name, check]) => (
                <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--red-border)", color: "rgba(242,237,228,0.8)", fontSize: "0.88rem" }}>
                  <span>{name}</span><span style={{ color: "var(--red)" }}>{check}</span>
                </div>
              ))}
              <div style={{ marginTop: 20, color: "rgba(242,237,228,0.5)", fontSize: "0.8rem", lineHeight: 1.6 }}>
                One interface. One answer.<br />No more copying and pasting across three platforms.<br />You save $30+ every single month.
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-block", background: "var(--red-dim)", border: "1px solid var(--red-border)", color: "var(--red)", padding: "14px 40px" }}>
              <span className="bebas" style={{ fontSize: "1.1rem", letterSpacing: "0.1em" }}>Stop paying triple. Start getting more.</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: "100px 24px", background: "rgba(242,237,228,0.02)", borderTop: "1px solid var(--card-border)", borderBottom: "1px solid var(--card-border)" }} ref={setRef("how") as any}>
        <div className={`scroll-in${visible.how ? " visible" : ""}`} style={{ maxWidth: 960, margin: "0 auto" }}>
          <p className="bebas" style={{ fontSize: "0.85rem", letterSpacing: "0.22em", color: "var(--muted)", textAlign: "center", marginBottom: 16 }}>HOW IT WORKS</p>
          <h2 className="bebas" style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", textAlign: "center", marginBottom: 64 }}>One question. Three models. One verdict.</h2>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {[
              { n: "01", title: "Ask Anything", body: "Type your question once. Select Quick or Deep mode. Pick your personality." },
              { n: "02", title: "We Run the Room", body: "Claude, GPT-4o, and Grok answer simultaneously. No waiting. No tab switching." },
              { n: "03", title: "The Engine Scores", body: "Every model gets a score (0–100). The synthesis engine combines the best parts into one superior Verdict." },
              { n: "04", title: "The Roasts Land", body: "Commentary on how each model performed — Clean, Cocky, or Savage. The answer is the same. Only the heat changes." },
            ].map((s) => (
              <div key={s.n} style={{ padding: "40px 28px", background: "var(--card)", border: "1px solid var(--card-border)" }}>
                <div className="bebas" style={{ fontSize: "3rem", color: "rgba(232,53,10,0.25)", lineHeight: 1, marginBottom: 20 }}>{s.n}</div>
                <div className="bebas" style={{ fontSize: "1.15rem", letterSpacing: "0.06em", marginBottom: 12 }}>{s.title}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.7 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DEMO */}
      <section id="demo" style={{ padding: "100px 24px", maxWidth: 1000, margin: "0 auto" }} ref={setRef("demo") as any}>
        <div className={`scroll-in${visible.demo ? " visible" : ""}`}>
          <p className="bebas" style={{ fontSize: "0.85rem", letterSpacing: "0.22em", color: "var(--muted)", textAlign: "center", marginBottom: 16 }}>LIVE DEMO</p>
          <h2 className="bebas" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", textAlign: "center", marginBottom: 12 }}>See the roasts. Feel the difference.</h2>
          <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.95rem", marginBottom: 52, fontStyle: "italic" }}>
            Same question. Same synthesis. Same answer quality. Only the personality changes.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
            <div className="bebas" style={{ fontSize: "0.78rem", letterSpacing: "0.2em", color: "var(--muted)", marginBottom: 8 }}>PICK A QUERY</div>
            {ROAST_EXAMPLES.map((r, i) => (
              <button key={i} className={`query-tab${activeDemo === i ? " active" : ""}`} onClick={() => setActiveDemo(i)}>
                &ldquo;{r.query}&rdquo;
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            {MODES.map(m => (
              <button key={m} className={`mode-btn${mode === m ? " active" : ""}`} onClick={() => setMode(m)}>
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>
          <p style={{ color: "var(--dimmer)", fontSize: "0.8rem", marginBottom: 32, fontStyle: "italic" }}>{MODE_DESC[mode]}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {roastData.map((item, i) => (
              <div key={`${mode}-${activeDemo}-${i}`} className="roast-card" style={{ animation: "fadeIn 0.4s ease both", animationDelay: `${i * 0.08}s` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ flex: 1, marginRight: 16 }}>
                    <div className="bebas" style={{ fontSize: "1rem", letterSpacing: "0.1em", color: "var(--red)", marginBottom: 4 }}>{item.model}</div>
                    <ScoreBar score={item.score} delay={i * 100} />
                  </div>
                  <div className="score-badge" style={{ color: item.score >= 90 ? "var(--red)" : item.score >= 80 ? "rgba(242,237,228,0.7)" : "var(--muted)" }}>
                    {item.score}
                  </div>
                </div>
                <p style={{ color: "rgba(242,237,228,0.85)", fontSize: "0.95rem", lineHeight: 1.7, fontStyle: mode === "savage" ? "italic" : "normal" }}>
                  {'summary' in item ? item.summary : item.roast}
                </p>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--red-dim)", border: "1px solid var(--red-border)", padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="bebas" style={{ fontSize: "0.78rem", letterSpacing: "0.2em", color: "var(--red)", marginBottom: 6 }}>▲ THE VERDICT — SYNTHESIZED ANSWER</div>
              <div style={{ color: "var(--muted)", fontSize: "0.88rem" }}>Best parts of all three combined into one superior answer.</div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <div className="bebas" style={{ fontSize: "3.5rem", color: "var(--red)", lineHeight: 1 }}>{demo.verdict}</div>
              <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>/100</div>
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: 24, color: "var(--dimmer)", fontSize: "0.78rem", fontStyle: "italic", lineHeight: 1.6 }}>
            All roasts target AI models, not humans. No large language models were emotionally harmed.<br />
            (Their feelings aren&apos;t real anyway. Probably.)
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "100px 24px", background: "rgba(242,237,228,0.02)", borderTop: "1px solid var(--card-border)" }} ref={setRef("pricing") as any}>
        <div className={`scroll-in${visible.pricing ? " visible" : ""}`} style={{ maxWidth: 860, margin: "0 auto" }}>
          <p className="bebas" style={{ fontSize: "0.85rem", letterSpacing: "0.22em", color: "var(--muted)", textAlign: "center", marginBottom: 16 }}>PRICING</p>
          <h2 className="bebas" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", textAlign: "center", marginBottom: 12 }}>Start free. Lock in forever.</h2>
          <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.95rem", marginBottom: 52, fontStyle: "italic" }}>
            Founding member pricing never increases as long as your subscription stays active.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, maxWidth: 680, margin: "0 auto 48px" }}>
            {[
              { name: "Free", price: "$0", sub: "Forever", features: ["5 verdicts/month", "Claude + GPT-4o + Grok", "Standard speed", "Clean mode only"], cta: "Start Free", highlight: false },
              { name: "Basic", price: "$29.99", sub: "/mo — founding rate", features: ["50 verdicts/month", "Claude + GPT-4o + Grok", "Standard speed", "All personalities (Clean, Cocky, Savage)"], cta: "Lock In Forever →", highlight: true },
            ].map(tier => (
              <div key={tier.name} style={{ padding: "40px 32px", background: tier.highlight ? "var(--red-dim)" : "var(--card)", border: `1px solid ${tier.highlight ? "var(--red-border)" : "var(--card-border)"}` }}>
                <div className="bebas" style={{ fontSize: "0.78rem", letterSpacing: "0.2em", color: tier.highlight ? "var(--red)" : "var(--muted)", marginBottom: 16 }}>
                  {tier.name}{tier.highlight && " — MOST POPULAR"}
                </div>
                <div className="bebas" style={{ fontSize: "2.8rem", lineHeight: 1, marginBottom: 4 }}>{tier.price}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: 28 }}>{tier.sub}</div>
                {tier.features.map(f => (
                  <div key={f} style={{ padding: "9px 0", borderTop: "1px solid var(--card-border)", color: "rgba(242,237,228,0.7)", fontSize: "0.85rem", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: tier.highlight ? "var(--red)" : "var(--muted)", marginTop: 1 }}>✓</span>{f}
                  </div>
                ))}
                <button className={tier.highlight ? "cta-primary" : "cta-ghost"} style={{ marginTop: 28, width: "100%", animation: "none" }} onClick={() => signIn('google')}>
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", color: "var(--dimmer)", fontSize: "0.8rem", lineHeight: 1.7 }}>
            <span style={{ color: "rgba(242,237,228,0.4)" }}>Pro</span> at $49.99/mo — unlocks Deep mode and smart model routing.
          </p>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ padding: "140px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(232,53,10,0.1) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }} ref={setRef("finalcta") as any}>
          <div className={`scroll-in${visible.finalcta ? " visible" : ""}`}>
            <h2 className="bebas" style={{ fontSize: "clamp(2.5rem, 8vw, 6.5rem)", lineHeight: 0.95, marginBottom: 32 }}>
              Stop paying for<br /><span style={{ color: "var(--red)" }}>three AIs.</span><br />Start getting one<br />
              <span style={{ color: "var(--red)", fontSize: "clamp(3rem, 10vw, 8rem)" }}>BETTER answer.</span>
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "1.05rem", marginBottom: 48, lineHeight: 1.7 }}>
              5 free verdicts a month. No credit card. Founding member pricing locks in forever when you upgrade.
            </p>
            <button className="cta-primary" style={{ fontSize: "1.3rem", padding: "20px 64px" }} onClick={() => signIn('google')}>
              Get Your Verdict Free →
            </button>
            <p style={{ marginTop: 20, color: "var(--dimmer)", fontSize: "0.75rem", lineHeight: 1.7 }}>
              Basic $29.99/mo · Pro $49.99/mo<br />
              Founding member rate guaranteed for life — as long as your subscription stays active without interruption.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 48px", borderTop: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z" fill="#F5A623" stroke="#F5A623" strokeWidth="1" strokeLinejoin="round"/>
          </svg>
          <span className="bebas" style={{ letterSpacing: "0.2em", fontSize: "0.9rem" }}>VERDICT</span>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {[["Terms", "/terms"], ["Privacy", "/privacy"], ["Pricing", "#pricing"]].map(([label, href]) => (
            <a key={label} href={href} className="nav-link">{label}</a>
          ))}
        </div>
        <div style={{ color: "var(--dimmer)", fontSize: "0.78rem" }}>© 2026 OPP Media Inc.</div>
      </footer>
    </div>
  );
}
