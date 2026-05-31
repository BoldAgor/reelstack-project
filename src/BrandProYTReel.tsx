/**
 * BrandProYTReel — Ezeumeanya C. Branding Reel
 *
 * Platform: YouTube (1920×1080)
 * Duration: 54.1s @ 30fps = 1625 frames
 * Voiceover: public/voiceover.mp3
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ds } from "./designSystem";

// ═══════════════════════════════════════════════════════════════
// TIMING — 54.1s @ 30fps = 1625 frames
// Beats locked to public/voiceover.mp3 via ffmpeg silence detection
// ═══════════════════════════════════════════════════════════════
export const BRANDPRO_TOTAL = 1625;

export const BEATS = {
  hook:         0,
  pain:         237,
  judge:        529,
  agitate:      634,
  pivot:        755,
  solve:        841,
  cta:          1233,
  end:          1625,
} as const;

// ═══════════════════════════════════════════════════════════════
// EASING
// ═══════════════════════════════════════════════════════════════
export const ease = {
  power2Out: Easing.bezier(0.165, 0.84, 0.44, 1),
  power3Out: Easing.bezier(0.215, 0.61, 0.355, 1),
  expoOut:   Easing.bezier(0.19, 1, 0.22, 1),
  backOut:   Easing.bezier(0.34, 1.56, 0.64, 1),
  inOut:     Easing.bezier(0.45, 0, 0.55, 1),
};

// ═══════════════════════════════════════════════════════════════
// LIGHT IRIDESCENT GLASS PALETTE
// ═══════════════════════════════════════════════════════════════
export const C = {
  bg:              "#EFEAF2",
  bgWarm:          "#E9E2EE",
  bgCool:          "#E4E9F2",
  ink:             "#0E0E12",
  inkSoft:         "#26242C",
  inkMuted:        "#5A5867",
  inkDim:          "#86848F",
  hairline:        "rgba(15,15,22,0.08)",
  iriCyan:         "#7FE8D4",
  iriViolet:       "#8B7FE8",
  iriRose:         "#E89BC4",
  iriGold:         "#F2D88F",
  glassFill:       "rgba(255,255,255,0.42)",
  glassFillStrong: "rgba(255,255,255,0.62)",
  glassBorder:     "rgba(255,255,255,0.85)",
  violetPill:      "#9D8BF2",
  tealPill:        "#85DDC9",
} as const;

export const FONT = ds.font.sans;
export const MONO = ds.font.mono;

// ═══════════════════════════════════════════════════════════════
// GLASS PRIMITIVES
// ═══════════════════════════════════════════════════════════════
export const glassBase: React.CSSProperties = {
  background: "rgba(255,255,255,0.82)",
  border:     "1.5px solid rgba(255,255,255,0.95)",
  boxShadow: [
    "0 24px 48px -12px rgba(120,100,180,0.18)",
    "0 8px 16px -4px rgba(120,100,180,0.10)",
    "inset 0 1.5px 0 rgba(255,255,255,1)",
    "inset 0 -1px 0 rgba(255,255,255,0.50)",
  ].join(", "),
};

// ═══════════════════════════════════════════════════════════════
// CAUSTIC BLOBS
// ═══════════════════════════════════════════════════════════════
export const CausticBlobs: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const { width, height } = useVideoConfig();
  const blob = (
    color: string, size: number, cx: number, cy: number,
    speedX: number, speedY: number, phase: number, opacity = 0.55,
  ): React.CSSProperties => ({
    position: "absolute",
    width: size, height: size, borderRadius: "50%",
    background: `radial-gradient(circle at 50% 50%, ${color} 0%, ${color}55 40%, transparent 70%)`,
    left:    cx + Math.sin(t * speedX + phase) * (width  * 0.12),
    top:     cy + Math.cos(t * speedY + phase) * (height * 0.12),
    opacity, pointerEvents: "none",
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={blob(C.iriCyan,   720, width * 0.05,  height * 0.10, 0.18, 0.13, 0.0, 0.7)} />
      <div style={blob(C.iriViolet, 820, width * 0.50,  height * 0.30, 0.14, 0.16, 1.2, 0.65)} />
      <div style={blob(C.iriRose,   700, width * 0.20,  height * 0.55, 0.11, 0.19, 2.4, 0.55)} />
      <div style={blob(C.iriGold,   540, width * 0.70,  height * 0.70, 0.16, 0.12, 3.6, 0.4)} />
      <div style={blob(C.iriCyan,   600, width * 0.85,  height * 0.20, 0.12, 0.18, 4.2, 0.4)} />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// HAIRLINE GRID
// ═══════════════════════════════════════════════════════════════
export const HairlineGrid: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => (
  <AbsoluteFill
    style={{
      backgroundImage:  `linear-gradient(${C.ink} 1px, transparent 1px), linear-gradient(90deg, ${C.ink} 1px, transparent 1px)`,
      backgroundSize:   "60px 60px",
      opacity, pointerEvents: "none",
    }}
  />
);

// ═══════════════════════════════════════════════════════════════
// GLASS CARD
// ═══════════════════════════════════════════════════════════════
export const GlassCard: React.FC<{
  style?: React.CSSProperties;
  children?: React.ReactNode;
  radius?: number;
}> = ({ style, children, radius = 32 }) => (
  <div style={{ ...glassBase, borderRadius: radius, ...style }}>{children}</div>
);

// ═══════════════════════════════════════════════════════════════
// EYEBROW PILL
// ═══════════════════════════════════════════════════════════════
export const EyebrowPill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      ...glassBase, borderRadius: 9999, padding: "8px 20px",
      display: "inline-flex", alignItems: "center", gap: 10,
      fontFamily: MONO, fontSize: 15, fontWeight: 500,
      color: C.inkSoft, letterSpacing: "0.18em", textTransform: "uppercase",
    }}
  >
    <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.iriViolet, boxShadow: `0 0 14px ${C.iriViolet}` }} />
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// STAGGERED WORDS
// ═══════════════════════════════════════════════════════════════
export const StaggeredWords: React.FC<{
  text: string;
  startFrame: number;
  perWordDelay?: number;
  duration?: number;
  fontSize: number;
  fontWeight?: number;
  color?: string;
  letterSpacing?: string;
  lineHeight?: number;
  align?: "left" | "center" | "right";
  highlight?: string;
  highlightColor?: string;
}> = ({
  text, startFrame, perWordDelay = 4, duration = 20, fontSize, fontWeight = 700,
  color = C.ink, letterSpacing = "-0.035em", lineHeight = 1.05,
  align = "left", highlight, highlightColor = C.iriViolet,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: "0.22em",
      justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
      textAlign: align, fontFamily: FONT, fontSize, fontWeight, color, letterSpacing, lineHeight,
    }}>
      {words.map((w, i) => {
        const local = frame - (startFrame + i * perWordDelay);
        const opacity = interpolate(local, [0, duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.expoOut });
        const y       = interpolate(local, [0, duration], [32, 0],  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.power3Out });
        const isHL = highlight && w.toLowerCase().replace(/[^a-z]/g, "").includes(highlight.toLowerCase());
        return (
          <span key={i} style={{ display: "inline-block", opacity, transform: `translateY(${y}px)`, color: isHL ? highlightColor : color }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SONAR RINGS
// ═══════════════════════════════════════════════════════════════
export const SonarRings: React.FC = () => {
  const frame = useCurrentFrame();
  const rings = [0, 18, 36, 54, 72];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {rings.map((birth, i) => {
        const local = frame - birth;
        const cycle = local % 90;
        if (local < 0) return null;
        const scale = interpolate(cycle, [0, 90], [0.05, 1.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.expoOut });
        const op    = interpolate(cycle, [0, 30, 90], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute", width: 800, height: 800, borderRadius: "50%",
            border: `2px solid ${i % 2 === 0 ? C.iriViolet : C.iriCyan}`,
            transform: `scale(${scale})`, opacity: op,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// LIGHT BEAM
// ═══════════════════════════════════════════════════════════════
export const LightBeam: React.FC<{ delay: number; angle: number }> = ({ delay, angle }) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const progress = interpolate(local, [0, 60], [-0.3, 1.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.expoOut });
  const op       = interpolate(local, [0, 12, 50, 60], [0, 0.7, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", top: "50%", left: "50%", width: 2200, height: 80,
      background: `linear-gradient(90deg, transparent 0%, ${C.iriCyan}66 30%, ${C.iriViolet}aa 50%, ${C.iriRose}66 70%, transparent 100%)`,
      transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${(progress - 0.5) * 1500}px)`,
      opacity: op,
    }} />
  );
};

// ═══════════════════════════════════════════════════════════════
// FLOATING GLYPHS
// ═══════════════════════════════════════════════════════════════
export const FloatingGlyphs: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const glyphs = [
    { x: width * 0.06, y: height * 0.20, size: 80, delay: 4,  rot: -8  },
    { x: width * 0.85, y: height * 0.18, size: 60, delay: 12, rot: 12  },
    { x: width * 0.05, y: height * 0.65, size: 70, delay: 22, rot: 6   },
    { x: width * 0.87, y: height * 0.68, size: 90, delay: 32, rot: -10 },
    { x: width * 0.18, y: height * 0.42, size: 50, delay: 42, rot: 14  },
    { x: width * 0.80, y: height * 0.40, size: 55, delay: 52, rot: -4  },
  ];
  return (
    <>
      {glyphs.map((g, i) => {
        const local = frame - g.delay;
        const op    = interpolate(local, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.expoOut });
        const float = Math.sin((frame + i * 22) * 0.05) * 6;
        const scale = spring({ frame: local, fps: 30, config: { damping: 12, stiffness: 110 }, from: 0.6, to: 1 });
        return (
          <div key={i} style={{
            position: "absolute", left: g.x, top: g.y + float, width: g.size, height: g.size,
            borderRadius: g.size * 0.28, background: "rgba(255,255,255,0.80)",
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), 0 8px 16px -4px rgba(120,100,180,0.18)",
            transform: `rotate(${g.rot}deg) scale(${scale})`, opacity: op * 0.85,
          }} />
        );
      })}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// SPLIT LAYOUT HELPER — left headline | right visual (landscape)
// ═══════════════════════════════════════════════════════════════
const SplitLayout: React.FC<{
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftWidth?: number; // 0–100 percent
}> = ({ leftContent, rightContent, leftWidth = 50 }) => (
  <AbsoluteFill style={{ flexDirection: "row", display: "flex" }}>
    <div style={{ width: `${leftWidth}%`, height: "100%", padding: "60px 48px 60px 80px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 2 }}>
      {leftContent}
    </div>
    <div style={{ width: `${100 - leftWidth}%`, height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {rightContent}
    </div>
  </AbsoluteFill>
);

// ═══════════════════════════════════════════════════════════════
// SCENE 1 — HOOK (0–237, 7.9s)
// "Most business owners know the drill…"
// ═══════════════════════════════════════════════════════════════
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const heroScale = spring({ frame: frame - 6, fps: 30, config: { damping: 14, stiffness: 130 }, from: 0.7, to: 1 });

  const rightContent = (
    <>
      <SonarRings />
      <LightBeam delay={0}  angle={-18} />
      <LightBeam delay={30} angle={22}  />
      <LightBeam delay={65} angle={-12} />
      <FloatingGlyphs />
      {/* Checklist card */}
      <div style={{ transform: `scale(${heroScale})`, willChange: "transform" }}>
        <GlassCard radius={28} style={{ padding: "32px 40px", minWidth: 400 }}>
          {["Post consistently", "Clean website", "Look professional"].map((item, i) => {
            const local = frame - (40 + i * 18);
            const op = interpolate(local, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const x  = interpolate(local, [0, 18], [-20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.power3Out });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: i < 2 ? 22 : 0, opacity: op, transform: `translateX(${x}px)` }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${C.iriViolet}, ${C.iriCyan})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><polyline points="2,7 5.5,11 12,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 600, color: C.inkSoft, letterSpacing: "-0.02em" }}>{item}</span>
              </div>
            );
          })}
        </GlassCard>
      </div>
    </>
  );

  return (
    <SplitLayout
      leftWidth={52}
      leftContent={
        <>
          <div style={{ marginBottom: 24, opacity: interpolate(frame, [4, 22], [0, 1], { extrapolateRight: "clamp" }) }}>
            <EyebrowPill>01 — The reality</EyebrowPill>
          </div>
          <StaggeredWords text="Most business" startFrame={8}  fontSize={72} fontWeight={500} color={C.inkMuted} />
          <StaggeredWords text="owners know"   startFrame={20} fontSize={88} fontWeight={800} color={C.ink} lineHeight={0.98} />
          <StaggeredWords text="the drill."    startFrame={36} fontSize={88} fontWeight={800} color={C.ink} lineHeight={0.98} highlight="drill" highlightColor={C.iriViolet} />
          <div style={{ height: 20 }} />
          <StaggeredWords text="Post consistently. Clean website." startFrame={90}  fontSize={32} fontWeight={400} color={C.inkMuted} letterSpacing="-0.01em" lineHeight={1.4} />
          <StaggeredWords text="Look professional."               startFrame={160} fontSize={32} fontWeight={400} color={C.inkMuted} letterSpacing="-0.01em" />
        </>
      }
      rightContent={rightContent}
    />
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 2 — PAIN (237–529, 9.7s)
// "but in reality… brand feels weak… fails to turn visitors"
// ═══════════════════════════════════════════════════════════════
const PainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEATS.pain;

  const cardIn = (delay: number) => ({
    opacity:   interpolate(local, [delay, delay + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    transform: `translateY(${interpolate(local, [delay, delay + 22], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.power3Out })}px)`,
  });

  const pains = [
    { label: "No time",         sub: "Never enough hours in the day",     accent: C.iriRose   },
    { label: "Not a designer",  sub: "Social media looks inconsistent",   accent: C.iriViolet },
    { label: "Weak brand",      sub: "Fails to turn visitors to clients", accent: C.iriGold   },
  ];

  return (
    <SplitLayout
      leftWidth={48}
      leftContent={
        <>
          <div style={{ marginBottom: 24, opacity: interpolate(local, [0, 20], [0, 1], { extrapolateRight: "clamp" }) }}>
            <EyebrowPill>02 — The problem</EyebrowPill>
          </div>
          <StaggeredWords text="But in reality,"     startFrame={BEATS.pain + 8}  fontSize={56} fontWeight={500} color={C.inkMuted} />
          <div style={{ height: 8 }} />
          <StaggeredWords text="there's never"       startFrame={BEATS.pain + 22} fontSize={80} fontWeight={800} color={C.ink} lineHeight={0.98} />
          <StaggeredWords text="enough time"         startFrame={BEATS.pain + 34} fontSize={80} fontWeight={800} color={C.ink} lineHeight={0.98} />
          <StaggeredWords text="and you're not"      startFrame={BEATS.pain + 50} fontSize={80} fontWeight={800} color={C.ink} lineHeight={0.98} />
          <StaggeredWords text="a designer."         startFrame={BEATS.pain + 65} fontSize={80} fontWeight={800} color={C.iriViolet} lineHeight={0.98} />
        </>
      }
      rightContent={
        <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "85%" }}>
          {pains.map((p, i) => (
            <div key={i} style={cardIn(i * 40 + 20)}>
              <GlassCard radius={22} style={{ padding: "22px 28px", display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${p.accent}33`, border: `1.5px solid ${p.accent}66`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.accent, boxShadow: `0 0 12px ${p.accent}` }} />
                </div>
                <div>
                  <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>{p.label}</div>
                  <div style={{ fontFamily: FONT, fontSize: 18, color: C.inkMuted, marginTop: 2 }}>{p.sub}</div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      }
    />
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 3 — JUDGE (529–634, 3.5s)
// "People will judge your business in seconds…"
// ═══════════════════════════════════════════════════════════════
const JudgeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEATS.judge;

  const countScale = spring({ frame: local - 10, fps: 30, config: { damping: 12, stiffness: 100 }, from: 0.6, to: 1 });
  const countOp    = interpolate(local, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: 28, display: "flex", justifyContent: "center", opacity: interpolate(local, [0, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          <EyebrowPill>03 — First impressions</EyebrowPill>
        </div>
        <StaggeredWords text="People will judge"            startFrame={BEATS.judge + 8}  fontSize={72} fontWeight={500} color={C.inkMuted} align="center" />
        <StaggeredWords text="your business"               startFrame={BEATS.judge + 20} fontSize={96} fontWeight={800} color={C.ink}     align="center" lineHeight={0.98} />
        {/* Giant number */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 12, margin: "16px 0" }}>
          <div style={{ fontFamily: MONO, fontSize: 320, fontWeight: 800, color: C.ink, letterSpacing: "-0.08em", lineHeight: 0.85, opacity: countOp, transform: `scale(${countScale})` }}>
            3
          </div>
          <div style={{ fontFamily: FONT, fontSize: 80, fontWeight: 500, color: C.iriViolet, letterSpacing: "-0.03em", lineHeight: 1 }}>sec</div>
        </div>
        <StaggeredWords text="before they even read a word." startFrame={BEATS.judge + 70} fontSize={48} fontWeight={400} color={C.inkMuted} align="center" letterSpacing="-0.01em" />
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 4 — AGITATE (634–755, 4.0s)
// "You're confusing. Outdated look makes them lose trust instantly."
// ═══════════════════════════════════════════════════════════════
const AgitateScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEATS.agitate;

  const shake = Math.sin(frame * 0.5) * (interpolate(local, [0, 30, 80, 121], [0, 2, 2, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", transform: `translateX(${shake}px)` }}>
        <div style={{ marginBottom: 28, display: "flex", justifyContent: "center", opacity: interpolate(local, [0, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          <EyebrowPill>04 — The damage</EyebrowPill>
        </div>
        <StaggeredWords text="You're"    startFrame={BEATS.agitate + 6}  fontSize={88}  fontWeight={500} color={C.inkMuted} align="center" />
        <StaggeredWords text="confusing." startFrame={BEATS.agitate + 16} fontSize={160} fontWeight={800} color={C.ink}     align="center" letterSpacing="-0.06em" lineHeight={0.92} />
        <div style={{ height: 24 }} />
        <StaggeredWords text="Outdated look makes them" startFrame={BEATS.agitate + 55} fontSize={52} fontWeight={400} color={C.inkMuted} align="center" letterSpacing="-0.01em" />
        <StaggeredWords text="lose trust instantly."    startFrame={BEATS.agitate + 78} fontSize={72} fontWeight={700} color={C.iriRose}  align="center" letterSpacing="-0.03em" />
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 5 — PIVOT (755–841, 2.9s)
// "That's the specific problem that I solve."
// ═══════════════════════════════════════════════════════════════
const PivotScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEATS.pivot;

  const revealScale = spring({ frame: local - 6, fps: 30, config: { damping: 14, stiffness: 110 }, from: 0.88, to: 1 });
  const revealOp    = interpolate(local, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", opacity: revealOp, transform: `scale(${revealScale})` }}>
        <StaggeredWords text="That's the specific"   startFrame={BEATS.pivot + 8}  fontSize={60}  fontWeight={500} color={C.inkMuted} align="center" />
        <StaggeredWords text="problem"               startFrame={BEATS.pivot + 22} fontSize={160} fontWeight={800} color={C.ink}     align="center" letterSpacing="-0.06em" lineHeight={0.92} />
        <StaggeredWords text="that I solve."         startFrame={BEATS.pivot + 44} fontSize={100} fontWeight={700} color={C.iriViolet} align="center" letterSpacing="-0.04em" />
        {/* Iridescent divider */}
        <div style={{
          width: interpolate(local, [55, 86], [0, 320], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.expoOut }),
          height: 5, borderRadius: 999, margin: "28px auto 0",
          background: `linear-gradient(90deg, ${C.iriCyan}, ${C.iriViolet}, ${C.iriRose})`,
          boxShadow: `0 0 20px ${C.iriViolet}66`,
        }} />
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 6 — SOLVE (841–1233, 13.0s)
// "I create the clean social media design, strong branding,
//  and modern websites… Focus on running your business."
// ═══════════════════════════════════════════════════════════════
const SolveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEATS.solve;

  const services = [
    { label: "Social Media Design", icon: "◻", color: C.iriCyan   },
    { label: "Strong Branding",     icon: "◆", color: C.iriViolet },
    { label: "Modern Websites",     icon: "◉", color: C.iriRose   },
  ];

  return (
    <SplitLayout
      leftWidth={50}
      leftContent={
        <>
          <div style={{ marginBottom: 24, opacity: interpolate(local, [0, 20], [0, 1], { extrapolateRight: "clamp" }) }}>
            <EyebrowPill>05 — What I do</EyebrowPill>
          </div>
          <StaggeredWords text="I create the"    startFrame={BEATS.solve + 8}  fontSize={52}  fontWeight={500} color={C.inkMuted}  />
          <StaggeredWords text="clean, trustworthy" startFrame={BEATS.solve + 20} fontSize={82}  fontWeight={800} color={C.ink} lineHeight={0.98} />
          <StaggeredWords text="visual identity"  startFrame={BEATS.solve + 38} fontSize={82}  fontWeight={800} color={C.iriViolet} lineHeight={0.98} />
          <StaggeredWords text="you need online." startFrame={BEATS.solve + 58} fontSize={82}  fontWeight={800} color={C.ink}     lineHeight={0.98} />
          <div style={{ height: 20 }} />
          <StaggeredWords text="Stop struggling with what to post." startFrame={BEATS.solve + 120} fontSize={28} fontWeight={400} color={C.inkMuted} lineHeight={1.5} />
          <StaggeredWords text="Focus on running your business."    startFrame={BEATS.solve + 160} fontSize={28} fontWeight={400} color={C.inkMuted} lineHeight={1.5} />
          <StaggeredWords text="I handle the entire visual side."   startFrame={BEATS.solve + 200} fontSize={28} fontWeight={400} color={C.inkMuted} lineHeight={1.5} />
        </>
      }
      rightContent={
        <div style={{ display: "flex", flexDirection: "column", gap: 22, width: "85%" }}>
          {services.map((s, i) => {
            const delay = i * 45 + 30;
            const op = interpolate(local, [delay, delay + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const y  = interpolate(local, [delay, delay + 22], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.power3Out });
            const pulse = 1 + Math.sin((frame + i * 30) * 0.06) * 0.012;
            return (
              <div key={i} style={{ opacity: op, transform: `translateY(${y}px) scale(${pulse})` }}>
                <GlassCard radius={22} style={{ padding: "24px 32px", display: "flex", alignItems: "center", gap: 24 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: `${s.color}22`, border: `1.5px solid ${s.color}66`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, color: s.color,
                  }}>{s.icon}</div>
                  <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>{s.label}</div>
                </GlassCard>
              </div>
            );
          })}
          {/* "Your first impression attracts serious customers" badge */}
          <div style={{
            opacity: interpolate(local, [180, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `scale(${spring({ frame: local - 180, fps: 30, config: { damping: 11, stiffness: 100 }, from: 0.85, to: 1 })})`,
          }}>
            <div style={{
              ...glassBase, background: C.glassFillStrong, borderRadius: 9999,
              padding: "16px 28px", display: "inline-flex", alignItems: "center", gap: 14,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.iriGold, boxShadow: `0 0 16px ${C.iriGold}` }} />
              <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>Your first impression attracts serious customers</span>
            </div>
          </div>
        </div>
      }
    />
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 7 — CTA (1233–1625, 13.1s)
// "If you're ready… send me a message"
// ═══════════════════════════════════════════════════════════════
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEATS.cta;

  const headOp    = interpolate(local, [0, 22],  [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headY     = interpolate(local, [0, 28],  [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.expoOut });
  const pillScale = spring({ frame: local - 80, fps: 30, config: { damping: 12, stiffness: 100 }, from: 0.8, to: 1 });
  const pillOp    = interpolate(local, [80, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const msgOp     = interpolate(local, [140, 175], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const msgScale  = spring({ frame: local - 140, fps: 30, config: { damping: 11, stiffness: 120 }, from: 0.85, to: 1 });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Background light rings */}
      <SonarRings />

      <div style={{ textAlign: "center", zIndex: 2 }}>
        {/* Eyebrow */}
        <div style={{ marginBottom: 28, display: "flex", justifyContent: "center", opacity: interpolate(local, [0, 18], [0, 1], { extrapolateRight: "clamp" }) }}>
          <EyebrowPill>06 — Ready?</EyebrowPill>
        </div>

        {/* Main headline */}
        <div style={{ opacity: headOp, transform: `translateY(${headY}px)` }}>
          <StaggeredWords text="If you're ready for" startFrame={BEATS.cta + 10} fontSize={64}  fontWeight={500} color={C.inkMuted} align="center" />
          <StaggeredWords text="your business to"   startFrame={BEATS.cta + 24} fontSize={96}  fontWeight={800} color={C.ink}     align="center" lineHeight={0.98} />
          <StaggeredWords text="finally look as"    startFrame={BEATS.cta + 40} fontSize={96}  fontWeight={800} color={C.ink}     align="center" lineHeight={0.98} />
          <StaggeredWords text="good as it is,"     startFrame={BEATS.cta + 55} fontSize={96}  fontWeight={800} color={C.iriViolet} align="center" lineHeight={0.98} />
        </div>

        <div style={{ height: 32 }} />

        {/* CTA pill */}
        <div style={{ opacity: pillOp, transform: `scale(${pillScale})`, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative" }}>
            {/* Conic ring */}
            <div style={{
              position: "absolute", inset: -3, borderRadius: 9999,
              background: `conic-gradient(from ${frame * 1.2}deg, ${C.iriCyan}, ${C.iriViolet}, ${C.iriRose}, ${C.iriGold}, ${C.iriCyan})`,
              filter: "blur(2px)", opacity: 0.8,
            }} />
            <div style={{
              ...glassBase, background: C.glassFillStrong, borderRadius: 9999,
              padding: "22px 52px", position: "relative", display: "inline-flex", alignItems: "center", gap: 18,
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.inkSoft} strokeWidth="1.8">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span style={{ fontFamily: FONT, fontSize: 40, fontWeight: 700, color: C.ink, letterSpacing: "-0.025em" }}>Send me a message</span>
            </div>
          </div>
        </div>

        {/* Handle */}
        <div style={{ marginTop: 36, opacity: msgOp, transform: `scale(${msgScale})` }}>
          <div style={{
            ...glassBase, borderRadius: 9999, padding: "14px 32px",
            display: "inline-flex", alignItems: "center", gap: 14,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.inkSoft} strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill={C.inkSoft} />
            </svg>
            <span style={{ fontFamily: FONT, fontSize: 30, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>@ezeumeanyac</span>
          </div>
        </div>

        {/* Tagline */}
        <div style={{
          marginTop: 22,
          opacity: interpolate(local, [190, 220], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          fontFamily: MONO, fontSize: 17, color: C.inkDim, letterSpacing: "0.2em", textTransform: "uppercase",
        }}>
          Graphic Design · Branding · Web Development
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
export const BrandProYTReel: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 30% 20%, ${C.bgWarm} 0%, ${C.bg} 50%, ${C.bgCool} 100%)`,
        width, height, overflow: "hidden",
      }}
    >
      <CausticBlobs />


      {/* Scenes */}
      {frame >= BEATS.hook    && frame < BEATS.pain    && <HookScene    />}
      {frame >= BEATS.pain    && frame < BEATS.judge   && <PainScene    />}
      {frame >= BEATS.judge   && frame < BEATS.agitate && <JudgeScene   />}
      {frame >= BEATS.agitate && frame < BEATS.pivot   && <AgitateScene />}
      {frame >= BEATS.pivot   && frame < BEATS.solve   && <PivotScene   />}
      {frame >= BEATS.solve   && frame < BEATS.cta     && <SolveScene   />}
      {frame >= BEATS.cta     && frame < BEATS.end     && <CtaScene     />}

      {/* Footer handle */}
      <div style={{
        position: "absolute", bottom: 28, left: 0, right: 0,
        display: "flex", justifyContent: "center",
        opacity: interpolate(frame, [BEATS.pain, BEATS.pain + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{
          ...glassBase, borderRadius: 9999, padding: "8px 20px",
          fontFamily: MONO, fontSize: 14, color: C.inkSoft, letterSpacing: "0.18em", textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: C.iriViolet, boxShadow: `0 0 8px ${C.iriViolet}` }} />
          Ezeumeanya C. · Graphic Designer · Awka, Nigeria
        </div>
      </div>

      {/* Voiceover */}
      <Audio src={staticFile("voiceover.mp3")} />
    </AbsoluteFill>
  );
};
