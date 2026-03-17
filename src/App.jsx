import { useState, useEffect, useRef } from "react";
import logoSplash from "./assets/logo-black-bg.svg";

const C = {
  bg: "#f0eeea",
  bg2: "#e8e6e1",
  bg3: "#ffffff",
  dark: "#0d0d0d",
  dark2: "#1a1a1a",
  muted: "#888880",
  mutedLight: "#b0aea8",
  border: "rgba(13,13,13,0.1)",
  borderDark: "rgba(13,13,13,0.18)",
  white: "#ffffff",
  accent: "#0d0d0d",
};

// ── HOOKS ─────────────────────────────────────────────────
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

// ── ICONS ─────────────────────────────────────────────────
const ArrowRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ArrowUpRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
  </svg>
);
const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4m0 12v4m-6-10H2m20 0h-4m-1.34-5.66l-2.83 2.83m-3.66 3.66l-2.83 2.83m9.32 0l-2.83-2.83m-3.66-3.66L4.34 6.34"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="17" x2="21" y2="17"/>
  </svg>
);
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── SPLASH SCREEN ─────────────────────────────────────────
const SplashScreen = ({ onDone }) => {
  const [phase, setPhase] = useState("enter"); // enter → hold → exit → done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  600);   // logo fades in
    const t2 = setTimeout(() => setPhase("exit"),  2000);  // start exit after hold
    const t3 = setTimeout(() => { setPhase("done"); onDone(); }, 2900); // fully gone
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done") return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#000000",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: phase === "exit" ? "opacity 0.9s cubic-bezier(0.76,0,0.24,1), transform 0.9s cubic-bezier(0.76,0,0.24,1)" : "none",
      opacity: phase === "exit" ? 0 : 1,
      transform: phase === "exit" ? "scale(1.04)" : "scale(1)",
      pointerEvents: phase === "exit" ? "none" : "all",
    }}>
      <div style={{
        width: 240,
        opacity: phase === "enter" ? 0 : 1,
        transform: phase === "enter" ? "scale(0.88) translateY(10px)" : "scale(1) translateY(0px)",
        transition: "opacity 0.7s cubic-bezier(0.34,1.56,0.64,1), transform 0.7s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <img src={logoSplash} alt="Tension Labs" style={{ width: "100%", display: "block" }} />
      </div>
    </div>
  );
};

