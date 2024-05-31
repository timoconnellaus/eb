import type { DeviceType } from ".";

const xs = {
  w: 375,
  h: 667,
  breakpoint: 568,
  label: "Mobile",
} as DeviceType;

const sm = {
  w: 667,
  h: 375,
  breakpoint: 768,
  label: "Mobile SM h",
  hidden: true,
} as DeviceType;

const md = {
  w: 768,
  h: 1024,
  breakpoint: 992,
  label: "Tablet",
} as DeviceType;

const lg = {
  w: 1024,
  h: 768,
  breakpoint: 1280,
  label: "TabletH",
  hidden: true,
} as DeviceType;

const xl = {
  w: 1366,
  h: 768,
  breakpoint: 1600,
  label: "Desktop",
  isMain: true,
} as DeviceType;

const _2xl = {
  w: 1920,
  h: 920,
  label: "Large desktop",
} as DeviceType;

export const DEFAULT_DEVICES = {
  xs,
  sm,
  md,
  lg,
  xl,
  "2xl": _2xl,
} as const;
