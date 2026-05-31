/**
 * GstackBrandReel — scaffolded by ReelStack v1.4
 *
 * Family:    glass
 * Preset:    gstack
 * Source:    reference/glass/gstack.tsx
 * Cloned at: 2026-05-31T13:53:08.522Z
 *
 * This file is a faithful clone of the production GstackReel
 * — same motion vocabulary, palette, and scene structure. Canonical Devini
 * Labs hook / sub / CTA strings are still in place. REPLACE them with your
 * own content before publishing. The motion floor (≥4 layers in opener,
 * ≥3 in anchor scenes) is preserved.
 *
 * Next steps:
 *   1. Replace the hero hook, sub, and CTA copy with your reel's narrative.
 *   2. Run `/reelstack-beats <vo.wav>` to lock motion to your voiceover.
 *   3. Look for REFERENCE-STRIP markers and swap in your assets.
 *   4. Run `/reelstack-lint src/GstackBrandReel.tsx` and address any errors.
 */
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
// TIMING — 94.0s @ 30fps = 2820 frames, audio-locked via Whisper transcript
// ═══════════════════════════════════════════════════════════════
export const GSTACK_TOTAL = 2820;

export const BEAT = {
  hook: 0,         // 0.0s  — "The president of YC just open-sourced his entire Claude Code setup."
  reveal: 165,     // 5.5s  — "The repo is called gstack."
  pitch: 222,      // 7.4s  — "You install it once...23 specialists...each one with their own job."
  officeHours: 542,// 18.08s — "Here's what blew my mind. /office-hours...AI pushes back."
  reframe: 780,    // 26.0s — "Like, you say...daily briefing app...chief of staff AI...reframes."
  qa: 1065,        // 35.5s — "Then there's /QA. Opens a real Chrome browser...by itself."
  cso: 1418,       // 47.28s — "/CSO runs a full OWASP security audit...for free."
  parallel: 1754,  // 58.48s — "And here's the unhinged part. 10 to 15 in parallel...same time."
  garry: 2115,     // 70.5s — "Built by Garry Tan...800× faster...same guy. Different tooling."
  cta: 2580,       // 86.0s — "It's free. MIT. 85,000 stars. Check the pinned comment."
  end: 2820,
} as const;

// GSAP-equivalent eases mapped into Remotion
export const ease = {
  power2Out: Easing.bezier(0.165, 0.84, 0.44, 1),
  power3Out: Easing.bezier(0.215, 0.61, 0.355, 1),
  expoOut: Easing.bezier(0.19, 1, 0.22, 1),
  expoIn: Easing.bezier(0.7, 0, 0.84, 0),
  backOut: Easing.bezier(0.34, 1.56, 0.64, 1),
  inOut: Easing.bezier(0.45, 0, 0.55, 1),
};

// ═══════════════════════════════════════════════════════════════
// LIGHT IRIDESCENT GLASS PALETTE — agency-tier, desaturated
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
  iriCyan: "#7FE8D4",
  iriViolet: "#8B7FE8",
  iriRose: "#E89BC4",
  iriGold: "#F2D88F",
  glassFill: "rgba(255,255,255,0.42)",
  glassFillStrong: "rgba(255,255,255,0.62)",
  glassBorder: "rgba(255,255,255,0.85)",
  ycOrange: "#F26625",
  emerald: "#34D399",
  rose: "#FB7185",
} as const;

export const FONT = ds.font.sans;
export const MONO = ds.font.mono;

// Glass primitive
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

// Reels safe zones (1080×1920)
const SAFE_TOP = 290;     // 15% top reserved for IG chrome
const SAFE_BOTTOM = 1500; // bottom 22% reserved

// ═══════════════════════════════════════════════════════════════
// GLOBAL ATMOSPHERE — caustic blobs, hairline grid, grain
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

