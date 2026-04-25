import "@rzl-zone/node-only";

import "dotenv/config";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const USE_EMOJI = process.env.FORCE_EMOJI === "1";

type Icons = {
  readonly [K in keyof typeof emojiIcons]: string;
};

const emojiIcons = {
  /* flow */
  start: "🕐",
  arrowRight: "▶️",
  arrowRightMini: "›",

  /* list */
  bulletBold: "●",
  bullet: "•",
  whiteCircle: "○",
  whiteBullet: "◦",
  smallSquare: "▪",

  /* status */
  success: "✅",
  warn: "⚠️",
  error: "❌",

  /* config */
  config: "⚙️",
  settings: "🛠️",

  /* files & fs */
  file: "📄",
  files: "📁",
  folder: "📂",
  path: "🧭",

  /* actions */
  add: "➕",
  remove: "➖",
  update: "♻️",
  copy: "📋",
  move: "📦",
  clean: "🧹",

  /* build / process */
  build: "🏗️",
  generate: "🧩",
  compile: "⚡",
  watch: "👀",

  /* info / misc */
  info: "ℹ️",
  debug: "🐛",
  question: "❓",
  separator: "━"
} as const;

const asciiIcons = {
  /* flow */
  start: "▶",
  arrowRight: "▶",
  arrowRightMini: "›",

  /* list */
  bulletBold: "●",
  bullet: "•",
  whiteCircle: "○",
  whiteBullet: "◦",
  smallSquare: "▪",

  /* status */
  success: "✅",
  warn: "⚠️ ",
  error: "❌",

  /* config */
  config: "#",
  settings: "@",

  /* files & fs */
  file: "F",
  files: "DIR",
  folder: "DIR",
  path: "~",

  /* actions */
  add: "+",
  remove: "-",
  update: "~",
  copy: "=",
  move: ">",
  clean: "x",

  /* build / process */
  build: "#",
  generate: "*",
  compile: ">",
  watch: "o",

  /* info / misc */
  info: "i",
  debug: "d",
  question: "?",
  separator: "-"
} as const satisfies Icons;

/** ----------------------------------------------------------------
 * * ***CLI icon mapping (emoji or ASCII fallback).***
 * ----------------------------------------------------------------
 *
 * Provides a centralized set of visual symbols used across the CLI
 * for rendering flow indicators, status messages, filesystem labels,
 * and action markers.
 *
 * - *The icon set is determined at runtime via the environment variable:*
 *     - `FORCE_EMOJI=1` ➜ Emoji icons are enabled.
 *     - Otherwise ➜ ASCII-safe fallback icons are used.
 *
 * - *This ensures compatibility with:*
 *     - Terminals that do not support emoji rendering.
 *     - CI environments.
 *     - Minimal shells or log files.
 * - *Behavior:*
 *     - The object shape is identical in both modes.
 *     - Only the visual representation changes.
 *     - The value is resolved once at module evaluation time.
 * ----------------------------------------------------------------
 * #### Environment Control
 * ```bash
 * FORCE_EMOJI=1
 * ```
 * ----------------------------------------------------------------
 * @remarks
 * This constant is intended for internal CLI rendering only, do not mutate the returned object.
 *
 * @example
 * ```ts
 * console.log(`${ICONS.success} Build completed`);
 * ```
 *
 */
export const ICONS: Readonly<Icons> = Object.freeze(
  USE_EMOJI ? emojiIcons : asciiIcons
);
