import { DEFAULT_DEVICES } from "./defaults";

export type DeviceType = {
  w: number;
  h: number;
  breakpoint: number | null;
  label: string;
  isMain: boolean;
  hidden: boolean;
};

export type DeviceTypeAllOptional = {
  w?: number;
  h?: number;
  breakpoint?: number | null;
  label?: string;
  isMain?: boolean;
  hidden?: boolean;
};

export type DeviceClasssAllOptional = {
  xs?: Device;
  sm?: Device;
  md?: Device;
  lg?: Device;
  xl?: Device;
  "2xl"?: Device;
};

export type DevicesType = {
  xs: DeviceType;
  sm: DeviceType;
  md: DeviceType;
  lg: DeviceType;
  xl: DeviceType;
  "2xl": DeviceType;
};

export class Device {
  private _w?: number;
  private _h?: number;
  private _breakpoint?: number | null;
  private _label?: string;
  private _isMain?: boolean;
  private _hidden?: boolean;

  w(w: number) {
    this._w = w;
    return this;
  }

  h(h: number) {
    this._h = h;
    return this;
  }

  breakpoint(breakpoint: number | null) {
    this._breakpoint = breakpoint;
    return this;
  }

  label(label: string) {
    this._label = label;
    return this;
  }

  isMain() {
    this._isMain = true;
    return this;
  }

  hidden(isHidden: boolean) {
    this._hidden = isHidden;
    return this;
  }

  _getConfig(): DeviceTypeAllOptional {
    return {
      w: this._w,
      h: this._h,
      breakpoint: this._breakpoint,
      label: this._label,
      isMain: this._isMain,
      hidden: this._hidden,
    };
  }
}

export const mergeDevice = (
  device: DeviceTypeAllOptional,
  defaultDevice: DeviceType
) => {
  return {
    w: device.w || defaultDevice.w,
    h: device.h || defaultDevice.h,
    breakpoint: device.breakpoint || defaultDevice.breakpoint,
    label: device.label || defaultDevice.label,
    isMain: device.isMain || defaultDevice.isMain,
    hidden: device.hidden || defaultDevice.hidden,
  };
};

export class Devices {
  private _devices: DevicesType;

  constructor(devices?: DeviceClasssAllOptional) {
    this._devices = DEFAULT_DEVICES;
    if (devices) {
      if (devices.xs) {
        const xs = devices.xs._getConfig();
        this._devices["xs"] = mergeDevice(xs, DEFAULT_DEVICES.xs);
      }
      if (devices.sm) {
        const sm = devices.sm._getConfig();
        this._devices["sm"] = mergeDevice(sm, DEFAULT_DEVICES.sm);
      }
      if (devices.md) {
        const md = devices.md._getConfig();
        this._devices["md"] = mergeDevice(md, DEFAULT_DEVICES.md);
      }
      if (devices.lg) {
        const lg = devices.lg._getConfig();
        this._devices["lg"] = mergeDevice(lg, DEFAULT_DEVICES.lg);
      }
      if (devices.xl) {
        const xl = devices.xl._getConfig();
        this._devices["xl"] = mergeDevice(xl, DEFAULT_DEVICES.xl);
      }
      if (devices["2xl"]) {
        const _2xl = devices["2xl"]._getConfig();
        this._devices["2xl"] = mergeDevice(_2xl, DEFAULT_DEVICES["2xl"]);
      }
    }
  }

  mainDevice(device: keyof DevicesType) {
    // set is main false to everything first
    Object.keys(this._devices).forEach((key) => {
      (this._devices as any)[key].isMain = false;
    });
    (this._devices as any)[device].isMain = true;
    return this;
  }

  _def() {
    return this._devices;
  }
}

export const devices = (devices?: DeviceClasssAllOptional) =>
  new Devices(devices);

export const device = () => new Device();
