import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ds } from "./designSystem";

// ═══════════════════════════════════════════════════════════════
// TIMING — 65.2s @ 30fps = 1956 frames, audio-locked
// ═══════════════════════════════════════════════════════════════
export const GRAPHIFY_TOTAL = 1956;

export const BEAT = {
  hook: 0,
  problem: 180, // 6s
  reveal: 540, // 18s
  mechanism: 720, // 24s
  clip: 1020, // 34s
  numbers: 1320, // 44s
  multimodal: 1500, // 50s
  compat: 1680, // 56s
  cta: 1830, // 61s
  end: 1956, // 65.2s
} as const;

// GSAP-equivalent easing curves, mapped into Remotion's interpolate.
// power3Out, expoOut, backOut are the GSAP eases that give "premium spring" feel.
export const ease = {
  power2Out: Easing.bezier(0.165, 0.84, 0.44, 1),
  power3Out: Easing.bezier(0.215, 0.61, 0.355, 1),
  power4Out: Easing.bezier(0.165, 0.84, 0.44, 1),
  expoOut: Easing.bezier(0.19, 1, 0.22, 1),
  expoIn: Easing.bezier(0.7, 0, 0.84, 0),
  backOut: Easing.bezier(0.34, 1.56, 0.64, 1),
  inOut: Easing.bezier(0.45, 0, 0.55, 1),
};

// ═══════════════════════════════════════════════════════════════
// LIGHT IRIDESCENT GLASS PALETTE
// ═══════════════════════════════════════════════════════════════
export const C = {
  bg: "#EFEAF2",
  bgWarm: "#E9E2EE",
  bgCool: "#E4E9F2",
  ink: "#0E0E12",
  inkSoft: "#26242C",
  inkMuted: "#5A5867",
  inkDim: "#86848F",
  hairline: "rgba(15,15,22,0.08)",
  // Iridescent stops — desaturated agency-tier
  iriCyan: "#7FE8D4",
  iriViolet: "#8B7FE8",
  iriRose: "#E89BC4",
  iriGold: "#F2D88F",
  // Glass
  glassFill: "rgba(255,255,255,0.42)",
  glassFillStrong: "rgba(255,255,255,0.62)",
  glassBorder: "rgba(255,255,255,0.85)",
  glassInner: "rgba(255,255,255,0.50)",
  // Pill accents (frosted)
  violetPill: "#9D8BF2",
  tealPill: "#85DDC9",
} as const;

export const FONT = ds.font.sans;
export const MONO = ds.font.mono;

// ═══════════════════════════════════════════════════════════════
// GLASS PRIMITIVES
// ═══════════════════════════════════════════════════════════════
export const glassBase: React.CSSProperties = {
  background: C.glassFill,
  backdropFilter: "blur(32px) saturate(180%)",
  WebkitBackdropFilter: "blur(32px) saturate(180%)",
  border: `1.5px solid ${C.glassBorder}`,
  boxShadow: [
    "0 24px 48px -12px rgba(120,100,180,0.22)",
    "0 8px 16px -4px rgba(120,100,180,0.12)",
    "inset 0 1.5px 0 rgba(255,255,255,0.95)",
    "inset 0 -1px 0 rgba(255,255,255,0.30)",
  ].join(", "),
};

const SAFE_TOP = 290; // 15% of 1920
const SAFE_BOTTOM = 1500; // y where bottom 22% begins

// ═══════════════════════════════════════════════════════════════
// PERPETUAL CAUSTIC BLOBS — drift slowly, simulate iridescent reflections
// ═══════════════════════════════════════════════════════════════
export const CausticBlobs: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const blob = (
    color: string,
    size: number,
    cx: number,
    cy: number,
    speedX: number,
    speedY: number,
    phase: number,
    opacity = 0.55,
  ): React.CSSProperties => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: "50%",
    background: `radial-gradient(circle at 50% 50%, ${color} 0%, ${color}99 30%, transparent 70%)`,
    filter: "blur(120px)",
    left: cx + Math.sin(t * speedX + phase) * 220,
    top: cy + Math.cos(t * speedY + phase) * 160,
    opacity,
    pointerEvents: "none",
    willChange: "transform",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={blob(C.iriCyan, 720, 80, 220, 0.18, 0.13, 0.0, 0.7)} />
      <div style={blob(C.iriViolet, 820, 600, 540, 0.14, 0.16, 1.2, 0.65)} />
      <div style={blob(C.iriRose, 700, 200, 1100, 0.11, 0.19, 2.4, 0.55)} />
      <div style={blob(C.iriGold, 540, 720, 1500, 0.16, 0.12, 3.6, 0.4)} />
      <div style={blob(C.iriCyan, 600, 100, 1700, 0.12, 0.18, 4.2, 0.4)} />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// HAIRLINE GRID — subtle 32-cell grid for depth
