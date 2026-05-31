/**
 * Devini Design System
 * Extracted from devini.io — all tokens match the production site.
 *
 * Usage in Remotion compositions:
 *   import { ds } from "./designSystem";
 *   <div style={{ color: ds.color.fg, fontFamily: ds.font.sans }}>
 */

import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";

// ═══════════════════════════════════════════════════════════════
// FONTS  — Geist (Vercel), same as devini.io
// ═══════════════════════════════════════════════════════════════

const { fontFamily: geistSans } = loadGeist("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const { fontFamily: geistMono } = loadGeistMono("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

// ═══════════════════════════════════════════════════════════════
// COLOR SCALES  — Zinc neutral + Indigo accent (from devini.io)
// ═══════════════════════════════════════════════════════════════

const zinc = {
  50: "#fafafa",
  100: "#f4f4f5",
  200: "#e4e4e7",
  300: "#d4d4d8",
  400: "#9f9fa9",
  500: "#71717b",
  600: "#52525c",
  700: "#3f3f46",
  800: "#27272a",
  900: "#18181b",
  950: "#09090b",
} as const;

const indigo = {
  50: "#eef2ff",
  100: "#e0e7ff",
  200: "#c7d2ff",
  300: "#a4b3ff",
  400: "#7d87ff",
  500: "#625fff",
  600: "#4f39f6",
  700: "#432dd7",
  950: "#1e1a4d",
} as const;

const emerald = {
  50: "#ecfdf5",
  200: "#a4f4cf",
  300: "#5ee9b5",
  400: "#00d294",
  500: "#00bb7f",
} as const;

const amber = {
  400: "#fcbb00",
  500: "#f99c00",
} as const;

const violet = {
  500: "#8d54ff",
} as const;

// ═══════════════════════════════════════════════════════════════
// DESIGN SYSTEM EXPORT
// ═══════════════════════════════════════════════════════════════

export const ds = {
  // ─── Fonts ───────────────────────────────────────────
  font: {
    sans: geistSans,
    mono: geistMono,
    serif: "Georgia, 'Times New Roman', serif",
  },

  // ─── Color Scales ────────────────────────────────────
  zinc,
  indigo,
  emerald,
  amber,
  violet,

  // ─── Semantic Colors (dark theme — for video) ───────
  color: {
    /** Page background */
    bg: zinc[950],                    // #09090b
    /** Slightly lifted background */
    bgSurface: zinc[900],             // #18181b
    /** Surface with brand tint */
    bgTinted: "#110a1f",
    /** Primary text */
    fg: zinc[50],                     // #fafafa
    /** Muted / secondary text */
    fgMuted: zinc[400],               // #9f9fa9
    /** Dimmed text */
    fgDim: zinc[500],                 // #71717b
    /** Primary accent */
    accent: indigo[500],              // #625fff
    /** Secondary accent */
    accentViolet: violet[500],        // #8d54ff
    /** Success */
    success: emerald[400],            // #00d294
    /** Warning / highlight */
    warning: amber[400],              // #fcbb00
    /** Claude brand */
    claude: "#D4663A",
    /** Pure white */
    white: "#ffffff",
    /** Pure black */
    black: "#000000",
  },

  // ─── Gradients ───────────────────────────────────────
  gradient: {
    /** Primary CTA gradient (indigo → violet) */
    accent: `linear-gradient(135deg, ${indigo[500]} 0%, ${violet[500]} 100%)`,
    /** Accent text gradient for WebkitBackgroundClip */
    accentText: `linear-gradient(135deg, ${indigo[400]} 0%, ${violet[500]} 100%)`,
    /** Dark background gradient */
    bgDark: `radial-gradient(ellipse at 50% 30%, ${zinc[900]} 0%, ${zinc[950]} 70%)`,
    /** Dark overlay */
    overlay: `linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)`,
    /** Surface highlight */
    surfaceHighlight: `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)`,
  },

  // ─── Typography ──────────────────────────────────────
  text: {
    // Sizes
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
    "6xl": 60,
    "7xl": 72,
    // Weights
    regular: 400 as const,
    medium: 500 as const,
    semibold: 600 as const,
    bold: 700 as const,
    // Letter spacing
    tighter: "-0.05em",
    tight: "-0.025em",
    wide: "0.05em",
    wider: "0.1em",
    // Line heights
    lineNone: 1,
    lineTight: 1.05,
    lineSnug: 1.375,
    lineNormal: 1.5,
  },

  // ─── Shadows ─────────────────────────────────────────
  shadow: {
    /** Multi-layer card shadow (dark mode) */
    card: [
      "0px 0.7px 0.7px -0.67px rgba(255,255,255,0.03)",
      "0px 1.8px 1.8px -1.33px rgba(255,255,255,0.02)",
      "inset 0px 1px 0px 0px rgba(255,255,255,0.06)",
    ].join(", "),
    /** Light-theme multi-layer card shadow */
    cardLight: [
      "0px 0.7px 0.7px -0.67px rgba(0,0,0,0.08)",
      "0px 1.8px 1.8px -1.33px rgba(0,0,0,0.08)",
      "0px 3.6px 3.6px -2px rgba(0,0,0,0.07)",
      "0px 6.9px 6.9px -2.67px rgba(0,0,0,0.07)",
      "0px 13.6px 13.6px -3.33px rgba(0,0,0,0.05)",
      "0px 30px 30px -4px rgba(0,0,0,0.02)",
      "inset 0px 3px 1px 0px #fff",
    ].join(", "),
    /** Deep elevation */
    elevated: "0 25px 50px -12px rgba(0,0,0,0.4)",
    /** Soft ambient */
    soft: "0 2px 20px rgba(0,0,0,0.06)",
  },

  // ─── Border Radius ───────────────────────────────────
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    "2xl": 24,
    pill: 9999,
  },

  // ─── Glass Morphism ──────────────────────────────────
  glass: {
    /** Subtle glass (default cards) */
    light: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.06)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderRadius: 20,
    } as React.CSSProperties,
    /** Medium glass */
    medium: {
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.10)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: 20,
    } as React.CSSProperties,
    /** Heavy glass (prominent cards) */
    heavy: {
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.15)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderRadius: 20,
    } as React.CSSProperties,
  },

  // ─── Animation Timing ────────────────────────────────
  /** Remotion Easing.bezier() arguments extracted from devini.io */
  easing: {
    /** Material standard — most transitions */
    standard: [0.4, 0, 0.2, 1] as [number, number, number, number],
    /** Ease-out — exits, slides */
    out: [0, 0, 0.2, 1] as [number, number, number, number],
    /** Glass button — bouncy, tactile */
    glass: [0.25, 1, 0.5, 1] as [number, number, number, number],
    /** Path animation — slight overshoot */
    bouncy: [0.75, -0.01, 0, 0.99] as [number, number, number, number],
  },

  /** Remotion spring configs matching devini.io motion feel */
  spring: {
    /** Smooth, no bounce — subtle reveals */
    smooth: { damping: 200 },
    /** Snappy — UI elements, cards */
    snappy: { damping: 20, stiffness: 200 },
    /** Gentle — text reveals */
    gentle: { damping: 15, stiffness: 80 },
    /** Bouncy — playful entrances */
    bouncy: { damping: 8, stiffness: 100 },
    /** Glass-button feel */
    glass: { damping: 12, stiffness: 120 },
  },

  // ─── Spacing (base 4px) ──────────────────────────────
  space: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
  },
  // ─── 3D Card System (Agents.md / dark-green aesthetic) ─
  card3d: {
    /** Dark forest green — from reference screenshots */
    green: {
      bg: "#1a2e1f",
      bgLight: "#243828",
      surface: "#2d4433",
      border: "rgba(255,255,255,0.08)",
      text: "#e8efe9",
      textMuted: "rgba(255,255,255,0.55)",
      accent: "#D4663A",
    },
    /** 3D depth shadow for floating cards */
    shadow3d: [
      "0 20px 60px -10px rgba(0,0,0,0.5)",
      "0 8px 20px -5px rgba(0,0,0,0.3)",
      "0 2px 6px rgba(0,0,0,0.2)",
      "inset 0 1px 0 rgba(255,255,255,0.08)",
    ].join(", "),
    /** Lighter 3D shadow */
    shadow3dLight: [
      "0 12px 40px -8px rgba(0,0,0,0.4)",
      "0 4px 12px rgba(0,0,0,0.2)",
      "inset 0 1px 0 rgba(255,255,255,0.06)",
    ].join(", "),
    /** Benchmark table shadow */
    shadowTable: [
      "0 30px 80px -15px rgba(0,0,0,0.45)",
      "0 10px 25px -5px rgba(0,0,0,0.25)",
      "inset 0 1px 0 rgba(255,255,255,0.05)",
    ].join(", "),
    /** Pill badge on dark green */
    pillStyle: {
      background: "rgba(0,0,0,0.4)",
      borderRadius: 9999,
      padding: "8px 20px",
      border: "1px solid rgba(255,255,255,0.1)",
    } as React.CSSProperties,
    /** Card surface on dark green */
    cardStyle: {
      background: "linear-gradient(145deg, #2a4030, #1e3226)",
      borderRadius: 24,
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: [
        "0 20px 60px -10px rgba(0,0,0,0.5)",
        "0 8px 20px -5px rgba(0,0,0,0.3)",
        "inset 0 1px 0 rgba(255,255,255,0.08)",
      ].join(", "),
    } as React.CSSProperties,
  },

  // ─── Light paper background (for contrast sections) ───
  paper: {
    bg: "#f0ede8",
    bgGrid: "#e5e2dd",
    text: "#1a1a1a",
    textMuted: "#6b6b6b",
  },
} as const;

// ─── Helper: create a glow shadow for a given color ────
export const glow = (color: string, opacity = 0.4, radius = 40) =>
  `0 0 ${radius}px rgba(${hexToRgb(color)},${opacity})`;

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}