export const HairlineGrid: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${C.ink} 1px, transparent 1px), linear-gradient(90deg, ${C.ink} 1px, transparent 1px)`,
      backgroundSize: "60px 60px",
      opacity,
      pointerEvents: "none",
    }}
  />
);

// ═══════════════════════════════════════════════════════════════
// PRIMITIVES — IridescentRing, GlassCard, EyebrowPill
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
      <div style={{ width: "100%", height: "100%", background: C.bg, borderRadius }} />
    </div>
  );
};

export const GlassCard: React.FC<{
  style?: React.CSSProperties;
  children?: React.ReactNode;
  radius?: number;
}> = ({ style, children, radius = 32 }) => (
  <div style={{ ...glassBase, borderRadius: radius, ...style }}>{children}</div>
);

export const EyebrowPill: React.FC<{ children: React.ReactNode; dotColor?: string }> = ({
  children,
  dotColor = C.iriViolet,
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
        background: dotColor,
        boxShadow: `0 0 14px ${dotColor}`,
      }}
    />
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// STAGGERED WORDS — fade-up with blur-clear (GSAP-style stagger)
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
          align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
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
        const isHighlight =
          highlight && w.toLowerCase().replace(/[.,]/g, "").includes(highlight.toLowerCase());
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
// COUNTER — easing number ticker, tabular nums
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
  const v = interpolate(frame, [startFrame, startFrame + duration], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
  return <span style={style}>{format ? format(v) : Math.round(v).toString()}</span>;
};

// ═══════════════════════════════════════════════════════════════
// MOTION-ART OPENERS — sonar, particles, beams, glyphs
// ═══════════════════════════════════════════════════════════════
export const SonarRings: React.FC<{ centerY?: number }> = ({ centerY }) => {
  const frame = useCurrentFrame();
  const rings = [0, 18, 36, 54, 72];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: centerY ? "flex-start" : "center" }}>
      {rings.map((birth, i) => {
        const local = frame - birth;
        if (local < 0) return null;
        const cycle = local % 90;
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
              top: centerY ?? "50%",
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

export const ParticleBurst: React.FC<{ count?: number }> = ({ count = 48 }) => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + i * 0.31;
    const distance = 200 + (i % 7) * 80;
    const size = 6 + (i % 4) * 4;
    const colorIdx = i % 4;
    const color = [C.iriCyan, C.iriViolet, C.iriRose, C.iriGold][colorIdx];
    const delay = (i * 0.7) % 24;
    return { angle, distance, size, color, delay };
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {particles.map((p, i) => {
        const local = Math.max(0, frame - p.delay);
        const burst = interpolate(local, [0, 50], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease.expoOut,
        });
        const drift = Math.sin((frame + i * 12) * 0.04) * 12;
        const x = Math.cos(p.angle) * p.distance * burst + drift;
        const y = Math.sin(p.angle) * p.distance * burst * 1.4 + drift * 0.6;
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
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.85), 0 8px 16px -4px rgba(120,100,180,0.18)",
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

// ═══════════════════════════════════════════════════════════════
// YC SIGIL — orange Y mark on glass (motion-art accent)
// ═══════════════════════════════════════════════════════════════
export const YCSigil: React.FC<{ size?: number }> = ({ size = 96 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.18,
      background: C.ycOrange,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#FFF",
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: size * 0.5,
      letterSpacing: "-0.04em",
      boxShadow: `0 12px 28px -8px ${C.ycOrange}99, inset 0 1px 0 rgba(255,255,255,0.4)`,
    }}
  >
    Y
  </div>
);

// ═══════════════════════════════════════════════════════════════
// SCENE 1 — HOOK (0-180, 6s)
// "The president of Y Combinator just open sourced his entire Claude Code setup."
// ═══════════════════════════════════════════════════════════════
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

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

  // YC sigil floats top-right, scale-pops at 18f
  const ycScale = spring({
    frame: frame - 18,
    fps: 30,
    config: { damping: 11, stiffness: 130 },
    from: 0,
    to: 1,
  });
  const ycFloat = Math.sin(frame * 0.05) * 10;

  return (
    <AbsoluteFill>
      <SonarRings />
      <LightBeam delay={0} angle={-18} />
      <LightBeam delay={26} angle={22} />
      <LightBeam delay={60} angle={-12} />
      <FloatingGlyphs />
      <ParticleBurst />

      {/* YC sigil — top-right floating accent */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP - 60,
          right: 80,
          transform: `scale(${ycScale}) translateY(${ycFloat}px) rotate(-6deg)`,
          willChange: "transform",
        }}
      >
        <YCSigil size={120} />
      </div>

      {/* Eyebrow */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 50,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [4, 24], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [4, 24], [16, 0], { extrapolateRight: "clamp", easing: ease.power3Out })}px)`,
        }}
      >
        <EyebrowPill dotColor={C.ycOrange}>01 — heads up</EyebrowPill>
      </div>

      {/* Hero copy — center, scale-pop + blur clear */}
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
            text="The president of"
            startFrame={6}
            perWordDelay={3}
            fontSize={84}
            fontWeight={500}
            color={C.inkMuted}
            align="center"
            letterSpacing="-0.025em"
          />
          <div style={{ height: 4 }} />
          <StaggeredWords
            text="Y Combinator"
            startFrame={20}
            perWordDelay={3}
            fontSize={148}
            fontWeight={800}
            color={C.ink}
            align="center"
            letterSpacing="-0.05em"
            lineHeight={1}
            highlight="combinator"
            highlightColor={C.ycOrange}
          />
          <div style={{ height: 14 }} />
          <StaggeredWords
            text="just open sourced"
            startFrame={42}
            perWordDelay={3}
            fontSize={84}
            fontWeight={500}
            color={C.inkMuted}
            align="center"
            letterSpacing="-0.025em"
          />
          <div style={{ height: 4 }} />
          <StaggeredWords
            text="his Claude Code setup."
            startFrame={62}
            perWordDelay={3}
            fontSize={84}
            fontWeight={700}
            color={C.ink}
            align="center"
            letterSpacing="-0.03em"
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
            opacity: interpolate(frame, [80, 110], [0, 1], { extrapolateRight: "clamp" }),
            transform: `scaleX(${interpolate(frame, [80, 120], [0, 1], { extrapolateRight: "clamp", easing: ease.expoOut })})`,
            transformOrigin: "center",
            boxShadow: `0 0 24px ${C.iriViolet}66`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 2 — REVEAL (180-390, 7s) — "The repo is called gstack."
