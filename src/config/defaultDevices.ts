import type { DeviceRange } from "@easyblocks/core";

const xs: Omit<DeviceRange, "id"> = {
  w: 375,
  h: 667,
  breakpoint: 568,
  label: "Mobile",
};

const sm: Omit<DeviceRange, "id"> = {
  w: 667,
  h: 375,
  breakpoint: 768,
  label: "Mobile SM h",
  hidden: true,
};

const md: Omit<DeviceRange, "id"> = {
  w: 768,
  h: 1024,
  breakpoint: 992,
  label: "Tablet",
};

const lg: Omit<DeviceRange, "id"> = {
  w: 1024,
  h: 768,
  breakpoint: 1280,
  label: "TabletH",
  hidden: true,
};

const xl: Omit<DeviceRange, "id"> = {
  w: 1366,
  h: 768,
  breakpoint: 1600,
  label: "Desktop",
  isMain: true,
};

const xl2: Omit<DeviceRange, "id"> = {
  w: 1920,
  h: 920,
  label: "Large desktop",
  breakpoint: null,
  // hidden: true,
};

export { xs, sm, md, lg, xl, xl2 };
