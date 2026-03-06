export default function PrivacyPage() {
  return (
    <div style={{
      background: "#080808",
      color: "#f2ede4",
      minHeight: "100vh",
      fontFamily: "'Georgia', 'Times New Roman', serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --red: #e8350a;
          --red-border: rgba(232,53,10,0.3);
          --text: #f2ede4;
          --muted: rgba(242,237,228,0.55);
          --dimmer: rgba(242,237,228,0.18);
          --card-border: rgba(242,237,228,0.08);
        }
        .bebas { font-family: 'Bebas Neue', Georgia, serif; letter-spacing: 0.04em; }
        .legal-body h2 { font-family: 'Bebas Neue', Georgia, serif; font-size: 1.4rem; letter-spacing: 0.06em; color: #f2ede4; margin: 48px 0 16px; }
        .legal-body h3 { font-size: 1rem; font-weight: 700; color: rgba(242,237,228,0.85); margin: 28px 0 10px; }
        .legal-body p { color: var(--muted); font-size: 0.95rem; line-height: 1.8; margin-bottom: 16px; }
        .legal-body ul { color: var(--muted); font-size: 0.95rem; line-height: 1.8; margin: 0 0 16px 20px; }
        .legal-body li { margin-bottom: 8px; }
        .legal-body a { color: var(--red); text-decoration: none; }
        .legal-body a:hover { text-decoration: underline; }
        .highlight-box { background: rgba(232,53,10,0.06); border: 1px solid rgba(232,53,10,0.2); padding: 20px 24px; margin-bottom: 24px; }
        .highlight-box p { margin-bottom: 0; }
      `}</style>

      <nav style={{
        padding: "18px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid var(--card-border)",
        position: "sticky", top: 0,
        background: "rgba(8,8,8,0.97)",
        backdropFilter: "blur(20px)",
        zIndex: 100,
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z" fill="#F5A623" stroke="#F5A623" strokeWidth="1" strokeLinejoin="round"/>
          </svg>
          <span className="bebas" style={{ fontSize: "1.2rem", letterSpacing: "0.22em", color: "#fff" }}>VERDICT</span>
        </a>
        <a href="/" style={{ color: "var(--muted)", fontSize: "0.85rem", textDecoration: "none" }}>← Back</a>
      </nav>

      <div style={{ maxWidth: 740, margin: "0 auto", padding: "72px 24px 120px" }}>
        <div style={{ marginBottom: 48 }}>
          <div className="bebas" style={{ fontSize: "0.78rem", letterSpacing: "0.22em", color: "var(--red)", marginBottom: 16 }}>LEGAL</div>
          <h1 className="bebas" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 0.97, marginBottom: 20 }}>
            Privacy Policy
          </h1>
          <p style={{ color: "var(--dimmer)", fontSize: "0.82rem" }}>
            Effective date: March 6, 2026 · OPP Media Inc.
          </p>
        </div>

        <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: 48 }} className="legal-body">

          <div className="highlight-box">
            <p>
              <strong style={{ color: "#f2ede4" }}>The short version:</strong> We collect what we need to run the product.
              We don&apos;t sell your data. We don&apos;t share your queries with advertisers. Your questions stay yours.
            </p>
          </div>

          <p>This Privacy Policy explains how OPP Media Inc. (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and shares information about you when you use Verdict (&ldquo;the Service&rdquo;). By using the Service, you agree to the practices described here.</p>

          <h2>1. Information We Collect</h2>

          <h3>Account Information</h3>
          <p>When you sign in with Google, we receive your name, email address, and profile photo from Google&apos;s OAuth service. This is the minimum required to create and identify your account. We do not receive your Google password.</p>

          <h3>Query Data</h3>
          <p>When you submit a question to Verdict, we log the query text, the timestamp, your account ID, the mode selected (Quick or Deep), the personality selected (Clean, Cocky, or Savage), and the scores and synthesis output returned. This data is stored in our database and used to serve results back to you and improve our synthesis engine.</p>

          <h3>Payment Information</h3>
          <p>Payments are processed by Stripe. We do not store your credit card number, CVV, or full payment details on our servers. We receive confirmation of successful payments and your subscription status from Stripe. Stripe&apos;s privacy practices are governed by <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe&apos;s Privacy Policy</a>.</p>

          <h3>Usage Data</h3>
          <p>We collect standard server logs including IP addresses, browser type, pages visited, and timestamps. We may use product analytics tools to understand how features are used. This data is used in aggregate and is not linked to individual identities for advertising purposes.</p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li><strong style={{ color: "rgba(242,237,228,0.8)" }}>To operate the Service</strong> — processing your queries, displaying results, and managing your account and subscription.</li>
            <li><strong style={{ color: "rgba(242,237,228,0.8)" }}>To improve the product</strong> — analyzing aggregated, anonymized query patterns to improve synthesis quality, scoring accuracy, and roast generation.</li>
            <li><strong style={{ color: "rgba(242,237,228,0.8)" }}>To communicate with you</strong> — sending transactional emails (receipts, billing notifications, major product updates). We do not send marketing email without your consent.</li>
            <li><strong style={{ color: "rgba(242,237,228,0.8)" }}>To enforce our Terms</strong> — detecting abuse, fraud, or violations of our acceptable use policy.</li>
          </ul>

          <h2>3. How We Share Your Information</h2>
          <p>We do not sell your personal information. Period.</p>
          <p>We share information only in these limited circumstances:</p>

          <h3>Third-Party AI Providers</h3>
          <p>Your queries are transmitted to Anthropic (Claude), OpenAI (GPT-4o), and xAI (Grok) for processing. Each provider receives your query text in order to generate a response. We recommend reviewing their privacy policies:</p>
          <ul>
            <li><a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer">Anthropic Privacy Policy</a></li>
            <li><a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">OpenAI Privacy Policy</a></li>
            <li><a href="https://x.ai/privacy" target="_blank" rel="noopener noreferrer">xAI Privacy Policy</a></li>
          </ul>
          <p>We do not share your account identity with AI providers — queries are transmitted without personally identifying information beyond what is inherent in the query content itself.</p>

          <h3>Infrastructure Providers</h3>
          <p>We use Vercel (hosting), Supabase (database), and Stripe (payments). These providers process data on our behalf under contractual obligations to protect your information.</p>

          <h3>Legal Requirements</h3>
          <p>We may disclose information if required by law, court order, or governmental authority, or if we believe in good faith that disclosure is necessary to protect the rights, property, or safety of OPP Media Inc., our users, or the public.</p>

          <h2>4. Data Retention</h2>
          <p>We retain your account information and query history for as long as your account is active. If you delete your account, we will delete your personal information within 30 days, except where retention is required by law or legitimate business purposes.</p>
          <p>Aggregated, anonymized data that cannot be linked back to you may be retained indefinitely for product improvement purposes.</p>

          <h2>5. Your Rights and Choices</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li><strong style={{ color: "rgba(242,237,228,0.8)" }}>Access</strong> — request a copy of the personal data we hold about you.</li>
            <li><strong style={{ color: "rgba(242,237,228,0.8)" }}>Correction</strong> — request correction of inaccurate information.</li>
            <li><strong style={{ color: "rgba(242,237,228,0.8)" }}>Deletion</strong> — request deletion of your account and associated data.</li>
            <li><strong style={{ color: "rgba(242,237,228,0.8)" }}>Portability</strong> — request your query history in a machine-readable format.</li>
            <li><strong style={{ color: "rgba(242,237,228,0.8)" }}>Opt-out</strong> — opt out of any non-essential data collection or communications.</li>
          </ul>
          <p>To exercise any of these rights, email us at <a href="mailto:privacy@verdict-app.com">privacy@verdict-app.com</a>. We will respond within 30 days.</p>

          <h2>6. Cookies and Tracking</h2>
          <p>We use essential cookies to maintain your session and keep you signed in. We do not use third-party advertising cookies or tracking pixels. We may use privacy-respecting analytics to understand product usage — these do not track you across other websites.</p>

          <h2>7. Children&apos;s Privacy</h2>
          <p>Verdict is not intended for users under 18 years of age. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected information from a minor, please contact us immediately at <a href="mailto:privacy@verdict-app.com">privacy@verdict-app.com</a>.</p>

          <h2>8. Security</h2>
          <p>We use industry-standard security practices including encrypted connections (TLS), access controls, and regular security reviews. No system is perfectly secure. Notify us immediately if you suspect unauthorized access to your Verdict account.</p>

          <h2>9. California Residents (CCPA)</h2>
          <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act, including the right to know what personal information we collect, the right to delete it, and the right to opt out of any sale of personal information. We do not sell personal information. To exercise your CCPA rights, contact <a href="mailto:privacy@verdict-app.com">privacy@verdict-app.com</a>.</p>

          <h2>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by prominent notice in the Service at least 14 days before changes take effect.</p>

          <h2>11. Contact</h2>
          <p>
            Privacy questions: <a href="mailto:privacy@verdict-app.com">privacy@verdict-app.com</a><br />
            General support: <a href="mailto:support@verdict-app.com">support@verdict-app.com</a>
          </p>
          <p>OPP Media Inc.<br />Torrance, California</p>

        </div>
      </div>

      <footer style={{
        padding: "28px 48px",
        borderTop: "1px solid var(--card-border)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
      }}>
        <span className="bebas" style={{ letterSpacing: "0.2em", fontSize: "0.85rem", color: "var(--dimmer)" }}>VERDICT</span>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="/privacy" style={{ color: "var(--dimmer)", fontSize: "0.8rem", textDecoration: "none" }}>Privacy</a>
          <a href="/terms" style={{ color: "var(--dimmer)", fontSize: "0.8rem", textDecoration: "none" }}>Terms</a>
        </div>
        <span style={{ color: "var(--dimmer)", fontSize: "0.78rem" }}>© 2026 OPP Media Inc.</span>
      </footer>
    </div>
  );
}