// GitHub repo card materializes
// ═══════════════════════════════════════════════════════════════
export const RepoCard: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const op = interpolate(local, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(local, [0, 20], [60, 0], {
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });
  const tilt = interpolate(local, [0, 30], [-3, 0], {
    extrapolateRight: "clamp",
    easing: ease.power3Out,
  });

  // Star counter
  return (
    <div
      style={{
        ...glassBase,
        borderRadius: 32,
        width: 880,
        padding: "40px 44px",
        opacity: op,
        transform: `translateY(${y}px) rotate(${tilt}deg) perspective(1400px) rotateX(2deg)`,
        willChange: "transform",
      }}
    >
      {/* Top row — github octicon + path */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill={C.ink}>
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.01c-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.27-5.24-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.18-1.48 3.14-1.17 3.14-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.07 0 4.39-2.7 5.36-5.27 5.64.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.79.56 4.57-1.52 7.85-5.83 7.85-10.91C23.5 5.65 18.35.5 12 .5z" />
        </svg>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 30,
            fontWeight: 500,
            color: C.inkSoft,
            letterSpacing: "-0.01em",
          }}
        >
          garrytan
          <span style={{ color: C.inkDim }}>/</span>
          <span style={{ fontWeight: 700, color: C.ink }}>gstack</span>
        </div>
        <div
          style={{
            marginLeft: "auto",
            ...glassBase,
            borderRadius: 9999,
            padding: "6px 14px",
            fontFamily: MONO,
            fontSize: 14,
            color: C.iriViolet,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          public · MIT
        </div>
      </div>

      {/* gstack big wordmark */}
      <div
        style={{
          fontFamily: FONT,
          fontSize: 200,
          fontWeight: 800,
          color: C.ink,
          letterSpacing: "-0.07em",
          lineHeight: 0.92,
          background: `linear-gradient(135deg, ${C.ink} 0%, ${C.inkSoft} 45%, ${C.iriViolet} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        gstack
      </div>

      {/* Description */}
      <div
        style={{
          fontFamily: FONT,
          fontSize: 26,
          fontWeight: 500,
          color: C.inkMuted,
          marginTop: 6,
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
        }}
      >
        Turn Claude Code into your engineering team.
      </div>

      {/* Stats row — stars, forks, language */}
      <div
        style={{
          marginTop: 28,
          display: "flex",
          gap: 28,
          alignItems: "center",
          fontFamily: MONO,
          fontSize: 20,
          color: C.inkSoft,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={C.iriGold}>
            <polygon points="12 2 15 8.5 22 9.3 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9.3 9 8.5" />
          </svg>
          <Counter
            from={0}
            to={85000}
            startFrame={startFrame + 14}
            duration={28}
            format={(n) => Math.round(n).toLocaleString()}
            style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}
          />
        </div>
        <div style={{ width: 1, height: 22, background: C.hairline }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: C.iriCyan }} />
          Markdown
        </div>
        <div style={{ width: 1, height: 22, background: C.hairline }} />
        <div style={{ color: C.iriViolet, fontWeight: 600 }}>open source</div>
      </div>
    </div>
  );
};

const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.reveal;

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
          opacity: interpolate(local, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <EyebrowPill>02 — the repo</EyebrowPill>
      </div>

      {/* Repo card — fast materialize so the 1.9s window holds the brand reveal */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <RepoCard startFrame={BEAT.reveal + 4} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 3 — PITCH (390-720, 11s) — "23 specialists working for you"
// gstack.mov clip in tilted laptop frame + specialist counter
// ═══════════════════════════════════════════════════════════════
const PitchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.pitch;

  const clipDuration = BEAT.officeHours - BEAT.pitch;

  // Clip frame
  const clipOp = interpolate(local, [0, 26], [0, 1], { extrapolateRight: "clamp" });
  const clipY = interpolate(local, [0, 32], [60, 0], {
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });
  const clipTilt = interpolate(local, [0, 50], [-2, 0], {
    extrapolateRight: "clamp",
    easing: ease.power3Out,
  });

  // Big "23" counter pops in late
  const numScale = spring({
    frame: local - 110,
    fps: 30,
    config: { damping: 12, stiffness: 110 },
    from: 0.5,
    to: 1,
  });
  const numOp = interpolate(local, [110, 130], [0, 1], { extrapolateRight: "clamp" });

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
        <EyebrowPill>03 — install once</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 80, right: 80, top: SAFE_TOP + 110 }}>
        <StaggeredWords
          text="Install once."
          startFrame={BEAT.pitch + 6}
          fontSize={84}
          fontWeight={500}
          color={C.inkMuted}
          align="left"
        />
        <div style={{ height: 4 }} />
        <StaggeredWords
          text="Get a team of"
          startFrame={BEAT.pitch + 24}
          fontSize={102}
          fontWeight={800}
          color={C.ink}
          align="left"
          letterSpacing="-0.045em"
        />
      </div>

      {/* Tilted glass laptop frame around clip */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 800,
          height: 480,
          opacity: clipOp,
          transform: `translateY(${clipY}px) rotate(${clipTilt}deg) perspective(1400px) rotateX(4deg)`,
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
          <div style={{ display: "flex", gap: 8, padding: "4px 6px 12px", alignItems: "center" }}>
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
              ~/.claude/skills/gstack
            </div>
          </div>

          {/* Video — wrap in inner Sequence so first frame isn't frozen */}
          <Sequence from={BEAT.pitch} durationInFrames={clipDuration}>
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

      {/* Big 23 counter + specialists label */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1310,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          gap: 22,
          opacity: numOp,
          transform: `scale(${numScale})`,
          willChange: "transform",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 200,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: "-0.07em",
            lineHeight: 0.9,
            fontVariantNumeric: "tabular-nums",
            background: `linear-gradient(135deg, ${C.iriCyan}, ${C.iriViolet}, ${C.iriRose})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          <Counter
            from={1}
            to={23}
            startFrame={BEAT.pitch + 110}
            duration={70}
            format={(n) => Math.round(n).toString()}
          />
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 56,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: "-0.025em",
          }}
        >
          specialists.
        </div>
      </div>

      {/* Sub caption — sits comfortably below the counter */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1500,
          textAlign: "center",
          opacity: interpolate(local, [180, 220], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(local, [180, 220], [16, 0], { extrapolateRight: "clamp", easing: ease.power3Out })}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 30,
            fontWeight: 500,
            color: C.inkMuted,
            letterSpacing: "-0.01em",
          }}
        >
          Each one with their own job.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 4 — OFFICEHOURS (720-960, 8s)
// "Type /office-hours, describe your idea, AI pushes back."
// ═══════════════════════════════════════════════════════════════
export const Terminal: React.FC<{
  startFrame: number;
  command: string;
  responseLines: { text: string; color?: string; delay: number; mono?: boolean }[];
}> = ({ startFrame, command, responseLines }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;

  // Type out command
  const typeChars = Math.max(0, Math.floor(interpolate(local, [10, 50], [0, command.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })));
  const typedCommand = command.slice(0, typeChars);

  // Cursor blink
  const cursorOn = Math.floor(frame / 10) % 2 === 0;

  return (
    <div
      style={{
        ...glassBase,
        borderRadius: 28,
        padding: "20px 28px 28px",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Window controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 22,
        }}
      >
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
          claude code · gstack
        </div>
      </div>

      {/* Prompt + command */}
      <div
        style={{
          fontFamily: MONO,
          fontSize: 26,
          color: C.ink,
          letterSpacing: "-0.005em",
          lineHeight: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ color: C.iriViolet }}>›</span>
        <span style={{ color: C.iriCyan, fontWeight: 600 }}>{typedCommand}</span>
        {typeChars < command.length && cursorOn && (
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 22,
              background: C.ink,
              marginLeft: 2,
            }}
          />
        )}
      </div>

      {/* Response lines */}
      <div style={{ marginTop: 18 }}>
        {responseLines.map((line, i) => {
          const lineLocal = local - line.delay;
          const op = interpolate(lineLocal, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x = interpolate(lineLocal, [0, 18], [-12, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease.expoOut,
          });
          return (
            <div
              key={i}
              style={{
                fontFamily: line.mono === false ? FONT : MONO,
                fontSize: 22,
                color: line.color ?? C.inkSoft,
                letterSpacing: "-0.005em",
                lineHeight: 1.5,
                opacity: op,
                transform: `translateX(${x}px)`,
                marginTop: 8,
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OfficeHoursScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.officeHours;

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
        <EyebrowPill>04 — /office-hours</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 80, right: 80, top: SAFE_TOP + 110 }}>
        <StaggeredWords
          text="The AI"
          startFrame={BEAT.officeHours + 6}
          fontSize={88}
          fontWeight={500}
          color={C.inkMuted}
          align="left"
        />
        <div style={{ height: 4 }} />
        <StaggeredWords
          text="pushes back."
          startFrame={BEAT.officeHours + 18}
          fontSize={120}
          fontWeight={800}
          color={C.ink}
          align="left"
          letterSpacing="-0.05em"
          highlight="pushes"
          highlightColor={C.iriViolet}
        />
      </div>

      {/* Terminal */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 760 }}>
        <Terminal
          startFrame={BEAT.officeHours + 50}
          command="/office-hours"
          responseLines={[
            {
              text: "  YC OFFICE HOURS — listening for your pitch",
              color: C.inkDim,
              delay: 60,
            },
            { text: "", delay: 70 },
            {
              text: "  six forcing questions:",
              color: C.iriViolet,
              delay: 78,
            },
            { text: "  ▸ what's the actual pain?", color: C.inkSoft, delay: 100 },
            { text: "  ▸ who's already paying for this?", color: C.inkSoft, delay: 118 },
            { text: "  ▸ what would 10× look like?", color: C.inkSoft, delay: 136 },
            { text: "  ▸ where's the wedge?", color: C.inkSoft, delay: 154 },
            { text: "  ▸ what could break this?", color: C.inkSoft, delay: 172 },
            { text: "  ▸ what's the smallest thing to ship?", color: C.inkSoft, delay: 190 },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 5 — REFRAME (960-1290, 11s)
// "daily briefing app" → "personal chief of staff AI"
// ═══════════════════════════════════════════════════════════════
const ReframeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.reframe;

  // Card 1 (your idea) appears first
  const card1Op = interpolate(local, [40, 70], [0, 1], { extrapolateRight: "clamp" });
  const card1Scale = spring({
    frame: local - 40,
    fps: 30,
    config: { damping: 12, stiffness: 110 },
    from: 0.85,
    to: 1,
  });
  // Greys out at 130
  const card1Fade = interpolate(local, [150, 200], [1, 0.32], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Arrow morphs in at 140
  const arrowOp = interpolate(local, [140, 180], [0, 1], { extrapolateRight: "clamp" });

  // Card 2 (reframe) appears at 170
  const card2Op = interpolate(local, [170, 210], [0, 1], { extrapolateRight: "clamp" });
  const card2Scale = spring({
    frame: local - 170,
    fps: 30,
    config: { damping: 11, stiffness: 130 },
    from: 0.7,
    to: 1,
  });

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
        <EyebrowPill>05 — reframe</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 80, right: 80, top: SAFE_TOP + 110 }}>
        <StaggeredWords
          text="It reframes"
          startFrame={BEAT.reframe + 6}
          fontSize={84}
          fontWeight={500}
          color={C.inkMuted}
          align="left"
        />
        <div style={{ height: 4 }} />
        <StaggeredWords
          text="the whole thing."
          startFrame={BEAT.reframe + 22}
          fontSize={104}
          fontWeight={800}
          color={C.ink}
          align="left"
          letterSpacing="-0.045em"
          highlight="whole"
          highlightColor={C.iriViolet}
        />
      </div>

      {/* Card 1 — "daily briefing app" */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 740,
          opacity: card1Op * card1Fade,
          transform: `scale(${card1Scale})`,
          willChange: "transform",
        }}
      >
        <GlassCard radius={28} style={{ padding: "26px 32px" }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 16,
              color: C.inkDim,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            you said
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 64,
              fontWeight: 700,
              color: C.inkSoft,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
            }}
          >
            "I want to build a
            <br />
            daily briefing app."
          </div>
        </GlassCard>
      </div>

      {/* Morph arrow / connector */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1060,
          display: "flex",
          justifyContent: "center",
          opacity: arrowOp,
        }}
      >
        <div
          style={{
            ...glassBase,
            borderRadius: 9999,
            padding: "16px 28px",
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            fontFamily: MONO,
            fontSize: 18,
            fontWeight: 600,
            color: C.iriViolet,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          no — push back
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.iriViolet} strokeWidth="2.4">
            <line x1="3" y1="12" x2="21" y2="12" />
            <polyline points="13 5 21 12 13 19" />
          </svg>
        </div>
      </div>

      {/* Card 2 — "personal chief of staff AI" */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1170,
          opacity: card2Op,
          transform: `scale(${card2Scale})`,
          willChange: "transform",
        }}
      >
        <div
          style={{
            ...glassBase,
            borderRadius: 28,
            padding: "30px 34px",
            border: `2px solid ${C.iriViolet}`,
            boxShadow: `0 24px 48px -12px ${C.iriViolet}55, inset 0 1.5px 0 rgba(255,255,255,0.95)`,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 16,
              color: C.iriViolet,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            you're actually building
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 76,
              fontWeight: 800,
              color: C.ink,
              letterSpacing: "-0.045em",
              lineHeight: 1.02,
            }}
          >
            a personal chief
            <br />
            of staff AI.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 6 — QA (1290-1620, 11s)
// "/qa opens real Chrome, finds bugs, fixes, writes regression tests"
// ═══════════════════════════════════════════════════════════════
export const QaCheckItem: React.FC<{
  startFrame: number;
  index: number;
  label: string;
  detail: string;
}> = ({ startFrame, index, label, detail }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame - index * 26;
  const op = interpolate(local, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const x = interpolate(local, [0, 22], [-30, 0], {
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });
  const checkScale = spring({
    frame: local - 14,
    fps: 30,
    config: { damping: 11, stiffness: 160 },
    from: 0,
    to: 1,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: op,
        transform: `translateX(${x}px)`,
        willChange: "transform",
        padding: "16px 0",
        borderBottom: `1px solid ${C.hairline}`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          background: C.emerald,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transform: `scale(${checkScale})`,
          boxShadow: `0 4px 14px ${C.emerald}55`,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3">
          <polyline points="5 12 10 17 19 7" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 32,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 16,
            color: C.inkDim,
            letterSpacing: "0.04em",
            marginTop: 2,
          }}
        >
          {detail}
        </div>
      </div>
    </div>
  );
};

const QaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.qa;

  // Browser frame slides up
  const browserOp = interpolate(local, [50, 80], [0, 1], { extrapolateRight: "clamp" });
  const browserY = interpolate(local, [50, 90], [40, 0], {
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });

  // Cursor moves around
  const cursorX = interpolate(local, [80, 130, 180, 230, 280], [200, 600, 280, 740, 420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.inOut,
  });
  const cursorY = interpolate(local, [80, 130, 180, 230, 280], [240, 180, 320, 260, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.inOut,
  });

  // Click pulse at certain frames
  const clickPulse = (t: number) => {
    const d = local - t;
    if (d < 0 || d > 30) return 0;
    return interpolate(d, [0, 30], [1, 0], { extrapolateRight: "clamp" });
  };
  const pulseA = clickPulse(130);
  const pulseB = clickPulse(230);

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
        <EyebrowPill dotColor={C.emerald}>06 — /qa</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 80, right: 80, top: SAFE_TOP + 110 }}>
        <StaggeredWords
          text="Opens a real"
          startFrame={BEAT.qa + 6}
          fontSize={84}
          fontWeight={500}
          color={C.inkMuted}
          align="left"
        />
        <div style={{ height: 4 }} />
        <StaggeredWords
          text="Chrome browser."
          startFrame={BEAT.qa + 22}
          fontSize={104}
          fontWeight={800}
          color={C.ink}
          align="left"
          letterSpacing="-0.045em"
        />
      </div>

      {/* Browser mock */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 740,
          height: 380,
          opacity: browserOp,
          transform: `translateY(${browserY}px)`,
          willChange: "transform",
        }}
      >
        <div
          style={{
            ...glassBase,
            borderRadius: 24,
            padding: 12,
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Browser chrome */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 6px 12px",
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FF5F57" }} />
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FEBC2E" }} />
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#28C840" }} />
            <div
              style={{
                marginLeft: 16,
                ...glassBase,
                borderRadius: 9999,
                padding: "6px 14px",
                fontFamily: MONO,
                fontSize: 13,
                color: C.inkSoft,
                letterSpacing: "0.02em",
                flex: 1,
                maxWidth: 460,
              }}
            >
              <span style={{ color: C.iriViolet }}>https://</span>staging.myapp.com
            </div>
          </div>
          {/* Page mock — rows of grey rectangles */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 14,
              padding: 16,
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  height: 78,
                  borderRadius: 12,
                  background:
                    i === 3
                      ? `linear-gradient(135deg, ${C.rose}, ${C.iriRose})`
                      : "rgba(255,255,255,0.6)",
                  border: `1px solid ${C.hairline}`,
                }}
              />
            ))}
          </div>
          <div
            style={{
              marginTop: 8,
              padding: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: MONO,
              fontSize: 14,
              color: C.inkDim,
              letterSpacing: "0.05em",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: C.rose,
                boxShadow: `0 0 10px ${C.rose}`,
              }}
            />
            BUG · element overflows on viewport &lt; 768px
          </div>

          {/* Click pulses */}
          {[
            { x: 600, y: 180, p: pulseA },
            { x: 740, y: 260, p: pulseB },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: c.x - 30,
                top: c.y - 30,
                width: 60,
                height: 60,
                borderRadius: 30,
                border: `3px solid ${C.iriViolet}`,
                opacity: c.p,
                transform: `scale(${1 + (1 - c.p) * 1.2})`,
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Cursor */}
          <div
            style={{
              position: "absolute",
              left: cursorX,
              top: cursorY,
              opacity: browserOp,
              pointerEvents: "none",
              willChange: "transform",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M3 3 L21 12 L13 14 L11 22 Z"
                fill={C.ink}
                stroke="#FFF"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Checklist below */}
      <div
        style={{
          position: "absolute",
          left: 100,
          right: 100,
          top: 1180,
        }}
      >
        <QaCheckItem
          startFrame={BEAT.qa + 130}
          index={0}
          label="Bug found"
          detail="overflow at sm breakpoint"
        />
        <QaCheckItem
          startFrame={BEAT.qa + 130}
          index={1}
          label="Bug fixed"
          detail="atomic commit · 6 lines"
        />
        <QaCheckItem
          startFrame={BEAT.qa + 130}
          index={2}
          label="Regression test written"
          detail="never comes back"
        />
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 7 — CSO (1620-1860, 8s)
// "/cso runs OWASP audit. $10K → free."
// ═══════════════════════════════════════════════════════════════
export const OwaspRow: React.FC<{
  index: number;
  startFrame: number;
  label: string;
  status: "ok" | "warn";
}> = ({ index, startFrame, label, status }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame - index * 8;
  const op = interpolate(local, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const x = interpolate(local, [0, 22], [-20, 0], {
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 16px",
        borderBottom: `1px solid ${C.hairline}`,
        opacity: op,
        transform: `translateX(${x}px)`,
        willChange: "transform",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 14,
          color: C.inkDim,
          width: 40,
          letterSpacing: "0.04em",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div
        style={{
          flex: 1,
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 600,
          color: C.ink,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          background: status === "ok" ? C.emerald : C.iriGold,
          boxShadow: `0 0 12px ${status === "ok" ? C.emerald : C.iriGold}88`,
        }}
      />
    </div>
  );
};

const CsoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.cso;

  const owaspItems = [
    { label: "Broken Access Control", status: "ok" as const },
    { label: "Cryptographic Failures", status: "ok" as const },
    { label: "Injection", status: "ok" as const },
    { label: "Insecure Design", status: "warn" as const },
    { label: "Security Misconfiguration", status: "ok" as const },
    { label: "Vulnerable Components", status: "ok" as const },
    { label: "Auth Failures", status: "ok" as const },
    { label: "Software & Data Integrity", status: "ok" as const },
    { label: "Logging & Monitoring", status: "warn" as const },
    { label: "Server-Side Request Forgery", status: "ok" as const },
  ];

  // Price ticker — $10,000 → $0
  const priceScale = spring({
    frame: local - 100,
    fps: 30,
    config: { damping: 11, stiffness: 110 },
    from: 0.7,
    to: 1,
  });
  const priceOp = interpolate(local, [100, 130], [0, 1], { extrapolateRight: "clamp" });

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
        <EyebrowPill dotColor={C.iriRose}>07 — /cso</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 80, right: 80, top: SAFE_TOP + 110 }}>
        <StaggeredWords
          text="Full OWASP audit."
          startFrame={BEAT.cso + 6}
          fontSize={92}
          fontWeight={800}
          color={C.ink}
          align="left"
          letterSpacing="-0.04em"
          highlight="OWASP"
          highlightColor={C.iriRose}
        />
      </div>

      {/* OWASP Top 10 list */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 720,
        }}
      >
        <div
          style={{
            ...glassBase,
            borderRadius: 28,
            padding: "24px 14px",
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
              padding: "0 16px 14px",
            }}
          >
            owasp top 10 · scanning…
          </div>
          {owaspItems.map((item, i) => (
            <OwaspRow
              key={i}
              index={i}
              startFrame={BEAT.cso + 36}
              label={item.label}
              status={item.status}
            />
          ))}
        </div>
      </div>

      {/* Price comparison */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1340,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 36,
          opacity: priceOp,
          transform: `scale(${priceScale})`,
          willChange: "transform",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 92,
            fontWeight: 700,
            color: C.inkDim,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textDecoration: "line-through",
            textDecorationColor: C.rose,
            textDecorationThickness: 6,
            paddingBottom: 6,
          }}
        >
          $10K
        </div>
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.iriViolet}
          strokeWidth="2.4"
          style={{ flexShrink: 0 }}
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <polyline points="13 5 21 12 13 19" />
        </svg>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 128,
            fontWeight: 800,
            color: C.ink,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            paddingBottom: 14,
            background: `linear-gradient(135deg, ${C.iriCyan}, ${C.iriViolet}, ${C.iriRose})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          free.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 8 — PARALLEL (1860-2160, 10s)
// "10 to 15 sprints in parallel"
// ═══════════════════════════════════════════════════════════════
export const ParallelTerminal: React.FC<{
  startFrame: number;
  index: number;
  total: number;
  cmd: string;
  status: string;
  accent: string;
}> = ({ startFrame, index, total, cmd, status, accent }) => {
  const frame = useCurrentFrame();
  const localStart = startFrame + index * 4;
  const local = frame - localStart;
  const op = interpolate(local, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const scale = spring({
    frame: local,
    fps: 30,
    config: { damping: 13, stiffness: 130 },
    from: 0.6,
    to: 1,
  });

  // Terminal log line ticker — fake activity
  const lineCount = Math.floor(local / 8) % 6;
  const lines = [
    "▸ analyzing dependencies",
    "▸ patch applied · 14 lines",
    "▸ test suite green",
    "▸ regression added",
    "▸ commit · b6f3a2",
    "▸ pushing branch",
  ];
  const visibleLines = lines.slice(0, Math.max(2, lineCount + 1));

  // Pulse breathing dot
  const pulse = 0.7 + Math.sin((frame + index * 14) * 0.12) * 0.3;

  return (
    <div
      style={{
        ...glassBase,
        borderRadius: 18,
        padding: "12px 14px",
        opacity: op,
        transform: `scale(${scale})`,
        willChange: "transform",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: accent,
            boxShadow: `0 0 ${8 * pulse + 4}px ${accent}`,
          }}
        />
        <div
          style={{
            fontFamily: MONO,
            fontSize: 13,
            fontWeight: 600,
            color: accent,
            letterSpacing: "-0.005em",
          }}
        >
          {cmd}
        </div>
        <div
          style={{
            marginLeft: "auto",
            fontFamily: MONO,
            fontSize: 10,
            color: C.inkDim,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {status}
        </div>
      </div>
      {visibleLines.map((line, i) => (
        <div
          key={i}
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: i === visibleLines.length - 1 ? C.inkSoft : C.inkDim,
            letterSpacing: "-0.005em",
            lineHeight: 1.3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

const ParallelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.parallel;

  const sprints = [
    { cmd: "/qa", status: "running", accent: C.iriCyan },
    { cmd: "/ship", status: "pushing", accent: C.iriViolet },
    { cmd: "/cso", status: "scanning", accent: C.iriRose },
    { cmd: "/review", status: "auto-fix", accent: C.emerald },
    { cmd: "/investigate", status: "tracing", accent: C.iriGold },
    { cmd: "/benchmark", status: "profiling", accent: C.iriCyan },
    { cmd: "/canary", status: "watching", accent: C.iriViolet },
    { cmd: "/design-html", status: "compiling", accent: C.iriRose },
    { cmd: "/document-release", status: "writing", accent: C.emerald },
    { cmd: "/devex-review", status: "auditing", accent: C.iriGold },
    { cmd: "/land-and-deploy", status: "deploy", accent: C.iriCyan },
    { cmd: "/retro", status: "summarize", accent: C.iriViolet },
  ];

  // Big "× 12" callout pops late
  const calloutOp = interpolate(local, [180, 210], [0, 1], { extrapolateRight: "clamp" });
  const calloutScale = spring({
    frame: local - 180,
    fps: 30,
    config: { damping: 12, stiffness: 130 },
    from: 0.7,
    to: 1,
  });

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
        <EyebrowPill dotColor={C.iriCyan}>08 — in parallel</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 80, right: 80, top: SAFE_TOP + 110 }}>
        <StaggeredWords
          text="All at the"
          startFrame={BEAT.parallel + 6}
          fontSize={84}
          fontWeight={500}
          color={C.inkMuted}
          align="left"
        />
        <div style={{ height: 4 }} />
        <StaggeredWords
          text="same time."
          startFrame={BEAT.parallel + 22}
          fontSize={132}
          fontWeight={800}
          color={C.ink}
          align="left"
          letterSpacing="-0.05em"
          highlight="same"
          highlightColor={C.iriCyan}
        />
      </div>

      {/* 12 parallel terminals — 3-col grid, 4 rows */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 760,
          height: 640,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          gap: 14,
        }}
      >
        {sprints.map((s, i) => (
          <ParallelTerminal
            key={i}
            startFrame={BEAT.parallel + 30}
            index={i}
            total={sprints.length}
            cmd={s.cmd}
            status={s.status}
            accent={s.accent}
          />
        ))}
      </div>

      {/* Callout */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1430,
          display: "flex",
          justifyContent: "center",
          opacity: calloutOp,
          transform: `scale(${calloutScale})`,
          willChange: "transform",
        }}
      >
        <div
          style={{
            ...glassBase,
            borderRadius: 9999,
            padding: "16px 32px",
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            fontFamily: FONT,
            fontSize: 38,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: "-0.025em",
          }}
        >
          <span style={{ color: C.iriViolet, fontFamily: MONO, fontWeight: 800 }}>10 → 15</span>
          sprints simultaneously
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 9 — GARRY (2160-2520, 12s)
// "Built by Garry Tan. 800× faster than 2013."
// ═══════════════════════════════════════════════════════════════
export const PortfolioPill: React.FC<{
  index: number;
  startFrame: number;
  name: string;
  color: string;
}> = ({ index, startFrame, name, color }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame - index * 7;
  const op = interpolate(local, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const scale = spring({
    frame: local,
    fps: 30,
    config: { damping: 11, stiffness: 130 },
    from: 0.7,
    to: 1,
  });
  const float = Math.sin((frame + index * 24) * 0.04) * 5;

  return (
    <div
      style={{
        ...glassBase,
        borderRadius: 9999,
        padding: "12px 22px",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        opacity: op,
        transform: `scale(${scale}) translateY(${float}px)`,
        willChange: "transform",
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          background: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
      <div
        style={{
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 600,
          color: C.ink,
          letterSpacing: "-0.015em",
        }}
      >
        {name}
      </div>
    </div>
  );
};

const GarryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.garry;

  // Portrait scale-pop
  const portraitScale = spring({
    frame: local - 30,
    fps: 30,
    config: { damping: 13, stiffness: 110 },
    from: 0.7,
    to: 1,
  });
  const portraitOp = interpolate(local, [30, 60], [0, 1], { extrapolateRight: "clamp" });

  // Counter — 1× → 800×
  const counterOp = interpolate(local, [180, 210], [0, 1], { extrapolateRight: "clamp" });
  const counterScale = spring({
    frame: local - 180,
    fps: 30,
    config: { damping: 12, stiffness: 110 },
    from: 0.6,
    to: 1,
  });

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
        <EyebrowPill dotColor={C.ycOrange}>09 — built by</EyebrowPill>
      </div>

      {/* Portrait — center, with iridescent ring */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: SAFE_TOP + 100,
          transform: `translateX(-50%) scale(${portraitScale})`,
          opacity: portraitOp,
          willChange: "transform",
        }}
      >
        <div style={{ position: "relative", width: 360, height: 360 }}>
          <IridescentRing size={360} thickness={6} speed={0.8} />
          <div
            style={{
              position: "absolute",
              inset: 6,
              borderRadius: "50%",
              overflow: "hidden",
              background: C.bg,
              boxShadow: "inset 0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <Img
              src={staticFile("garrytan-image.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 30%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Name + title */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: SAFE_TOP + 510,
          textAlign: "center",
          opacity: interpolate(local, [60, 90], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(local, [60, 90], [16, 0], { extrapolateRight: "clamp", easing: ease.power3Out })}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 76,
            fontWeight: 800,
            color: C.ink,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          Garry Tan
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 18,
            color: C.inkMuted,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginTop: 10,
          }}
        >
          president · y combinator
        </div>
      </div>

      {/* Portfolio pills — Coinbase, Stripe, Airbnb */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: SAFE_TOP + 660,
          display: "flex",
          justifyContent: "center",
          gap: 14,
          flexWrap: "wrap",
          padding: "0 60px",
        }}
      >
        <PortfolioPill index={0} startFrame={BEAT.garry + 100} name="Coinbase" color="#0052FF" />
        <PortfolioPill index={1} startFrame={BEAT.garry + 100} name="Stripe" color="#635BFF" />
        <PortfolioPill index={2} startFrame={BEAT.garry + 100} name="Airbnb" color="#FF5A5F" />
        <PortfolioPill index={3} startFrame={BEAT.garry + 100} name="Instacart" color="#43B02A" />
      </div>

      {/* 1× → 800× counter */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1280,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          gap: 18,
          opacity: counterOp,
          transform: `scale(${counterScale})`,
          willChange: "transform",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 14,
              color: C.inkDim,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            2013
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 64,
              fontWeight: 700,
              color: C.inkMuted,
              letterSpacing: "-0.04em",
              textDecoration: "line-through",
              textDecorationColor: C.inkDim,
              textDecorationThickness: 3,
            }}
          >
            1×
          </div>
        </div>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.iriViolet} strokeWidth="2.4">
          <line x1="3" y1="12" x2="21" y2="12" />
          <polyline points="13 5 21 12 13 19" />
        </svg>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
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
            2026
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 168,
              fontWeight: 800,
              color: C.ink,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              fontVariantNumeric: "tabular-nums",
              background: `linear-gradient(135deg, ${C.iriCyan}, ${C.iriViolet}, ${C.iriRose})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            <Counter
              from={1}
              to={800}
              startFrame={BEAT.garry + 180}
              duration={90}
              format={(n) => `${Math.round(n)}×`}
            />
          </div>
        </div>
      </div>

      {/* Caption */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1480,
          textAlign: "center",
          opacity: interpolate(local, [240, 280], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 30,
            fontWeight: 500,
            color: C.inkMuted,
            letterSpacing: "-0.01em",
          }}
        >
          Same builder. Different tooling.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 10 — CTA (2520-2820, 10s)