// ═══════════════════════════════════════════════════════════════
export const HairlineGrid: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${C.ink} 1px, transparent 1px), linear-gradient(90deg, ${C.ink} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════
// IRIDESCENT RING — conic-gradient ring that rotates slowly
// ═══════════════════════════════════════════════════════════════
export const IridescentRing: React.FC<{
  size: number;
  thickness?: number;
  speed?: number;
  borderRadius?: number;
}> = ({ size, thickness = 4, speed = 0.5, borderRadius = 9999 }) => {
  const frame = useCurrentFrame();
  const angle = (frame * speed) % 360;
  return (
    <div
      style={{
        position: "absolute",
        inset: -thickness,
        width: size + thickness * 2,
        height: size + thickness * 2,
        borderRadius: borderRadius + thickness,
        background: `conic-gradient(from ${angle}deg, ${C.iriCyan}, ${C.iriViolet}, ${C.iriRose}, ${C.iriGold}, ${C.iriCyan})`,
        padding: thickness,
        pointerEvents: "none",
        opacity: 0.85,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: C.bg,
          borderRadius,
        }}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// GLASS CARD — double-bezel architecture
// ═══════════════════════════════════════════════════════════════
export const GlassCard: React.FC<{
  style?: React.CSSProperties;
  children?: React.ReactNode;
  radius?: number;
}> = ({ style, children, radius = 32 }) => (
  <div
    style={{
      ...glassBase,
      borderRadius: radius,
      ...style,
    }}
  >
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// EYEBROW PILL — small glass capsule with tracking-wide caps
// ═══════════════════════════════════════════════════════════════
export const EyebrowPill: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      ...glassBase,
      borderRadius: 9999,
      padding: "10px 22px",
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      fontFamily: MONO,
      fontSize: 18,
      fontWeight: 500,
      color: C.inkSoft,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
    }}
  >
    <div
      style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: C.iriViolet,
        boxShadow: `0 0 14px ${C.iriViolet}`,
      }}
    />
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// STAGGERED WORD REVEAL — fade-up with blur, GSAP-style stagger
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
  fontFamily?: string;
  highlight?: string;
  highlightColor?: string;
}> = ({
  text,
  startFrame,
  perWordDelay = 4,
  duration = 24,
  fontSize,
  fontWeight = 700,
  color = C.ink,
  letterSpacing = "-0.035em",
  lineHeight = 1.02,
  align = "left",
  fontFamily = FONT,
  highlight,
  highlightColor = C.iriViolet,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.25em",
        justifyContent:
          align === "center"
            ? "center"
            : align === "right"
              ? "flex-end"
              : "flex-start",
        textAlign: align,
        fontFamily,
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        lineHeight,
      }}
    >
      {words.map((w, i) => {
        const wordStart = startFrame + i * perWordDelay;
        const local = frame - wordStart;
        const opacity = interpolate(local, [0, duration], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease.expoOut,
        });
        const y = interpolate(local, [0, duration], [40, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease.power3Out,
        });
        const blur = interpolate(local, [0, duration], [12, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const isHighlight = highlight && w.toLowerCase().includes(highlight.toLowerCase());
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${y}px)`,
              filter: `blur(${blur}px)`,
              color: isHighlight ? highlightColor : color,
              willChange: "transform, opacity, filter",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCRAMBLE TEXT — characters resolve from random to actual
// ═══════════════════════════════════════════════════════════════
export const ScrambleText: React.FC<{
  text: string;
  startFrame: number;
  duration: number;
  fontSize: number;
  fontWeight?: number;
  color?: string;
  fontFamily?: string;
  letterSpacing?: string;
}> = ({
  text,
  startFrame,
  duration,
  fontSize,
  fontWeight = 800,
  color = C.ink,
  fontFamily = FONT,
  letterSpacing = "-0.06em",
}) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - startFrame);
  const progress = Math.min(1, local / duration);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&!*";
  const resolved = Math.floor(progress * text.length);
  const out = text
    .split("")
    .map((ch, i) => {
      if (i < resolved) return ch;
      if (ch === " ") return " ";
      const seed = (frame + i * 7) % chars.length;
      return chars[seed];
    })
    .join("");
  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        lineHeight: 1,
        whiteSpace: "pre",
      }}
    >
      {out}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COUNTER — easing number ticker
// ═══════════════════════════════════════════════════════════════
export const Counter: React.FC<{
  from: number;
  to: number;
  startFrame: number;
  duration: number;
  format?: (n: number) => string;
  style?: React.CSSProperties;
  easing?: (n: number) => number;
}> = ({ from, to, startFrame, duration, format, style, easing = ease.expoOut }) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [startFrame, startFrame + duration], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
  return <span style={style}>{format ? format(value) : Math.round(value).toString()}</span>;
};

// ═══════════════════════════════════════════════════════════════
// SCENE 1 — HOOK (0-180, 6s) — motion-art-heavy opener
// "Before you open Claude Code again, you need to see this."
// ═══════════════════════════════════════════════════════════════

// Sonar rings — concentric circles pulsing outward from center
export const SonarRings: React.FC = () => {
  const frame = useCurrentFrame();
  const rings = [0, 18, 36, 54, 72]; // staggered birth frames
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {rings.map((birth, i) => {
        const local = frame - birth;
        const cycle = local % 90; // ring lives for 90 frames
        if (local < 0) return null;
        const scale = interpolate(cycle, [0, 90], [0.05, 1.4], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease.expoOut,
        });
        const op = interpolate(cycle, [0, 30, 90], [0, 0.55, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 1400,
              height: 1400,
              borderRadius: "50%",
              border: `2px solid ${i % 2 === 0 ? C.iriViolet : C.iriCyan}`,
              transform: `scale(${scale})`,
              opacity: op,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Particle burst — small glass dots scatter outward from center
export const ParticleBurst: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 48 }, (_, i) => {
    const angle = (i / 48) * Math.PI * 2 + (i * 0.31);
    const distance = 200 + (i % 7) * 80;
    const speed = 0.7 + (i % 5) * 0.18;
    const size = 6 + (i % 4) * 4;
    const colorIdx = i % 4;
    const color = [C.iriCyan, C.iriViolet, C.iriRose, C.iriGold][colorIdx];
    const delay = (i * 0.7) % 24;
    return { angle, distance, speed, size, color, delay };
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {particles.map((p, i) => {
        const local = Math.max(0, frame - p.delay);
        // Burst out then drift slowly
        const burstProgress = interpolate(local, [0, 50], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease.expoOut,
        });
        const drift = Math.sin((frame + i * 12) * 0.04) * 12;
        const x = Math.cos(p.angle) * p.distance * burstProgress + drift;
        const y = Math.sin(p.angle) * p.distance * burstProgress * 1.4 + drift * 0.6;
        const op = interpolate(local, [0, 20, 100, 180], [0, 0.85, 0.5, 0.2], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              transform: `translate(${x}px, ${y}px)`,
              opacity: op,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Light beam sweep — diagonal iridescent ray that sweeps across
export const LightBeam: React.FC<{ delay: number; angle: number }> = ({ delay, angle }) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const progress = interpolate(local, [0, 60], [-0.3, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });
  const op = interpolate(local, [0, 12, 50, 60], [0, 0.7, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 2200,
        height: 100,
        background: `linear-gradient(90deg, transparent 0%, ${C.iriCyan}88 30%, ${C.iriViolet}cc 50%, ${C.iriRose}88 70%, transparent 100%)`,
        filter: "blur(20px)",
        transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${(progress - 0.5) * 1500}px)`,
        opacity: op,
        willChange: "transform, opacity",
      }}
    />
  );
};