// ── NAVBAR ────────────────────────────────────────────────
const Navbar = ({ page, setPage, scrolled }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollTo = (id) => {
    if (page !== "home") { setPage("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 320); }
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };
  const links = [
    { label: "How It Works", action: () => scrollTo("how-it-works") },
    { label: "Services", action: () => scrollTo("services") },
    { label: "About", action: () => { setPage("about"); window.scrollTo({ top: 0 }); setMobileOpen(false); } },
    { label: "Contact", action: () => scrollTo("contact") },
  ];
  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        display: "flex", alignItems: "center", padding: "0 40px", height: 64,
        background: scrolled ? "rgba(240,238,234,0.92)" : "rgba(240,238,234,0.7)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
        transition: "all 0.4s ease",
      }}>
        <div onClick={() => { setPage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          style={{ cursor: "pointer", flex: 1 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.dark, letterSpacing: 0.2 }}>tension labs</span>
        </div>
        <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 4, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          {links.map(l => (
            <button key={l.label} onClick={l.action} style={{
              background: "none", border: "none", padding: "8px 16px", fontSize: 13.5,
              fontWeight: 400, color: C.muted, cursor: "pointer", fontFamily: "inherit",
              letterSpacing: 0.1, transition: "color 0.25s",
            }}
              onMouseEnter={e => e.target.style.color = C.dark}
              onMouseLeave={e => e.target.style.color = C.muted}
            >{l.label}</button>
          ))}
        </div>
        <div className="nav-desktop" style={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
          <button onClick={() => { setPage("book"); window.scrollTo({ top: 0 }); }} style={{
            background: C.dark, border: "none", padding: "11px 24px", borderRadius: 100,
            fontSize: 13.5, fontWeight: 500, color: C.white, cursor: "pointer",
            fontFamily: "inherit", transition: "all 0.25s",
            display: "flex", alignItems: "center", gap: 6,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#333"; e.currentTarget.style.transform = "scale(1.03)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.dark; e.currentTarget.style.transform = "scale(1)"; }}
          ><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5aff8a", display: "inline-block" }} />Book Now</button>
        </div>
        <button className="nav-mobile" onClick={() => setMobileOpen(!mobileOpen)} style={{
          display: "none", background: "none", border: "none", color: C.dark, cursor: "pointer", padding: 4,
        }}>{mobileOpen ? <XIcon /> : <MenuIcon />}</button>
      </nav>
      {mobileOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 999,
          background: "rgba(240,238,234,0.98)", backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`, padding: "16px 32px 28px",
          display: "flex", flexDirection: "column",
          animation: "slideDown 0.25s ease",
        }}>
          {links.map(l => (
            <button key={l.label} onClick={l.action} style={{
              background: "none", border: "none", borderBottom: `1px solid ${C.border}`,
              padding: "15px 0", fontSize: 16, fontWeight: 400, color: C.dark,
              cursor: "pointer", textAlign: "left", fontFamily: "inherit",
            }}>{l.label}</button>
          ))}
          <button onClick={() => { setPage("book"); window.scrollTo({ top: 0 }); setMobileOpen(false); }} style={{
            background: C.dark, border: "none", padding: "14px 0", borderRadius: 100,
            fontSize: 15, fontWeight: 500, color: C.white, cursor: "pointer",
            fontFamily: "inherit", marginTop: 16,
          }}>Book Now</button>
        </div>
      )}
    </>
  );
};

// ── FADE IN WRAPPER ───────────────────────────────────────
const FadeIn = ({ children, delay = 0, style = {} }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
      ...style,
    }}>{children}</div>
  );
};

// ── HERO ──────────────────────────────────────────────────
const Hero = ({ setPage }) => {
  const [mounted, setMounted] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const words = ["Performance.", "Precision.", "Your Game."];

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % words.length); setFade(true); }, 350);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{
      minHeight: "100vh", background: C.bg, padding: "0 40px",
      display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 80,
      position: "relative",
    }} className="hero-section">
      {/* Top meta row */}
      <div className="hero-meta" style={{
        position: "absolute", top: 80, left: 40, right: 40,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        opacity: mounted ? 1 : 0, transition: "opacity 1s ease 0.3s",
      }}>
        <span style={{ fontSize: 11, color: C.mutedLight, letterSpacing: 2.5, textTransform: "uppercase" }}>Frisco, Texas — Est. 2026</span>
        <span style={{ fontSize: 11, color: C.mutedLight, letterSpacing: 2.5, textTransform: "uppercase" }}>Professional Stringing</span>
      </div>

      <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 0.1s" }}>
        <p style={{ fontSize: 13, color: C.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 28, fontWeight: 500 }}>
          Tennis Racket Stringing
        </p>
        <h1 style={{
          fontSize: "clamp(52px, 8.5vw, 124px)", fontWeight: 800, color: C.dark,
          lineHeight: 0.96, letterSpacing: "-0.035em", margin: "0 0 52px",
          fontFamily: "inherit", marginLeft: "-3px",
        }}>
          STRUNG FOR<br />
          <span style={{
            display: "inline-block",
            opacity: fade ? 1 : 0,
            transform: fade ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
            color: C.dark,
          }}>{words[wordIdx]}</span>
        </h1>

        <div className="hero-cta" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <button onClick={() => { setPage("book"); window.scrollTo({ top: 0 }); }} style={{
            background: C.dark, border: "none", padding: "16px 36px", borderRadius: 100,
            fontSize: 14, fontWeight: 500, color: C.white, cursor: "pointer",
            fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8,
            transition: "all 0.3s ease", letterSpacing: 0.2,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#222"; e.currentTarget.style.transform = "scale(1.03)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.dark; e.currentTarget.style.transform = "scale(1)"; }}
          >Book a Stringing <ArrowUpRight size={13} /></button>

          <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} style={{
            background: "transparent", border: `1px solid ${C.borderDark}`, padding: "16px 36px", borderRadius: 100,
            fontSize: 14, fontWeight: 400, color: C.dark, cursor: "pointer",
            fontFamily: "inherit", transition: "all 0.3s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = C.dark; e.currentTarget.style.color = C.white; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.dark; }}
          >See How It Works</button>

          <div className="hero-stats" style={{ display: "flex", gap: 44, marginLeft: "auto", flexWrap: "wrap" }}>
            {[["2–3", "Day Turnaround"], ["Free", "Pickup & Delivery"], ["100%", "Satisfaction"]].map(([num, label]) => (
              <div key={label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.dark, lineHeight: 1, letterSpacing: "-0.02em" }}>{num}</div>
                <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginTop: 5 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── DIVIDER ───────────────────────────────────────────────
const Divider = () => <div className="divider" style={{ height: 1, background: C.border, margin: "0 40px" }} />;

// ── HOW IT WORKS ──────────────────────────────────────────
const HowItWorks = () => (
  <section id="how-it-works" style={{ background: C.bg, padding: "120px 40px" }} className="section-pad">
    <Divider />
    <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "80px 0 72px", flexWrap: "wrap", gap: 24 }}>
      <FadeIn>
        <p style={{ fontSize: 11, color: C.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20, fontWeight: 500 }}>Process</p>
        <h2 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, color: C.dark, lineHeight: 1.0, letterSpacing: "-0.03em" }}>
          HOW IT<br />WORKS.
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="section-header-desc" style={{ fontSize: 15, color: C.muted, maxWidth: 340, lineHeight: 1.75, textAlign: "right" }}>
          Three effortless steps to professional stringing — without leaving your home.
        </p>
      </FadeIn>
    </div>
    <div className="howitworks-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: `1px solid ${C.border}` }}>
      {[
        { num: "01", title: "Book Online", desc: "Choose your string type, tension, and pickup location in under 2 minutes." },
        { num: "02", title: "We Pick Up & String", desc: "We come to you, collect your racket, and string it with precision at our workshop." },
        { num: "03", title: "Delivered Back", desc: "Freshly strung and ready to play within 2–3 business days. No extra charge, ever." },
      ].map((s, i) => (
        <FadeIn key={i} delay={i * 0.12}>
          <div className="howitworks-step" style={{
            padding: "44px 36px 44px 0", paddingLeft: i > 0 ? 36 : 0,
            borderRight: i < 2 ? `1px solid ${C.border}` : "none",
            transition: "all 0.3s ease", cursor: "default",
          }}>
            <span style={{ fontSize: 11, color: C.mutedLight, letterSpacing: 3, fontWeight: 500 }}>{s.num}</span>
            <h3 style={{ fontSize: 19, fontWeight: 700, color: C.dark, margin: "18px 0 12px", letterSpacing: "-0.01em" }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>{s.desc}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

// ── SERVICES ──────────────────────────────────────────────
const Services = ({ setPage }) => (
  <section id="services" style={{ background: C.bg2, padding: "120px 40px" }} className="section-pad">
    <Divider />
    <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "80px 0 72px", flexWrap: "wrap", gap: 24 }}>
      <FadeIn>
        <p style={{ fontSize: 11, color: C.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20, fontWeight: 500 }}>Pricing</p>
        <h2 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, color: C.dark, lineHeight: 1.0, letterSpacing: "-0.03em" }}>
          SERVICES &<br />PRICING.
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="section-header-desc" style={{ fontSize: 15, color: C.muted, maxWidth: 340, lineHeight: 1.75, textAlign: "right" }}>
          All prices include free pickup, stringing labor, and delivery back to you.
        </p>
      </FadeIn>
    </div>
    <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
      {[
        { name: "Signature Stringing", price: "$14.99", tag: "You provide strings", desc: "Standard restringing using your own strings. Every racket gets a fresh overgrip included.", features: ["Customer-provided strings", "Fresh overgrip included", "2–3 day turnaround", "Free pickup & delivery"], highlight: false },
        { name: "Premium Stringing", price: "$14.99 + string cost", tag: "Most Popular", desc: "We source and provide the strings. Wide selection of top brands — you don't lift a finger.", features: ["We provide the strings", "Wide string selection", "Fresh overgrip included", "Free pickup & delivery"], highlight: true },
      ].map((t, i) => (
        <FadeIn key={i} delay={i * 0.15}>
          <div style={{
            background: t.highlight ? C.dark : C.white,
            borderRadius: 20, padding: "44px 40px", position: "relative",
            transition: "transform 0.35s ease, box-shadow 0.35s ease",
            boxShadow: "0 2px 20px rgba(13,13,13,0.06)",
            cursor: "default",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(13,13,13,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 20px rgba(13,13,13,0.06)"; }}
          >
            {t.highlight && (
              <span style={{ position: "absolute", top: 24, right: 24, background: "rgba(255,255,255,0.15)", color: C.white, fontSize: 10, fontWeight: 600, padding: "5px 14px", borderRadius: 100, letterSpacing: 1.5, textTransform: "uppercase" }}>{t.tag}</span>
            )}
            {!t.highlight && (
              <span style={{ position: "absolute", top: 24, right: 24, background: C.bg2, color: C.muted, fontSize: 10, fontWeight: 600, padding: "5px 14px", borderRadius: 100, letterSpacing: 1.5, textTransform: "uppercase" }}>{t.tag}</span>
            )}
            <h3 style={{ fontSize: 22, fontWeight: 700, color: t.highlight ? C.white : C.dark, marginBottom: 6, marginTop: 8, letterSpacing: "-0.01em" }}>{t.name}</h3>
            <div style={{ fontSize: 36, fontWeight: 800, color: t.highlight ? "rgba(255,255,255,0.95)" : C.dark, marginBottom: 16, letterSpacing: "-0.03em" }}>{t.price}</div>
            <p style={{ fontSize: 14, color: t.highlight ? "rgba(255,255,255,0.55)" : C.muted, lineHeight: 1.75, marginBottom: 28, paddingBottom: 28, borderBottom: `1px solid ${t.highlight ? "rgba(255,255,255,0.1)" : C.border}` }}>{t.desc}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 36 }}>
              {t.features.map((f, fi) => (
                <div key={fi} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: t.highlight ? "rgba(255,255,255,0.8)" : C.dark }}>
                  <span style={{ color: t.highlight ? "rgba(255,255,255,0.6)" : C.muted }}><CheckIcon /></span> {f}
                </div>
              ))}
            </div>
            <button onClick={() => { setPage("book"); window.scrollTo({ top: 0 }); }} style={{
              width: "100%", padding: "14px 0", borderRadius: 100,
              background: t.highlight ? C.white : C.dark,
              color: t.highlight ? C.dark : C.white,
              border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", letterSpacing: 0.3, transition: "all 0.25s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Get Started <ArrowRight size={12} /></button>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

// ── AI ADVISOR ────────────────────────────────────────────
const AIAdvisor = () => {
  const [form, setForm] = useState({ racket: "", style: "", level: "", elbow: "Healthy" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRecommendation = async () => {
    setLoading(true); setResult(null);
    const prompt = `You are an expert tennis string advisor for Tension Labs. Respond ONLY in valid JSON with no markdown, no code blocks, just raw JSON: {"stringType":"...","stringModel":"...","tension":"...","reason":"2-3 sentence explanation"}
Choose string models only from: Luxilon ALU Power 16L, Babolat RPM Blast 16, Wilson NXT 16, Tecnifibre X-One Biphase 16, Babolat VS Natural Gut 16, Head Lynx Tour 17, Solinco Hyper-G 16L.

Racket: ${form.racket || "Not specified"}
Playing Style: ${form.style || "Not specified"}
Skill Level: ${form.level || "Not specified"}
Elbow Health: ${form.elbow}

Recommend the best string setup for this player.`;

    const parseResult = (text) => {
      const cleaned = text.replace(/```json|```/gi, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON in response");
      return JSON.parse(jsonMatch[0]);
    };

    try {
      // Try Groq first (free tier, no quota issues)
      const groqKey = import.meta.env.VITE_GROQ_API_KEY;
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 500,
          temperature: 0.7,
          messages: [
            { role: "system", content: "You are an expert tennis string advisor. Always respond with raw valid JSON only, no markdown." },
            { role: "user", content: prompt },
          ],
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "";
      setResult(parseResult(text));
    } catch (err) {
      setResult({ stringType: "Error", stringModel: "Unable to generate", tension: "N/A", reason: err.message || "Something went wrong. Please try again." });
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 10,
    background: C.bg, border: `1px solid ${C.border}`,
    color: C.dark, fontSize: 14, fontFamily: "inherit", outline: "none",
    transition: "border-color 0.25s, box-shadow 0.25s", boxSizing: "border-box",
  };
  const labelStyle = { display: "block", fontSize: 10, fontWeight: 600, color: C.muted, marginBottom: 7, letterSpacing: 2, textTransform: "uppercase" };

  return (
    <section id="ai-advisor" style={{ background: C.bg, padding: "120px 40px" }} className="section-pad">
      <Divider />
      <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "80px 0 72px", flexWrap: "wrap", gap: 24 }}>
        <FadeIn>
          <p style={{ fontSize: 11, color: C.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.muted, display: "inline-block", flexShrink: 0 }} /> AI-Powered
          </p>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, color: C.dark, lineHeight: 1.0, letterSpacing: "-0.03em" }}>
            STRING<br />ADVISOR.
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="section-header-desc" style={{ fontSize: 15, color: C.muted, maxWidth: 340, lineHeight: 1.75, textAlign: "right" }}>
            Tell us about your game. Our AI recommends the perfect string setup for you.
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={0.05}>
        <div className="advisor-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Form */}
          <div style={{ background: C.white, borderRadius: 20, padding: "44px 40px", boxShadow: "0 2px 20px rgba(13,13,13,0.06)" }}>
            {[
              { label: "Your Racket", key: "racket", placeholder: "e.g. Wilson Blade 98, Babolat Pure Drive..." },
              { label: "Playing Style", key: "style", placeholder: "e.g. aggressive baseliner, all-court, serve & volley..." },
              { label: "Skill Level", key: "level", placeholder: "e.g. beginner, intermediate, advanced, 4.0 NTRP..." },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 18 }}>
                <label style={labelStyle}>{f.label}</label>
                <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = C.dark; e.target.style.boxShadow = "0 0 0 3px rgba(13,13,13,0.07)"; }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }} />
              </div>
            ))}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Elbow Health</label>
              <select value={form.elbow} onChange={e => setForm({ ...form, elbow: e.target.value })}
                style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}>
                <option>Healthy — No issues</option>
                <option>Mild discomfort</option>
                <option>Tennis elbow / Chronic pain</option>
              </select>
            </div>
            <button onClick={getRecommendation} disabled={loading} style={{
              width: "100%", padding: "15px 0", borderRadius: 100,
              background: loading ? "#555" : C.dark,
              color: C.white, border: "none", fontSize: 13, fontWeight: 600,
              cursor: loading ? "wait" : "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              transition: "all 0.25s", letterSpacing: 0.3,
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.white, display: "inline-block", flexShrink: 0 }} /> {loading ? "Analyzing your game..." : "Get My Recommendation"}
            </button>
          </div>

          {/* Result */}
          <div className="advisor-result" style={{ background: C.dark, borderRadius: 20, padding: "44px 40px", display: "flex", flexDirection: "column", justifyContent: result ? "flex-start" : "center", alignItems: result ? "flex-start" : "center", minHeight: 360 }}>
            {!result ? (
              <div style={{ textAlign: "center", opacity: 0.35 }}>
                <p style={{ fontSize: 13, color: C.white, letterSpacing: 0.5, lineHeight: 1.6 }}>Fill in the form and we'll<br />recommend your perfect setup</p>
              </div>
            ) : (
              <div style={{ animation: "fadeUp 0.5s ease", width: "100%" }}>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 32, fontWeight: 600 }}>Your Recommendation</p>
                {[{ label: "String Type", value: result.stringType }, { label: "String Model", value: result.stringModel }, { label: "Tension", value: result.tension }].map((item, i) => (
                  <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>{item.label}</div>
                    <div style={{ fontSize: 17, fontWeight: 600, color: C.white, letterSpacing: "-0.01em" }}>{item.value}</div>
                  </div>
                ))}
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginTop: 4 }}>{result.reason}</p>
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </section>
  );
};

// ── CONTACT ───────────────────────────────────────────────
const Contact = () => (
  <section id="contact" style={{ background: C.bg2, padding: "120px 40px" }} className="section-pad">
    <Divider />
    <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "80px 0 72px", flexWrap: "wrap", gap: 24 }}>
      <FadeIn>
        <p style={{ fontSize: 11, color: C.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20, fontWeight: 500 }}>Get in Touch</p>
        <h2 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, color: C.dark, lineHeight: 1.0, letterSpacing: "-0.03em" }}>
          CONTACT<br />US.
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="section-header-desc" style={{ fontSize: 15, color: C.muted, maxWidth: 340, lineHeight: 1.75, textAlign: "right" }}>
          Questions? Reach out anytime. We're happy to help with anything.
        </p>
      </FadeIn>
    </div>
    <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      {[
        { label: "Phone", value: "(555) 123-4567" },
        { label: "Email", value: "hello@tensionlabs.com" },
        { label: "Service Area", value: "Greater North Texas" },
        { label: "Turnaround", value: "2–3 Business Days" },
      ].map((item, i) => (
        <FadeIn key={i} delay={i * 0.1}>
          <div style={{
            background: C.white, borderRadius: 16, padding: "36px 28px",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            boxShadow: "0 2px 16px rgba(13,13,13,0.05)",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(13,13,13,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(13,13,13,0.05)"; }}
          >
            <div style={{ fontSize: 10, color: C.mutedLight, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: 15.5, fontWeight: 600, color: C.dark, letterSpacing: "-0.01em" }}>{item.value}</div>
          </div>
        </FadeIn>
      ))}
    </div>
  </section>
);

// ── FOOTER ────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: "40px 40px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
      <span style={{ fontWeight: 700, fontSize: 14, color: C.dark, letterSpacing: 0.2 }}>tension labs</span>
      <span style={{ fontSize: 12, color: C.mutedLight, letterSpacing: 0.2 }}>© 2026 Tension Labs Stringing — Frisco, Texas</span>
    </div>
  </footer>
);

// ── ABOUT PAGE ────────────────────────────────────────────
const AboutPage = ({ setPage }) => (
  <div style={{ paddingTop: 64, background: C.bg, minHeight: "100vh" }}>
    <section style={{ padding: "80px 40px 120px" }}>
      <button onClick={() => { setPage("home"); window.scrollTo({ top: 0 }); }} style={{
        display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
        color: C.muted, fontSize: 12, cursor: "pointer", marginBottom: 64, fontFamily: "inherit",
        letterSpacing: 1, textTransform: "uppercase", transition: "color 0.25s",
      }}
        onMouseEnter={e => e.currentTarget.style.color = C.dark}
        onMouseLeave={e => e.currentTarget.style.color = C.muted}
      ><ArrowLeft /> Back</button>

      <FadeIn>
        <p style={{ fontSize: 11, color: C.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24, fontWeight: 500 }}>Our Story</p>
        <h1 style={{ fontSize: "clamp(52px, 8vw, 100px)", fontWeight: 800, color: C.dark, lineHeight: 0.95, letterSpacing: "-0.035em", marginBottom: 80 }}>
          ABOUT<br />TENSION<br />LABS.
        </h1>
      </FadeIn>

      <div className="about-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        {[
          { label: "Who We Are", text: "We're a group of four high school tennis players from Frisco, Texas, who share a deep passion for the sport and entrepreneurship. Tension Labs was born from a simple idea: what if getting your racket strung was as convenient as ordering food delivery?" },
          { label: "Our Mission", text: "To provide every player in North Texas with access to precise, high-quality stringing that enhances their game — delivered with zero hassle. Premium stringing shouldn't require driving across town or waiting at a pro shop." },
        ].map((b, i) => (
          <FadeIn key={i} delay={i * 0.15}>
            <div style={{ background: C.white, borderRadius: 20, padding: "44px 40px", boxShadow: "0 2px 20px rgba(13,13,13,0.06)" }}>
              <p style={{ fontSize: 10, color: C.mutedLight, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 20, fontWeight: 600 }}>{b.label}</p>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8 }}>{b.text}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.2}>
        <div style={{ background: C.dark, borderRadius: 20, padding: "44px 40px", boxShadow: "0 2px 20px rgba(13,13,13,0.1)" }}>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 32, fontWeight: 600 }}>Why Choose Us</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {["Founded by competitive tennis players who understand the game", "Precision stringing with attention to every detail", "Free pickup and delivery throughout North Texas", "Quick 2–3 business day turnaround", "AI-powered string recommendations tailored to your game"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 11, fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
                <span style={{ marginTop: 3, color: "rgba(255,255,255,0.4)", flexShrink: 0 }}><CheckIcon /></span> {item}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
    <Footer />
  </div>
);

// ── BOOK PAGE ─────────────────────────────────────────────
const BookPage = ({ setPage }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "Signature Stringing", stringType: "", tension: "", racket: "", pickup: "", dropoff: "", date: "", notes: "" });
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 10,
    background: C.bg, border: `1px solid ${C.border}`,
    color: C.dark, fontSize: 14, fontFamily: "inherit", outline: "none",
    transition: "border-color 0.25s, box-shadow 0.25s", boxSizing: "border-box",
  };
  const labelStyle = { display: "block", fontSize: 10, fontWeight: 600, color: C.muted, marginBottom: 7, letterSpacing: 2, textTransform: "uppercase" };

  if (submitted) return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "120px 40px" }}>
      <div style={{ fontSize: 52, marginBottom: 24, lineHeight: 1 }}>✦</div>
      <p style={{ fontSize: 11, color: C.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20, fontWeight: 500 }}>Order Received</p>
      <h1 style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 800, color: C.dark, lineHeight: 1, letterSpacing: "-0.035em", marginBottom: 24 }}>THANK YOU.</h1>
      <p style={{ fontSize: 16, color: C.muted, maxWidth: 420, lineHeight: 1.75, marginBottom: 48 }}>
        Your stringing order has been submitted. We'll reach out soon to confirm your pickup details.
      </p>
      <button onClick={() => { setPage("home"); window.scrollTo({ top: 0 }); }} style={{
        background: C.dark, border: "none", padding: "15px 36px", borderRadius: 100,
        fontSize: 14, fontWeight: 500, color: C.white, cursor: "pointer",
        fontFamily: "inherit", transition: "opacity 0.25s",
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >Back to Home</button>
    </div>
  );

  return (
    <div style={{ paddingTop: 64, background: C.bg, minHeight: "100vh" }}>
      <section style={{ padding: "80px 40px 120px" }}>
        <button onClick={() => { setPage("home"); window.scrollTo({ top: 0 }); }} style={{
          display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
          color: C.muted, fontSize: 12, cursor: "pointer", marginBottom: 64, fontFamily: "inherit",
          letterSpacing: 1, textTransform: "uppercase", transition: "color 0.25s",
        }}
          onMouseEnter={e => e.currentTarget.style.color = C.dark}
          onMouseLeave={e => e.currentTarget.style.color = C.muted}
        ><ArrowLeft /> Back</button>

        <FadeIn>
          <div className="book-hero" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 40, marginBottom: 100 }}>
            <div style={{ flexShrink: 0 }}>
              <p style={{ fontSize: 11, color: C.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>Schedule</p>
              <h1 style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 800, color: C.dark, lineHeight: 0.95, letterSpacing: "-0.035em" }}>
                BOOK A<br />STRINGING.
              </h1>
            </div>
            <div className="book-image" style={{ width: 500, flexShrink: 0, borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 20px rgba(13,13,13,0.08)", height: 420 }}>
              <img
                src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1000&q=80"
                alt="Novak Djokovic tennis"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="book-form-wrap" style={{ display: "flex", justifyContent: "center", marginTop: 320 }}>
          <div style={{ background: C.white, borderRadius: 20, padding: "48px 44px", maxWidth: 680, width: "100%", boxShadow: "0 2px 20px rgba(13,13,13,0.06)" }}>
            <div className="book-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div><label style={labelStyle}>Full Name *</label><input style={inputStyle} placeholder="John Smith" value={form.name} onChange={e => update("name", e.target.value)} onFocus={e => { e.target.style.borderColor = C.dark; e.target.style.boxShadow = "0 0 0 3px rgba(13,13,13,0.07)"; }} onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }} /></div>
              <div><label style={labelStyle}>Phone *</label><input style={inputStyle} placeholder="(555) 123-4567" value={form.phone} onChange={e => update("phone", e.target.value)} onFocus={e => { e.target.style.borderColor = C.dark; e.target.style.boxShadow = "0 0 0 3px rgba(13,13,13,0.07)"; }} onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }} /></div>
            </div>
            <div style={{ marginTop: 18 }}><label style={labelStyle}>Email</label><input style={inputStyle} placeholder="john@example.com" value={form.email} onChange={e => update("email", e.target.value)} onFocus={e => { e.target.style.borderColor = C.dark; e.target.style.boxShadow = "0 0 0 3px rgba(13,13,13,0.07)"; }} onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }} /></div>
            <div className="book-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 18 }}>
              <div><label style={labelStyle}>Racket Brand & Model *</label><input style={inputStyle} placeholder="e.g. Wilson Blade 98" value={form.racket} onChange={e => update("racket", e.target.value)} onFocus={e => { e.target.style.borderColor = C.dark; e.target.style.boxShadow = "0 0 0 3px rgba(13,13,13,0.07)"; }} onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }} /></div>
              <div><label style={labelStyle}>Desired Tension</label><input style={inputStyle} placeholder="e.g. 55 lbs" value={form.tension} onChange={e => update("tension", e.target.value)} onFocus={e => { e.target.style.borderColor = C.dark; e.target.style.boxShadow = "0 0 0 3px rgba(13,13,13,0.07)"; }} onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }} /></div>
            </div>
            <div style={{ marginTop: 18 }}><label style={labelStyle}>Service</label><select style={{ ...inputStyle, cursor: "pointer", appearance: "none" }} value={form.service} onChange={e => update("service", e.target.value)}><option>Signature Stringing</option><option>Premium Stringing</option></select></div>
            <div style={{ marginTop: 18 }}>
              <label style={labelStyle}>String Type & Gauge</label>
              <input style={inputStyle} placeholder="e.g. Luxilon ALU Power 16L, Babolat RPM Blast 16..." value={form.stringType} onChange={e => update("stringType", e.target.value)} onFocus={e => { e.target.style.borderColor = C.dark; e.target.style.boxShadow = "0 0 0 3px rgba(13,13,13,0.07)"; }} onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }} />
              <p style={{ fontSize: 12, color: C.muted, marginTop: 6, cursor: "pointer", transition: "color 0.2s" }}
                onClick={() => { setPage("home"); setTimeout(() => document.getElementById("ai-advisor")?.scrollIntoView({ behavior: "smooth" }), 300); }}
                onMouseEnter={e => e.target.style.color = C.dark} onMouseLeave={e => e.target.style.color = C.muted}
              >→ Not sure? Use our AI Advisor on the homepage.</p>
            </div>
            <div style={{ marginTop: 18 }}><label style={labelStyle}>Pickup Location</label><input style={inputStyle} placeholder="e.g. Your home, local tennis club..." value={form.pickup} onChange={e => update("pickup", e.target.value)} onFocus={e => { e.target.style.borderColor = C.dark; e.target.style.boxShadow = "0 0 0 3px rgba(13,13,13,0.07)"; }} onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }} /></div>
            <div style={{ marginTop: 18 }}><label style={labelStyle}>Drop-Off Location</label><input style={inputStyle} placeholder="e.g. Same as pickup..." value={form.dropoff} onChange={e => update("dropoff", e.target.value)} onFocus={e => { e.target.style.borderColor = C.dark; e.target.style.boxShadow = "0 0 0 3px rgba(13,13,13,0.07)"; }} onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }} /></div>
            <div style={{ marginTop: 18 }}><label style={labelStyle}>Preferred Pickup Date</label><input type="date" style={inputStyle} value={form.date} onChange={e => update("date", e.target.value)} onFocus={e => { e.target.style.borderColor = C.dark; e.target.style.boxShadow = "0 0 0 3px rgba(13,13,13,0.07)"; }} onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }} /></div>
            <div style={{ marginTop: 18 }}><label style={labelStyle}>Additional Notes</label><textarea style={{ ...inputStyle, minHeight: 96, resize: "vertical" }} placeholder="Any special requests..." value={form.notes} onChange={e => update("notes", e.target.value)} onFocus={e => { e.target.style.borderColor = C.dark; e.target.style.boxShadow = "0 0 0 3px rgba(13,13,13,0.07)"; }} onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }} /></div>
            <button onClick={() => setSubmitted(true)} style={{
              width: "100%", padding: "15px 0", borderRadius: 100, marginTop: 28,
              background: C.dark, color: C.white, border: "none",
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              transition: "opacity 0.25s", letterSpacing: 0.3,
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Submit Order <ArrowRight size={12} /></button>
          </div>
          </div>
        </FadeIn>
      </section>
      <Footer />
    </div>
  );
};

// ── HOME PAGE ─────────────────────────────────────────────
const HomePage = ({ setPage }) => (
  <>
    <Hero setPage={setPage} />
    <HowItWorks />
    <Services setPage={setPage} />
    <AIAdvisor />
    <Contact />
    <Footer />
  </>
);

// ── APP ───────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: C.bg, minHeight: "100vh", color: C.dark, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::selection { background: rgba(13,13,13,0.12); }
        input::placeholder, textarea::placeholder { color: #bbb; }
        input[type="date"] { color-scheme: light; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
        @media (max-width: 768px) {
          /* Global section padding */
          .section-pad { padding: 80px 20px !important; }

          /* Hero */
          .hero-section { padding: 0 20px 60px !important; }
          .hero-meta { left: 20px !important; right: 20px !important; top: 72px !important; flex-direction: column !important; align-items: flex-start !important; gap: 4px !important; }
          .hero-cta { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          /* Hero stats — hide on mobile */
          .hero-stats { display: none !important; }

          /* Shared section headers */
          .section-header { flex-direction: column !important; align-items: flex-start !important; padding: 48px 0 40px !important; }
          .section-header-desc { text-align: left !important; max-width: 100% !important; }

          /* How It Works */
          .howitworks-grid { grid-template-columns: 1fr !important; border-top: none !important; }
          .howitworks-step { border-right: none !important; border-top: 1px solid rgba(13,13,13,0.1) !important; padding: 32px 0 !important; padding-left: 0 !important; }

          /* Services */
          .services-grid { grid-template-columns: 1fr !important; }

          /* AI Advisor */
          .advisor-grid { grid-template-columns: 1fr !important; }
          .advisor-result { min-height: 200px !important; }

          /* Contact */
          .contact-grid { grid-template-columns: 1fr 1fr !important; }

          /* About page */
          .about-cards { grid-template-columns: 1fr !important; }

          /* Book page */
          .book-hero { flex-direction: column !important; gap: 24px !important; margin-bottom: 40px !important; }
          /* Book page image — hide on mobile */
          .book-image { display: none !important; }
          .book-form-wrap { margin-top: 0 !important; }
          .book-form-grid { grid-template-columns: 1fr !important; }

          /* Divider */
          .divider { margin: 0 20px !important; }

          /* Navbar padding */
          nav { padding: 0 20px !important; }

          /* Footer */
          footer { padding: 32px 20px !important; }
          footer > div { flex-direction: column !important; align-items: flex-start !important; gap: 6px !important; }
        }
        @media (max-width: 480px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <div style={{
        opacity: splashDone ? 1 : 0,
        transition: "opacity 0.6s ease 0.1s",
      }}>
        <Navbar page={page} setPage={setPage} scrolled={scrolled} />
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "about" && <AboutPage setPage={setPage} />}
        {page === "book" && <BookPage setPage={setPage} />}
      </div>
    </div>
  );
}