// "Free. MIT. 85,000 stars. Pinned comment."
// ═══════════════════════════════════════════════════════════════

// Concentric rings that pulse out from center
const CtaSonar: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.cta;
  const rings = [0, 22, 44, 66, 88, 110];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {rings.map((birth, i) => {
        const lf = local - birth;
        if (lf < 0) return null;
        const cycle = lf % 110;
        const scale = interpolate(cycle, [0, 110], [0.05, 1.2], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease.expoOut,
        });
        const op = interpolate(cycle, [0, 30, 110], [0, 0.5, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 1500,
              height: 1500,
              borderRadius: "50%",
              border: `2px solid ${i % 2 === 0 ? C.iriGold : C.iriViolet}`,
              transform: `scale(${scale})`,
              opacity: op,
              willChange: "transform, opacity",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Floating glass star shards that drift and pulse
const FloatingStars: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.cta;
  const shards = [
    { x: 90, y: 320, size: 56, delay: 6, rot: -10, color: C.iriGold },
    { x: 920, y: 280, size: 48, delay: 14, rot: 14, color: C.iriCyan },
    { x: 70, y: 760, size: 64, delay: 22, rot: 6, color: C.iriViolet },
    { x: 940, y: 820, size: 54, delay: 30, rot: -8, color: C.iriRose },
    { x: 140, y: 1180, size: 44, delay: 38, rot: 16, color: C.iriGold },
    { x: 880, y: 1240, size: 60, delay: 46, rot: -4, color: C.iriCyan },
    { x: 200, y: 540, size: 36, delay: 18, rot: 8, color: C.iriRose },
    { x: 820, y: 580, size: 40, delay: 26, rot: -12, color: C.iriViolet },
  ];
  return (
    <>
      {shards.map((s, i) => {
        const lf = local - s.delay;
        const op = interpolate(lf, [0, 30], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease.expoOut,
        });
        const float = Math.sin((frame + i * 26) * 0.045) * 12;
        const drift = Math.cos((frame + i * 19) * 0.035) * 8;
        const sc = spring({
          frame: lf,
          fps: 30,
          config: { damping: 12, stiffness: 110 },
          from: 0.4,
          to: 1,
        });
        const spin = (frame + i * 30) * 0.4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x + drift,
              top: s.y + float,
              width: s.size,
              height: s.size,
              transform: `rotate(${s.rot + spin}deg) scale(${sc})`,
              opacity: op * 0.85,
              willChange: "transform, opacity",
              pointerEvents: "none",
              filter: `drop-shadow(0 0 ${s.size * 0.4}px ${s.color}88)`,
            }}
          >
            <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill={s.color}>
              <polygon points="12 2 15 8.5 22 9.3 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9.3 9 8.5" />
            </svg>
          </div>
        );
      })}
    </>
  );
};

