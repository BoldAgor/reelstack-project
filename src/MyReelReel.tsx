/**
 * MyReelReel — scaffolded by ReelStack v1.4
 *
 * Family:    glass
 * Preset:    claudewatch
 * Source:    reference/glass/claudewatch.tsx
 * Cloned at: 2026-05-31T12:53:55.067Z
 *
 * This file is a faithful clone of the production ClaudeWatchReel
 * — same motion vocabulary, palette, and scene structure. Canonical Devini
 * Labs hook / sub / CTA strings are still in place. REPLACE them with your
 * own content before publishing. The motion floor (≥4 layers in opener,
 * ≥3 in anchor scenes) is preserved.
 *
 * Next steps:
 *   1. Replace the hero hook, sub, and CTA copy with your reel's narrative.
 *   2. Run `/reelstack-beats <vo.wav>` to lock motion to your voiceover.
 *   3. Look for REFERENCE-STRIP markers and swap in your assets.
 *   4. Run `/reelstack-lint src/MyReelReel.tsx` and address any errors.
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
} from "remotion";
import { ds } from "./designSystem";

// ═══════════════════════════════════════════════════════════════
// TIMING — 105.20s @ 30fps = 3156 frames
// Beats locked to /tmp/claude-watch.srt (whisper-cli base.en)
// ═══════════════════════════════════════════════════════════════
export const CW_TOTAL = 3156;

export const CW = {
  hook:     0,    // 00.00s — "This custom Claude skill literally watches video..."
  viral:    403,  // 13.44s — "Here's how you can use it. Say a YouTube video goes viral."
  demo:     491,  // 16.36s — "You just type /claude-watch, paste the URL, hit enter."  ← clip 1
  result:   718,  // 23.92s — "A 30-minute video, broken down and rewritten..."         ← clip 2
  decode:   874,  // 29.14s — "You can also do this with every top creator..."
  brain:    1229, // 40.96s — "Your second brain just keeps getting smarter..."
  ytCta:    1429, // 47.64s — "For the full setup tutorial, check my YouTube channel..."
  hood:     1546, // 51.52s — "Now here's how it actually works under the hood..."
  ytdlp:    1852, // 61.72s — "It uses yt-dlp to pull the video from basically any site..."
  ffmpeg:   2153, // 71.76s — "Then FFmpeg rips out frames... transcribed... Whisper on Groq..."
  flipbook: 2501, // 83.36s — "Then everything gets handed to Claude with the timestamps..."
  local:    2819, // 93.96s — "It knows exactly what's on screen... All running locally..."
  comment:  3053, // 101.76s — "Comment AI to get this custom created Claude skill."
  end:      3156, // 105.20s
} as const;

// GSAP-equivalent easing curves mapped onto Remotion's `interpolate`.
export const ease = {
  power2Out: Easing.bezier(0.165, 0.84, 0.44, 1),
  power3Out: Easing.bezier(0.215, 0.61, 0.355, 1),
  power4Out: Easing.bezier(0.165, 0.84, 0.44, 1),
  expoOut:   Easing.bezier(0.19, 1, 0.22, 1),
  expoIn:    Easing.bezier(0.7, 0, 0.84, 0),
  backOut:   Easing.bezier(0.34, 1.56, 0.64, 1),
  inOut:     Easing.bezier(0.45, 0, 0.55, 1),
};

// ═══════════════════════════════════════════════════════════════
// BRIGHT LAVENDER PALETTE — Graphify-style luminous base + scene accents
// ═══════════════════════════════════════════════════════════════
export const C = {
  bg:       "#EFEAF2",
  bgWarm:   "#E9E2EE",
  bgCool:   "#E4E9F2",
  ink:      "#0E0E12",
  inkSoft:  "#26242C",
  inkMuted: "#5A5867",
  inkDim:   "#86848F",
  hairline: "rgba(15,15,22,0.08)",
  // Scene-coded accents — brightened / saturated versions of original six
  claude:   "#FF7A4D", // vivid coral — Claude brand (skill identity)
  film:     "#E89414", // saturated marigold — frame-strip (visuals/frames) — darker than pale gold for lavender contrast
  vector:   "#6E6EFF", // electric indigo — Obsidian / vector library / second brain
  success:  "#1FD891", // bright mint — transcribe / free / local
  crimson:  "#FF5C7E", // hot rose — anti-pattern (transcript-only / no API)
  plasma:   "#B58CFF", // electric violet — Whisper
  // Glass tokens — adopted from GraphifyReel
  glassFill:       "rgba(255,255,255,0.42)",
  glassFillStrong: "rgba(255,255,255,0.62)",
  glassBorder:     "rgba(255,255,255,0.85)",
  glassInner:      "rgba(255,255,255,0.50)",
} as const;

export const FONT = ds.font.sans;
export const MONO = ds.font.mono;

export const GLASS_SHADOW = [
  "0 24px 48px -12px rgba(120,100,180,0.22)",
  "0 8px 16px -4px rgba(120,100,180,0.12)",
  "inset 0 1.5px 0 rgba(255,255,255,0.95)",
  "inset 0 -1px 0 rgba(255,255,255,0.30)",
].join(", ");

export const glassBase: React.CSSProperties = {
  background: C.glassFill,
  backdropFilter: "blur(32px) saturate(180%)",
  WebkitBackdropFilter: "blur(32px) saturate(180%)",
  border: `1.5px solid ${C.glassBorder}`,
  boxShadow: GLASS_SHADOW,
};

const SAFE_TOP = 290;

// ═══════════════════════════════════════════════════════════════
// PERPETUAL CAUSTIC BLOBS — Claude + film + vector tints
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
      <div style={blob(C.claude, 720, 80, 220, 0.18, 0.13, 0.0, 0.55)} />
      <div style={blob(C.vector, 820, 600, 540, 0.14, 0.16, 1.2, 0.45)} />
      <div style={blob(C.film, 700, 200, 1100, 0.11, 0.19, 2.4, 0.5)} />
      <div style={blob(C.plasma, 540, 720, 1500, 0.16, 0.12, 3.6, 0.35)} />
      <div style={blob(C.claude, 600, 100, 1700, 0.12, 0.18, 4.2, 0.4)} />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// IRIDESCENT RING — conic gradient halo
// ═══════════════════════════════════════════════════════════════
const IridescentRing: React.FC<{
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
        background: `conic-gradient(from ${angle}deg, ${C.claude}, ${C.film}, ${C.vector}, ${C.plasma}, ${C.claude})`,
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
// GLASS CARD + EYEBROW PILL
// ═══════════════════════════════════════════════════════════════
export const EyebrowPill: React.FC<{ children: React.ReactNode; dot?: string }> = ({
  children,
  dot = C.claude,
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
        background: dot,
        boxShadow: `0 0 14px ${dot}`,
      }}
    />
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// STAGGERED WORDS — fade-up + blur, GSAP stagger
// ═══════════════════════════════════════════════════════════════
const StaggeredWords: React.FC<{
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
  highlightColor = C.claude,
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
// SONAR RINGS / PARTICLE BURST / LIGHT BEAM / FLOATING GLYPHS
// ═══════════════════════════════════════════════════════════════
export const SonarRings: React.FC<{ accent?: string; secondary?: string }> = ({
  accent = C.claude,
  secondary = C.film,
}) => {
  const frame = useCurrentFrame();
  const rings = [0, 18, 36, 54, 72];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {rings.map((birth, i) => {
        const local = frame - birth;
        const cycle = local % 90;
        if (local < 0) return null;
        const scale = interpolate(cycle, [0, 90], [0.05, 1.4], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease.expoOut,
        });
        const op = interpolate(cycle, [0, 30, 90], [0, 0.1, 0], {
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
              border: `2px solid ${i % 2 === 0 ? `${accent}aa` : `${secondary}aa`}`,
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

export const ParticleBurst: React.FC<{ count?: number; palette?: string[] }> = ({
  count = 48,
  palette = [C.claude, C.film, C.vector, C.plasma],
}) => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + i * 0.31;
    const distance = 200 + (i % 7) * 80;
    const size = 6 + (i % 4) * 4;
    const color = palette[i % palette.length];
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
        background: `linear-gradient(90deg, transparent 0%, ${C.claude}88 30%, ${C.film}cc 50%, ${C.vector}88 70%, transparent 100%)`,
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
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), 0 8px 16px -4px rgba(120,80,120,0.18)",
              transform: `rotate(${g.rot}deg) scale(${scale})`,
              opacity: op * 0.55,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════
// LAPTOP FRAME — chrome wrapper for embedded clips
// ═══════════════════════════════════════════════════════════════
const LaptopFrame: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
  title?: string;
}> = ({ width, height, children, title = "claude-watch.mov" }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 28,
      overflow: "hidden",
      ...glassBase,
      padding: 0,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Window chrome */}
    <div
      style={{
        height: 44,
        background: "rgba(255,255,255,0.62)",
        borderBottom: `1px solid ${C.hairline}`,
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        gap: 10,
      }}
    >
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
      <div
        style={{
          marginLeft: 16,
          fontFamily: MONO,
          fontSize: 14,
          color: C.inkMuted,
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </div>
    </div>
    {/* Clip body */}
    <div style={{ flex: 1, position: "relative", background: "#0E0E12" }}>{children}</div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// FILM STRIP — sprocket-perforated horizontal frame ribbon
// ═══════════════════════════════════════════════════════════════
const FilmStrip: React.FC<{
  speed?: number;
  height?: number;
  width?: number;
  thumbColor?: string;
  thumbCount?: number;
}> = ({ speed = 1.5, height = 110, width = 1080, thumbColor = C.inkSoft, thumbCount = 8 }) => {
  const frame = useCurrentFrame();
  const offset = (frame * speed) % (140 + 12);
  const thumbW = 140;
  const gap = 12;
  return (
    <div
      style={{
        width,
        height,
        background: C.ink,
        position: "relative",
        overflow: "hidden",
        borderRadius: 6,
        boxShadow: `0 6px 14px -6px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)`,
      }}
    >
      {/* Sprocket holes top */}
      <div
        style={{
          position: "absolute",
          top: 4,
          left: 0,
          right: 0,
          height: 12,
          backgroundImage: `repeating-linear-gradient(90deg, ${C.bg} 0 14px, transparent 14px 30px)`,
          opacity: 0.85,
        }}
      />
      {/* Sprocket holes bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 4,
          left: 0,
          right: 0,
          height: 12,
          backgroundImage: `repeating-linear-gradient(90deg, ${C.bg} 0 14px, transparent 14px 30px)`,
          opacity: 0.85,
        }}
      />
      {/* Frames */}
      <div
        style={{
          position: "absolute",
          top: 22,
          bottom: 22,
          left: -offset,
          display: "flex",
          gap,
        }}
      >
        {Array.from({ length: thumbCount + 4 }).map((_, i) => {
          const tint = [C.claude, C.film, C.vector, C.plasma, C.success][i % 5];
          return (
            <div
              key={i}
              style={{
                width: thumbW,
                height: "100%",
                borderRadius: 4,
                background: `linear-gradient(135deg, ${thumbColor}, ${tint}88)`,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 0,
                  height: 0,
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderLeft: `16px solid rgba(255,255,255,0.55)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 1 — HOOK (frames 0–402, 13.44s)
// "This custom Claude skill literally watches video frame by frame.
//  Not just the transcript — the actual visuals.
//  Because in any good video, half the meaning is happening on screen, not in the words.
//  Now Claude sees both."
// ═══════════════════════════════════════════════════════════════
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Claude logo entrance — gentle scale + float
  const logoScale = spring({
    frame: frame - 4,
    fps: 30,
    config: { damping: 13, stiffness: 120 },
    from: 0.4,
    to: 1,
  });
  const logoFloat = Math.sin(frame * 0.04) * 8;
  const logoGlowPulse = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.6, 1],
  );

  // Strikethrough on "transcript" — kicks in at frame 150
  const strikeWidth = interpolate(frame, [150, 175], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.power3Out,
  });

  // TRANSCRIPT vs VISUALS card collide → BOTH at frame 280
  const collideStart = 260;
  const collideLocal = frame - collideStart;
  const transcriptX = interpolate(collideLocal, [0, 36], [-380, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.power3Out,
  });
  const visualsX = interpolate(collideLocal, [0, 36], [380, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.power3Out,
  });
  const cardOpacity = interpolate(collideLocal, [0, 12, 60, 75], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bothScale = spring({
    frame: collideLocal - 65,
    fps: 30,
    config: { damping: 11, stiffness: 130 },
    from: 0.3,
    to: 1,
  });
  const bothOpacity = interpolate(collideLocal, [65, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Scene-specific motion atmosphere */}
      <SonarRings accent={C.claude} secondary={C.film} />
      {frame < 90 && <ParticleBurst count={48} />}
      {frame < 180 && (
        <>
          <LightBeam delay={20} angle={-8} />
          <LightBeam delay={50} angle={12} />
          <LightBeam delay={95} angle={-4} />
        </>
      )}

      {/* Eyebrow */}
      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.claude}>01 / WATCH</EyebrowPill>
      </div>

      {/* Claude logo — fills the upper band above the headline */}
      <div
        style={{
          position: "absolute",
          top: 440,
          left: "50%",
          width: 300,
          height: 300,
          transform: `translate(-50%, ${logoFloat}px) scale(${logoScale})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -60,
            background: `radial-gradient(circle at 50% 50%, ${C.claude}55 0%, transparent 65%)`,
            filter: "blur(32px)",
            opacity: logoGlowPulse,
          }}
        />
        <Img
          src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)}
          style={{
            width: 300,
            height: 300,
            filter: `drop-shadow(0 16px 40px ${C.claude}88)`,
          }}
        />
      </div>

      {/* HEADLINE BAND */}
      <div style={{ position: "absolute", top: 800, left: 60, right: 60 }}>
        <StaggeredWords
          text="Claude now"
          startFrame={12}
          fontSize={104}
          fontWeight={800}
          letterSpacing="-0.045em"
          align="center"
        />
        <div style={{ marginTop: 2 }}>
          <StaggeredWords
            text="watches video."
            startFrame={32}
            fontSize={104}
            fontWeight={800}
            letterSpacing="-0.045em"
            align="center"
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <StaggeredWords
            text="Frame by frame."
            startFrame={64}
            fontSize={72}
            fontWeight={700}
            highlight="frame"
            highlightColor={C.film}
            letterSpacing="-0.035em"
            align="center"
          />
        </div>
      </div>

      {/* SUB-LINE BAND — strikethrough transcript */}
      <div
        style={{
          position: "absolute",
          top: 1180,
          left: 60,
          right: 60,
          opacity: interpolate(frame, [130, 160], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 38,
            fontWeight: 600,
            color: C.inkSoft,
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "baseline",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 10,
          }}
        >
          Not just the
          <div style={{ position: "relative", display: "inline-block" }}>
            <span style={{ color: C.crimson, fontWeight: 700 }}>transcript</span>
            <div
              style={{
                position: "absolute",
                top: "55%",
                left: -2,
                height: 4,
                width: "calc(100% + 4px)",
                background: C.crimson,
                transform: `translateY(-50%) rotate(-2deg) scaleX(${strikeWidth / 100})`,
                transformOrigin: "left center",
                boxShadow: `0 0 12px ${C.crimson}`,
                borderRadius: 2,
              }}
            />
          </div>
          <span>—</span>
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: FONT,
            fontSize: 56,
            fontWeight: 800,
            color: C.ink,
            letterSpacing: "-0.035em",
            textAlign: "center",
          }}
        >
          the <span style={{ color: C.film }}>actual visuals.</span>
        </div>
      </div>

      {/* TRANSCRIPT + VISUALS cards collide → BOTH (bottom band) */}
      <div
        style={{
          position: "absolute",
          top: 1380,
          left: 0,
          right: 0,
          height: 110,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {bothOpacity < 0.5 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div
              style={{
                ...glassBase,
                borderRadius: 18,
                padding: "16px 32px",
                fontFamily: MONO,
                fontSize: 26,
                fontWeight: 700,
                color: C.crimson,
                transform: `translateX(${transcriptX}px)`,
                opacity: cardOpacity,
                letterSpacing: "0.18em",
                border: `1.5px solid ${C.crimson}66`,
                boxShadow: `${GLASS_SHADOW}, 0 0 18px ${C.crimson}44`,
              }}
            >
              TRANSCRIPT
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 22,
                color: C.inkMuted,
                opacity: cardOpacity,
              }}
            >
              +
            </div>
            <div
              style={{
                ...glassBase,
                borderRadius: 18,
                padding: "16px 32px",
                fontFamily: MONO,
                fontSize: 26,
                fontWeight: 700,
                color: C.film,
                transform: `translateX(${visualsX}px)`,
                opacity: cardOpacity,
                letterSpacing: "0.18em",
                border: `1.5px solid ${C.film}88`,
                boxShadow: `${GLASS_SHADOW}, 0 0 18px ${C.film}66`,
              }}
            >
              VISUALS
            </div>
          </div>
        ) : (
          <div
            style={{
              ...glassBase,
              borderRadius: 22,
              padding: "20px 56px",
              fontFamily: FONT,
              fontSize: 60,
              fontWeight: 800,
              color: C.ink,
              transform: `scale(${bothScale})`,
              opacity: bothOpacity,
              boxShadow: `${GLASS_SHADOW}, 0 0 48px ${C.claude}66`,
              letterSpacing: "-0.04em",
              border: `1.5px solid ${C.claude}55`,
            }}
          >
            Now Claude sees <span style={{ color: C.claude }}>both.</span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 2 — VIRAL (frames 403–490, 2.93s)
// "Here's how you can use it. Say a YouTube video goes viral."
// ═══════════════════════════════════════════════════════════════
const ViralScene: React.FC = () => {
  const frame = useCurrentFrame();
  const ytScale = spring({
    frame: frame - 6,
    fps: 30,
    config: { damping: 9, stiffness: 130 },
    from: 0,
    to: 1,
  });
  const counterStart = 12;
  return (
    <AbsoluteFill>
      <SonarRings accent={C.crimson} secondary={C.film} />
      {frame < 30 && <ParticleBurst count={36} palette={[C.crimson, C.film, C.claude]} />}

      <div style={{ position: "absolute", top: SAFE_TOP, right: 60 }}>
        <EyebrowPill dot={C.crimson}>02 / VIRAL</EyebrowPill>
      </div>

      {/* YouTube logo */}
      <div
        style={{
          position: "absolute",
          top: 720,
          left: "50%",
          transform: `translateX(-50%) scale(${ytScale})`,
          width: 320,
          height: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: `drop-shadow(0 0 32px ${C.crimson}66)`,
        }}
      >
        <Img src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)} style={{ width: 280, height: 280 }} />
      </div>

      {/* View counter */}
      <div
        style={{
          position: "absolute",
          top: 1080,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 96,
          fontWeight: 700,
          color: C.ink,
          letterSpacing: "-0.04em",
          opacity: interpolate(frame, [counterStart, counterStart + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {Math.round(
          interpolate(frame, [counterStart, counterStart + 50], [0, 1247892], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease.expoOut,
          }),
        )
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1208,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 28,
          color: C.inkMuted,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: interpolate(frame, [40, 56], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        views • trending #1
      </div>

      {/* VIRAL stamps */}
      {[-1, 0, 1].map((idx) => {
        const stampLocal = frame - 24 - idx * 6;
        const op = interpolate(stampLocal, [0, 12, 50, 70], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = idx * 280;
        const y = -80 - Math.abs(idx) * 20;
        const rot = idx * 8;
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              top: 1380,
              left: "50%",
              transform: `translate(calc(-50% + ${x}px), ${y}px) rotate(${rot}deg) scale(${op})`,
              ...glassBase,
              borderRadius: 12,
              padding: "8px 22px",
              fontFamily: MONO,
              fontSize: 22,
              fontWeight: 700,
              color: C.crimson,
              letterSpacing: "0.18em",
              border: `2px solid ${C.crimson}`,
              boxShadow: `0 0 24px ${C.crimson}55`,
              opacity: op,
            }}
          >
            VIRAL
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 3 — DEMO (frames 491–717, 7.57s) — embeds clip 1
// "You just type slash claude watch, paste the URL, hit enter.
//  Claude studies the whole thing frame by frame and writes you a full video break down."
// ═══════════════════════════════════════════════════════════════
const DemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cmd = "/claude-watch ";
  const url = "https://youtu.be/bV-N_d7vZJM";
  const cmdLen = Math.min(cmd.length, Math.floor(frame / 2));
  const showUrl = frame >= 30;
  const enterPulse = interpolate(frame, [54, 62, 76], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor blink
  const cursor = Math.floor(frame / 12) % 2 === 0;

  // Cut to motion-art screen at local frame 100 (≈19.7s global, just after ENTER pulse).
  // VO "Plot studies the whole thing frame by frame..." starts at local frame 112 (20.12s).
  const ART_IN = 100;
  const ART_FULL = 125;
  const STUDIES_VO = 112;
  const terminalFade = interpolate(frame, [ART_IN - 6, ART_FULL - 6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const artFade = interpolate(frame, [ART_IN, ART_FULL], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });
  const breakdownLines = [
    { txt: "→ Hook  0:00–0:14", color: C.claude },
    { txt: "→ Cuts  6 scene changes", color: C.film },
    { txt: "→ Beat  1:24 reveal", color: C.vector },
    { txt: "→ Takeaway captured", color: C.success },
  ];
  const lineOp = (i: number) =>
    interpolate(frame, [STUDIES_VO + i * 18, STUDIES_VO + i * 18 + 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease.expoOut,
    });
  const lineY = (i: number) =>
    interpolate(frame, [STUDIES_VO + i * 18, STUDIES_VO + i * 18 + 14], [22, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease.power3Out,
    });
  // Scan beam sweeps across filmstrip
  const scanPct = ((Math.sin((frame - ART_IN) * 0.075) + 1) / 2) * 100;
  // Flow pulse between strip and notes card (3 dots cycling)
  const flowDot = (i: number) => {
    const t = ((frame - ART_IN) * 0.12 + i * 0.33) % 1;
    return { y: t * 60, op: Math.sin(t * Math.PI) };
  };

  return (
    <AbsoluteFill>
      <SonarRings accent={C.claude} secondary={C.film} />

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.claude}>03 / RUN IT</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", top: SAFE_TOP + 60, left: 60, right: 60 }}>
        <StaggeredWords
          text="Type. Paste. Watch."
          startFrame={4}
          fontSize={88}
          fontWeight={700}
          align="left"
          highlight="watch"
          highlightColor={C.claude}
        />
      </div>

      {/* Terminal mock card */}
      <div
        style={{
          position: "absolute",
          top: 540,
          left: 60,
          right: 60,
          ...glassBase,
          background: C.glassFillStrong,
          borderRadius: 24,
          padding: "28px 32px",
          fontFamily: MONO,
          fontSize: 38,
          color: C.ink,
          opacity: terminalFade,
          pointerEvents: terminalFade < 0.05 ? "none" : "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FEBC2E" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
          <div
            style={{
              marginLeft: 16,
              fontSize: 18,
              color: C.inkMuted,
              letterSpacing: "0.05em",
            }}
          >
            ~/claude-projects
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 4 }}>
          <span style={{ color: C.success, marginRight: 12 }}>$</span>
          <span style={{ color: C.claude, fontWeight: 600 }}>{cmd.slice(0, cmdLen)}</span>
          {showUrl && (
            <span style={{ color: C.inkMuted }}>
              {url}
            </span>
          )}
          {cursor && frame < 80 && (
            <span
              style={{
                display: "inline-block",
                width: 16,
                height: 38,
                background: C.ink,
                marginLeft: 4,
                verticalAlign: "middle",
              }}
            />
          )}
        </div>

        {/* ENTER pill */}
        <div
          style={{
            marginTop: 22,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            ...glassBase,
            borderRadius: 12,
            padding: "8px 18px",
            fontFamily: MONO,
            fontSize: 22,
            color: C.inkSoft,
            letterSpacing: "0.18em",
            transform: `scale(${1 + enterPulse * 0.15})`,
            boxShadow: `${GLASS_SHADOW}, 0 0 ${enterPulse * 32}px ${C.claude}99`,
          }}
        >
          <span>↵</span>
          <span>ENTER</span>
        </div>
      </div>

      {/* MOTION-ART SCREEN — "Plot studies frame by frame and writes a breakdown" (local 100→end) */}
      {frame >= ART_IN - 6 && (
        <div
          style={{
            position: "absolute",
            top: 540,
            left: 0,
            right: 0,
            opacity: artFade,
          }}
        >
          {/* Section caption with pulsing dot */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              fontFamily: MONO,
              fontSize: 22,
              fontWeight: 700,
              color: C.claude,
              letterSpacing: "0.22em",
              marginBottom: 22,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: C.claude,
                boxShadow: `0 0 14px ${C.claude}`,
                opacity: 0.4 + 0.6 * ((Math.sin(frame * 0.18) + 1) / 2),
              }}
            />
            FRAME-BY-FRAME ANALYSIS
          </div>

          {/* Filmstrip + scan beam */}
          <div style={{ position: "relative", margin: "0 60px" }}>
            <FilmStrip speed={6} height={210} width={960} thumbCount={9} />
            {/* Vertical scan beam */}
            <div
              style={{
                position: "absolute",
                top: -8,
                bottom: -8,
                left: `${scanPct}%`,
                width: 4,
                background: `linear-gradient(180deg, transparent, ${C.claude}, transparent)`,
                boxShadow: `0 0 24px ${C.claude}, 0 0 48px ${C.claude}88`,
                transform: "translateX(-50%)",
                pointerEvents: "none",
              }}
            />
            {/* Scan beam glow halo */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${scanPct}%`,
                width: 120,
                background: `radial-gradient(ellipse at center, ${C.claude}33, transparent 60%)`,
                transform: "translateX(-50%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Flow connector — 3 cycling dots between strip and notes */}
          <div
            style={{
              position: "relative",
              height: 80,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 36,
              marginTop: 8,
            }}
          >
            {[0, 1, 2].map((i) => {
              const f = flowDot(i);
              return (
                <div
                  key={i}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: C.claude,
                    transform: `translateY(${f.y}px)`,
                    opacity: f.op * 0.95,
                    boxShadow: `0 0 18px ${C.claude}`,
                  }}
                />
              );
            })}
          </div>

          {/* Breakdown notes card */}
          <div
            style={{
              margin: "0 60px",
              ...glassBase,
              background: C.glassFillStrong,
              borderRadius: 22,
              padding: "26px 30px",
              fontFamily: MONO,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 18,
                fontSize: 18,
                color: C.inkMuted,
                letterSpacing: "0.14em",
                fontWeight: 700,
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.success }} />
              BREAKDOWN.MD
              <span
                style={{
                  marginLeft: "auto",
                  display: "inline-block",
                  width: 12,
                  height: 22,
                  background: cursor ? C.ink : "transparent",
                }}
              />
            </div>
            {breakdownLines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 30,
                  fontWeight: 600,
                  color: line.color,
                  letterSpacing: "0.02em",
                  lineHeight: 1.55,
                  opacity: lineOp(i),
                  transform: `translateY(${lineY(i)}px)`,
                  willChange: "transform, opacity",
                }}
              >
                {line.txt}
              </div>
            ))}
          </div>
        </div>
      )}

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 4 — RESULT (frames 718–873, 5.20s) — embeds clip 2
// "A 30-minute video, broken down and rewritten, in under two minutes."
// ═══════════════════════════════════════════════════════════════
const ResultScene: React.FC = () => {
  const frame = useCurrentFrame();
  const num30Scale = spring({
    frame: frame - 4,
    fps: 30,
    config: { damping: 12, stiffness: 130 },
    from: 0.4,
    to: 1,
  });
  const num2Scale = spring({
    frame: frame - 38,
    fps: 30,
    config: { damping: 11, stiffness: 130 },
    from: 0.3,
    to: 1,
  });
  const arrowProgress = interpolate(frame, [44, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.power3Out,
  });

  // Timer ring sweep — 360deg → ~24deg (2/30 ratio)
  const ringSweep = interpolate(frame, [10, 90], [360, 24], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });

  return (
    <AbsoluteFill>
      <SonarRings accent={C.success} secondary={C.claude} />

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.success}>04 / RESULT</EyebrowPill>
      </div>

      {/* Hero numerals — compact, fit-to-1080 */}
      <div
        style={{
          position: "absolute",
          top: 440,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          fontFamily: MONO,
          fontWeight: 800,
          letterSpacing: "-0.06em",
          color: C.ink,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            transform: `scale(${num30Scale})`,
            transformOrigin: "right",
          }}
        >
          <div
            style={{
              fontSize: 140,
              color: C.crimson,
              lineHeight: 1,
              textDecoration: "line-through",
              textDecorationThickness: 6,
              textDecorationColor: `${C.crimson}cc`,
            }}
          >
            30
          </div>
          <div style={{ fontSize: 52, color: C.inkMuted, lineHeight: 1 }}>min</div>
        </div>

        {/* Arrow */}
        <div
          style={{
            position: "relative",
            width: 140,
            height: 4,
            background: `linear-gradient(90deg, ${C.crimson}, ${C.claude}, ${C.success})`,
            transform: `scaleX(${arrowProgress})`,
            transformOrigin: "left",
            opacity: arrowProgress,
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -2,
              top: -10,
              width: 0,
              height: 0,
              borderLeft: `22px solid ${C.success}`,
              borderTop: "12px solid transparent",
              borderBottom: "12px solid transparent",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            transform: `scale(${num2Scale})`,
            transformOrigin: "left",
            filter: `drop-shadow(0 0 16px ${C.success}55)`,
          }}
        >
          <div style={{ fontSize: 180, color: C.success, lineHeight: 1 }}>2</div>
          <div style={{ fontSize: 64, color: C.inkMuted, lineHeight: 1 }}>min</div>
        </div>
      </div>

      {/* Timer ring */}
      <svg
        width={100}
        height={100}
        viewBox="0 0 100 100"
        style={{
          position: "absolute",
          top: 460,
          right: 60,
          opacity: 0.85,
        }}
      >
        <circle cx={50} cy={50} r={42} fill="none" stroke={C.hairline} strokeWidth={5} />
        <circle
          cx={50}
          cy={50}
          r={42}
          fill="none"
          stroke={C.success}
          strokeWidth={5}
          strokeDasharray={`${(ringSweep / 360) * 264} 264`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ filter: `drop-shadow(0 0 8px ${C.success})` }}
        />
      </svg>

      {/* Subtitle — above clip */}
      <div
        style={{
          position: "absolute",
          top: 720,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 40,
          fontWeight: 700,
          color: C.inkSoft,
          letterSpacing: "-0.02em",
          opacity: interpolate(frame, [50, 80], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Broken down. Rewritten. <span style={{ color: C.claude }}>Done.</span>
      </div>

      {/* Embedded clip 2 — entire scene */}
      <Sequence from={0} durationInFrames={156}>
        <div
          style={{
            position: "absolute",
            top: 860,
            left: 60,
            width: 960,
            height: 540,
          }}
        >
          <LaptopFrame width={960} height={540} title="claude-watch-result.mov">
            {/* REFERENCE-STRIP: <OffthreadVideo> removed — bring your own clip */}
          </LaptopFrame>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 5 — DECODE (frames 874–1228, 11.83s)
// "You can also do this with every top creator in your niche.
//  Paste the URL, Claude breaks down what's working — the hooks, the visuals, the trends —
//  and pipes it straight into your Obsidian vector library."
// ═══════════════════════════════════════════════════════════════
const DecodeScene: React.FC = () => {
  const frame = useCurrentFrame();

  const creators = [
    { handle: "@mrbeast", color: C.crimson },
    { handle: "@garrytan", color: C.claude },
    { handle: "@aliabdaal", color: C.vector },
  ];
  const chips = ["HOOK", "VISUALS", "TRENDS"];

  return (
    <AbsoluteFill>
      <SonarRings accent={C.vector} secondary={C.claude} />

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.vector}>05 / DECODE</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", top: SAFE_TOP + 60, left: 60, right: 60 }}>
        <StaggeredWords
          text="Every top creator. Decoded."
          startFrame={4}
          fontSize={84}
          fontWeight={700}
          highlight="decoded"
          highlightColor={C.vector}
        />
      </div>

      {/* 3 creator cards */}
      {creators.map((c, i) => {
        const cardLocal = frame - (10 + i * 12);
        const cardScale = spring({
          frame: cardLocal,
          fps: 30,
          config: { damping: 12, stiffness: 120 },
          from: 0.5,
          to: 1,
        });
        const op = interpolate(cardLocal, [0, 24], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease.expoOut,
        });
        const x = 60 + i * 320;
        return (
          <div
            key={c.handle}
            style={{
              position: "absolute",
              top: 600,
              left: x,
              width: 300,
              height: 300,
              ...glassBase,
              borderRadius: 24,
              padding: 18,
              transform: `scale(${cardScale})`,
              opacity: op,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                width: "100%",
                height: 200,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${c.color}, ${C.ink})`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "32px solid white",
                  borderTop: "20px solid transparent",
                  borderBottom: "20px solid transparent",
                }}
              />
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 22,
                fontWeight: 600,
                color: C.ink,
                letterSpacing: "0.02em",
              }}
            >
              {c.handle}
            </div>
          </div>
        );
      })}

      {/* Chips above each card */}
      {chips.map((label, i) => {
        const chipLocal = frame - (80 + i * 8);
        const op = interpolate(chipLocal, [0, 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease.expoOut,
        });
        const yDrift = interpolate(chipLocal, [0, 24], [12, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease.power3Out,
        });
        const x = 110 + i * 320;
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              top: 540,
              left: x,
              transform: `translateY(${yDrift}px)`,
              opacity: op,
              ...glassBase,
              borderRadius: 8,
              padding: "6px 16px",
              fontFamily: MONO,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: [C.claude, C.film, C.vector][i],
              border: `1.5px solid ${[C.claude, C.film, C.vector][i]}`,
              boxShadow: `0 0 16px ${[C.claude, C.film, C.vector][i]}55`,
            }}
          >
            {label}
          </div>
        );
      })}

      {/* Bezier path-draw lines from cards → Obsidian */}
      <svg
        width={1080}
        height={500}
        viewBox="0 0 1080 500"
        style={{ position: "absolute", top: 920, left: 0, pointerEvents: "none" }}
      >
        {creators.map((_, i) => {
          const lineLocal = frame - (140 + i * 6);
          const drawProgress = interpolate(lineLocal, [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease.power3Out,
          });
          const startX = 210 + i * 320;
          const endX = 540;
          return (
            <path
              key={i}
              d={`M ${startX},10 C ${startX},200 ${endX},200 ${endX},400`}
              fill="none"
              stroke={[C.claude, C.film, C.vector][i]}
              strokeWidth={3}
              strokeDasharray="600"
              strokeDashoffset={(1 - drawProgress) * 600}
              style={{
                filter: `drop-shadow(0 0 8px ${[C.claude, C.film, C.vector][i]})`,
                opacity: drawProgress,
              }}
            />
          );
        })}
      </svg>

      {/* Obsidian logo + node graph */}
      <div
        style={{
          position: "absolute",
          top: 1280,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          opacity: interpolate(frame, [180, 210], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            ...glassBase,
            borderRadius: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `${GLASS_SHADOW}, 0 0 32px ${C.vector}66`,
          }}
        >
          <Img
            src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)}
            style={{
              width: 80,
              height: 80,
              filter: `drop-shadow(0 0 12px ${C.vector})`,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 22,
            color: C.inkSoft,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          obsidian vault
        </div>
      </div>

      {/* Mini node graph — appears post-Obsidian */}
      <svg
        width={1080}
        height={200}
        viewBox="0 0 1080 200"
        style={{ position: "absolute", top: 1610, left: 0, pointerEvents: "none" }}
      >
        {Array.from({ length: 9 }).map((_, i) => {
          const nodeLocal = frame - (210 + i * 4);
          const op = interpolate(nodeLocal, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const cx = 60 + (i % 9) * 120 + Math.sin(i) * 20;
          const cy = 60 + (i % 3) * 50;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={6}
              fill={C.vector}
              opacity={op * 0.85}
              style={{ filter: `drop-shadow(0 0 6px ${C.vector})` }}
            />
          );
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const lineLocal = frame - (224 + i * 3);
          const op = interpolate(lineLocal, [0, 12], [0, 0.4], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x1 = 60 + (i % 9) * 120;
          const y1 = 60 + (i % 3) * 50;
          const x2 = 60 + ((i + 1) % 9) * 120;
          const y2 = 60 + ((i + 1) % 3) * 50;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.vector} strokeWidth={1.5} opacity={op} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 6 — BRAIN (frames 1229–1428, 6.67s)
// "Your second brain just keeps getting smarter on autopilot.
//  You are literally never out of content ideas."
// ═══════════════════════════════════════════════════════════════
const BrainScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Brain SVG built from scattered nodes
  const nodes = [
    { x: 540, y: 760, r: 18, delay: 0, key: "n0" },
    { x: 420, y: 700, r: 14, delay: 4, key: "n1" },
    { x: 660, y: 700, r: 14, delay: 8, key: "n2" },
    { x: 360, y: 800, r: 12, delay: 12, key: "n3" },
    { x: 720, y: 800, r: 12, delay: 16, key: "n4" },
    { x: 480, y: 880, r: 12, delay: 20, key: "n5" },
    { x: 600, y: 880, r: 12, delay: 24, key: "n6" },
    { x: 420, y: 600, r: 10, delay: 28, key: "n7" },
    { x: 660, y: 600, r: 10, delay: 32, key: "n8" },
    { x: 540, y: 560, r: 10, delay: 36, key: "n9" },
    { x: 320, y: 750, r: 9, delay: 40, key: "n10" },
    { x: 760, y: 750, r: 9, delay: 44, key: "n11" },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 5], [0, 6], [1, 3], [2, 4], [1, 7], [2, 8],
    [7, 9], [8, 9], [3, 10], [4, 11], [5, 6], [9, 0], [1, 5], [2, 6],
  ];

  // Lightbulbs popping
  const bulbPositions = [
    { x: 180, y: 760, delay: 70 },
    { x: 920, y: 760, delay: 86 },
    { x: 200, y: 1080, delay: 102 },
    { x: 880, y: 1080, delay: 118 },
    { x: 540, y: 1380, delay: 134 },
  ];

  return (
    <AbsoluteFill>
      <SonarRings accent={C.vector} secondary={C.film} />

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.vector}>06 / BRAIN</EyebrowPill>
      </div>

      <div style={{ position: "absolute", top: SAFE_TOP + 60, left: 60, right: 60 }}>
        <StaggeredWords
          text="Second brain. On autopilot."
          startFrame={4}
          fontSize={88}
          fontWeight={700}
          highlight="autopilot"
          highlightColor={C.claude}
        />
      </div>

      {/* Brain node graph */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {edges.map(([a, b], i) => {
          const eLocal = frame - (50 + i * 2);
          const op = interpolate(eLocal, [0, 18], [0, 0.5], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const draw = interpolate(eLocal, [0, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease.power3Out,
          });
          const na = nodes[a];
          const nb = nodes[b];
          const dx = nb.x - na.x;
          const dy = nb.y - na.y;
          return (
            <line
              key={i}
              x1={na.x}
              y1={na.y}
              x2={na.x + dx * draw}
              y2={na.y + dy * draw}
              stroke={C.vector}
              strokeWidth={2}
              opacity={op}
            />
          );
        })}
        {nodes.map((n) => {
          const nLocal = frame - n.delay;
          const sc = spring({
            frame: nLocal,
            fps: 30,
            config: { damping: 10, stiffness: 130 },
            from: 0,
            to: 1,
          });
          return (
            <circle
              key={n.key}
              cx={n.x}
              cy={n.y}
              r={n.r * sc}
              fill={C.vector}
              opacity={0.95}
              style={{ filter: `drop-shadow(0 0 8px ${C.vector})` }}
            />
          );
        })}
      </svg>

      {/* Lightbulbs */}
      {bulbPositions.map((b, i) => {
        const bLocal = frame - b.delay;
        const sc = spring({
          frame: bLocal,
          fps: 30,
          config: { damping: 9, stiffness: 130 },
          from: 0,
          to: 1,
        });
        const op = interpolate(bLocal, [0, 12, 60, 80], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x - 35,
              top: b.y - 35,
              width: 70,
              height: 70,
              transform: `scale(${sc})`,
              opacity: op,
              filter: `drop-shadow(0 0 16px ${C.film})`,
            }}
          >
            <Img src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)} style={{ width: 70, height: 70 }} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${C.film}66 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />
          </div>
        );
      })}

      {/* Subline */}
      <div
        style={{
          position: "absolute",
          top: 1180,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 42,
          fontWeight: 600,
          color: C.inkSoft,
          letterSpacing: "-0.02em",
          opacity: interpolate(frame, [120, 150], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Never out of <span style={{ color: C.film, fontWeight: 700 }}>ideas.</span>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 7 — YT MID CTA (frames 1429–1545, 3.90s)
// "For the full setup tutorial, check my YouTube channel in my profile."
// ═══════════════════════════════════════════════════════════════
const YtMidCtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cardScale = spring({
    frame,
    fps: 30,
    config: { damping: 12, stiffness: 120 },
    from: 0.6,
    to: 1,
  });
  return (
    <AbsoluteFill>
      <SonarRings accent={C.crimson} secondary={C.claude} />
      <LightBeam delay={20} angle={-6} />

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.crimson}>07 / TUTORIAL</EyebrowPill>
      </div>

      {/* Centered glass CTA card */}
      <div
        style={{
          position: "absolute",
          top: 720,
          left: "50%",
          transform: `translateX(-50%) scale(${cardScale})`,
          width: 880,
          ...glassBase,
          borderRadius: 32,
          padding: "48px 56px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          boxShadow: `${GLASS_SHADOW}, 0 0 48px ${C.crimson}44`,
        }}
      >
        <Img
          src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)}
          style={{
            width: 180,
            height: 180,
            filter: `drop-shadow(0 0 24px ${C.crimson}aa)`,
          }}
        />
        <div
          style={{
            fontFamily: FONT,
            fontSize: 56,
            fontWeight: 800,
            color: C.ink,
            textAlign: "center",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          Full tutorial<br />on <span style={{ color: C.crimson }}>YouTube</span>.
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 32,
            fontWeight: 700,
            color: C.crimson,
            letterSpacing: "-0.01em",
            filter: `drop-shadow(0 0 12px ${C.crimson}66)`,
          }}
        >
          @DeviniLabs
        </div>
        <div
          style={{
            ...glassBase,
            borderRadius: 12,
            padding: "10px 22px",
            fontFamily: MONO,
            fontSize: 22,
            color: C.inkSoft,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          ↗ link in profile
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 8 — UNDER THE HOOD (frames 1546–1851, 10.20s)
// "Now here's how it actually works under the hood.
//  Claude doesn't have a native video model — so the skill splits every video
//  into the two things Claude does understand: images and text."
// ═══════════════════════════════════════════════════════════════
const HoodScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Frame splits at frame 60
  const splitProgress = interpolate(frame, [60, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.power3Out,
  });
  const leftX = -240 * splitProgress;
  const rightX = 240 * splitProgress;

  // Image grid + text grid materialize after split
  const gridFade = interpolate(frame, [100, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // No-native-video stamp
  const stampLocal = frame - 150;
  const stampScale = spring({
    frame: stampLocal,
    fps: 30,
    config: { damping: 8, stiffness: 200 },
    from: 0,
    to: 1,
  });
  const stampOp = interpolate(stampLocal, [0, 8, 60, 80], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <SonarRings accent={C.claude} secondary={C.film} />

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.claude}>08 / UNDER THE HOOD</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", top: SAFE_TOP + 60, left: 60, right: 60 }}>
        <StaggeredWords
          text="Images + text. That's all Claude needs."
          startFrame={4}
          fontSize={72}
          fontWeight={700}
          highlight="text"
          highlightColor={C.vector}
        />
      </div>

      {/* Original video frame splitting */}
      <div
        style={{
          position: "absolute",
          top: 840,
          left: "50%",
          transform: "translateX(-50%)",
          width: 480,
          height: 280,
          display: "flex",
        }}
      >
        {/* Left half */}
        <div
          style={{
            width: 240,
            height: 280,
            background: "linear-gradient(135deg, #1a1a1f, #2a2a30)",
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            transform: `translateX(${leftX}px)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Play triangle shows before split */}
          {splitProgress < 0.3 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "100%",
                transform: "translate(-50%, -50%)",
                width: 0,
                height: 0,
                borderLeft: "28px solid white",
                borderTop: "18px solid transparent",
                borderBottom: "18px solid transparent",
              }}
            />
          )}
          {/* 4×3 image grid materializes after split */}
          <div
            style={{
              position: "absolute",
              inset: 8,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "repeat(3, 1fr)",
              gap: 4,
              opacity: gridFade,
            }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: `linear-gradient(135deg, ${[C.claude, C.film, C.vector, C.plasma, C.success][i % 5]}, ${C.ink})`,
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        </div>
        {/* Right half */}
        <div
          style={{
            width: 240,
            height: 280,
            background: "linear-gradient(135deg, #2a2a30, #1a1a1f)",
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            transform: `translateX(${rightX}px)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Text lines materialize after split */}
          <div
            style={{
              position: "absolute",
              inset: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              opacity: gridFade,
              fontFamily: MONO,
              fontSize: 12,
              color: C.bg,
              lineHeight: 1.4,
            }}
          >
            {[
              "[00:14] Subject enters",
              "the frame from left,",
              "wearing a red jacket.",
              "[00:27] Cut to product",
              "shot, white background,",
              "soft lighting.",
              "[00:42] Speaker walks",
              "and talks to camera.",
            ].map((line, i) => (
              <div key={i} style={{ opacity: 0.85 }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stream labels */}
      <div
        style={{
          position: "absolute",
          top: 1160,
          left: 60,
          width: 480,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 26,
          fontWeight: 700,
          color: C.film,
          letterSpacing: "0.18em",
          opacity: gridFade,
        }}
      >
        IMAGES
      </div>
      <div
        style={{
          position: "absolute",
          top: 1160,
          right: 60,
          width: 480,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 26,
          fontWeight: 700,
          color: C.vector,
          letterSpacing: "0.18em",
          opacity: gridFade,
        }}
      >
        TEXT
      </div>

      {/* No-native-video stamp */}
      <div
        style={{
          position: "absolute",
          top: 1280,
          left: "50%",
          transform: `translateX(-50%) scale(${stampScale}) rotate(-6deg)`,
          opacity: stampOp,
          ...glassBase,
          borderRadius: 12,
          padding: "12px 28px",
          fontFamily: MONO,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: C.crimson,
          border: `2px solid ${C.crimson}`,
          boxShadow: `${GLASS_SHADOW}, 0 0 24px ${C.crimson}88`,
        }}
      >
        × NO NATIVE VIDEO MODEL
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 9 — yt-dlp (frames 1852–2152, 10.03s)
// "It uses yt-dlp to pull the video from basically any site on the internet —
//  YouTube, Loom, Instagram and over all platforms."
// ═══════════════════════════════════════════════════════════════
const YtDlpScene: React.FC = () => {
  const frame = useCurrentFrame();
  const platforms = [
    { icon: "icons/youtube.svg", label: "YouTube", color: C.crimson },
    { icon: "icons/loom.svg", label: "Loom", color: C.vector },
    { icon: "icons/instagram.svg", label: "Instagram", color: C.plasma },
    { icon: "icons/web.svg", label: "+ more", color: C.film },
  ];

  return (
    <AbsoluteFill>
      <SonarRings accent={C.success} secondary={C.claude} />

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.success}>09 / yt-dlp</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", top: SAFE_TOP + 60, left: 60, right: 60 }}>
        <StaggeredWords
          text="Pull from anywhere."
          startFrame={4}
          fontSize={92}
          fontWeight={700}
          highlight="anywhere"
          highlightColor={C.success}
        />
      </div>

      {/* Terminal pill */}
      <div
        style={{
          position: "absolute",
          top: 580,
          left: 60,
          right: 60,
          ...glassBase,
          background: C.glassFillStrong,
          borderRadius: 18,
          padding: "20px 28px",
          fontFamily: MONO,
          fontSize: 32,
          color: C.ink,
        }}
      >
        <span style={{ color: C.success }}>$</span>{" "}
        <span style={{ color: C.claude, fontWeight: 600 }}>yt-dlp</span>{" "}
        <span style={{ color: C.inkMuted }}>https://...</span>
        {Math.floor(frame / 12) % 2 === 0 && (
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 32,
              background: C.ink,
              marginLeft: 4,
              verticalAlign: "middle",
            }}
          />
        )}
      </div>

      {/* Platform constellation arc */}
      {platforms.map((p, i) => {
        const pLocal = frame - (40 + i * 9);
        const sc = spring({
          frame: pLocal,
          fps: 30,
          config: { damping: 10, stiffness: 120 },
          from: 0.4,
          to: 1,
        });
        const op = interpolate(pLocal, [0, 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const arcAngle = (-Math.PI / 2) + (i / 3) * (Math.PI * 0.6) - Math.PI * 0.3;
        const cx = 540 + Math.cos(arcAngle) * 320;
        const cy = 1080 + Math.sin(arcAngle) * 200;
        return (
          <div
            key={p.label}
            style={{
              position: "absolute",
              left: cx - 110,
              top: cy - 110,
              width: 220,
              height: 220,
              ...glassBase,
              borderRadius: 28,
              padding: 24,
              transform: `scale(${sc})`,
              opacity: op,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              boxShadow: `${GLASS_SHADOW}, 0 0 28px ${p.color}55`,
            }}
          >
            {p.icon === "icons/web.svg" ? (
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 22,
                  background: `linear-gradient(135deg, ${p.color}, ${C.claude})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT,
                  fontSize: 56,
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-0.04em",
                  boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.3), 0 0 12px ${p.color}99`,
                }}
              >
                +
              </div>
            ) : (
              <Img
                src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)}
                style={{
                  width: 90,
                  height: 90,
                  filter: `drop-shadow(0 0 12px ${p.color}99)`,
                }}
              />
            )}
            <div
              style={{
                fontFamily: MONO,
                fontSize: 18,
                fontWeight: 600,
                color: C.inkSoft,
                letterSpacing: "0.05em",
              }}
            >
              {p.label}
            </div>
          </div>
        );
      })}

      {/* Pull lines from each platform → central video file card */}
      <svg
        width={1080}
        height={500}
        viewBox="0 0 1080 500"
        style={{ position: "absolute", top: 1080, left: 0, pointerEvents: "none" }}
      >
        {platforms.map((p, i) => {
          const lineLocal = frame - (140 + i * 4);
          const draw = interpolate(lineLocal, [0, 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: ease.power3Out,
          });
          const arcAngle = (-Math.PI / 2) + (i / 3) * (Math.PI * 0.6) - Math.PI * 0.3;
          const startX = 540 + Math.cos(arcAngle) * 320;
          const startY = 0 + Math.sin(arcAngle) * 200 + 110;
          const endX = 540;
          const endY = 380;
          return (
            <line
              key={i}
              x1={startX}
              y1={startY}
              x2={startX + (endX - startX) * draw}
              y2={startY + (endY - startY) * draw}
              stroke={p.color}
              strokeWidth={2}
              strokeDasharray="4 6"
              opacity={0.75}
              style={{ filter: `drop-shadow(0 0 4px ${p.color})` }}
            />
          );
        })}
      </svg>

      {/* Central video file card */}
      <div
        style={{
          position: "absolute",
          top: 1440,
          left: "50%",
          transform: `translateX(-50%) scale(${spring({
            frame: frame - 170,
            fps: 30,
            config: { damping: 10, stiffness: 130 },
            from: 0,
            to: 1,
          })})`,
          width: 360,
          ...glassBase,
          borderRadius: 20,
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          boxShadow: `${GLASS_SHADOW}, 0 0 32px ${C.success}55`,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${C.claude}, ${C.film})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "16px solid white",
              borderTop: "10px solid transparent",
              borderBottom: "10px solid transparent",
              marginLeft: 4,
            }}
          />
        </div>
        <div>
          <div
            style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, color: C.ink }}
          >
            video.mp4
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 16,
              color: C.success,
              letterSpacing: "0.12em",
            }}
          >
            ✓ DOWNLOADED
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 10 — FFMPEG + WHISPER (frames 2153–2500, 11.60s)
// "Then FFmpeg rips out frames across the whole video and pulls a clean audio track.
//  The audio gets transcribed — free if YouTube has captions,
//  or through Whisper on Groq's free tier if not."
// ═══════════════════════════════════════════════════════════════
const FfmpegScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Part A (0–180): frame-rip
  // Part B (180–end): transcribe paths

  // Audio waveform bars
  const bars = Array.from({ length: 64 });

  // Eyebrow swap at frame 180
  const showExtract = frame < 180;

  return (
    <AbsoluteFill>
      <SonarRings accent={C.film} secondary={C.plasma} />

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={showExtract ? C.film : C.plasma}>
          {showExtract ? "10 / EXTRACT" : "11 / TRANSCRIBE"}
        </EyebrowPill>
      </div>

      {/* PART A — FFmpeg blade */}
      {showExtract && (
        <>
          <div style={{ position: "absolute", top: SAFE_TOP + 60, left: 60, right: 60 }}>
            <StaggeredWords
              text="FFmpeg rips frames + audio."
              startFrame={4}
              fontSize={72}
              fontWeight={700}
              highlight="ffmpeg"
              highlightColor={C.film}
            />
          </div>

          {/* FFmpeg logo center */}
          <div
            style={{
              position: "absolute",
              top: 600,
              left: "50%",
              transform: `translateX(-50%) rotate(${frame * 6}deg)`,
              width: 140,
              height: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: `drop-shadow(0 0 20px ${C.film}88)`,
            }}
          >
            <Img src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)} style={{ width: 120, height: 120 }} />
          </div>

          {/* Top stream — film strip */}
          <div
            style={{
              position: "absolute",
              top: 820,
              left: 0,
              right: 0,
              padding: "0 60px",
              opacity: interpolate(frame, [40, 70], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <FilmStrip speed={3} height={120} width={960} />
          </div>
          <div
            style={{
              position: "absolute",
              top: 960,
              left: 60,
              fontFamily: MONO,
              fontSize: 22,
              color: C.film,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: interpolate(frame, [60, 80], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            ▶ frame stream
          </div>

          {/* Bottom stream — waveform */}
          <div
            style={{
              position: "absolute",
              top: 1100,
              left: 60,
              right: 60,
              height: 160,
              ...glassBase,
              borderRadius: 16,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity: interpolate(frame, [80, 110], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {bars.map((_, i) => {
              const h = Math.abs(Math.sin(i * 0.4 + frame * 0.2)) * 70 + 12;
              return (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: h,
                    background: `linear-gradient(180deg, ${C.plasma}, ${C.vector})`,
                    borderRadius: 4,
                    boxShadow: `0 0 6px ${C.plasma}55`,
                  }}
                />
              );
            })}
          </div>
          <div
            style={{
              position: "absolute",
              top: 1280,
              left: 60,
              fontFamily: MONO,
              fontSize: 22,
              color: C.plasma,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: interpolate(frame, [110, 130], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            ♪ audio stream
          </div>
        </>
      )}

      {/* PART B — Transcribe branches */}
      {!showExtract && (
        <>
          <div style={{ position: "absolute", top: SAFE_TOP + 60, left: 60, right: 60 }}>
            <StaggeredWords
              text="Transcribe. Free."
              startFrame={184}
              fontSize={92}
              fontWeight={700}
              highlight="free"
              highlightColor={C.success}
            />
          </div>

          {/* Persistent waveform on top */}
          <div
            style={{
              position: "absolute",
              top: 540,
              left: 60,
              right: 60,
              height: 100,
              ...glassBase,
              borderRadius: 14,
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {bars.map((_, i) => {
              const h = Math.abs(Math.sin(i * 0.4 + frame * 0.2)) * 50 + 8;
              return (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: h,
                    background: `linear-gradient(180deg, ${C.plasma}, ${C.vector})`,
                    borderRadius: 4,
                  }}
                />
              );
            })}
          </div>

          {/* LEFT branch — YouTube CC */}
          {(() => {
            const lLocal = frame - 195;
            const sc = spring({
              frame: lLocal,
              fps: 30,
              config: { damping: 11, stiffness: 130 },
              from: 0.5,
              to: 1,
            });
            const op = interpolate(lLocal, [0, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                style={{
                  position: "absolute",
                  top: 740,
                  left: 60,
                  width: 440,
                  height: 340,
                  ...glassBase,
                  borderRadius: 24,
                  padding: 24,
                  transform: `scale(${sc})`,
                  opacity: op,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                  boxShadow: `${GLASS_SHADOW}, 0 0 24px ${C.success}55`,
                }}
              >
                <Img
                  src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)}
                  style={{
                    width: 100,
                    height: 100,
                    filter: `drop-shadow(0 0 12px ${C.crimson}88)`,
                  }}
                />
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 24,
                    fontWeight: 700,
                    color: C.ink,
                    letterSpacing: "0.06em",
                  }}
                >
                  CAPTIONS
                </div>
                <div
                  style={{
                    ...glassBase,
                    borderRadius: 8,
                    padding: "6px 16px",
                    fontFamily: MONO,
                    fontSize: 18,
                    color: C.success,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    border: `1.5px solid ${C.success}`,
                    boxShadow: `0 0 12px ${C.success}55`,
                  }}
                >
                  $0 — FREE
                </div>
              </div>
            );
          })()}

          {/* OR divider */}
          <div
            style={{
              position: "absolute",
              top: 896,
              left: 540,
              transform: "translateX(-50%)",
              fontFamily: MONO,
              fontSize: 28,
              fontWeight: 700,
              color: C.inkMuted,
              letterSpacing: "0.18em",
              opacity: interpolate(frame, [205, 225], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            OR
          </div>

          {/* RIGHT branch — Whisper / Groq */}
          {(() => {
            const rLocal = frame - 215;
            const sc = spring({
              frame: rLocal,
              fps: 30,
              config: { damping: 11, stiffness: 130 },
              from: 0.5,
              to: 1,
            });
            const op = interpolate(rLocal, [0, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                style={{
                  position: "absolute",
                  top: 740,
                  right: 60,
                  width: 440,
                  height: 340,
                  ...glassBase,
                  borderRadius: 24,
                  padding: 24,
                  transform: `scale(${sc})`,
                  opacity: op,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                  boxShadow: `${GLASS_SHADOW}, 0 0 24px ${C.film}55`,
                }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <Img
                    src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)}
                    style={{
                      width: 80,
                      height: 80,
                      filter: `drop-shadow(0 0 12px ${C.plasma}88)`,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 28,
                      fontWeight: 600,
                      color: C.plasma,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    WHISPER
                  </div>
                </div>
                <div
                  style={{
                    width: 80,
                    height: 4,
                    background: `linear-gradient(90deg, ${C.plasma}, ${C.film})`,
                    borderRadius: 2,
                  }}
                />
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <Img
                    src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)}
                    style={{
                      width: 80,
                      height: 80,
                      filter: `drop-shadow(0 0 12px ${C.film}88)`,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 28,
                      fontWeight: 700,
                      color: C.film,
                      letterSpacing: "0.04em",
                    }}
                  >
                    GROQ
                  </div>
                </div>
                <div
                  style={{
                    ...glassBase,
                    borderRadius: 8,
                    padding: "6px 16px",
                    fontFamily: MONO,
                    fontSize: 16,
                    color: C.success,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    border: `1.5px solid ${C.success}`,
                  }}
                >
                  FREE TIER
                </div>
              </div>
            );
          })()}

          {/* Output text rolling */}
          <div
            style={{
              position: "absolute",
              top: 1240,
              left: 60,
              right: 60,
              ...glassBase,
              borderRadius: 14,
              padding: "16px 20px",
              fontFamily: MONO,
              fontSize: 20,
              color: C.inkSoft,
              lineHeight: 1.5,
              opacity: interpolate(frame, [240, 270], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div style={{ color: C.success, marginBottom: 4 }}>✓ transcript.srt</div>
            <div>[00:00:00] Welcome back to the channel...</div>
            <div>[00:00:14] Today we're going to look at...</div>
            <div>[00:00:27] So the first thing you need is...</div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 11 — FLIPBOOK (frames 2501–2818, 10.60s)
// "Then everything gets handed to Claude with the timestamps lined up.
//  So Claude isn't guessing from a transcript anymore — it's flipping through
//  the frames like a flipbook while reading the script."
// ═══════════════════════════════════════════════════════════════
const FlipbookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pageIdx = Math.floor(frame / 9) % 5;
  const captions = [
    "[00:14] Subject enters frame, red jacket.",
    "[00:27] Cut to product shot, white bg.",
    "[00:42] Speaker walks toward camera.",
    "[00:58] Title card: 'How it works'.",
    "[01:14] Demo on screen, terminal visible.",
  ];

  return (
    <AbsoluteFill>
      <SonarRings accent={C.claude} secondary={C.film} />
      {frame > 60 && frame < 90 && <LightBeam delay={60} angle={-4} />}

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.claude}>12 / SYNC</EyebrowPill>
      </div>

      <div style={{ position: "absolute", top: SAFE_TOP + 60, left: 60, right: 60 }}>
        <StaggeredWords
          text="Claude reads. Claude watches."
          startFrame={4}
          fontSize={76}
          fontWeight={700}
          highlight="watches"
          highlightColor={C.film}
        />
        <div style={{ marginTop: 4 }}>
          <StaggeredWords
            text="Same time."
            startFrame={36}
            fontSize={76}
            fontWeight={700}
          />
        </div>
      </div>

      {/* Flipbook stack */}
      <div
        style={{
          position: "absolute",
          top: 700,
          left: 80,
          width: 480,
          height: 320,
          perspective: 1200,
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const isCurrent = i === pageIdx;
          const offset = i - pageIdx;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(135deg, ${[C.claude, C.film, C.vector, C.plasma, C.success][i]}, ${C.ink})`,
                borderRadius: 16,
                transform: `translate3d(${offset * 12}px, ${-offset * 8}px, ${-Math.abs(offset) * 30}px) rotateY(${offset * -8}deg)`,
                boxShadow: "0 12px 32px -8px rgba(0,0,0,0.4)",
                opacity: isCurrent ? 1 : 0.5,
                transition: "all 0.12s ease",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 14,
                  left: 14,
                  right: 14,
                  fontFamily: MONO,
                  fontSize: 16,
                  color: "white",
                  background: "rgba(0,0,0,0.4)",
                  padding: "6px 12px",
                  borderRadius: 6,
                }}
              >
                {captions[i]}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "24px solid rgba(255,255,255,0.5)",
                  borderTop: "16px solid transparent",
                  borderBottom: "16px solid transparent",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Claude logo */}
      <div
        style={{
          position: "absolute",
          top: 700,
          right: 80,
          width: 280,
          height: 320,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            ...glassBase,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `${GLASS_SHADOW}, 0 0 40px ${C.claude}77`,
          }}
        >
          <Img
            src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)}
            style={{
              width: 120,
              height: 120,
              filter: `drop-shadow(0 0 12px ${C.claude})`,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 18,
            color: C.inkMuted,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          claude
        </div>
      </div>

      {/* Caption-bubble showing what Claude sees on the current page */}
      <div
        style={{
          position: "absolute",
          top: 1080,
          left: 60,
          right: 60,
          ...glassBase,
          borderRadius: 18,
          padding: "20px 28px",
          fontFamily: MONO,
          fontSize: 26,
          color: C.ink,
          letterSpacing: "-0.01em",
          lineHeight: 1.4,
          boxShadow: `${GLASS_SHADOW}, 0 0 24px ${C.claude}33`,
        }}
      >
        <div
          style={{
            fontSize: 16,
            color: C.claude,
            letterSpacing: "0.18em",
            marginBottom: 6,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          ▸ claude sees:
        </div>
        {captions[pageIdx]}
      </div>

      {/* Timestamp pills along the bottom */}
      <div
        style={{
          position: "absolute",
          top: 1300,
          left: 60,
          right: 60,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
          opacity: interpolate(frame, [80, 120], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {["00:14", "00:27", "00:42", "00:58", "01:14"].map((ts, i) => (
          <div
            key={ts}
            style={{
              ...glassBase,
              borderRadius: 8,
              padding: "6px 14px",
              fontFamily: MONO,
              fontSize: 18,
              fontWeight: 600,
              color: i === pageIdx ? C.claude : C.inkMuted,
              border: `1px solid ${i === pageIdx ? C.claude : C.hairline}`,
              boxShadow: i === pageIdx ? `0 0 16px ${C.claude}55` : "none",
              letterSpacing: "0.05em",
            }}
          >
            {ts}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 12 — LOCAL (frames 2819–3052, 7.80s)
// "It knows exactly what's on screen the moment something is being said.
//  All running locally. No expensive video API."
// ═══════════════════════════════════════════════════════════════
const LocalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const localScale = spring({
    frame: frame - 4,
    fps: 30,
    config: { damping: 10, stiffness: 130 },
    from: 0.4,
    to: 1,
  });
  const noApiScale = spring({
    frame: frame - 24,
    fps: 30,
    config: { damping: 10, stiffness: 130 },
    from: 0.4,
    to: 1,
  });

  return (
    <AbsoluteFill>
      <SonarRings accent={C.success} secondary={C.crimson} />

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.success}>13 / LOCAL</EyebrowPill>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", top: SAFE_TOP + 60, left: 60, right: 60 }}>
        <StaggeredWords
          text="Runs on your machine."
          startFrame={4}
          fontSize={88}
          fontWeight={700}
          highlight="your"
          highlightColor={C.claude}
        />
      </div>

      {/* LOCAL chip */}
      <div
        style={{
          position: "absolute",
          top: 880,
          left: 100,
          width: 400,
          height: 300,
          ...glassBase,
          borderRadius: 24,
          padding: "32px 28px",
          transform: `scale(${localScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          border: `2px solid ${C.success}`,
          boxShadow: `${GLASS_SHADOW}, 0 0 28px ${C.success}55`,
        }}
      >
        <Img
          src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)}
          style={{
            width: 110,
            height: 110,
            filter: `drop-shadow(0 0 12px ${C.success}aa)`,
          }}
        />
        <div
          style={{
            fontFamily: MONO,
            fontSize: 32,
            fontWeight: 700,
            color: C.success,
            letterSpacing: "0.18em",
          }}
        >
          LOCAL
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 16,
            color: C.inkMuted,
            letterSpacing: "0.12em",
          }}
        >
          your machine
        </div>
      </div>

      {/* $0 API chip */}
      <div
        style={{
          position: "absolute",
          top: 880,
          right: 100,
          width: 400,
          height: 300,
          ...glassBase,
          borderRadius: 24,
          padding: "32px 28px",
          transform: `scale(${noApiScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          border: `2px solid ${C.crimson}`,
          boxShadow: `${GLASS_SHADOW}, 0 0 28px ${C.crimson}55`,
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 96,
              fontWeight: 800,
              color: C.crimson,
              letterSpacing: "-0.04em",
              filter: `drop-shadow(0 0 12px ${C.crimson}66)`,
            }}
          >
            $0
          </div>
          {/* Strikethrough */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: -8,
              right: -8,
              height: 4,
              background: C.crimson,
              transform: `translateY(-50%) scaleX(${interpolate(frame, [40, 60], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })})`,
              transformOrigin: "left",
              boxShadow: `0 0 8px ${C.crimson}`,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 24,
            fontWeight: 700,
            color: C.crimson,
            letterSpacing: "0.18em",
          }}
        >
          NO API
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 16,
            color: C.inkMuted,
            letterSpacing: "0.12em",
          }}
        >
          no monthly bills
        </div>
      </div>

      {/* Subline */}
      <div
        style={{
          position: "absolute",
          top: 1380,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 36,
          fontWeight: 600,
          color: C.inkSoft,
          letterSpacing: "-0.02em",
          opacity: interpolate(frame, [60, 90], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Frame-perfect. <span style={{ color: C.success, fontWeight: 700 }}>Wallet-perfect.</span>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 13 — COMMENT CTA (frames 3053–3155, 3.43s)
// "Comment AI to get this custom created Claude skill."
// ═══════════════════════════════════════════════════════════════
const CommentCtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const text = "AI";
  const typed = Math.min(text.length, Math.floor(frame / 9));

  const sendPulse = interpolate(frame, [40, 50, 60], [1, 1.18, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sendGlow = interpolate(frame, [40, 50, 60, 80], [0, 1, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Engagement chips — Like / Follow / Comment AI
  const chipSpring = (delay: number) =>
    spring({
      frame: frame - delay,
      fps: 30,
      config: { damping: 11, stiffness: 150 },
      from: 0,
      to: 1,
    });
  const likeScale = chipSpring(18);
  const followScale = chipSpring(28);
  const heartBeat = 1 + 0.08 * ((Math.sin(frame * 0.22) + 1) / 2);
  const followBeat = 1 + 0.08 * ((Math.sin(frame * 0.22 + 2) + 1) / 2);
  // Floating heart particles emitted from the LIKE chip
  const hearts = Array.from({ length: 5 }).map((_, i) => {
    const cycle = (frame + i * 14) % 70;
    const t = cycle / 70;
    return {
      key: i,
      x: -10 + Math.sin((frame + i * 14) * 0.08) * 18,
      y: -t * 140,
      op: Math.sin(t * Math.PI),
      scale: 0.6 + t * 0.8,
    };
  });

  return (
    <AbsoluteFill>
      <SonarRings accent={C.claude} secondary={C.film} />
      {frame > 50 && (
        <ParticleBurst count={36} palette={[C.claude, C.film, C.success]} />
      )}

      <div style={{ position: "absolute", top: SAFE_TOP, left: 60 }}>
        <EyebrowPill dot={C.claude}>14 / GET IT</EyebrowPill>
      </div>

      {/* Big "Comment AI" */}
      <div
        style={{
          position: "absolute",
          top: 540,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 800,
          color: C.ink,
          letterSpacing: "-0.04em",
          lineHeight: 1.0,
        }}
      >
        <div style={{ fontSize: 96 }}>Comment</div>
        <div
          style={{
            fontSize: 200,
            color: C.claude,
            filter: `drop-shadow(0 0 24px ${C.claude}77)`,
            transform: `scale(${spring({
              frame: frame - 8,
              fps: 30,
              config: { damping: 9, stiffness: 130 },
              from: 0.4,
              to: 1,
            })})`,
          }}
        >
          AI
        </div>
      </div>

      {/* ENGAGEMENT MOTION-ART — Like / Follow / Comment AI */}
      <div
        style={{
          position: "absolute",
          top: 880,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
        }}
      >
        {/* LIKE chip */}
        <div
          style={{
            position: "relative",
            transform: `scale(${likeScale * heartBeat})`,
            transformOrigin: "center",
          }}
        >
          <div
            style={{
              ...glassBase,
              background: C.glassFillStrong,
              borderRadius: 999,
              padding: "14px 22px 14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: `2px solid ${C.crimson}77`,
              boxShadow: `${GLASS_SHADOW}, 0 0 24px ${C.crimson}55`,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.crimson}, #FF8FAE)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 24,
                fontWeight: 800,
                boxShadow: `0 0 14px ${C.crimson}88`,
              }}
            >
              ♥
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 22,
                fontWeight: 700,
                color: C.crimson,
                letterSpacing: "0.18em",
              }}
            >
              LIKE
            </div>
          </div>
          {/* Floating hearts above the chip */}
          {hearts.map((h) => (
            <div
              key={h.key}
              style={{
                position: "absolute",
                top: -10,
                left: "50%",
                transform: `translate(${h.x}px, ${h.y}px) scale(${h.scale})`,
                color: C.crimson,
                fontSize: 22,
                opacity: h.op * 0.9,
                pointerEvents: "none",
                filter: `drop-shadow(0 0 6px ${C.crimson}aa)`,
              }}
            >
              ♥
            </div>
          ))}
        </div>

        {/* FOLLOW chip */}
        <div
          style={{
            transform: `scale(${followScale * followBeat})`,
            transformOrigin: "center",
            ...glassBase,
            background: C.glassFillStrong,
            borderRadius: 999,
            padding: "14px 22px 14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: `2px solid ${C.success}77`,
            boxShadow: `${GLASS_SHADOW}, 0 0 24px ${C.success}55`,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.success}, #5DEDB1)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1,
              boxShadow: `0 0 14px ${C.success}88`,
            }}
          >
            +
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 22,
              fontWeight: 700,
              color: C.success,
              letterSpacing: "0.18em",
            }}
          >
            FOLLOW
          </div>
        </div>

      </div>

      {/* Comment box mockup */}
      <div
        style={{
          position: "absolute",
          top: 1080,
          left: 60,
          right: 60,
          ...glassBase,
          background: C.glassFillStrong,
          borderRadius: 999,
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: FONT,
          fontSize: 32,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.claude}, ${C.film})`,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, color: C.ink, fontWeight: 600 }}>
          {text.slice(0, typed)}
          {Math.floor(frame / 12) % 2 === 0 && typed < text.length && (
            <span
              style={{
                display: "inline-block",
                width: 4,
                height: 32,
                background: C.ink,
                marginLeft: 4,
                verticalAlign: "middle",
              }}
            />
          )}
        </div>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: C.claude,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontFamily: MONO,
            fontSize: 28,
            transform: `scale(${sendPulse})`,
            boxShadow: `0 0 ${sendGlow * 32}px ${C.claude}`,
          }}
        >
          ↗
        </div>
      </div>

      {/* CTA tail */}
      <div
        style={{
          position: "absolute",
          top: 1280,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 24,
          color: C.inkMuted,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: interpolate(frame, [40, 70], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        get the custom claude skill
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════════════════════════
export const MyReelReel: React.FC<{ embedded?: boolean }> = ({
  embedded = false,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: embedded ? "transparent" : C.bg,
        fontFamily: FONT,
      }}
    >
      {!embedded && {/* REFERENCE-STRIP: voiceover tag removed — bring your own voiceover */}}

      {/* Perpetual atmosphere — runs all scenes (skipped when embedded; host provides bg+caustics) */}
      {!embedded && <CausticBlobs />}
      <FloatingGlyphs />

      <Sequence from={CW.hook} durationInFrames={CW.viral - CW.hook}>
        <HookScene />
      </Sequence>
      <Sequence from={CW.viral} durationInFrames={CW.demo - CW.viral}>
        <ViralScene />
      </Sequence>
      <Sequence from={CW.demo} durationInFrames={CW.result - CW.demo}>
        <DemoScene />
      </Sequence>
      <Sequence from={CW.result} durationInFrames={CW.decode - CW.result}>
        <ResultScene />
      </Sequence>
      <Sequence from={CW.decode} durationInFrames={CW.brain - CW.decode}>
        <DecodeScene />
      </Sequence>
      <Sequence from={CW.brain} durationInFrames={CW.ytCta - CW.brain}>
        <BrainScene />
      </Sequence>
      <Sequence from={CW.ytCta} durationInFrames={CW.hood - CW.ytCta}>
        <YtMidCtaScene />
      </Sequence>
      <Sequence from={CW.hood} durationInFrames={CW.ytdlp - CW.hood}>
        <HoodScene />
      </Sequence>
      <Sequence from={CW.ytdlp} durationInFrames={CW.ffmpeg - CW.ytdlp}>
        <YtDlpScene />
      </Sequence>
      <Sequence from={CW.ffmpeg} durationInFrames={CW.flipbook - CW.ffmpeg}>
        <FfmpegScene />
      </Sequence>
      <Sequence from={CW.flipbook} durationInFrames={CW.local - CW.flipbook}>
        <FlipbookScene />
      </Sequence>
      <Sequence from={CW.local} durationInFrames={CW.comment - CW.local}>
        <LocalScene />
      </Sequence>
      <Sequence from={CW.comment} durationInFrames={CW.end - CW.comment}>
        <CommentCtaScene />
      </Sequence>
    </AbsoluteFill>
  );
};