// Kinetic glyph — tiny floating UI shards in background
export const FloatingGlyphs: React.FC = () => {
  const frame = useCurrentFrame();
  const glyphs = [
    { x: 120, y: 380, size: 80, delay: 4, rot: -8 },
    { x: 880, y: 340, size: 60, delay: 12, rot: 12 },
    { x: 80, y: 1240, size: 70, delay: 22, rot: 6 },
    { x: 920, y: 1280, size: 90, delay: 32, rot: -10 },
    { x: 200, y: 800, size: 50, delay: 42, rot: 14 },
    { x: 820, y: 760, size: 55, delay: 52, rot: -4 },
  ];
  return (
    <>
      {glyphs.map((g, i) => {
        const local = frame - g.delay;
        const op = interpolate(local, [0, 30], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease.expoOut,
        });
        const float = Math.sin((frame + i * 22) * 0.05) * 8;
        const scale = spring({
          frame: local,
          fps: 30,
          config: { damping: 12, stiffness: 110 },
          from: 0.6,
          to: 1,
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: g.x,
              top: g.y + float,
              width: g.size,
              height: g.size,
              borderRadius: g.size * 0.28,
              background: C.glassFill,
              backdropFilter: "blur(20px) saturate(160%)",
              WebkitBackdropFilter: "blur(20px) saturate(160%)",
              border: `1px solid ${C.glassBorder}`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), 0 8px 16px -4px rgba(120,100,180,0.18)",
              transform: `rotate(${g.rot}deg) scale(${scale})`,
              opacity: op * 0.85,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </>
  );
};

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Heavy hero-text scale-pop
  const heroScale = spring({
    frame: frame - 6,
    fps: 30,
    config: { damping: 14, stiffness: 130 },
    from: 0.7,
    to: 1,
  });
  const heroBlur = interpolate(frame, [6, 32], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });

  return (
    <AbsoluteFill>
      {/* Motion-art layer 1: sonar rings */}
      <SonarRings />

      {/* Motion-art layer 2: light beam sweeps */}
      <LightBeam delay={0} angle={-18} />
      <LightBeam delay={26} angle={22} />
      <LightBeam delay={60} angle={-12} />

      {/* Motion-art layer 3: floating glass glyphs */}
      <FloatingGlyphs />

      {/* Motion-art layer 4: particle burst */}
      <ParticleBurst />

      {/* Eyebrow */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 24,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [4, 24], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [4, 24], [16, 0], { extrapolateRight: "clamp", easing: ease.power3Out })}px)`,
        }}
      >
        <EyebrowPill>01 — heads up</EyebrowPill>
      </div>

      {/* Hero copy — center, with scale-pop + blur clear */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 64px",
          transform: `scale(${heroScale})`,
          filter: `blur(${heroBlur}px)`,
          willChange: "transform, filter",
        }}
      >
        <div style={{ width: "100%" }}>
          <StaggeredWords
            text="Before you open"
            startFrame={6}
            perWordDelay={3}
            fontSize={92}
            fontWeight={500}
            color={C.inkMuted}
            align="center"
            letterSpacing="-0.025em"
          />
          <div style={{ height: 4 }} />
          <StaggeredWords
            text="Claude Code"
            startFrame={20}
            perWordDelay={3}
            fontSize={148}
            fontWeight={800}
            color={C.ink}
            align="center"
            letterSpacing="-0.05em"
            lineHeight={1}
          />
          <div style={{ height: 4 }} />
          <StaggeredWords
            text="again,"
            startFrame={36}
            perWordDelay={3}
            fontSize={148}
            fontWeight={800}
            color={C.ink}
            align="center"
            letterSpacing="-0.05em"
            lineHeight={1}
          />
        </div>

        {/* Iridescent divider accent */}
        <div
          style={{
            width: 280,
            height: 5,
            borderRadius: 999,
            margin: "48px 0",
            background: `linear-gradient(90deg, ${C.iriCyan}, ${C.iriViolet}, ${C.iriRose})`,
            opacity: interpolate(frame, [50, 80], [0, 1], { extrapolateRight: "clamp" }),
            transform: `scaleX(${interpolate(frame, [50, 90], [0, 1], { extrapolateRight: "clamp", easing: ease.expoOut })})`,
            transformOrigin: "center",
            boxShadow: `0 0 24px ${C.iriViolet}66`,
          }}
        />

        {/* Closing line */}
        <div style={{ width: "100%" }}>
          <StaggeredWords
            text="you need to see this."
            startFrame={70}
            fontSize={76}
            fontWeight={700}
            color={C.ink}
            align="center"
            letterSpacing="-0.03em"
            highlight="see"
            highlightColor={C.iriViolet}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 2 — PROBLEM (180-540, 12s)
// "Every new session, Claude re-reads your entire codebase.
//  Thousands of tokens, gone."
// ═══════════════════════════════════════════════════════════════
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.problem;

  const tokensFrom = 200000;
  const tokensTo = 0;

  // Glass terminal panel reveal
  const panelOpacity = interpolate(local, [0, 24], [0, 1], {
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });
  const panelY = interpolate(local, [0, 30], [40, 0], {
    extrapolateRight: "clamp",
    easing: ease.power3Out,
  });

  const codeLines = [
    "src/app/(dashboard)/layout.tsx",
    "src/components/sidebar/index.tsx",
    "src/lib/auth/session.ts",
    "src/lib/db/schema.ts",
    "src/components/ui/button.tsx",
    "src/app/api/users/route.ts",
    "src/hooks/use-toast.ts",
    "src/components/forms/login.tsx",
    "src/app/page.tsx",
    "src/lib/utils.ts",
  ];

  return (
    <AbsoluteFill>
      {/* Eyebrow */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 24,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(local, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <EyebrowPill>02 — the silent drain</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 80, right: 80, top: SAFE_TOP + 110 }}>
        <StaggeredWords
          text="Every new session,"
          startFrame={BEAT.problem + 10}
          fontSize={68}
          fontWeight={500}
          color={C.inkMuted}
          align="left"
        />
        <div style={{ height: 8 }} />
        <StaggeredWords
          text="Claude re-reads your"
          startFrame={BEAT.problem + 30}
          fontSize={86}
          fontWeight={700}
          color={C.ink}
          align="left"
        />
        <StaggeredWords
          text="entire codebase."
          startFrame={BEAT.problem + 55}
          fontSize={86}
          fontWeight={700}
          color={C.ink}
          align="left"
          highlight="entire"
          highlightColor={C.iriViolet}
        />
      </div>

      {/* Glass terminal panel with cascading code */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 850,
          width: 920,
          height: 480,
          opacity: panelOpacity,
          transform: `translateY(${panelY}px)`,
          willChange: "transform",
        }}
      >
        <GlassCard radius={28} style={{ width: "100%", height: "100%", padding: 32, overflow: "hidden", position: "relative" }}>
          {/* Window controls */}
          <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FF5F57" }} />
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FEBC2E" }} />
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#28C840" }} />
            <div
              style={{
                marginLeft: "auto",
                fontFamily: MONO,
                fontSize: 14,
                color: C.inkDim,
                letterSpacing: "0.05em",
              }}
            >
              claude-code · session/new
            </div>
          </div>
          {codeLines.map((line, i) => {
            const startF = BEAT.problem + 50 + i * 8;
            const lf = frame - startF;
            const op = interpolate(lf, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const x = interpolate(lf, [0, 14], [-24, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: ease.power3Out,
            });
            // Fade out as tokens drain
            const fadeOut = interpolate(
              local,
              [180, 280],
              [1, 0.18],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div
                key={i}
                style={{
                  fontFamily: MONO,
                  fontSize: 22,
                  color: C.inkSoft,
                  marginBottom: 8,
                  opacity: op * fadeOut,
                  transform: `translateX(${x}px)`,
                  display: "flex",
                  gap: 18,
                }}
              >
                <span style={{ color: C.inkDim }}>read</span>
                <span>{line}</span>
                <span
                  style={{
                    marginLeft: "auto",
                    color: C.iriViolet,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  −{(7000 + i * 400).toLocaleString()}t
                </span>
              </div>
            );
          })}

          {/* Token counter overlay (bottom) */}
          <div
            style={{
              position: "absolute",
              left: 32,
              right: 32,
              bottom: 28,
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              borderTop: `1px solid ${C.hairline}`,
              paddingTop: 18,
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 14,
                color: C.inkDim,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
              }}
            >
              context tokens
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 38,
                fontWeight: 600,
                color: C.ink,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <Counter
                from={tokensFrom}
                to={tokensTo}
                startFrame={BEAT.problem + 110}
                duration={140}
                format={(n) => Math.round(n).toLocaleString()}
              />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* "gone." stamp at end of scene */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1380,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(local, [260, 300], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${interpolate(local, [260, 320], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.backOut })})`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 140,
            fontWeight: 800,
            color: C.ink,
            letterSpacing: "-0.06em",
            lineHeight: 1,
          }}
        >
          gone.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 3 — REVEAL (540-720, 6s)
