/**
 * BrandingReelLandscape — 16:9 (1920×1080) version of BrandingReelReel
 *
 * Same BEAT map, VO, and scene structure — layout adapted for landscape.
 * Left column: headline / copy. Right column: visual element / card.
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

export const BRANDING_LANDSCAPE_TOTAL = 1625;

export const BEAT = {
  hook:    0,
  pain:    237,
  judge:   528,
  agitate: 618,
  pivot:   702,
  solve:   756,
  cta:     1233,
  end:     1625,
} as const;

const ease = {
  power3Out: Easing.bezier(0.215, 0.61, 0.355, 1),
  expoOut:   Easing.bezier(0.19, 1, 0.22, 1),
  backOut:   Easing.bezier(0.34, 1.56, 0.64, 1),
};

const C = {
  bg:              "#EFEAF2",
  ink:             "#0E0E12",
  inkSoft:         "#26242C",
  inkMuted:        "#5A5867",
  hairline:        "rgba(15,15,22,0.08)",
  violet:          "#8B7FE8",
  rose:            "#E89BC4",
  gold:            "#F2D88F",
  teal:            "#7FE8D4",
  crimson:         "#FF5C7E",
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

// ─── Primitives ───────────────────────────────────────────────────────────────

const CausticBlobs: React.FC<{ accent?: string }> = ({ accent = C.violet }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const blob = (color: string, size: number, cx: number, cy: number, sx: number, sy: number, phase: number, op = 0.5): React.CSSProperties => ({
    position: "absolute", width: size, height: size, borderRadius: "50%",
    background: `radial-gradient(circle at 50% 50%, ${color} 0%, ${color}99 30%, transparent 70%)`,
    filter: "blur(100px)",
    left: cx + Math.sin(t * sx + phase) * 180,
    top:  cy + Math.cos(t * sy + phase) * 100,
    opacity: op, pointerEvents: "none",
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={blob(accent,  600,  0,   -80, 0.18, 0.13, 0.0, 0.50)} />
      <div style={blob(C.rose,  550, 900,  200, 0.14, 0.16, 1.2, 0.35)} />
      <div style={blob(C.gold,  480, 400,  600, 0.11, 0.19, 2.4, 0.35)} />
      <div style={blob(C.teal,  420,1500,  300, 0.16, 0.12, 3.6, 0.28)} />
      <div style={blob(accent,  460, 100,  800, 0.12, 0.18, 4.2, 0.30)} />
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
      WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)",
      maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)",
    }} />
  </AbsoluteFill>
);

const SonarRings: React.FC<{ accent?: string; secondary?: string }> = ({
  accent = C.violet, secondary = C.rose,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {[0, 22, 44, 66].map((birth, i) => {
        const local = frame - birth;
        const cycle = local % 100;
        if (local < 0) return null;
        const scale = interpolate(cycle, [0, 100], [0.05, 1.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.expoOut });
        const op = interpolate(cycle, [0, 30, 100], [0, 0.08, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute", width: 1600, height: 1600, borderRadius: "50%",
            border: `2px solid ${i % 2 === 0 ? `${accent}99` : `${secondary}99`}`,
            transform: `scale(${scale})`, opacity: op,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

const ParticleBurst: React.FC<{ count?: number; palette?: string[] }> = ({
  count = 28, palette = [C.violet, C.rose, C.gold, C.teal],
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + i * 0.31;
        const distance = 140 + (i % 7) * 55;
        const size = 5 + (i % 4) * 3;
        const color = palette[i % palette.length];
        const delay = (i * 0.6) % 18;
        const local = Math.max(0, frame - delay);
        const burst = interpolate(local, [0, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.expoOut });
        const x = Math.cos(angle) * distance * burst;
        const y = Math.sin(angle) * distance * burst;
        const op = interpolate(local, [0, 18, 90, 150], [0, 0.85, 0.5, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
    ...glassBase, borderRadius: 9999, padding: "8px 18px",
    display: "inline-flex", alignItems: "center", gap: 8,
    fontFamily: MONO, fontSize: 13, fontWeight: 500,
    color: C.inkSoft, letterSpacing: "0.18em", textTransform: "uppercase",
  }}>
    <div style={{ width: 6, height: 6, borderRadius: "50%", background: dot, boxShadow: `0 0 10px ${dot}` }} />
    {children}
  </div>
);

const FadeUp: React.FC<{ startFrame: number; duration?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  startFrame, duration = 20, children, style,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  const opacity = interpolate(local, [0, duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.expoOut });
  const y = interpolate(local, [0, duration], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.power3Out });
  return <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>{children}</div>;
};

// ─── Left/Right split layout helper ──────────────────────────────────────────
const SplitLayout: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: number; // px, default 860
}> = ({ left, right, leftWidth = 860 }) => (
  <AbsoluteFill style={{ flexDirection: "row" }}>
    <div style={{ width: leftWidth, padding: "60px 64px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
      {left}
    </div>
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px 40px 0" }}>
      {right}
    </div>
  </AbsoluteFill>
);

// ─── Scene 1: HOOK (0–236) ────────────────────────────────────────────────────
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    { label: "Post consistently",  color: C.teal,   delay: 40 },
    { label: "Clean website",       color: C.violet, delay: 75 },
    { label: "Look professional",   color: C.gold,   delay: 110 },
  ];
  return (
    <AbsoluteFill>
      <CausticBlobs accent={C.violet} />
      <HairlineGrid />
      <SonarRings accent={C.violet} secondary={C.teal} />
      {frame < 50 && <ParticleBurst palette={[C.violet, C.teal, C.rose, C.gold]} />}
      <SplitLayout
        left={<>
          <FadeUp startFrame={4}>
            <EyebrowPill dot={C.violet}>01 / THE DRILL</EyebrowPill>
          </FadeUp>
          <FadeUp startFrame={10}>
            <div style={{ fontFamily: FONT, fontSize: 72, fontWeight: 800, color: C.ink, letterSpacing: "-0.04em", lineHeight: 1.02 }}>
              Most business owners<br />
              <span style={{ color: C.violet }}>know the drill.</span>
            </div>
          </FadeUp>
          <FadeUp startFrame={30}>
            <div style={{ fontFamily: FONT, fontSize: 26, color: C.inkMuted, letterSpacing: "-0.01em", lineHeight: 1.5 }}>
              Post consistently. Clean website.<br />Look professional online.
            </div>
          </FadeUp>
        </>}
        right={
          <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
            {items.map((item, i) => {
              const local = frame - item.delay;
              const sc = spring({ frame: local, fps: 30, config: { damping: 12, stiffness: 120 }, from: 0.7, to: 1 });
              const op = interpolate(local, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={i} style={{
                  ...glassBase, borderRadius: 18, padding: "20px 28px",
                  display: "flex", alignItems: "center", gap: 18,
                  transform: `scale(${sc})`, opacity: op, transformOrigin: "left center",
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%",
                    background: `${item.color}22`, border: `2px solid ${item.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width={16} height={16} viewBox="0 0 20 20">
                      <polyline points="3,10 8,15 17,5" fill="none" stroke={item.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.ink }}>{item.label}</div>
                </div>
              );
            })}
          </div>
        }
      />
    </AbsoluteFill>
  );
};

// ─── Scene 2: PAIN (237–527) ──────────────────────────────────────────────────
const PainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const painItems = [
    { label: "Never enough time",            color: C.crimson, delay: 10 },
    { label: "Not a designer",               color: C.crimson, delay: 45 },
    { label: "Inconsistent social media",    color: C.crimson, delay: 80 },
    { label: "Weak brand — zero conversions",color: C.crimson, delay: 140 },
  ];
  return (
    <AbsoluteFill>
      <CausticBlobs accent={C.crimson} />
      <HairlineGrid />
      <SonarRings accent={C.crimson} secondary={C.rose} />
      <SplitLayout
        left={<>
          <FadeUp startFrame={4}>
            <EyebrowPill dot={C.crimson}>02 / REALITY</EyebrowPill>
          </FadeUp>
          <FadeUp startFrame={10}>
            <div style={{ fontFamily: FONT, fontSize: 72, fontWeight: 800, color: C.ink, letterSpacing: "-0.04em", lineHeight: 1.02 }}>
              But in reality…
            </div>
          </FadeUp>
          <FadeUp startFrame={30}>
            <div style={{ fontFamily: FONT, fontSize: 26, color: C.inkMuted, letterSpacing: "-0.01em", lineHeight: 1.55 }}>
              Your brand feels weak and your<br />
              website fails to turn visitors<br />
              into customers.
            </div>
          </FadeUp>
        </>}
        right={
          <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
            {painItems.map((item, i) => {
              const local = frame - item.delay;
              const sc = spring({ frame: local, fps: 30, config: { damping: 11, stiffness: 130 }, from: 0.6, to: 1 });
              const op = interpolate(local, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={i} style={{
                  ...glassBase, borderRadius: 16, padding: "16px 24px",
                  display: "flex", alignItems: "center", gap: 16,
                  transform: `scale(${sc})`, opacity: op, transformOrigin: "left center",
                  border: `1.5px solid ${C.crimson}44`,
                  boxShadow: `${GLASS_SHADOW}, 0 0 16px ${C.crimson}1a`,
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: `${C.crimson}18`, border: `2px solid ${C.crimson}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width={14} height={14} viewBox="0 0 18 18">
                      <line x1="4" y1="4" x2="14" y2="14" stroke={C.crimson} strokeWidth={2.5} strokeLinecap="round" />
                      <line x1="14" y1="4" x2="4" y2="14" stroke={C.crimson} strokeWidth={2.5} strokeLinecap="round" />
                    </svg>
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.ink }}>{item.label}</div>
                </div>
              );
            })}
          </div>
        }
      />
    </AbsoluteFill>
  );
};

// ─── Scene 3: JUDGE (528–617) ─────────────────────────────────────────────────
const JudgeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const countdown = frame < 30 ? "3" : frame < 60 ? "2" : "1";
  const numScale = spring({ frame: frame % 30, fps: 30, config: { damping: 8, stiffness: 200 }, from: 1.3, to: 1 });
  return (
    <AbsoluteFill>
      <CausticBlobs accent={C.gold} />
      <HairlineGrid />
      <SonarRings accent={C.gold} secondary={C.violet} />
      <SplitLayout
        leftWidth={700}
        left={<>
          <FadeUp startFrame={4}>
            <EyebrowPill dot={C.gold}>03 / FIRST IMPRESSION</EyebrowPill>
          </FadeUp>
          <FadeUp startFrame={10}>
            <div style={{ fontFamily: FONT, fontSize: 60, fontWeight: 800, color: C.ink, letterSpacing: "-0.04em", lineHeight: 1.05 }}>
              People judge your<br />business<br />
              <span style={{ color: C.gold }}>before they read a word.</span>
            </div>
          </FadeUp>
        </>}
        right={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{
              fontFamily: MONO, fontSize: 260, fontWeight: 800, color: C.ink,
              letterSpacing: "-0.08em", lineHeight: 1,
              transform: `scale(${numScale})`,
              filter: `drop-shadow(0 0 40px ${C.gold}66)`,
            }}>
              {countdown}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 600, color: C.inkMuted, letterSpacing: "0.22em", textTransform: "uppercase" }}>
              seconds
            </div>
          </div>
        }
      />
    </AbsoluteFill>
  );
};

// ─── Scene 4: AGITATE (618–701) ───────────────────────────────────────────────
const AgitateScene: React.FC = () => {
  const frame = useCurrentFrame();
  const shakeAmp = interpolate(frame, [10, 28, 48], [0, 3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shakeX = Math.sin(frame * 0.5) * shakeAmp;
  return (
    <AbsoluteFill>
      <CausticBlobs accent={C.crimson} />
      <HairlineGrid />
      <SonarRings accent={C.crimson} secondary={C.rose} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 120px", gap: 32 }}>
        <FadeUp startFrame={4}>
          <EyebrowPill dot={C.crimson}>04 / THE COST</EyebrowPill>
        </FadeUp>
        <div style={{ transform: `translateX(${shakeX}px)` }}>
          <FadeUp startFrame={6}>
            <div style={{ fontFamily: FONT, fontSize: 96, fontWeight: 800, color: C.ink, letterSpacing: "-0.05em", lineHeight: 1 }}>
              You're <span style={{ color: C.crimson }}>confusing.</span>
            </div>
          </FadeUp>
        </div>
        <FadeUp startFrame={30}>
          <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 700, color: C.inkSoft, letterSpacing: "-0.025em" }}>
            Outdated look → visitors <span style={{ color: C.crimson }}>lose trust instantly.</span>
          </div>
        </FadeUp>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 5: PIVOT (702–755) ─────────────────────────────────────────────────
const PivotScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cardScale = spring({ frame: frame - 6, fps: 30, config: { damping: 11, stiffness: 120 }, from: 0.5, to: 1 });
  return (
    <AbsoluteFill>
      <CausticBlobs accent={C.violet} />
      <HairlineGrid />
      <SonarRings accent={C.violet} secondary={C.teal} />
      {frame < 40 && <ParticleBurst palette={[C.violet, C.rose, C.gold, C.teal]} />}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{
          ...glassBase, borderRadius: 32, padding: "56px 80px",
          transform: `scale(${cardScale})`,
          border: `1.5px solid ${C.violet}66`,
          boxShadow: `${GLASS_SHADOW}, 0 0 60px ${C.violet}44`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 20, maxWidth: 1200,
        }}>
          <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: C.violet, letterSpacing: "0.22em", textTransform: "uppercase" }}>
            That's the specific problem
          </div>
          <div style={{ fontFamily: FONT, fontSize: 88, fontWeight: 800, color: C.ink, letterSpacing: "-0.05em", lineHeight: 1, textAlign: "center" }}>
            that <span style={{ color: C.violet }}>I solve.</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 6: SOLVE (756–1232) ────────────────────────────────────────────────
const SolveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const services = [
    { label: "Social Media Design", icon: "◈", color: C.teal,   delay: 30  },
    { label: "Strong Branding",     icon: "◉", color: C.violet, delay: 80  },
    { label: "Modern Websites",     icon: "◍", color: C.gold,   delay: 130 },
  ];
  const taglineOp = interpolate(frame, [200, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineY = interpolate(frame, [200, 240], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.power3Out });
  return (
    <AbsoluteFill>
      <CausticBlobs accent={C.teal} />
      <HairlineGrid />
      <SonarRings accent={C.teal} secondary={C.violet} />
      <SplitLayout
        left={<>
          <FadeUp startFrame={4}>
            <EyebrowPill dot={C.teal}>05 / WHAT I DO</EyebrowPill>
          </FadeUp>
          <FadeUp startFrame={10}>
            <div style={{ fontFamily: FONT, fontSize: 58, fontWeight: 800, color: C.ink, letterSpacing: "-0.04em", lineHeight: 1.05 }}>
              Clean design.<br />
              <span style={{ color: C.violet }}>Strong brand.</span><br />
              Modern website.
            </div>
          </FadeUp>
          <div style={{ opacity: taglineOp, transform: `translateY(${taglineY}px)` }}>
            <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: C.inkMuted, letterSpacing: "-0.01em", lineHeight: 1.5 }}>
              Focus on your business.<br />
              <span style={{ color: C.violet, fontWeight: 800 }}>I handle the entire visual side.</span>
            </div>
          </div>
        </>}
        right={
          <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
            {services.map((svc, i) => {
              const local = frame - svc.delay;
              const sc = spring({ frame: local, fps: 30, config: { damping: 12, stiffness: 115 }, from: 0.5, to: 1 });
              const op = interpolate(local, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={i} style={{
                  ...glassBase, borderRadius: 20, padding: "22px 28px",
                  display: "flex", alignItems: "center", gap: 22,
                  transform: `scale(${sc})`, opacity: op, transformOrigin: "left center",
                  border: `1.5px solid ${svc.color}44`,
                  boxShadow: `${GLASS_SHADOW}, 0 0 20px ${svc.color}22`,
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 14,
                    background: `${svc.color}18`, border: `2px solid ${svc.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28, color: svc.color, flexShrink: 0,
                  }}>
                    {svc.icon}
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>
                    {svc.label}
                  </div>
                </div>
              );
            })}
          </div>
        }
      />
    </AbsoluteFill>
  );
};

// ─── Scene 7: CTA (1233–1625) ─────────────────────────────────────────────────
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cardScale = spring({ frame, fps: 30, config: { damping: 11, stiffness: 110 }, from: 0.55, to: 1 });
  const glowPulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.5, 1]);
  return (
    <AbsoluteFill>
      <CausticBlobs accent={C.rose} />
      <HairlineGrid />
      <SonarRings accent={C.rose} secondary={C.violet} />
      {frame < 40 && <ParticleBurst palette={[C.rose, C.violet, C.gold, C.teal]} />}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{
          ...glassBase, borderRadius: 36, padding: "56px 80px",
          transform: `scale(${cardScale})`,
          border: `1.5px solid ${C.rose}66`,
          boxShadow: `${GLASS_SHADOW}, 0 0 ${60 * glowPulse}px ${C.rose}44`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 28,
          maxWidth: 1100,
        }}>
          <EyebrowPill dot={C.rose}>07 / LET'S GO</EyebrowPill>
          <div style={{
            fontFamily: FONT, fontSize: 72, fontWeight: 800, color: C.ink,
            textAlign: "center", letterSpacing: "-0.04em", lineHeight: 1.05,
          }}>
            Ready to look as good<br />
            as your business <span style={{ color: C.rose }}>is?</span>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{
              ...glassBase, background: C.glassFillStrong, borderRadius: 14,
              padding: "14px 36px", fontFamily: MONO, fontSize: 22, fontWeight: 700,
              color: C.rose, letterSpacing: "0.08em", textTransform: "uppercase",
              border: `1.5px solid ${C.rose}88`, boxShadow: `0 0 24px ${C.rose}44`,
            }}>
              ↗ Send me a message
            </div>
          </div>
          <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 600, color: C.inkMuted, letterSpacing: "-0.01em", textAlign: "center" }}>
            Your first impression attracts <span style={{ color: C.rose, fontWeight: 800 }}>serious customers.</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export const BrandingReelLandscape: React.FC = () => (
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
