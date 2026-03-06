export default function TermsPage() {
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
      `}</style>

      {/* NAV */}
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

      {/* CONTENT */}
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "72px 24px 120px" }}>
        <div style={{ marginBottom: 48 }}>
          <div className="bebas" style={{ fontSize: "0.78rem", letterSpacing: "0.22em", color: "var(--red)", marginBottom: 16 }}>LEGAL</div>
          <h1 className="bebas" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 0.97, marginBottom: 20 }}>
            Terms of Service
          </h1>
          <p style={{ color: "var(--dimmer)", fontSize: "0.82rem" }}>
            Effective date: March 6, 2026 · OPP Media Inc.
          </p>
        </div>

        <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: 48 }} className="legal-body">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of Verdict, a multi-model AI synthesis
            platform operated by OPP Media Inc. (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By creating an account or
            using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.
          </p>

          <h2>1. The Service</h2>
          <p>
            Verdict is a subscription-based platform that submits your queries to multiple third-party AI models
            simultaneously (currently Claude by Anthropic, GPT-4o by OpenAI, and Grok by xAI), synthesizes their
            responses into a combined answer, scores each model&apos;s output, and generates personality-driven
            commentary about each model&apos;s performance.
          </p>
          <p>
            We are an independent product. We are not affiliated with, endorsed by, or sponsored by Anthropic,
            OpenAI, or xAI. The AI models are third-party services accessed via their respective APIs.
          </p>

          <h2>2. Accounts and Eligibility</h2>
          <p>
            You must be at least 18 years old to use Verdict. By creating an account, you represent that you meet
            this requirement and that all information you provide is accurate.
          </p>
          <p>
            You are responsible for maintaining the security of your account and for all activity that occurs under
            your account. Notify us immediately at <a href="mailto:support@verdict-app.com">support@verdict-app.com</a> if
            you suspect unauthorized access.
          </p>

          <h2>3. Subscription Plans and Billing</h2>

          <h3>Free Tier</h3>
          <p>
            Free accounts receive 5 verdicts per month at no charge. Free accounts are limited to Quick mode and
            Clean personality mode. No credit card is required to create a free account.
          </p>

          <h3>Paid Tiers</h3>
          <p>
            Basic ($29.99/mo) and Pro ($49.99/mo) subscriptions are billed monthly in advance. All prices are in
            USD. Subscriptions automatically renew each billing cycle until cancelled.
          </p>

          <h3>Founding Member Pricing</h3>
          <p>
            Subscribers who sign up during the founding member period are eligible for a rate lock guarantee:
            your subscription price will not increase for as long as your subscription remains continuously active
            without interruption. If your subscription lapses for any reason — including failed payment, voluntary
            cancellation, or account closure — the founding member rate is forfeited and any future resubscription
            will be at the then-current price.
          </p>

          <h3>Cancellation and Refunds</h3>
          <p>
            You may cancel your subscription at any time from your account settings. Cancellation takes effect at
            the end of the current billing period. We do not provide prorated refunds for unused time within a
            billing period. In exceptional circumstances, refund requests may be submitted to{' '}
            <a href="mailto:support@verdict-app.com">support@verdict-app.com</a> and will be evaluated on a
            case-by-case basis.
          </p>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to use Verdict to:</p>
          <ul>
            <li>Generate content intended to harass, threaten, or harm any individual or group</li>
            <li>Attempt to extract, scrape, or systematically download our synthesis outputs for competitive purposes</li>
            <li>Circumvent usage limits through automated means, multiple accounts, or technical exploits</li>
            <li>Use the Service for any illegal purpose or in violation of any applicable laws</li>
            <li>Attempt to reverse-engineer, decompile, or derive the source code of the Service</li>
            <li>Resell or sublicense access to the Service without our written consent</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms without notice or refund.
          </p>

          <h2>5. Your Content and Queries</h2>
          <p>
            You retain ownership of the queries you submit to Verdict. By submitting queries, you grant us a
            limited, non-exclusive license to process them through third-party AI APIs and display results back
            to you.
          </p>
          <p>
            We may use aggregated, anonymized query data to improve our synthesis engine, scoring models, and
            product features. We will not sell your individual queries or associate them with your identity for
            third-party advertising purposes.
          </p>

          <h2>6. AI Output Disclaimer</h2>
          <p>
            Verdict synthesizes outputs from third-party AI models. These outputs may be inaccurate, incomplete,
            outdated, or inappropriate for your specific situation. The Service is not a substitute for
            professional advice — legal, medical, financial, or otherwise.
          </p>
          <p>
            We make no warranties about the accuracy, reliability, or fitness for any particular purpose of any
            AI-generated content delivered through the Service. You use AI outputs at your own risk and judgment.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            The Verdict brand, product design, synthesis methodology, scoring system, and all original content
            on this platform are the intellectual property of OPP Media Inc. You may not reproduce, copy, or
            distribute any part of the Service without our express written permission.
          </p>

          <h2>8. Third-Party Services</h2>
          <p>
            Verdict integrates with third-party AI providers (Anthropic, OpenAI, xAI) and payment processors
            (Stripe). Your use of the Service is also subject to those providers&apos; respective terms of service
            and privacy policies. We are not responsible for the availability, accuracy, or conduct of
            third-party services.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, OPP Media Inc. shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of or inability to
            use the Service, even if we have been advised of the possibility of such damages.
          </p>
          <p>
            Our total liability to you for any claim arising from these Terms or your use of the Service shall
            not exceed the amount you paid us in the three months preceding the claim.
          </p>

          <h2>10. Disclaimer of Warranties</h2>
          <p>
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or
            implied. We do not warrant that the Service will be uninterrupted, error-free, or free of harmful
            components.
          </p>

          <h2>11. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. If we make material changes, we will notify you by
            email or by prominent notice within the Service at least 14 days before the changes take effect.
            Continued use of the Service after that date constitutes acceptance of the updated Terms.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of California, without regard to conflict of law
            principles. Any disputes arising under these Terms shall be resolved in the state or federal courts
            located in Los Angeles County, California.
          </p>

          <h2>13. Contact</h2>
          <p>
            For questions about these Terms, contact us at{' '}
            <a href="mailto:support@verdict-app.com">support@verdict-app.com</a>.
          </p>
          <p>
            OPP Media Inc.<br />
            Los Angeles, California
          </p>
        </div>
      </div>
    </div>
  );
}