// "It's called Graphify."
// ═══════════════════════════════════════════════════════════════
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.reveal;

  const introOpacity = interpolate(local, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(local, [30, 60], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(local, [30, 70], [50, 0], {
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });
  const titleScale = spring({
    frame: local - 30,
    fps: 30,
    config: { damping: 14, stiffness: 110 },
    from: 0.92,
    to: 1,
  });

  const ringRevealStart = 60;
  const ringSize = interpolate(local, [ringRevealStart, ringRevealStart + 40], [0, 920], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 56,
          fontWeight: 500,
          color: C.inkMuted,
          opacity: introOpacity,
          transform: `translateY(${interpolate(local, [0, 24], [16, 0], { extrapolateRight: "clamp", easing: ease.power3Out })}px)`,
          marginBottom: 28,
          letterSpacing: "-0.02em",
        }}
      >
        It's called
      </div>

      {/* Title group with iridescent ring behind */}
      <div
        style={{
          position: "relative",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px) scale(${titleScale})`,
          willChange: "transform, opacity",
        }}
      >
        {/* Conic iridescent halo */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: ringSize,
            height: ringSize,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: `conic-gradient(from ${frame * 0.6}deg, ${C.iriCyan}, ${C.iriViolet}, ${C.iriRose}, ${C.iriGold}, ${C.iriCyan})`,
            filter: "blur(80px)",
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: "relative",
            fontFamily: FONT,
            fontSize: 220,
            fontWeight: 800,
            color: C.ink,
            letterSpacing: "-0.07em",
            lineHeight: 0.9,
          }}
        >
          Graphify.
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 28,
          opacity: interpolate(local, [80, 120], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(local, [80, 120], [12, 0], { extrapolateRight: "clamp", easing: ease.power3Out })}px)`,
          fontFamily: MONO,
          fontSize: 22,
          color: C.inkMuted,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        a knowledge graph for your code
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 4 — MECHANISM (720-1020, 10s)
// "GitHub — 35,000 stars and counting." +
// "Builds a full knowledge graph"
// ═══════════════════════════════════════════════════════════════
export const KnowledgeGraph: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  // 9 nodes positioned in a constellation
  const nodes = [
    { x: 220, y: 200, r: 22, label: "auth", color: C.iriCyan },
    { x: 90, y: 360, r: 16, label: "db", color: C.iriViolet },
    { x: 380, y: 320, r: 30, label: "api", color: C.iriRose },
    { x: 540, y: 180, r: 18, label: "ui", color: C.iriGold },
    { x: 680, y: 380, r: 24, label: "hooks", color: C.iriViolet },
    { x: 280, y: 540, r: 20, label: "lib", color: C.iriCyan },
    { x: 480, y: 580, r: 16, label: "utils", color: C.iriRose },
    { x: 620, y: 540, r: 22, label: "types", color: C.iriCyan },
    { x: 160, y: 640, r: 18, label: "test", color: C.iriGold },
  ];
  const edges: [number, number][] = [
    [0, 1], [0, 2], [2, 3], [2, 4], [2, 5], [5, 6], [4, 7], [5, 8], [1, 5], [3, 4], [6, 7],
  ];

  return (
    <svg
      width={760}
      height={760}
      viewBox="0 0 760 760"
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <linearGradient id="edge-grad" x1="0" x2="1">
          <stop offset="0" stopColor={C.iriCyan} stopOpacity="0.7" />
          <stop offset="0.5" stopColor={C.iriViolet} stopOpacity="0.9" />
          <stop offset="1" stopColor={C.iriRose} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => {
        const start = startFrame + 10 + i * 4;
        const local = frame - start;
        const drawProgress = interpolate(local, [0, 28], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease.power3Out,
        });
        const x1 = nodes[a].x;
        const y1 = nodes[a].y;
        const x2 = nodes[b].x;
        const y2 = nodes[b].y;
        const midX = x1 + (x2 - x1) * drawProgress;
        const midY = y1 + (y2 - y1) * drawProgress;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={midX}
            y2={midY}
            stroke="url(#edge-grad)"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={drawProgress > 0 ? 0.8 : 0}
          />
        );
      })}
      {nodes.map((n, i) => {
        const start = startFrame + i * 5;
        const local = frame - start;
        const scale = spring({
          frame: local,
          fps: 30,
          config: { damping: 11, stiffness: 130 },
          from: 0,
          to: 1,
        });
        const pulse = 1 + Math.sin((frame + i * 12) * 0.08) * 0.04;
        return (
          <g key={i}>
            {/* Halo */}
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r * 2.2 * scale * pulse}
              fill={n.color}
              opacity={0.18}
            />
            {/* Core */}
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r * scale * pulse}
              fill="white"
              stroke={n.color}
              strokeWidth={3}
            />
            {/* Label */}
            <text
              x={n.x}
              y={n.y + n.r + 26}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={14}
              fill={C.inkMuted}
              opacity={scale}
              style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const MechanismScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.mechanism;

  // GitHub repo card with star counter — first 4s
  // Then graph nodes build — next 6s
  const cardOpacity = interpolate(local, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const cardY = interpolate(local, [0, 30], [40, 0], {
    extrapolateRight: "clamp",
    easing: ease.power3Out,
  });
  const cardExitOpacity = interpolate(local, [180, 220], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardExitY = interpolate(local, [180, 220], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.power3Out,
  });

  const graphInOpacity = interpolate(local, [180, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Eyebrow */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 24,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(local, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <EyebrowPill>03 — what it does</EyebrowPill>
      </div>

      {/* GitHub star card */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: SAFE_TOP + 130,
          opacity: cardOpacity * cardExitOpacity,
          transform: `translateY(${cardY + cardExitY}px)`,
          willChange: "transform, opacity",
        }}
      >
        <GlassCard radius={32} style={{ padding: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "#0E0E12",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Img src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)} style={{ width: 38, height: 38, filter: "invert(1)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 16,
                  color: C.inkDim,
                  letterSpacing: "0.05em",
                }}
              >
                safishamsi /
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 44,
                  fontWeight: 700,
                  color: C.ink,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                graphify
              </div>
            </div>
          </div>

          {/* Stars row */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 18,
              marginTop: 12,
              borderTop: `1px solid ${C.hairline}`,
              paddingTop: 22,
            }}
          >
            <svg width="46" height="46" viewBox="0 0 24 24" fill={C.iriGold}>
              <path d="M12 2l2.85 6.34L22 9.27l-5.4 4.69 1.69 7.23L12 17.5l-6.29 3.69L7.4 13.96 2 9.27l7.15-.93z" />
            </svg>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 88,
                fontWeight: 700,
                color: C.ink,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              <Counter
                from={0}
                to={35000}
                startFrame={BEAT.mechanism + 30}
                duration={120}
                format={(n) => Math.round(n).toLocaleString()}
              />
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 28,
                fontWeight: 500,
                color: C.inkMuted,
                marginLeft: "auto",
              }}
            >
              and counting
            </div>
          </div>

          {/* Activity sparkline */}
          <div style={{ marginTop: 32, display: "flex", gap: 6, alignItems: "flex-end" }}>
            {Array.from({ length: 28 }).map((_, i) => {
              const baseHeight = 20 + Math.abs(Math.sin(i * 0.7)) * 60 + (i / 28) * 80;
              const start = BEAT.mechanism + 60 + i * 3;
              const lf = frame - start;
              const h = interpolate(lf, [0, 18], [0, baseHeight], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: ease.expoOut,
              });
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: h,
                    background:
                      i > 22
                        ? `linear-gradient(180deg, ${C.iriViolet}, ${C.iriCyan})`
                        : `linear-gradient(180deg, ${C.inkSoft}, ${C.inkMuted})`,
                    borderRadius: 4,
                    opacity: 0.85,
                  }}
                />
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Knowledge graph (second half of scene) */}
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 600,
          opacity: graphInOpacity,
          transform: `translateY(${interpolate(local, [180, 220], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.expoOut })}px)`,
        }}
      >
        <KnowledgeGraph startFrame={BEAT.mechanism + 200} />
      </div>

      {/* Caption under graph */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1380,
          textAlign: "center",
          opacity: interpolate(local, [220, 260], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(local, [220, 260], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.power3Out })}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 56,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          Every function. Every connection.
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 56,
            fontWeight: 700,
            color: C.iriViolet,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            marginTop: 6,
          }}
        >
          Every architectural decision.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 5 — CLIP (1020-1320, 10s)