// Diagonal iridescent light sweep
const CtaLightSweep: React.FC<{ delay: number; angle: number }> = ({ delay, angle }) => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.cta - delay;
  const progress = interpolate(local, [0, 80], [-0.3, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });
  const op = interpolate(local, [0, 14, 60, 80], [0, 0.55, 0.55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 2400,
        height: 90,
        background: `linear-gradient(90deg, transparent 0%, ${C.iriGold}aa 30%, ${C.iriViolet}cc 50%, ${C.iriRose}aa 70%, transparent 100%)`,
        filter: "blur(22px)",
        transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${(progress - 0.5) * 1700}px)`,
        opacity: op,
        willChange: "transform, opacity",
        pointerEvents: "none",
      }}
    />
  );
};

export const StarBurst: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.cta;
  const stars = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2 + 0.31;
    const distance = 240 + (i % 5) * 50;
    const delay = (i * 1.2) % 26;
    const lf = local - 60 - delay;
    const burst = interpolate(lf, [0, 50], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease.expoOut,
    });
    const drift = Math.sin((frame + i * 12) * 0.05) * 6;
    const x = Math.cos(angle) * distance * burst + drift;
    const y = Math.sin(angle) * distance * burst + drift * 0.6;
    const op = interpolate(lf, [0, 16, 100, 180], [0, 0.85, 0.5, 0.25], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const size = 10 + (i % 3) * 5;
    return { x, y, op, size, key: i };
  });
  return (
    <>
      {stars.map((s) => (
        <div
          key={s.key}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: s.size,
            height: s.size,
            transform: `translate(${s.x - s.size / 2}px, ${s.y - s.size / 2}px)`,
            opacity: s.op,
            willChange: "transform, opacity",
            pointerEvents: "none",
            filter: `drop-shadow(0 0 ${s.size}px ${C.iriGold})`,
          }}
        >
          <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill={C.iriGold}>
            <polygon points="12 2 15 8.5 22 9.3 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9.3 9 8.5" />
          </svg>
        </div>
      ))}
    </>
  );
};

const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.cta;

  // Star count scale-pop
  const numScale = spring({
    frame: local - 20,
    fps: 30,
    config: { damping: 12, stiffness: 110 },
    from: 0.5,
    to: 1,
  });
  const numOp = interpolate(local, [20, 50], [0, 1], { extrapolateRight: "clamp" });

  // Pinned-comment arrow bobs
  const arrowBob = Math.sin(frame * 0.12) * 14;

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
        <EyebrowPill dotColor={C.iriGold}>10 — free</EyebrowPill>
      </div>

      {/* Motion-art layers — sonar rings + light sweeps + floating stars + center burst */}
      <CtaSonar />
      <CtaLightSweep delay={0} angle={-16} />
      <CtaLightSweep delay={36} angle={20} />
      <CtaLightSweep delay={80} angle={-10} />
      <FloatingStars />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 1, height: 1 }}>
          <StarBurst />
        </div>
      </AbsoluteFill>

      {/* Star count — sized to fit 1080 width with side padding */}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: SAFE_TOP + 180,
          textAlign: "center",
          opacity: numOp,
          transform: `scale(${numScale})`,
          willChange: "transform",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 256,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: "-0.075em",
            lineHeight: 0.85,
            fontVariantNumeric: "tabular-nums",
            background: `linear-gradient(135deg, ${C.iriCyan} 0%, ${C.iriViolet} 50%, ${C.iriRose} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            whiteSpace: "nowrap",
          }}
        >
          <Counter
            from={0}
            to={85000}
            startFrame={BEAT.cta + 20}
            duration={90}
            format={(n) => Math.round(n).toLocaleString()}
          />
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            marginTop: 18,
            fontFamily: MONO,
            fontSize: 28,
            fontWeight: 600,
            color: C.inkSoft,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill={C.iriGold}>
            <polygon points="12 2 15 8.5 22 9.3 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9.3 9 8.5" />
          </svg>
          stars on github
        </div>
      </div>

      {/* Free / MIT / Open Source pills */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: SAFE_TOP + 700,
          display: "flex",
          justifyContent: "center",
          gap: 14,
          opacity: interpolate(local, [80, 120], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(local, [80, 120], [20, 0], { extrapolateRight: "clamp", easing: ease.power3Out })}px)`,
        }}
      >
        {[
          { label: "FREE", color: C.emerald },
          { label: "MIT", color: C.iriViolet },
          { label: "OPEN SOURCE", color: C.iriCyan },
        ].map((p, i) => (
          <div
            key={i}
            style={{
              ...glassBase,
              borderRadius: 9999,
              padding: "18px 30px",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              fontFamily: MONO,
              fontSize: 22,
              fontWeight: 700,
              color: C.ink,
              letterSpacing: "0.15em",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background: p.color,
                boxShadow: `0 0 12px ${p.color}`,
              }}
            />
            {p.label}
          </div>
        ))}
      </div>

      {/* Pinned comment CTA */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1380,
          textAlign: "center",
          opacity: interpolate(local, [140, 180], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${arrowBob}px)`,
          willChange: "transform",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 52,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          link in pinned comment
        </div>
        <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={C.iriViolet} strokeWidth="2.4">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN — orchestrate scenes with audio
