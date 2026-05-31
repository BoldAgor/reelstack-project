/**
 * PaperclipBrandReel — scaffolded by ReelStack v1.4
 *
 * Family:    glass
 * Preset:    paperclip
 * Source:    reference/glass/paperclip.tsx
 * Cloned at: 2026-05-31T13:53:08.593Z
 *
 * This file is a faithful clone of the production PaperclipReel
 * — same motion vocabulary, palette, and scene structure. Canonical Devini
 * Labs hook / sub / CTA strings are still in place. REPLACE them with your
 * own content before publishing. The motion floor (≥4 layers in opener,
 * ≥3 in anchor scenes) is preserved.
 *
 * Next steps:
 *   1. Replace the hero hook, sub, and CTA copy with your reel's narrative.
 *   2. Run `/reelstack-beats <vo.wav>` to lock motion to your voiceover.
 *   3. Look for REFERENCE-STRIP markers and swap in your assets.
 *   4. Run `/reelstack-lint src/PaperclipBrandReel.tsx` and address any errors.
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  ease,
  C,
  FONT,
  MONO,
  glassBase,
  CausticBlobs,
  HairlineGrid,
  EyebrowPill,
  StaggeredWords,
  Counter,
  SonarRings,
  ParticleBurst,
  LightBeam,
  FloatingGlyphs,
} from "./GraphifyReel";

// ═══════════════════════════════════════════════════════════════
// TIMING — 55.0s @ 30fps = 1650 frames, audio-locked from whisper SRT
// ═══════════════════════════════════════════════════════════════
export const PAPERCLIP_TOTAL = 1650;

export const BEAT = {
  hook: 0,         // 0.0s
  replaced: 180,   // 6.0s — "...just replaced the entire company"
  notOpenAI: 240,  // 8.0s — "And it's not OpenAI, it's not Google"
  reveal: 270,     // 9.0s — "It's called Paperclip"
  license: 330,    // 11.0s — fully open source, MIT licensed
  companies: 410,  // 13.7s — "people are already spinning up whole companies"
  notFramework: 488, // 16.3s — "this isn't another agent framework"
  demoStart: 595,  // 19.8s — "you open paperclip..." [paperclip.mp4 begins]
  demoEnd: 1410,   // 47.0s — paperclip.mp4 ends [815f = 27.17s, NO CUTS]
  notVibe: 1410,   // 47.0s — "This isn't vibe-coding a chatbot"
  fromPhone: 1454, // 48.5s — "running an entire company from your phone"
  cta: 1561,       // 52.0s — "Comment AI" CTA
  end: 1650,       // 55.0s
} as const;

export const DEMO_DURATION = BEAT.demoEnd - BEAT.demoStart; // 815 frames = 27.17s — must match paperclip.mp4

const SAFE_TOP = 290;
const SAFE_BOTTOM = 1500;

// ═══════════════════════════════════════════════════════════════
// PAPERCLIP GLYPH — inline SVG, single-path with iridescent stroke draw-in
// ═══════════════════════════════════════════════════════════════
export const PaperclipGlyph: React.FC<{ size: number; startFrame: number; rotate?: number }> = ({
  size,
  startFrame,
  rotate = -10,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const dashOffset = interpolate(local, [0, 28], [520, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });
  const op = interpolate(local, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ transform: `rotate(${rotate}deg)`, opacity: op, willChange: "transform, opacity" }}
    >
      <defs>
        <linearGradient id="papclipIri" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.iriCyan} />
          <stop offset="50%" stopColor={C.iriViolet} />
          <stop offset="100%" stopColor={C.iriRose} />
        </linearGradient>
      </defs>
      <path
        d="M 70 30 L 70 145 A 30 30 0 0 0 130 145 L 130 55 A 18 18 0 0 0 94 55 L 94 130"
        fill="none"
        stroke="url(#papclipIri)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="520"
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
};


// ═══════════════════════════════════════════════════════════════
// ORG CHART CARD — glass card with role + dot + name
// ═══════════════════════════════════════════════════════════════
export const OrgChartCard: React.FC<{
  role: string;
  title: string;
  dotColor: string;
  startFrame: number;
  width?: number;
  height?: number;
}> = ({ role, title, dotColor, startFrame, width = 360, height = 130 }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const op = interpolate(local, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(local, [0, 28], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.power3Out,
  });
  const scale = spring({
    frame: local,
    fps: 30,
    config: { damping: 11, stiffness: 110 },
    from: 0.85,
    to: 1,
  });
  return (
    <div
      style={{
        ...glassBase,
        background: "rgba(255,255,255,0.92)",
        width,
        height,
        borderRadius: 22,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 10,
        opacity: op,
        transform: `translateX(${x}px) scale(${scale})`,
        willChange: "transform, opacity",
        boxShadow: [
          "0 24px 48px -12px rgba(120,100,180,0.30)",
          "0 8px 16px -4px rgba(120,100,180,0.18)",
          "inset 0 1.5px 0 rgba(255,255,255,1)",
          "inset 0 -1px 0 rgba(255,255,255,0.4)",
        ].join(", "),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: dotColor,
            boxShadow: `0 0 14px ${dotColor}`,
          }}
        />
        <div
          style={{
            fontFamily: MONO,
            fontSize: 14,
            fontWeight: 600,
            color: C.inkSoft,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {role}
        </div>
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 30,
          fontWeight: 800,
          color: C.ink,
          letterSpacing: "-0.025em",
          lineHeight: 1.05,
        }}
      >
        {title}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TOOL CHIP — glass pill with logo + label, used for Claude Code/Codex/Cursor
// ═══════════════════════════════════════════════════════════════
export const ToolChip: React.FC<{
  label: string;
  iconPath: string;
  iconBg?: string;
  startFrame: number;
}> = ({ label, iconPath, iconBg, startFrame }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const op = interpolate(local, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(local, [0, 28], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.power3Out,
  });
  const scale = spring({
    frame: local,
    fps: 30,
    config: { damping: 10, stiffness: 130 },
    from: 0.8,
    to: 1,
  });
  return (
    <div
      style={{
        ...glassBase,
        borderRadius: 9999,
        padding: "14px 26px 14px 16px",
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        opacity: op,
        transform: `translateY(${y}px) scale(${scale})`,
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: iconBg ?? "rgba(255,255,255,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 6,
          border: "1px solid rgba(255,255,255,0.85)",
        }}
      >
        <Img src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 700,
          color: C.ink,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DATA TILE — glass card with mono label + bold value
// ═══════════════════════════════════════════════════════════════
export const DataTile: React.FC<{
  label: string;
  value: string;
  dotColor: string;
  startFrame: number;
}> = ({ label, value, dotColor, startFrame }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const op = interpolate(local, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(local, [0, 32], [120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });
  return (
    <div
      style={{
        ...glassBase,
        borderRadius: 22,
        padding: "22px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 280,
        opacity: op,
        transform: `translateY(${y}px)`,
        willChange: "transform, opacity",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: dotColor,
            boxShadow: `0 0 12px ${dotColor}`,
          }}
        />
        <div
          style={{
            fontFamily: MONO,
            fontSize: 13,
            fontWeight: 500,
            color: C.inkMuted,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 32,
          fontWeight: 700,
          color: C.ink,
          letterSpacing: "-0.025em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// DEVICE CARD — glass-bezel container for the OffthreadVideo
// Header strip with macOS traffic-light dots + breadcrumb
// ═══════════════════════════════════════════════════════════════
export const DeviceCard: React.FC<{
  width: number;
  height: number;
  translateX: number;
  scale: number;
  opacity: number;
  children: React.ReactNode;
}> = ({ width, height, translateX, scale, opacity, children }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width,
        height,
        transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale})`,
        opacity,
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          ...glassBase,
          width: "100%",
          height: "100%",
          borderRadius: 36,
          padding: 14,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Window controls */}
        <div style={{ display: "flex", gap: 8, padding: "4px 8px 12px", alignItems: "center" }}>
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
            paperclip ▸ ai
          </div>
        </div>
        {/* Video frame */}
        <div
          style={{
            flex: 1,
            borderRadius: 22,
            overflow: "hidden",
            background: "#0E0E12",
            position: "relative",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 1 — HOOK (0–180, 6.0s) — counter opener
// "This, over 61,000 stars on GitHub project just replaced the entire company."
// ═══════════════════════════════════════════════════════════════
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Eyebrow pill
  const eyebrowOp = interpolate(frame, [6, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Counter container scale-in
  const counterScale = spring({
    frame: frame - 4,
    fps: 30,
    config: { damping: 14, stiffness: 130 },
    from: 0.7,
    to: 1,
  });
  const counterBlur = interpolate(frame, [4, 30], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });

  // Pulse on "stars" (frame 76)
  const starsPulse = interpolate(frame, [76, 80, 88], [1, 1.03, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Layer 1: sonar rings (perpetual) */}
      <SonarRings />

      {/* Layer 2: light beam sweeps */}
      <LightBeam delay={0} angle={-18} />
      <LightBeam delay={26} angle={22} />
      <LightBeam delay={60} angle={-12} />

      {/* Layer 3: floating glass glyphs */}
      <FloatingGlyphs />

      {/* Layer 4: particle burst */}
      <ParticleBurst />

      {/* Eyebrow pill: "STARS ON GITHUB" */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: eyebrowOp,
        }}
      >
        <EyebrowPill>STARS ON GITHUB</EyebrowPill>
      </div>

      {/* Counter — center stage, 220px Geist Bold, tabular-nums */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${counterScale * starsPulse})`,
            filter: `blur(${counterBlur}px)`,
            willChange: "transform, filter",
          }}
        >
          <Counter
            from={0}
            to={61800}
            startFrame={8}
            duration={56}
            easing={ease.expoOut}
            format={(n) => Math.round(n).toLocaleString("en-US")}
            style={{
              display: "inline-block",
              fontFamily: FONT,
              fontSize: 220,
              fontWeight: 800,
              color: C.ink,
              letterSpacing: "-0.07em",
              lineHeight: 0.9,
              fontVariantNumeric: "tabular-nums",
              background: `linear-gradient(135deg, ${C.iriCyan}, ${C.iriViolet}, ${C.iriRose})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          />
          {/* Star + label */}
          <div
            style={{
              marginTop: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              opacity: interpolate(frame, [50, 80], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill={C.iriGold}>
              <path d="M12 2 L14.9 8.6 L22 9.3 L16.6 14.1 L18.2 21 L12 17.3 L5.8 21 L7.4 14.1 L2 9.3 L9.1 8.6 Z" />
            </svg>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 26,
                fontWeight: 500,
                color: C.inkSoft,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              stars · paperclip on github
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Sub-headline that lands during silence after "GitHub" */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 1920 - SAFE_BOTTOM + 80,
          textAlign: "center",
          opacity: interpolate(frame, [110, 138], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <StaggeredWords
          text="just replaced the entire company."
          startFrame={120}
          fontSize={62}
          fontWeight={600}
          color={C.inkSoft}
          letterSpacing="-0.03em"
          align="center"
          highlight="company"
          highlightColor={C.iriRose}
        />
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 2 — REPLACED (180–240, 2.0s) — building tiles get crossed out
// ═══════════════════════════════════════════════════════════════
const ReplacedScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.replaced;

  const headlineOp = interpolate(local, [0, 22], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <FloatingGlyphs />

      {/* Eyebrow */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 30,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(local, [0, 16], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <EyebrowPill>WHAT THIS DOES</EyebrowPill>
      </div>

      {/* Headline */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 130,
          left: 80,
          right: 80,
          opacity: headlineOp,
        }}
      >
        <StaggeredWords
          text="It just replaced the entire"
          startFrame={BEAT.replaced + 4}
          fontSize={88}
          fontWeight={800}
          color={C.ink}
          align="left"
        />
        <div style={{ height: 6 }} />
        <StaggeredWords
          text="company."
          startFrame={BEAT.replaced + 28}
          fontSize={120}
          fontWeight={800}
          color={C.iriRose}
          align="left"
          letterSpacing="-0.05em"
        />
      </div>

      {/* Three building tiles getting struck out */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1100,
          display: "flex",
          gap: 24,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {[
          { label: "Engineering", strikeAt: 195 },
          { label: "Marketing", strikeAt: 205 },
          { label: "Operations", strikeAt: 215 },
        ].map((b, i) => {
          const cardLocal = frame - (BEAT.replaced + 6 + i * 6);
          const op = interpolate(cardLocal, [0, 18], [0, 1], { extrapolateRight: "clamp" });
          const y = interpolate(cardLocal, [0, 24], [40, 0], {
            extrapolateRight: "clamp",
            easing: ease.power3Out,
          });
          const struckLocal = frame - (b.strikeAt + 12);
          const dimOp = interpolate(struckLocal, [0, 12], [1, 0.45], { extrapolateRight: "clamp" });
          return (
            <div
              key={i}
              style={{
                ...glassBase,
                width: 280,
                height: 200,
                borderRadius: 24,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                gap: 10,
                opacity: op * dimOp,
                transform: `translateY(${y}px)`,
                position: "relative",
                willChange: "transform, opacity",
              }}
            >
              {/* Building icon */}
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.inkMuted}
                strokeWidth="1.4"
                style={{ position: "absolute", top: 24, left: 24 }}
              >
                <rect x="4" y="3" width="16" height="18" rx="1" />
                <line x1="9" y1="7" x2="9" y2="7" />
                <line x1="9" y1="11" x2="9" y2="11" />
                <line x1="9" y1="15" x2="9" y2="15" />
                <line x1="15" y1="7" x2="15" y2="7" />
                <line x1="15" y1="11" x2="15" y2="11" />
                <line x1="15" y1="15" x2="15" y2="15" />
                <line x1="10" y1="21" x2="14" y2="21" />
              </svg>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 26,
                  fontWeight: 700,
                  color: C.ink,
                  letterSpacing: "-0.02em",
                }}
              >
                {b.label}
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  color: C.inkDim,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Department
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 3 — NOT OPENAI / GOOGLE (240–270, 1.0s)
// "And it's not OpenAI, it's not Google."
// ═══════════════════════════════════════════════════════════════
const NotOpenAIScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.notOpenAI;

  const headOp = interpolate(local, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const headY = interpolate(local, [0, 24], [30, 0], {
    extrapolateRight: "clamp",
    easing: ease.power3Out,
  });

  const cardScale1 = spring({
    frame: local - 2,
    fps: 30,
    config: { damping: 12, stiffness: 130 },
    from: 0.85,
    to: 1,
  });
  const cardScale2 = spring({
    frame: local - 8,
    fps: 30,
    config: { damping: 12, stiffness: 130 },
    from: 0.85,
    to: 1,
  });

  return (
    <AbsoluteFill>
      <FloatingGlyphs />

      {/* Headline */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 80,
          left: 80,
          right: 80,
          textAlign: "center",
          opacity: headOp,
          transform: `translateY(${headY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 22,
            fontWeight: 500,
            color: C.inkMuted,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          and it's
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 110,
            fontWeight: 800,
            color: C.ink,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          not these.
        </div>
      </div>

      {/* Two big logo cards */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1000,
          display: "flex",
          gap: 30,
          justifyContent: "center",
        }}
      >
        {/* OpenAI */}
        <div
          style={{
            ...glassBase,
            width: 380,
            height: 380,
            borderRadius: 32,
            padding: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            position: "relative",
            transform: `scale(${cardScale1})`,
            willChange: "transform",
          }}
        >
          <Img
            src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)}
            style={{ width: 160, height: 160, objectFit: "contain" }}
          />
          <div
            style={{
              fontFamily: FONT,
              fontSize: 30,
              fontWeight: 700,
              color: C.ink,
              letterSpacing: "-0.02em",
            }}
          >
            OpenAI
          </div>
        </div>

        {/* Google */}
        <div
          style={{
            ...glassBase,
            width: 380,
            height: 380,
            borderRadius: 32,
            padding: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            position: "relative",
            transform: `scale(${cardScale2})`,
            willChange: "transform",
          }}
        >
          <Img
            src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)}
            style={{ width: 160, height: 160, objectFit: "contain" }}
          />
          <div
            style={{
              fontFamily: FONT,
              fontSize: 30,
              fontWeight: 700,
              color: C.ink,
              letterSpacing: "-0.02em",
            }}
          >
            Google
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 4 — REVEAL (270–330, 2.0s) — "It's called Paperclip"
// ═══════════════════════════════════════════════════════════════
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.reveal;

  const wordmarkScale = spring({
    frame: local - 10,
    fps: 30,
    config: { damping: 11, stiffness: 120 },
    from: 0.85,
    to: 1,
  });
  const wordmarkOp = interpolate(local, [10, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Particle burst sparkle */}
      <ParticleBurst />

      {/* Eyebrow */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 60,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(local, [0, 18], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <EyebrowPill>IT'S CALLED</EyebrowPill>
      </div>

      {/* Glyph + wordmark */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          transform: `scale(${wordmarkScale})`,
          willChange: "transform",
        }}
      >
        <PaperclipGlyph size={210} startFrame={BEAT.reveal} rotate={-12} />
        <div
          style={{
            fontFamily: FONT,
            fontSize: 180,
            fontWeight: 800,
            letterSpacing: "-0.05em",
            lineHeight: 0.9,
            opacity: wordmarkOp,
            background: `linear-gradient(135deg, ${C.iriCyan}, ${C.iriViolet}, ${C.iriRose})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Paperclip
        </div>
      </div>

      {/* Tag underneath */}
      <div
        style={{
          marginTop: 24,
          fontFamily: MONO,
          fontSize: 22,
          fontWeight: 500,
          color: C.inkSoft,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: interpolate(local, [30, 50], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        an org-chart that hires itself
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 5 — LICENSE (330–410, 2.7s) — MIT / Open Source / 61.8k★
// ═══════════════════════════════════════════════════════════════
const LicenseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.license;

  const pills = [
    { label: "MIT LICENSED", dot: C.iriCyan, delay: 10, icon: null },
    { label: "OPEN SOURCE", dot: C.iriViolet, delay: 18, icon: null },
    { label: "61.8K STARS", dot: C.iriGold, delay: 26, icon: "icons/github.svg" },
  ];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <FloatingGlyphs />

      {/* Headline */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 80,
          left: 80,
          right: 80,
          textAlign: "center",
          opacity: interpolate(local, [4, 30], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <StaggeredWords
          text="Already powering real businesses."
          startFrame={BEAT.license + 4}
          fontSize={72}
          fontWeight={700}
          color={C.ink}
          align="center"
          highlight="real"
          highlightColor={C.iriViolet}
        />
      </div>

      {/* Three glass pills cascading in vertically */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 22,
          alignItems: "center",
          marginTop: 80,
        }}
      >
        {pills.map((p, i) => {
          const pillLocal = frame - (BEAT.license + p.delay);
          const op = interpolate(pillLocal, [0, 18], [0, 1], { extrapolateRight: "clamp" });
          const y = interpolate(pillLocal, [0, 28], [60, 0], {
            extrapolateRight: "clamp",
            easing: ease.expoOut,
          });
          const scale = spring({
            frame: pillLocal,
            fps: 30,
            config: { damping: 11, stiffness: 110 },
            from: 0.9,
            to: 1,
          });
          return (
            <div
              key={i}
              style={{
                ...glassBase,
                borderRadius: 9999,
                padding: "20px 36px",
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                opacity: op,
                transform: `translateY(${y}px) scale(${scale})`,
                willChange: "transform, opacity",
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: p.dot,
                  boxShadow: `0 0 18px ${p.dot}`,
                }}
              />
              {p.icon && (
                <Img
                  src={staticFile("captures/your-asset.png" /* REFERENCE-STRIP */)}
                  style={{ width: 26, height: 26, objectFit: "contain" }}
                />
              )}
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 26,
                  fontWeight: 600,
                  color: C.ink,
                  letterSpacing: "0.14em",
                }}
              >
                {p.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 6 — COMPANIES (410–488, 2.6s) — "spinning up whole companies"
// ═══════════════════════════════════════════════════════════════
const CompaniesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.companies;

  const companies = [
    { name: "Halcyon Studio", role: "Brand & Web", x: -340, dot: C.iriCyan, delay: 10 },
    { name: "Atlas Foundry", role: "Hardware Lab", x: 0, dot: C.iriViolet, delay: 18 },
    { name: "Meridian Labs", role: "AI Research", x: 340, dot: C.iriRose, delay: 26 },
  ];

  return (
    <AbsoluteFill>
      <FloatingGlyphs />

      {/* Headline */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 60,
          left: 80,
          right: 80,
          textAlign: "center",
          opacity: interpolate(local, [0, 24], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <StaggeredWords
          text="People are spinning up whole"
          startFrame={BEAT.companies + 4}
          fontSize={72}
          fontWeight={600}
          color={C.inkSoft}
          align="center"
        />
        <div style={{ height: 6 }} />
        <StaggeredWords
          text="companies on it."
          startFrame={BEAT.companies + 22}
          fontSize={96}
          fontWeight={800}
          color={C.ink}
          align="center"
          highlight="companies"
          highlightColor={C.iriViolet}
        />
      </div>

      {/* Three company cards drift into a row */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1080,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {companies.map((co, i) => {
          const coLocal = frame - (BEAT.companies + co.delay);
          const op = interpolate(coLocal, [0, 22], [0, 1], { extrapolateRight: "clamp" });
          // Drift from chaos to alignment
          const xOffset = interpolate(coLocal, [0, 32], [(i - 1) * 60, 0], {
            extrapolateRight: "clamp",
            easing: ease.backOut,
          });
          const yOffset = interpolate(coLocal, [0, 32], [80 - i * 30, 0], {
            extrapolateRight: "clamp",
            easing: ease.backOut,
          });
          const rot = interpolate(coLocal, [0, 32], [(i - 1) * 4, 0], {
            extrapolateRight: "clamp",
            easing: ease.expoOut,
          });
          return (
            <div
              key={i}
              style={{
                ...glassBase,
                position: "absolute",
                left: "50%",
                width: 300,
                height: 200,
                marginLeft: -150,
                borderRadius: 24,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: op,
                transform: `translateX(${co.x + xOffset}px) translateY(${yOffset}px) rotate(${rot}deg)`,
                willChange: "transform, opacity",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: co.dot,
                    boxShadow: `0 0 14px ${co.dot}`,
                  }}
                />
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    color: C.inkMuted,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  built on paperclip
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 28,
                    fontWeight: 700,
                    color: C.ink,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.05,
                  }}
                >
                  {co.name}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: MONO,
                    fontSize: 13,
                    color: C.inkDim,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {co.role}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 7 — NOT FRAMEWORK (488–595, 3.6s) — strikethrough list
// ═══════════════════════════════════════════════════════════════
const NotFrameworkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.notFramework;

  const frameworks = [
    { label: "LangChain", appearAt: 4, strikeAt: 22 },
    { label: "AutoGPT", appearAt: 12, strikeAt: 36 },
    { label: "CrewAI", appearAt: 20, strikeAt: 50 },
    { label: "Yet another framework", appearAt: 28, strikeAt: 64 },
  ];

  return (
    <AbsoluteFill>
      <FloatingGlyphs />

      {/* Eyebrow */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 30,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(local, [0, 14], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <EyebrowPill>HERE'S THE THING</EyebrowPill>
      </div>

      {/* List of crossed-out frameworks */}
      <div
        style={{
          position: "absolute",
          left: 100,
          right: 100,
          top: SAFE_TOP + 130,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {frameworks.map((f, i) => {
          const fwLocal = frame - (BEAT.notFramework + f.appearAt);
          const op = interpolate(fwLocal, [0, 16], [0, 1], { extrapolateRight: "clamp" });
          const x = interpolate(fwLocal, [0, 24], [40, 0], {
            extrapolateRight: "clamp",
            easing: ease.power3Out,
          });
          const struckLocal = frame - (BEAT.notFramework + f.strikeAt + 14);
          const dim = interpolate(struckLocal, [0, 12], [1, 0.35], { extrapolateRight: "clamp" });
          return (
            <div
              key={i}
              style={{
                ...glassBase,
                width: 880,
                height: 84,
                borderRadius: 18,
                padding: "0 30px",
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: op * dim,
                transform: `translateX(${x}px)`,
                position: "relative",
                willChange: "transform, opacity",
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 18,
                  fontWeight: 500,
                  color: C.inkDim,
                  letterSpacing: "0.18em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 36,
                  fontWeight: 700,
                  color: C.ink,
                  letterSpacing: "-0.02em",
                }}
              >
                {f.label}
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  fontFamily: MONO,
                  fontSize: 14,
                  color: C.inkMuted,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                agent framework
              </div>
            </div>
          );
        })}
      </div>

      {/* Punch headline below the list, lands at frame 575 (local 87) */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1280,
          textAlign: "center",
          opacity: interpolate(local, [80, 100], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(local, [80, 100], [30, 0], {
            extrapolateRight: "clamp",
            easing: ease.expoOut,
          })}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 86,
            fontWeight: 800,
            color: C.ink,
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
          }}
        >
          Paperclip is different.
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: MONO,
            fontSize: 26,
            fontWeight: 500,
            color: C.iriViolet,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          it hires.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 8 — DEMO (595–1410, 27.17s) — paperclip.mp4 UNCUT, 4 sub-acts
// Sub-act A (Boot, 595–760): scale-in, CEO sonar pulse
// Sub-act B (Roster, 760–1037): translateX -120, org cards stack right
// Sub-act C (Tools, 1037–1265): translateX 0, iridescent ring + tool chips
// Sub-act D (Discipline, 1265–1410): dim, data trio flies in
// ═══════════════════════════════════════════════════════════════
const DemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.demoStart;

  // Device card scale-in (sub-act A)
  const bootScale = spring({
    frame: local,
    fps: 30,
    config: { damping: 14, stiffness: 130 },
    from: 0.92,
    to: 1,
  });

  // Device stays centered through every sub-act (no translateX).
  const translateX = 0;

  // Sub-act D: device dim at frame 1265 (local 670)
  const deviceOpacity = interpolate(local, [670, 700], [1, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Org cards visible during sub-act B (frame 760 → local 165),
  // fade out cleanly when tool chips appear in sub-act C (frame 1037 → local 442)
  const orgCardOp = interpolate(local, [442, 470], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sonar pulse on CEO spawn at frame 700 (local 105)
  const sonarLocal = frame - 700;

  // Boot caption pop at frame 705 (local 110)
  const captionLocal = frame - 705;
  const captionOp = interpolate(captionLocal, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const captionY = interpolate(captionLocal, [0, 28], [30, 0], {
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });
  // Caption fades out at sub-act B kick-in (frame 760)
  const captionFadeOut = interpolate(frame, [752, 772], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Device card with the OffthreadVideo inside */}
      <DeviceCard
        width={960}
        height={760}
        translateX={translateX}
        scale={bootScale}
        opacity={deviceOpacity}
      >
        <Sequence from={BEAT.demoStart} durationInFrames={DEMO_DURATION}>
          {/* REFERENCE-STRIP: <OffthreadVideo> removed — bring your own clip */}
        </Sequence>
      </DeviceCard>

      {/* Sub-act A: Sonar pulse anchored to device top-right area */}
      {frame >= 700 && frame < 760 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(180px, -300px)",
            width: 240,
            height: 240,
          }}
        >
          {[0, 14].map((delay, i) => {
            const cycle = sonarLocal - delay;
            if (cycle < 0) return null;
            const ringScale = interpolate(cycle, [0, 50], [0.2, 1.4], {
              extrapolateRight: "clamp",
              easing: ease.expoOut,
            });
            const op = interpolate(cycle, [0, 12, 50], [0, 0.7, 0], {
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `2px solid ${C.iriViolet}`,
                  transform: `scale(${ringScale})`,
                  opacity: op,
                  willChange: "transform, opacity",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Sub-act A: caption "CEO AGENT SPAWNED" */}
      {frame >= 705 && frame < 772 && (
        <div
          style={{
            position: "absolute",
            top: SAFE_TOP - 40,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: captionOp * captionFadeOut,
            transform: `translateY(${captionY}px)`,
          }}
        >
          <EyebrowPill>CEO AGENT SPAWNED</EyebrowPill>
        </div>
      )}

      {/* Sub-act B: roster as 2x2 grid ABOVE the centered device */}
      {frame >= 760 && frame < 1040 && (
        <div
          style={{
            position: "absolute",
            top: 1380,
            left: 80,
            right: 80,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            opacity: orgCardOp,
            willChange: "opacity",
          }}
        >
          <OrgChartCard
            role="founder · 24/7"
            title="CEO Agent"
            dotColor={C.iriCyan}
            startFrame={760}
            width={460}
            height={104}
          />
          <OrgChartCard
            role="ic · 12 seats"
            title="Engineers"
            dotColor={C.iriViolet}
            startFrame={905}
            width={460}
            height={104}
          />
          <OrgChartCard
            role="growth lead"
            title="Marketing Director"
            dotColor={C.iriRose}
            startFrame={942}
            width={460}
            height={104}
          />
          <OrgChartCard
            role="content"
            title="Copywriter"
            dotColor={C.iriGold}
            startFrame={1009}
            width={460}
            height={104}
          />
        </div>
      )}

      {/* Sub-act B: caption "HIRING ROSTER" */}
      {frame >= 770 && frame < 1040 && (
        <div
          style={{
            position: "absolute",
            top: SAFE_TOP - 40,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [770, 790, 1020, 1040], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <EyebrowPill>HIRING ROSTER · 24/7</EyebrowPill>
        </div>
      )}

      {/* Sub-act C: three tool chips in a row above the device */}
      {frame >= 1037 && frame < 1290 && (
        <div
          style={{
            position: "absolute",
            top: 280,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
            opacity: interpolate(frame, [1265, 1290], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <ToolChip
            label="Claude Code"
            iconPath="icons/claude.svg"
            iconBg="rgba(255,255,255,0.7)"
            startFrame={1068}
          />
          <ToolChip
            label="Codex"
            iconPath="icons/openai.svg"
            iconBg="rgba(255,255,255,0.7)"
            startFrame={1095}
          />
          <ToolChip
            label="Cursor"
            iconPath="icons/cursor.svg"
            iconBg="#0E0E12"
            startFrame={1115}
          />
        </div>
      )}

      {/* Sub-act C: caption */}
      {frame >= 1040 && frame < 1290 && (
        <div
          style={{
            position: "absolute",
            top: SAFE_TOP - 40,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [1045, 1065, 1265, 1290], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <EyebrowPill>REAL AI AGENTS</EyebrowPill>
        </div>
      )}

      {/* Sub-act D: data trio at the bottom */}
      {frame >= 1265 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 200,
            display: "flex",
            justifyContent: "center",
            gap: 18,
          }}
        >
          <DataTile
            label="Budget"
            value="$200/mo"
            dotColor={C.iriGold}
            startFrame={1270}
          />
          <DataTile
            label="Job Title"
            value="CEO"
            dotColor={C.iriViolet}
            startFrame={1276}
          />
          <DataTile
            label="Reports To"
            value="→ You"
            dotColor={C.iriCyan}
            startFrame={1282}
          />
        </div>
      )}

      {/* Sub-act D: caption */}
      {frame >= 1265 && (
        <div
          style={{
            position: "absolute",
            top: SAFE_TOP - 40,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [1270, 1290], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <EyebrowPill>EVERY AGENT IS ACCOUNTABLE</EyebrowPill>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 9 — NOT VIBE (1410–1454, 1.5s) — strikethrough on "vibe-coding"
// ═══════════════════════════════════════════════════════════════
const NotVibeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.notVibe;

  const op = interpolate(local, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(local, [0, 24], [30, 0], {
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <FloatingGlyphs />

      <div
        style={{
          position: "relative",
          textAlign: "center",
          opacity: op,
          transform: `translateY(${y}px)`,
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 90,
            fontWeight: 800,
            color: C.ink,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          This isn't{" "}
          <span style={{ color: C.inkDim, fontWeight: 500 }}>vibe-coding</span>{" "}
          a chatbot.
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: MONO,
            fontSize: 24,
            fontWeight: 500,
            color: C.iriViolet,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          this is an org.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 10 — FROM PHONE (1454–1561, 3.6s)
// "running an entire company from your phone"
// ═══════════════════════════════════════════════════════════════
const FromPhoneScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.fromPhone;

  const phoneScale = spring({
    frame: local,
    fps: 30,
    config: { damping: 13, stiffness: 120 },
    from: 0.8,
    to: 1,
  });
  const phoneOp = interpolate(local, [0, 22], [0, 1], { extrapolateRight: "clamp" });

  // Tiny org chart inside the phone — 4 mini cards
  const miniCards = [
    { label: "CEO", dot: C.iriCyan, at: BEAT.fromPhone + 16 },
    { label: "Engineers", dot: C.iriViolet, at: BEAT.fromPhone + 22 },
    { label: "Marketing", dot: C.iriRose, at: BEAT.fromPhone + 28 },
    { label: "Copy", dot: C.iriGold, at: BEAT.fromPhone + 34 },
  ];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <FloatingGlyphs />

      {/* Headline above */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 40,
          left: 80,
          right: 80,
          textAlign: "center",
          opacity: interpolate(local, [0, 24], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <StaggeredWords
          text="Run a whole company"
          startFrame={BEAT.fromPhone + 4}
          fontSize={72}
          fontWeight={600}
          color={C.inkSoft}
          align="center"
        />
        <div style={{ height: 4 }} />
        <StaggeredWords
          text="from your phone."
          startFrame={BEAT.fromPhone + 22}
          fontSize={92}
          fontWeight={800}
          color={C.ink}
          align="center"
          highlight="phone"
          highlightColor={C.iriViolet}
        />
      </div>

      {/* Phone mockup */}
      <div
        style={{
          position: "relative",
          width: 360,
          height: 720,
          opacity: phoneOp,
          transform: `scale(${phoneScale})`,
          willChange: "transform, opacity",
        }}
      >
        {/* Phone bezel */}
        <div
          style={{
            ...glassBase,
            position: "absolute",
            inset: 0,
            borderRadius: 56,
            padding: 16,
            background: "rgba(14,14,18,0.92)",
            border: "1.5px solid rgba(255,255,255,0.18)",
            boxShadow: [
              "0 30px 60px -16px rgba(120,100,180,0.35)",
              "inset 0 1.5px 0 rgba(255,255,255,0.4)",
            ].join(", "),
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              width: 110,
              height: 28,
              borderRadius: 14,
              background: "#000",
              zIndex: 2,
            }}
          />
          {/* Screen */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 42,
              background: `linear-gradient(160deg, ${C.iriCyan}22, ${C.iriViolet}33, ${C.iriRose}22)`,
              padding: "60px 18px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              overflow: "hidden",
            }}
          >
            {/* Mini app header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
                padding: "0 6px",
              }}
            >
              <PaperclipGlyph size={28} startFrame={BEAT.fromPhone + 6} rotate={-12} />
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                paperclip
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: C.iriCyan,
                  boxShadow: `0 0 10px ${C.iriCyan}`,
                }}
              />
            </div>
            {/* Mini cards */}
            {miniCards.map((m, i) => {
              const cardLocal = frame - m.at;
              const op = interpolate(cardLocal, [0, 14], [0, 1], { extrapolateRight: "clamp" });
              const x = interpolate(cardLocal, [0, 22], [40, 0], {
                extrapolateRight: "clamp",
                easing: ease.power3Out,
              });
              return (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 14,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    opacity: op,
                    transform: `translateX(${x}px)`,
                    willChange: "transform, opacity",
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: m.dot,
                      boxShadow: `0 0 10px ${m.dot}`,
                    }}
                  />
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#fff",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {m.label}
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      fontFamily: MONO,
                      fontSize: 11,
                      color: "rgba(255,255,255,0.55)",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                    }}
                  >
                    active
                  </div>
                </div>
              );
            })}
            <div style={{ flex: 1 }} />
            <div
              style={{
                fontFamily: MONO,
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textAlign: "center",
                padding: "8px 0",
              }}
            >
              org running · 24/7
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE 11 — CTA (1561–1650, 3.0s) — "Comment AI"
// ═══════════════════════════════════════════════════════════════
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.cta;

  // Eyebrow pill (frame 1561 → local 0)
  const eyebrowOp = interpolate(local, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // "Comment" word (frame 1568 → local 7)
  const commentOp = interpolate(local, [7, 28], [0, 1], { extrapolateRight: "clamp" });
  const commentY = interpolate(local, [7, 28], [28, 0], {
    extrapolateRight: "clamp",
    easing: ease.expoOut,
  });

  // "AI" word (frame 1580 → local 19)
  const aiScale = spring({
    frame: local - 19,
    fps: 30,
    config: { damping: 11, stiffness: 120 },
    from: 0.85,
    to: 1,
  });
  const aiOp = interpolate(local, [19, 35], [0, 1], { extrapolateRight: "clamp" });

  // Caption (frame 1592 → local 31)
  const captionOp = interpolate(local, [31, 50], [0, 1], { extrapolateRight: "clamp" });

  // Pill (frame 1605 → local 44)
  const pillOp = interpolate(local, [44, 70], [0, 1], { extrapolateRight: "clamp" });
  const pillScale = spring({
    frame: local - 44,
    fps: 30,
    config: { damping: 12, stiffness: 100 },
    from: 0.85,
    to: 1,
  });

  // Follow line (frame 1625 → local 64)
  const followOp = interpolate(local, [64, 86], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Sparkle particle burst (re-fires at frame 1574 / local 13 and 1640 / local 79) */}
      {frame >= 1574 && frame < 1640 && <ParticleBurst />}

      {/* Eyebrow pill */}
      <div
        style={{
          position: "absolute",
          top: SAFE_TOP + 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: eyebrowOp,
        }}
      >
        <EyebrowPill>GET THE LINK</EyebrowPill>
      </div>

      {/* Headline stack */}
      <div style={{ textAlign: "center", marginTop: -100 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 56,
            fontWeight: 500,
            color: C.inkMuted,
            letterSpacing: "-0.02em",
            opacity: commentOp,
            transform: `translateY(${commentY}px)`,
          }}
        >
          Comment
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 240,
            fontWeight: 800,
            letterSpacing: "-0.07em",
            lineHeight: 0.9,
            opacity: aiOp,
            transform: `scale(${aiScale})`,
            background: `linear-gradient(135deg, ${C.iriCyan}, ${C.iriViolet}, ${C.iriRose})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            willChange: "transform",
          }}
        >
          "AI"
        </div>
        <div
          style={{
            marginTop: -8,
            fontFamily: FONT,
            fontSize: 44,
            fontWeight: 500,
            color: C.inkMuted,
            letterSpacing: "-0.02em",
            opacity: captionOp,
          }}
        >
          and I'll DM the GitHub repo.
        </div>
      </div>

      {/* Iridescent pill with handle */}
      <div
        style={{
          position: "relative",
          marginTop: 36,
          opacity: pillOp,
          transform: `scale(${pillScale})`,
          willChange: "transform, opacity",
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
            opacity: 0.85,
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
              fontSize: 36,
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
          marginTop: 32,
          opacity: followOp,
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
// MAIN — orchestrate scenes with audio at root
// ═══════════════════════════════════════════════════════════════
export const PaperclipBrandReel: React.FC = () => {
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
      {/* Voiceover — single Audio at root, no Sequence wrap */}
      {/* REFERENCE-STRIP: voiceover tag removed — bring your own voiceover */}

      {/* Perpetual layers */}
      <CausticBlobs />
      <HairlineGrid opacity={0.04} />

      {/* Film-grain noise (fixed pseudo-element pattern) */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          opacity: 0.06,
          pointerEvents: "none",
          mixBlendMode: "multiply",
        }}
      />

      {/* Scenes — conditional render so useCurrentFrame() stays GLOBAL inside each scene */}
      {frame >= BEAT.hook && frame < BEAT.replaced && <HookScene />}
      {frame >= BEAT.replaced && frame < BEAT.notOpenAI && <ReplacedScene />}
      {frame >= BEAT.notOpenAI && frame < BEAT.reveal && <NotOpenAIScene />}
      {frame >= BEAT.reveal && frame < BEAT.license && <RevealScene />}
      {frame >= BEAT.license && frame < BEAT.companies && <LicenseScene />}
      {frame >= BEAT.companies && frame < BEAT.notFramework && <CompaniesScene />}
      {frame >= BEAT.notFramework && frame < BEAT.demoStart && <NotFrameworkScene />}
      {frame >= BEAT.demoStart && frame < BEAT.demoEnd && <DemoScene />}
      {frame >= BEAT.notVibe && frame < BEAT.fromPhone && <NotVibeScene />}
      {frame >= BEAT.fromPhone && frame < BEAT.cta && <FromPhoneScene />}
      {frame >= BEAT.cta && frame < BEAT.end && <CTAScene />}
    </AbsoluteFill>
  );
};