// "Now here's the trick. It doesn't re-read files. It navigates the graph."
// ═══════════════════════════════════════════════════════════════
const ClipScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.clip;

  const frameOpacity = interpolate(local, [0, 26], [0, 1], { extrapolateRight: "clamp" });
  const frameY = interpolate(local, [0, 32], [60, 0], {
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });
  const tilt = interpolate(local, [0, 50], [-2, 0], {
    extrapolateRight: "clamp",
    easing: ease.power3Out,
  });

  const clipDuration = 300; // 10s of clip

  return (
    <AbsoluteFill>
      {/* Eyebrow */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 24,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(local, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <EyebrowPill>04 — here's the trick</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 80, right: 80, top: SAFE_TOP + 110 }}>
        <StaggeredWords
          text="It doesn't re-read files."
          startFrame={BEAT.clip + 10}
          fontSize={72}
          fontWeight={600}
          color={C.inkMuted}
          align="left"
        />
        <div style={{ height: 6 }} />
        <StaggeredWords
          text="It navigates the graph."
          startFrame={BEAT.clip + 38}
          fontSize={86}
          fontWeight={800}
          color={C.ink}
          align="left"
          highlight="navigates"
          highlightColor={C.iriViolet}
        />
      </div>

      {/* Tilted glass laptop frame around clip */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 880,
          height: 540,
          opacity: frameOpacity,
          transform: `translateY(${frameY}px) rotate(${tilt}deg) perspective(1400px) rotateX(4deg)`,
          willChange: "transform",
        }}
      >
        <div
          style={{
            ...glassBase,
            borderRadius: 28,
            padding: 14,
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {/* Window controls */}
          <div style={{ display: "flex", gap: 8, padding: "4px 6px 12px" }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FF5F57" }} />
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FEBC2E" }} />
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#28C840" }} />
            <div
              style={{
                marginLeft: "auto",
                fontFamily: MONO,
                fontSize: 13,
                color: C.inkDim,
                letterSpacing: "0.05em",
              }}
            >
              /graphify .
            </div>
          </div>

          {/* Video — wrap in inner Sequence so first frame isn't frozen.
              The parent ClipScene only mounts when frame is in [BEAT.clip, BEAT.numbers],
              so we need a Sequence to reset the video's perceived time. */}
          <Sequence from={BEAT.clip} durationInFrames={clipDuration}>
            <div
              style={{
                width: "100%",
                height: "calc(100% - 28px)",
                borderRadius: 18,
                overflow: "hidden",
                background: "#0E0E12",
              }}
            >
              {/* REFERENCE-STRIP: <OffthreadVideo> removed — bring your own clip */}
            </div>
          </Sequence>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 6 — NUMBERS (1320-1500, 6s)
// "71× fewer tokens. Your $20 plan does the work of $100."
// ═══════════════════════════════════════════════════════════════
const NumbersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.numbers;

  const numScale = spring({
    frame: local,
    fps: 30,
    config: { damping: 12, stiffness: 100 },
    from: 0.6,
    to: 1,
  });
  const numOpacity = interpolate(local, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 24,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(local, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <EyebrowPill>05 — the math</EyebrowPill>
      </div>

      {/* Massive 71× ticker */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: SAFE_TOP + 160,
          textAlign: "center",
          opacity: numOpacity,
          transform: `scale(${numScale})`,
          willChange: "transform",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 480,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: "-0.08em",
            lineHeight: 0.85,
            fontVariantNumeric: "tabular-nums",
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
          }}
        >
          <Counter
            from={0}
            to={71}
            startFrame={BEAT.numbers + 10}
            duration={70}
            format={(n) => Math.round(n).toString()}
            easing={ease.expoOut}
          />
          <span
            style={{
              fontSize: 280,
              fontWeight: 500,
              color: C.iriViolet,
              marginLeft: 12,
            }}
          >
            ×
          </span>
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 48,
            fontWeight: 600,
            color: C.inkMuted,
            letterSpacing: "-0.025em",
            marginTop: 8,
          }}
        >
          fewer tokens per query
        </div>
      </div>

      {/* Plan comparison */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1240,
          display: "flex",
          alignItems: "center",
          gap: 24,
          opacity: interpolate(local, [60, 100], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(local, [60, 100], [30, 0], { extrapolateRight: "clamp", easing: ease.power3Out })}px)`,
        }}
      >
        {/* $20 card */}
        <GlassCard radius={28} style={{ flex: 1, padding: 30, textAlign: "center" }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 14,
              color: C.inkDim,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            you pay
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 96,
              fontWeight: 800,
              color: C.ink,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              marginTop: 6,
            }}
          >
            $20
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 18,
              color: C.inkMuted,
              marginTop: 4,
            }}
          >
            per month
          </div>
        </GlassCard>

        {/* Arrow */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 36,
            color: C.iriViolet,
            fontWeight: 600,
          }}
        >
          ≡
        </div>

        {/* $100 card */}
        <div style={{ flex: 1, position: "relative" }}>
          <IridescentRing size={1} thickness={2} speed={0.8} borderRadius={28} />
          <div
            style={{
              ...glassBase,
              background: C.glassFillStrong,
              borderRadius: 28,
              padding: 30,
              textAlign: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 14,
                color: C.iriViolet,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              you get
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 96,
                fontWeight: 800,
                color: C.ink,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                marginTop: 6,
                background: `linear-gradient(135deg, ${C.iriCyan}, ${C.iriViolet}, ${C.iriRose})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              $100
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 18,
                color: C.inkMuted,
                marginTop: 4,
              }}
            >
              of throughput
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 7 — MULTIMODAL (1500-1680, 6s)
// "Not just code — PDFs, screenshots, even YouTube videos."
// ═══════════════════════════════════════════════════════════════
const MultimodalTile: React.FC<{
  index: number;
  startFrame: number;
  label: string;
  detail: string;
  iconNode: React.ReactNode;
  size: { col: number; row: number };
  position: { col: number; row: number };
  accent: string;
}> = ({ index, startFrame, label, detail, iconNode, size, position, accent }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame - index * 6;
  const opacity = interpolate(local, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = spring({
    frame: local,
    fps: 30,
    config: { damping: 12, stiffness: 110 },
    from: 0.85,
    to: 1,
  });
  // Perpetual micro-pulse
  const pulse = 1 + Math.sin((frame + index * 30) * 0.04) * 0.012;

  return (
    <div
      style={{
        gridColumn: `${position.col} / span ${size.col}`,
        gridRow: `${position.row} / span ${size.row}`,
        opacity,
        transform: `scale(${scale * pulse})`,
        willChange: "transform",
      }}
    >
      <GlassCard
        radius={28}
        style={{
          width: "100%",
          height: "100%",
          padding: 28,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top-right accent dot */}
        <div
          style={{
            position: "absolute",
            top: 22,
            right: 22,
            width: 10,
            height: 10,
            borderRadius: 5,
            background: accent,
            boxShadow: `0 0 18px ${accent}`,
          }}
        />
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "rgba(255,255,255,0.65)",
            border: `1px solid ${C.hairline}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {iconNode}
        </div>
        <div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 32,
              fontWeight: 700,
              color: C.ink,
              letterSpacing: "-0.02em",
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 14,
              color: C.inkDim,
              letterSpacing: "0.05em",
              marginTop: 4,
            }}
          >
            {detail}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

const MultimodalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.multimodal;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 24,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(local, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <EyebrowPill>06 — beyond code</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 80, right: 80, top: SAFE_TOP + 110 }}>
        <StaggeredWords
          text="Not just code."
          startFrame={BEAT.multimodal + 10}
          fontSize={92}
          fontWeight={800}
          color={C.ink}
          align="left"
          letterSpacing="-0.04em"
        />
        <div style={{ height: 4 }} />
        <StaggeredWords
          text="Drop in anything."
          startFrame={BEAT.multimodal + 30}
          fontSize={68}
          fontWeight={500}
          color={C.inkMuted}
          align="left"
        />
      </div>

      {/* Bento 2.0 — asymmetric grid */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 880,
          height: 580,
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          gap: 18,
        }}
      >
        <MultimodalTile
          index={0}
          startFrame={BEAT.multimodal + 30}
          size={{ col: 4, row: 2 }}
          position={{ col: 1, row: 1 }}
          label="PDFs & papers"
          detail="citation mining"
          accent={C.iriRose}
          iconNode={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="14" x2="15" y2="14" />
              <line x1="9" y1="17" x2="13" y2="17" />
            </svg>
          }
        />
        <MultimodalTile
          index={1}
          startFrame={BEAT.multimodal + 30}
          size={{ col: 2, row: 2 }}
          position={{ col: 5, row: 1 }}
          label="Screenshots"
          detail="vision parsing"
          accent={C.iriCyan}
          iconNode={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="9" cy="9" r="2" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          }
        />
        <MultimodalTile
          index={2}
          startFrame={BEAT.multimodal + 30}
          size={{ col: 2, row: 2 }}
          position={{ col: 1, row: 3 }}
          label="YouTube"
          detail="auto-transcribe"
          accent={C.iriViolet}
          iconNode={
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="1.5">
              <rect x="2" y="5" width="20" height="14" rx="3" />
              <polygon points="10 9 15 12 10 15" fill={C.ink} />
            </svg>
          }
        />
        <MultimodalTile
          index={3}
          startFrame={BEAT.multimodal + 30}
          size={{ col: 4, row: 2 }}
          position={{ col: 3, row: 3 }}
          label="Code · 13 languages"
          detail="tree-sitter AST"
          accent={C.iriGold}
          iconNode={
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="1.5">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
              <line x1="13" y1="4" x2="11" y2="20" />
            </svg>
          }
        />
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 8 — COMPATIBILITY (1680-1830, 5s)
// "Works with Claude Code, Cursor, Codex... every assistant."
// ═══════════════════════════════════════════════════════════════
const CompatPill: React.FC<{
  label: string;
  startFrame: number;
  index: number;
  iconNode: React.ReactNode;
}> = ({ label, startFrame, index, iconNode }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame - index * 7;
  const op = interpolate(local, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = spring({
    frame: local,
    fps: 30,
    config: { damping: 11, stiffness: 130 },
    from: 0.7,
    to: 1,
  });
  // Magnetic float
  const floatY = Math.sin((frame + index * 24) * 0.04) * 6;

  return (
    <div
      style={{
        ...glassBase,
        borderRadius: 9999,
        padding: "20px 32px",
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        opacity: op,
        transform: `scale(${scale}) translateY(${floatY}px)`,
        willChange: "transform",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "rgba(255,255,255,0.7)",
          border: `1px solid ${C.hairline}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {iconNode}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 30,
          fontWeight: 600,
          color: C.ink,
          letterSpacing: "-0.02em",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const CompatScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.compat;

  const items = [
    {
      label: "Claude Code",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#D4663A">
          <path d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z" />
        </svg>
      ),
    },
    {
      label: "Cursor",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2">
          <path d="M3 3 L21 12 L13 14 L11 22 Z" fill={C.ink} />
        </svg>
      ),
    },
    {
      label: "Codex",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="1.6">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      label: "ChatGPT",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#10A37F">
          <circle cx="12" cy="12" r="9" />
        </svg>
      ),
    },
    {
      label: "Gemini",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill={C.iriCyan} />
        </svg>
      ),
    },
  ];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 24,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(local, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <EyebrowPill>07 — universal</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 80, right: 80, top: SAFE_TOP + 130, textAlign: "center" }}>
        <StaggeredWords
          text="Works with"
          startFrame={BEAT.compat + 10}
          fontSize={64}
          fontWeight={500}
          color={C.inkMuted}
          align="center"
        />
        <div style={{ height: 6 }} />
        <StaggeredWords
          text="every AI you use."
          startFrame={BEAT.compat + 28}
          fontSize={92}
          fontWeight={800}
          color={C.ink}
          align="center"
          letterSpacing="-0.04em"
          highlight="every"
          highlightColor={C.iriViolet}
        />
      </div>

      {/* Floating glass pills */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 950,
          display: "flex",
          flexWrap: "wrap",
          gap: 18,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {items.map((it, i) => (
          <CompatPill
            key={i}
            label={it.label}
            iconNode={it.icon}
            startFrame={BEAT.compat + 36}
            index={i}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 9 — CTA (1830-1956, 4.2s)
// "Comment AI below. Follow for more."
// ═══════════════════════════════════════════════════════════════
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.cta;

  const headlineOp = interpolate(local, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const headlineY = interpolate(local, [0, 28], [30, 0], {
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });

  const pillOp = interpolate(local, [20, 50], [0, 1], { extrapolateRight: "clamp" });
  const pillScale = spring({
    frame: local - 20,
    fps: 30,
    config: { damping: 12, stiffness: 100 },
    from: 0.8,
    to: 1,
  });

  const handleOp = interpolate(local, [40, 70], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Headline */}
      <div
        style={{
          opacity: headlineOp,
          transform: `translateY(${headlineY}px)`,
          textAlign: "center",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 56,
            fontWeight: 500,
            color: C.inkMuted,
            letterSpacing: "-0.02em",
          }}
        >
          Comment
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 220,
            fontWeight: 800,
            color: C.ink,
            letterSpacing: "-0.07em",
            lineHeight: 0.9,
            background: `linear-gradient(135deg, ${C.iriCyan}, ${C.iriViolet}, ${C.iriRose})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          "AI"
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 56,
            fontWeight: 500,
            color: C.inkMuted,
            letterSpacing: "-0.02em",
            marginTop: -10,
          }}
        >
          and I'll DM you the resources.
        </div>
      </div>

      {/* Iridescent pill with handle */}
      <div
        style={{
          position: "relative",
          opacity: pillOp,
          transform: `scale(${pillScale})`,
          marginTop: 20,
        }}
      >
        {/* Conic ring around pill */}
        <div
          style={{
            position: "absolute",
            inset: -3,
            borderRadius: 9999,
            background: `conic-gradient(from ${frame * 1.2}deg, ${C.iriCyan}, ${C.iriViolet}, ${C.iriRose}, ${C.iriGold}, ${C.iriCyan})`,
            filter: "blur(2px)",
            opacity: 0.8,
          }}
        />
        <div
          style={{
            ...glassBase,
            background: C.glassFillStrong,
            borderRadius: 9999,
            padding: "22px 44px",
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            position: "relative",
            opacity: handleOp,
          }}
        >
          {/* Instagram glyph */}
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="1.6">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill={C.ink} />
          </svg>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 38,
              fontWeight: 700,
              color: C.ink,
              letterSpacing: "-0.02em",
            }}
          >
            @abhishek.devini
          </div>
        </div>
      </div>

      {/* Follow line */}
      <div
        style={{
          marginTop: 36,
          opacity: interpolate(local, [60, 90], [0, 1], { extrapolateRight: "clamp" }),
          fontFamily: MONO,
          fontSize: 22,
          color: C.inkMuted,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        follow for more →
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN — orchestrate sequences with audio
// ═══════════════════════════════════════════════════════════════
export const GraphifyReel: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 30% 20%, ${C.bgWarm} 0%, ${C.bg} 50%, ${C.bgCool} 100%)`,
        width,
        height,
        overflow: "hidden",
      }}
    >
      {/* Perpetual caustic blobs — drift across entire reel */}
      <CausticBlobs />

      {/* Subtle hairline grid */}
      <HairlineGrid opacity={0.04} />

      {/* Film-grain noise (fixed, pointer-events none) */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          opacity: 0.06,
          pointerEvents: "none",
          mixBlendMode: "multiply",
        }}
      />

      {/* Scenes — conditional render (no Sequence wrap) so useCurrentFrame() inside
          each scene returns the GLOBAL frame, which matches our `local = frame - BEAT.x` math. */}
      {frame >= BEAT.hook && frame < BEAT.problem && <HookScene />}
      {frame >= BEAT.problem && frame < BEAT.reveal && <ProblemScene />}
      {frame >= BEAT.reveal && frame < BEAT.mechanism && <RevealScene />}
      {frame >= BEAT.mechanism && frame < BEAT.clip && <MechanismScene />}
      {frame >= BEAT.clip && frame < BEAT.numbers && <ClipScene />}
      {frame >= BEAT.numbers && frame < BEAT.multimodal && <NumbersScene />}
      {frame >= BEAT.multimodal && frame < BEAT.compat && <MultimodalScene />}
      {frame >= BEAT.compat && frame < BEAT.cta && <CompatScene />}
      {frame >= BEAT.cta && frame < BEAT.end && <CTAScene />}

      {/* Bottom safe-zone footer (visible from scene 2 onward) */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [180, 220], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            ...glassBase,
            borderRadius: 9999,
            padding: "10px 22px",
            fontFamily: MONO,
            fontSize: 16,
            color: C.inkSoft,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              background: C.iriViolet,
              boxShadow: `0 0 10px ${C.iriViolet}`,
            }}
          />
          @abhishek.devini
        </div>
      </div>

      {/* Audio */}
      {/* REFERENCE-STRIP: voiceover tag removed — bring your own voiceover */}
    </AbsoluteFill>
  );
};