// ═══════════════════════════════════════════════════════════════
export const GstackBrandReel: React.FC = () => {
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

      {/* Subtle hairline grid for depth */}
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

      {/* Scenes — conditional render so useCurrentFrame() returns GLOBAL frame
          inside each scene, matching our `local = frame - BEAT.x` math. */}
      {frame >= BEAT.hook && frame < BEAT.reveal && <HookScene />}
      {frame >= BEAT.reveal && frame < BEAT.pitch && <RevealScene />}
      {frame >= BEAT.pitch && frame < BEAT.officeHours && <PitchScene />}
      {frame >= BEAT.officeHours && frame < BEAT.reframe && <OfficeHoursScene />}
      {frame >= BEAT.reframe && frame < BEAT.qa && <ReframeScene />}
      {frame >= BEAT.qa && frame < BEAT.cso && <QaScene />}
      {frame >= BEAT.cso && frame < BEAT.parallel && <CsoScene />}
      {frame >= BEAT.parallel && frame < BEAT.garry && <ParallelScene />}
      {frame >= BEAT.garry && frame < BEAT.cta && <GarryScene />}
      {frame >= BEAT.cta && frame < BEAT.end && <CtaScene />}

      {/* Audio */}
      {/* REFERENCE-STRIP: voiceover tag removed — bring your own voiceover */}
    </AbsoluteFill>
  );
};
