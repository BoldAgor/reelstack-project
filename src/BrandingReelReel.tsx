/**
 * BrandingReelReel — Glass Iridescent / graphify base
 *
 * Script: "Most business owners know the drill..." (branding/design services pitch)
 * Duration: 54.1s → 1625 frames @ 30fps
 *
 * BEAT map — locked to voiceover.mp3 via ffmpeg silence detection:
 *   hook     0      0.0s  "Most business owners know the drill..."
 *   pain     237    7.9s  "but in reality... website fails to convert"
 *   judge    528    17.6s "People will judge your business in seconds"
 *   agitate  618    20.6s "You're confusing. Outdated look..."
 *   pivot    702    23.4s "That's the specific problem that I solve."
 *   solve    756    25.2s "I create the clean social media design..."
 *   cta      1233   41.1s "If you're ready for your business..."
 *   end      1625   54.1s
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { ds } from "./designSystem";

export const BRANDING_TOTAL = 1625;

export const BEAT = {
  hook:    0,
  pain:    237,   // 7.9s  — "but in reality..."
  judge:   528,   // 17.6s — "People will judge..."
  agitate: 618,   // 20.6s — "You're confusing..."
  pivot:   702,   // 23.4s — "That's the specific problem..."
  solve:   756,   // 25.2s — "I create the clean social media design..."
  cta:     1233,  // 41.1s — "If you're ready..."
  end:     1625,  // 54.1s
} as const;

// ─── Easing ───────────────────────────────────────────────────────────────────
const ease = {
  power3Out: Easing.bezier(0.215, 0.61, 0.355, 1),
  power4Out: Easing.bezier(0.165, 0.84, 0.44, 1),
  expoOut:   Easing.bezier(0.19, 1, 0.22, 1),
  backOut:   Easing.bezier(0.34, 1.56, 0.64, 1),
};

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:              "#EFEAF2",
  ink:             "#0E0E12",
  inkSoft:         "#26242C",
  inkMuted:        "#5A5867",
  inkDim:          "#86848F",
  hairline:        "rgba(15,15,22,0.08)",
  // Brand accents
  violet:          "#8B7FE8",   // trust / solution
  rose:            "#E89BC4",   // warmth / CTA
  gold:            "#F2D88F",   // premium / result
  teal:            "#7FE8D4",   // clarity / clean
  crimson:         "#FF5C7E",   // pain / problem
  // Glass tokens
  glassFill:       "rgba(255,255,255,0.42)",
  glassFillStrong: "rgba(255,255,255,0.62)",
  glassBorder:     "rgba(255,255,255,0.86)",
} as const;

const FONT = ds.font.sans;
const MONO = ds.font.mono;

const GLASS_SHADOW = [
  "0 24px 48px -12px rgba(120,100,180,0.22)",
  "0 8px 16px -4px rgba(120,100,180,0.12)",
  "inset 0 1.5px 0 rgba(255,255,255,0.95)",
  "inset 0 -1px 0 rgba(255,255,255,0.30)",
].join(", ");

const glassBase: React.CSSProperties = {
  background: C.glassFill,
  backdropFilter: "blur(32px) saturate(180%)",
  WebkitBackdropFilter: "blur(32px) saturate(180%)",
  border: `1.5px solid ${C.glassBorder}`,
  boxShadow: GLASS_SHADOW,
};

const SAFE_TOP = 290;

// ─── Primitives ───────────────────────────────────────────────────────────────

const CausticBlobs: React.FC<{ accent?: string }> = ({ accent = C.violet }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const blob = (
    color: string, size: number, cx: number, cy: number,
    sx: number, sy: number, phase: number, op = 0.5,
  ): React.CSSProperties => ({
    position: "absolute", width: size, height: size, borderRadius: "50%",
    background: `radial-gradient(circle at 50% 50%, ${color} 0%, ${color}99 30%, transparent 70%)`,
    filter: "blur(120px)",
    left: cx + Math.sin(t * sx + phase) * 200,
    top:  cy + Math.cos(t * sy + phase) * 150,
    opacity: op, pointerEvents: "none",
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={blob(accent,    720,  80,  220, 0.18, 0.13, 0.0, 0.55)} />
      <div style={blob(C.rose,    680, 600,  540, 0.14, 0.16, 1.2, 0.40)} />
      <div style={blob(C.gold,    600, 180, 1100, 0.11, 0.19, 2.4, 0.40)} />
      <div style={blob(C.teal,    500, 720, 1500, 0.16, 0.12, 3.6, 0.30)} />
      <div style={blob(accent,    560, 100, 1700, 0.12, 0.18, 4.2, 0.35)} />
    </AbsoluteFill>
  );
};

const HairlineGrid: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `linear-gradient(${C.hairline} 1px, transparent 1px),
                        linear-gradient(90deg, ${C.hairline} 1px, transparent 1px)`,
      backgroundSize: "72px 72px",
      WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
      maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
    }} />
  </AbsoluteFill>
);

const SonarRings: React.FC<{ accent?: string; secondary?: string }> = ({
  accent = C.violet, secondary = C.rose,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {[0, 18, 36, 54, 72].map((birth, i) => {
        const local = frame - birth;
        const cycle = local % 90;
        if (local < 0) return null;
        const scale = interpolate(cycle, [0, 90], [0.05, 1.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.expoOut });
        const op = interpolate(cycle, [0, 30, 90], [0, 0.1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute", width: 1400, height: 1400, borderRadius: "50%",
            border: `2px solid ${i % 2 === 0 ? `${accent}aa` : `${secondary}aa`}`,
            transform: `scale(${scale})`, opacity: op,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

const ParticleBurst: React.FC<{ count?: number; palette?: string[] }> = ({
  count = 36, palette = [C.violet, C.rose, C.gold, C.teal],
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + i * 0.31;
        const distance = 180 + (i % 7) * 70;
        const size = 6 + (i % 4) * 4;
        const color = palette[i % palette.length];
        const delay = (i * 0.7) % 20;
        const local = Math.max(0, frame - delay);
        const burst = interpolate(local, [0, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.expoOut });
        const x = Math.cos(angle) * distance * burst;
        const y = Math.sin(angle) * distance * burst * 1.3;
        const op = interpolate(local, [0, 20, 100, 160], [0, 0.85, 0.5, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute", width: size, height: size, borderRadius: "50%",
            background: color, boxShadow: `0 0 ${size * 2}px ${color}`,
            transform: `translate(${x}px, ${y}px)`, opacity: op,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

const EyebrowPill: React.FC<{ children: React.ReactNode; dot?: string }> = ({
  children, dot = C.violet,
}) => (
  <div style={{
    ...glassBase, borderRadius: 9999, padding: "10px 22px",
    display: "inline-flex", alignItems: "center", gap: 10,
    fontFamily: MONO, fontSize: 18, fontWeight: 500,
    color: C.inkSoft, letterSpacing: "0.18em", textTransform: "uppercase",
  }}>
    <div style={{ width: 7, height: 7, borderRadius: "50%", background: dot, boxShadow: `0 0 14px ${dot}` }} />
    {children}
  </div>
);

const StaggeredWords: React.FC<{
  text: string; startFrame: number; perWordDelay?: number; duration?: number;
  fontSize: number; fontWeight?: number; color?: string;
  letterSpacing?: string; lineHeight?: number; align?: "left" | "center" | "right";
  highlight?: string; highlightColor?: string;
}> = ({
  text, startFrame, perWordDelay = 4, duration = 22,
  fontSize, fontWeight = 700, color = C.ink,
  letterSpacing = "-0.035em", lineHeight = 1.02,
  align = "left", highlight, highlightColor = C.violet,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: "0.26em",
      justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
      fontFamily: FONT, fontSize, fontWeight, color, letterSpacing, lineHeight,
    }}>
      {words.map((w, i) => {
        const ws = startFrame + i * perWordDelay;
        const local = frame - ws;
        const opacity = interpolate(local, [0, duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.expoOut });
        const y = interpolate(local, [0, duration], [36, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.power3Out });
        const blur = interpolate(local, [0, duration], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const isHl = highlight && w.toLowerCase().replace(/[^a-z]/g, "").includes(highlight.toLowerCase());
        return (
          <span key={i} style={{
            display: "inline-block", opacity,
            transform: `translateY(${y}px)`, filter: `blur(${blur}px)`,
            color: isHl ? highlightColor : color,
          }}>{w}</span>
        );
      })}
    </div>
  );
};

// ─── Scene 1: HOOK (frames 0–209, ~7s) ───────────────────────────────────────
// "Most business owners know the drill — post consistently,
//  have a clean website, look professional."
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Three "checklist" items slide in one by one
  const items = [
    { label: "Post consistently",   color: C.teal,   delay: 50 },
    { label: "Clean website",        color: C.violet, delay: 90 },
    { label: "Look professional",    color: C.gold,   delay: 130 },
  ];

  return (
    <AbsoluteFill>
      <CausticBlobs accent={C.violet} />
      <HairlineGrid />
      <SonarRings accent={C.violet} secondary={C.teal} />
      {frame < 60 && <ParticleBurst count={32} palette={[C.violet, C.teal, C.rose, C.gold]} />}

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.violet}>01 / THE DRILL</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", top: SAFE_TOP + 70, left: 60, right: 60 }}>
        <StaggeredWords
          text="Most business owners know the drill."
          startFrame={8}
          fontSize={88}
          fontWeight={800}
          letterSpacing="-0.045em"
          align="left"
          highlight="drill"
          highlightColor={C.violet}
        />
      </div>

      {/* Three checklist glass cards */}
      {items.map((item, i) => {
        const local = frame - item.delay;
        const sc = spring({ frame: local, fps: 30, config: { damping: 12, stiffness: 120 }, from: 0.6, to: 1 });
        const op = interpolate(local, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute",
            top: 780 + i * 140,
            left: 60,
            right: 60,
            ...glassBase,
            borderRadius: 20,
            padding: "22px 32px",
            display: "flex",
            alignItems: "center",
            gap: 20,
            transform: `scale(${sc})`,
            opacity: op,
            transformOrigin: "left center",
          }}>
            {/* Check mark */}
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: `${item.color}22`,
              border: `2px solid ${item.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width={20} height={20} viewBox="0 0 20 20">
                <polyline
                  points="3,10 8,15 17,5"
                  fill="none"
                  stroke={item.color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 38, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>
              {item.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Scene 2: PAIN (frames 210–479, ~9s) ─────────────────────────────────────
// "But in reality, there is never enough time
//  and you're not a designer —
//  so your social media looks inconsistent,
//  your brand feels weak, your website fails to convert."
const PainScene: React.FC = () => {
  const frame = useCurrentFrame();

  // X marks replacing checkmarks
  const painItems = [
    { label: "Never enough time",            color: C.crimson, delay: 10 },
    { label: "Not a designer",               color: C.crimson, delay: 40 },
    { label: "Inconsistent social media",    color: C.crimson, delay: 80 },
    { label: "Weak brand, zero conversions", color: C.crimson, delay: 120 },
  ];

  return (
    <AbsoluteFill>
      <CausticBlobs accent={C.crimson} />
      <HairlineGrid />
      <SonarRings accent={C.crimson} secondary={C.rose} />

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.crimson}>02 / REALITY</EyebrowPill>
      </div>

      <div style={{ position: "absolute", top: SAFE_TOP + 70, left: 60, right: 60 }}>
        <StaggeredWords
          text="But in reality…"
          startFrame={4}
          fontSize={96}
          fontWeight={800}
          letterSpacing="-0.045em"
          highlight="reality"
          highlightColor={C.crimson}
        />
      </div>

      {painItems.map((item, i) => {
        const local = frame - item.delay;
        const sc = spring({ frame: local, fps: 30, config: { damping: 11, stiffness: 130 }, from: 0.5, to: 1 });
        const op = interpolate(local, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute",
            top: 730 + i * 130,
            left: 60,
            right: 60,
            ...glassBase,
            borderRadius: 20,
            padding: "18px 28px",
            display: "flex",
            alignItems: "center",
            gap: 20,
            transform: `scale(${sc})`,
            opacity: op,
            transformOrigin: "left center",
            border: `1.5px solid ${C.crimson}55`,
            boxShadow: `${GLASS_SHADOW}, 0 0 20px ${C.crimson}22`,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: `${C.crimson}18`,
              border: `2px solid ${C.crimson}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width={18} height={18} viewBox="0 0 18 18">
                <line x1="4" y1="4" x2="14" y2="14" stroke={C.crimson} strokeWidth={2.5} strokeLinecap="round" />
                <line x1="14" y1="4" x2="4" y2="14" stroke={C.crimson} strokeWidth={2.5} strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>
              {item.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Scene 3: JUDGE (frames 480–659, ~6s) ────────────────────────────────────
// "People will judge your business in seconds — before they even read a word."
const JudgeScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Large countdown number: 3…2…1
  const countdownFrame = frame;
  const countdown = countdownFrame < 30 ? "3" : countdownFrame < 70 ? "2" : "1";
  const numScale = spring({
    frame: countdownFrame % 40,
    fps: 30,
    config: { damping: 8, stiffness: 200 },
    from: 1.4,
    to: 1,
  });

  // "seconds" label
  const secOp = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <CausticBlobs accent={C.gold} />
      <HairlineGrid />
      <SonarRings accent={C.gold} secondary={C.violet} />

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.gold}>03 / FIRST IMPRESSION</EyebrowPill>
      </div>

      {/* Hero numeral */}
      <div style={{
        position: "absolute",
        top: 520,
        left: 0, right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
      }}>
        <div style={{
          fontFamily: MONO,
          fontSize: 340,
          fontWeight: 800,
          color: C.ink,
          letterSpacing: "-0.08em",
          lineHeight: 1,
          transform: `scale(${numScale})`,
          filter: `drop-shadow(0 0 60px ${C.gold}66)`,
        }}>
          {countdown}
        </div>
        <div style={{
          fontFamily: MONO,
          fontSize: 36,
          fontWeight: 600,
          color: C.inkMuted,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          opacity: secOp,
          marginTop: -20,
        }}>
          seconds
        </div>
      </div>

      {/* Sub-copy */}
      <div style={{ position: "absolute", top: 1280, left: 60, right: 60 }}>
        <StaggeredWords
          text="People judge your business before they read a word."
          startFrame={30}
          perWordDelay={5}
          fontSize={54}
          fontWeight={700}
          letterSpacing="-0.025em"
          align="center"
          highlight="judge"
          highlightColor={C.gold}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: AGITATE (frames 660–839, ~6s) ──────────────────────────────────
// "You're confusing. Outdated look makes them lose trust instantly."
const AgitateScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle shake on "confusing" — gentle nudge, not a seizure
  const shakeAmp = interpolate(frame, [20, 35, 55], [0, 3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shakeX = Math.sin(frame * 0.5) * shakeAmp;

  return (
    <AbsoluteFill>
      <CausticBlobs accent={C.crimson} />
      <HairlineGrid />
      <SonarRings accent={C.crimson} secondary={C.rose} />


      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.crimson}>04 / THE COST</EyebrowPill>
      </div>

      {/* "You're confusing." — big + shake */}
      <div style={{
        position: "absolute",
        top: 560,
        left: 60, right: 60,
        transform: `translateX(${shakeX}px)`,
      }}>
        <StaggeredWords
          text="You're confusing."
          startFrame={6}
          fontSize={112}
          fontWeight={800}
          letterSpacing="-0.05em"
          align="left"
          highlight="confusing"
          highlightColor={C.crimson}
        />
      </div>

      {/* Outdated sub */}
      <div style={{ position: "absolute", top: 820, left: 60, right: 60 }}>
        <StaggeredWords
          text="Outdated look → lost trust."
          startFrame={40}
          perWordDelay={5}
          fontSize={64}
          fontWeight={700}
          letterSpacing="-0.03em"
          align="left"
          color={C.inkSoft}
          highlight="trust"
          highlightColor={C.crimson}
        />
      </div>

      {/* Trust broken glass card */}
      {frame > 80 && (() => {
        const local = frame - 80;
        const op = interpolate(local, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div style={{
            position: "absolute",
            top: 1060,
            left: 60, right: 60,
            ...glassBase,
            borderRadius: 24,
            padding: "32px 36px",
            opacity: op,
            border: `1.5px solid ${C.crimson}66`,
            boxShadow: `${GLASS_SHADOW}, 0 0 32px ${C.crimson}33`,
          }}>
            <div style={{
              fontFamily: FONT, fontSize: 38, fontWeight: 700,
              color: C.crimson, letterSpacing: "-0.02em", lineHeight: 1.35,
            }}>
              Visitors leave before they ever know what you offer.
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ─── Scene 5: PIVOT (frames 840–1019, ~6s) ───────────────────────────────────
// "That's the specific problem that I solve."
const PivotScene: React.FC = () => {
  const frame = useCurrentFrame();

  const cardScale = spring({ frame: frame - 10, fps: 30, config: { damping: 11, stiffness: 120 }, from: 0.5, to: 1 });
  const textOp = interpolate(frame, [20, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <CausticBlobs accent={C.violet} />
      <HairlineGrid />
      <SonarRings accent={C.violet} secondary={C.teal} />
      {frame < 50 && <ParticleBurst count={40} palette={[C.violet, C.rose, C.gold, C.teal]} />}

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.violet}>05 / THE SOLUTION</EyebrowPill>
      </div>

      {/* Large pivot statement */}
      <div style={{
        position: "absolute",
        top: 560,
        left: 0, right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          ...glassBase,
          borderRadius: 32,
          padding: "52px 60px",
          transform: `scale(${cardScale})`,
          width: 920,
          boxShadow: `${GLASS_SHADOW}, 0 0 60px ${C.violet}55`,
          border: `1.5px solid ${C.violet}66`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}>
          <div style={{
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 700,
            color: C.violet,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: textOp,
          }}>
            That's the specific problem
          </div>
          <div style={{
            fontFamily: FONT,
            fontSize: 96,
            fontWeight: 800,
            color: C.ink,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            textAlign: "center",
            opacity: textOp,
          }}>
            that <span style={{ color: C.violet }}>I solve.</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: SOLVE (frames 1020–1439, ~14s) ─────────────────────────────────
// "I create clean social media design, strong branding, and modern websites
//  that make you look trustworthy and professional online.
//  Focus on running your business. I handle the entire visual side."
const SolveScene: React.FC = () => {
  const frame = useCurrentFrame();

  const services = [
    { label: "Social Media Design", icon: "◈", color: C.teal,   delay: 30  },
    { label: "Strong Branding",     icon: "◉", color: C.violet, delay: 90  },
    { label: "Modern Websites",     icon: "◍", color: C.gold,   delay: 150 },
  ];

  return (
    <AbsoluteFill>
      <CausticBlobs accent={C.teal} />
      <HairlineGrid />
      <SonarRings accent={C.teal} secondary={C.violet} />

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.teal}>06 / WHAT I DO</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", top: SAFE_TOP + 70, left: 60, right: 60 }}>
        <StaggeredWords
          text="Clean design. Strong brand. Modern website."
          startFrame={6}
          perWordDelay={5}
          fontSize={72}
          fontWeight={800}
          letterSpacing="-0.04em"
          highlight="brand"
          highlightColor={C.violet}
        />
      </div>

      {/* Three service cards */}
      {services.map((svc, i) => {
        const local = frame - svc.delay;
        const sc = spring({ frame: local, fps: 30, config: { damping: 12, stiffness: 115 }, from: 0.5, to: 1 });
        const op = interpolate(local, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute",
            top: 840 + i * 200,
            left: 60, right: 60,
            ...glassBase,
            borderRadius: 24,
            padding: "28px 36px",
            display: "flex",
            alignItems: "center",
            gap: 28,
            transform: `scale(${sc})`,
            opacity: op,
            transformOrigin: "left center",
            border: `1.5px solid ${svc.color}55`,
            boxShadow: `${GLASS_SHADOW}, 0 0 24px ${svc.color}33`,
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: 18,
              background: `${svc.color}18`,
              border: `2px solid ${svc.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 34, color: svc.color, flexShrink: 0,
            }}>
              {svc.icon}
            </div>
            <div style={{
              fontFamily: FONT, fontSize: 42, fontWeight: 700,
              color: C.ink, letterSpacing: "-0.025em",
            }}>
              {svc.label}
            </div>
          </div>
        );
      })}

      {/* Tagline */}
      {frame > 260 && (() => {
        const local = frame - 260;
        const op = interpolate(local, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(local, [0, 30], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.power3Out });
        return (
          <div style={{
            position: "absolute",
            top: 1500,
            left: 60, right: 60,
            textAlign: "center",
            fontFamily: FONT,
            fontSize: 44,
            fontWeight: 600,
            color: C.inkSoft,
            letterSpacing: "-0.02em",
            opacity: op,
            transform: `translateY(${y}px)`,
          }}>
            Focus on your business.{" "}
            <span style={{ color: C.violet, fontWeight: 800 }}>I handle the visual side.</span>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ─── Scene 7: CTA (frames 1440–1650, ~7s) ────────────────────────────────────
// "If you're ready for your business to finally look as good as it is — send me a message."
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cardScale = spring({ frame, fps: 30, config: { damping: 11, stiffness: 110 }, from: 0.55, to: 1 });

  // Pulsing glow on CTA card
  const glowPulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill>
      <CausticBlobs accent={C.rose} />
      <HairlineGrid />
      <SonarRings accent={C.rose} secondary={C.violet} />
      {frame < 40 && <ParticleBurst count={44} palette={[C.rose, C.violet, C.gold, C.teal]} />}

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.rose}>07 / LET'S GO</EyebrowPill>
      </div>

      {/* Main CTA card */}
      <div style={{
        position: "absolute",
        top: 540,
        left: "50%",
        transform: `translateX(-50%) scale(${cardScale})`,
        width: 900,
        ...glassBase,
        borderRadius: 36,
        padding: "56px 60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
        border: `1.5px solid ${C.rose}66`,
        boxShadow: `${GLASS_SHADOW}, 0 0 ${60 * glowPulse}px ${C.rose}44`,
      }}>
        {/* Icon ring */}
        <div style={{
          width: 100, height: 100, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.rose}33, ${C.violet}22)`,
          border: `2px solid ${C.rose}88`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 48,
          boxShadow: `0 0 32px ${C.rose}55`,
        }}>
          ✦
        </div>

        <div style={{
          fontFamily: FONT,
          fontSize: 62,
          fontWeight: 800,
          color: C.ink,
          textAlign: "center",
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
        }}>
          Ready to look as good<br />
          as your business <span style={{ color: C.rose }}>is?</span>
        </div>

        {/* Send message button */}
        <div style={{
          ...glassBase,
          background: C.glassFillStrong,
          borderRadius: 14,
          padding: "16px 40px",
          fontFamily: MONO,
          fontSize: 28,
          fontWeight: 700,
          color: C.rose,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          border: `1.5px solid ${C.rose}88`,
          boxShadow: `0 0 24px ${C.rose}44`,
        }}>
          ↗ Send me a message
        </div>
      </div>

      {/* Bottom sub-copy */}
      <div style={{ position: "absolute", top: 1340, left: 60, right: 60 }}>
        <StaggeredWords
          text="Your first impression attracts serious customers."
          startFrame={50}
          perWordDelay={5}
          fontSize={46}
          fontWeight={600}
          letterSpacing="-0.02em"
          align="center"
          color={C.inkSoft}
          highlight="serious"
          highlightColor={C.rose}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─── Root composition ─────────────────────────────────────────────────────────
export const BrandingReelReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
      <Audio src={staticFile("voiceover.mp3")} />
      <Sequence from={BEAT.hook}    durationInFrames={BEAT.pain    - BEAT.hook}>    <HookScene />    </Sequence>
      <Sequence from={BEAT.pain}    durationInFrames={BEAT.judge   - BEAT.pain}>    <PainScene />    </Sequence>
      <Sequence from={BEAT.judge}   durationInFrames={BEAT.agitate - BEAT.judge}>   <JudgeScene />   </Sequence>
      <Sequence from={BEAT.agitate} durationInFrames={BEAT.pivot   - BEAT.agitate}> <AgitateScene /> </Sequence>
      <Sequence from={BEAT.pivot}   durationInFrames={BEAT.solve   - BEAT.pivot}>   <PivotScene />   </Sequence>
      <Sequence from={BEAT.solve}   durationInFrames={BEAT.cta     - BEAT.solve}>   <SolveScene />   </Sequence>
      <Sequence from={BEAT.cta}     durationInFrames={BEAT.end     - BEAT.cta}>     <CtaScene />     </Sequence>
    </AbsoluteFill>
  );
};
