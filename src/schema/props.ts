import type {
  StringSchemaProp,
  NumberSchemaProp,
  BooleanSchemaProp,
} from "@easyblocks/core";
import type { Group } from "./group";

type ResponsiveValue<T> =
  | {
      $res: true;
      xs?: T | true;
      sm?: T | true;
      md?: T | true;
      lg?: T | true;
      xl?: T | true;
      "2xl"?: T | true;
    }
  | T;

export abstract class Prop<T> {
  protected _defaultValue: T | undefined;
  protected _buildOnly: boolean = false;
  protected _responsive: boolean = false;
  protected _label: string | undefined;
  protected _hideLabel: boolean = false;
  protected _description: string | undefined;
  protected _visible: boolean = true;
  protected _layout: "row" | "column" | undefined;

  defaultValue(value: T): this {
    this._defaultValue = value;
    return this;
  }

  buildOnly(): this {
    this._buildOnly = true;
    return this;
  }

  label(value: string): this {
    this._label = value;
    return this;
  }

  hideLabel(): this {
    this._hideLabel = true;
    return this;
  }

  abstract get typename(): string;

  abstract get getConfig(): unknown;

  getBaseConfig(): {
    defaultValue?: T;
    buildOnly: boolean;
    responsive: boolean;
    label?: string;
    hideLabel: boolean;
    description?: string;
    visible: boolean;
    layout?: "row" | "column";
  } {
    const config: {
      buildOnly: boolean;
      responsive: boolean;
      hideLabel: boolean;
      visible: boolean;
      defaultValue?: T; // Add defaultValue property
      label?: string;
      description?: string;
      layout?: "row" | "column";
    } = {
      buildOnly: this._buildOnly,
      responsive: this._responsive,
      hideLabel: this._hideLabel,
      visible: this._visible,
    };
    if (this._defaultValue !== undefined) {
      config.defaultValue = this._defaultValue;
    }
    if (this._label !== undefined) {
      config.label = this._label;
    }
    if (this._description !== undefined) {
      config.description = this._description;
    }
    if (this._layout !== undefined) {
      config.layout = this._layout;
    }
    return config;
  }
}

interface ResponsiveProp {
  responsive(): this;
}

export class StringProp
  extends Prop<ResponsiveValue<string>>
  implements ResponsiveProp
{
  protected _normalize: ((value: string) => string) | undefined;

  get typename(): string {
    return "string";
  }

  responsive(): this {
    return this;
  }

  normalize(callback: (value: string) => string): this {
    this._normalize = callback;
    return this;
  }

  get getConfig() {
    const config: Omit<StringSchemaProp, "prop"> = {
      type: "string",
      ...this.getBaseConfig(),
    };

    if (this._normalize) {
      config.params = {
        ...(config.params || {}),
        normalize: this._normalize,
      };
    }
    return config;
  }
}

/**
 * A string prop
 *
 * @param defaultValue the default value of property
 * @returns a string prop
 */
export const string = (): StringProp => new StringProp();

export class NumberProp
  extends Prop<ResponsiveValue<number>>
  implements ResponsiveProp
{
  private _min: number | undefined;
  private _max: number | undefined;

  get typename(): string {
    return "number";
  }

  responsive(): this {
    return this;
  }

  min(value: number): this {
    return this;
  }

  max(value: number): this {
    return this;
  }

  get getConfig() {
    const config: Omit<NumberSchemaProp, "prop"> = {
      type: "number",
      ...this.getBaseConfig(),
    };

    if (this._min) {
      config.params = {
        ...(config.params || {}),
        min: this._min,
      };
    }

    if (this._max) {
      config.params = {
        ...(config.params || {}),
        max: this._max,
      };
    }

    return config;
  }
}

/**
 * A number prop
 *
 * @param defaultValue the default value of property
 * @returns a number prop
 */
export const number = (): NumberProp => new NumberProp();

export class BooleanProp extends Prop<boolean> {
  get typename(): string {
    return "boolean";
  }

  get getConfig() {
    const config: Omit<BooleanSchemaProp, "prop"> = {
      type: "boolean",
      ...this.getBaseConfig(),
    };

    return config;
  }
}

export const boolean = (): BooleanProp => new BooleanProp();

export type PropType =
  | StringProp
  | NumberProp
  | BooleanProp
  | Group<{ [key: string]: PropType }>;

export type PropTypeWithoutGroup = Exclude<PropType, Group<any>>;

// [ ] SelectSchemaProp
// [ ] RadioGroupSchemaProp
// [ ] ColorSchemaProp
// [ ] SpaceSchemaProp
// [ ] FontSchemaProp
// [ ] StringTokenSchemaProp
// [ ] IconSchemaProp
// [ ] TextSchemaProp
// [ ] ComponentSchemaProp
// [ ] ComponentCollectionSchemaProp
// [ ] ComponentCollectionLocalisedSchemaProp
// [ ] PositionSchemaProp
// [ ] ExternalSchemaProp
// [ ] LocalSchemaProp
// [ ] TokenSchemaProp
