import type { DeviceRange } from "@easyblocks/core";
import { xs, sm, lg, md, xl, xl2 } from "./defaultDevices";

// Note: Because easyblocks devices are opionated, we use that preset here
// In the future it would make sense to allow for custom devices when easyblocks
// supports that

type DeviceProps = {
  xs?: Omit<DeviceRange, "id">;
  sm?: Omit<DeviceRange, "id">;
  md?: Omit<DeviceRange, "id">;
  lg?: Omit<DeviceRange, "id">;
  xl?: Omit<DeviceRange, "id">;
  "2xl"?: Omit<DeviceRange, "id">;
};

type EBCProps = {
  devices?: DeviceProps;
};

export class EBC {
  private devices: DeviceProps;

  constructor(props: EBCProps) {
    if (props.devices === undefined) {
      this.devices = {
        xs: xs,
        sm: sm,
        md: md,
        lg: lg,
        xl: xl,
        "2xl": xl2,
      };
    } else {
      this.devices = {
        xs: props.devices.xs,
        sm: props.devices.sm,
        md: props.devices.md,
        lg: props.devices.lg,
        xl: props.devices.xl,
        "2xl": props.devices["2xl"],
      };
    }
  }

  public getDevices = (): DeviceProps => {
    return this.devices;
  };

  public getDevicesArray = (): DeviceRange[] => {
    return Object.entries(this.devices).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  };
}

export const ebc = (props: EBCProps): EBC => new EBC(props);
