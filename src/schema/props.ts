import type {
  StringSchemaProp,
  NumberSchemaProp,
  BooleanSchemaProp,
  TextSchemaProp,
  IconSchemaProp,
  ComponentSchemaProp,
  ComponentCollectionSchemaProp,
  ComponentCollectionLocalisedSchemaProp,
  PositionSchemaProp,
  ExternalSchemaProp,
  LocalSchemaProp,
  TokenSchemaProp,
  SelectSchemaProp,
  Option,
  RadioGroupSchemaProp,
  ColorSchemaProp,
  SpaceSchemaProp,
  FontSchemaProp,
  StringTokenSchemaProp,
} from "@easyblocks/core";
import type { Group } from "./group";
import type { ComponentType } from "react";

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

  get getConfig(): Omit<StringSchemaProp, "prop"> {
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

  get getConfig(): Omit<NumberSchemaProp, "prop"> {
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

  get getConfig(): Omit<BooleanSchemaProp, "prop"> {
    const config: Omit<BooleanSchemaProp, "prop"> = {
      type: "boolean",
      ...this.getBaseConfig(),
    };

    return config;
  }
}

export const boolean = (): BooleanProp => new BooleanProp();

export class OptionsOption {
  private _label: string | undefined;
  private _icon:
    | string
    | ComponentType<{ size?: number; isStroke?: boolean }>
    | undefined;
  private _hideLabel: boolean = false;

  label(value: string): this {
    this._label = value;
    return this;
  }

  icon(
    value: string | ComponentType<{ size?: number; isStroke?: boolean }>
  ): this {
    this._icon = value;
    return this;
  }

  hideLabel(): this {
    this._hideLabel = true;
    return this;
  }
  get getConfig(): Omit<Option, "value"> {
    return {
      label: this._label,
      icon: this._icon,
      hideLabel: this._hideLabel,
    };
  }
}

export const option = (): OptionsOption => new OptionsOption();

export class Options<T extends { [key: string]: typeof option } | string[]> {
  private _options: T;

  constructor(options: T) {
    this._options = options;
  }

  get options(): Option[] {
    if (Array.isArray(this._options)) {
      if (typeof this._options[0] === "string") {
        return this._options;
      } else {
        const options: Option[] = [];
        const values = Object.entries(this._options);
        for (const [key, value] of values) {
          options.push({
            value: key,
            ...value,
          });
        }
        return options as Option[];
      }
    } else {
      return [];
    }
  }
}

export const options = <T extends { [key: string]: typeof option } | string[]>(
  options: T
): Options<T> => new Options(options);

export class SelectProp extends Prop<string> {
  private _options: { [key: string]: Omit<Option, "value"> } | string[] = {};

  get typename(): string {
    return "select";
  }

  options(options: { [key: string]: Omit<Option, "value"> } | string[]): this {
    this._options = options;
    return this;
  }

  get getConfig(): Omit<SelectSchemaProp, "prop"> {
    const config: Omit<SelectSchemaProp, "prop"> = {
      type: "select",
      params: {
        options: [],
      },
      ...this.getBaseConfig(),
    };

    if (Array.isArray(this._options)) {
      if (this._options.length === 0) {
        config.params.options = [];
      }
      if (typeof this._options[0] === "string") {
        config.params.options = this._options as string[];
      }
    } else if (typeof this._options === "object") {
      const options: Option[] = [];
      const values = Object.entries(this._options) as [
        string,
        Omit<Option, "value">
      ][];
      for (const [key, value] of values) {
        options.push({
          value: key,
          ...value,
        });
      }
      config.params.options = options;
    } else {
      config.params.options = [];
    }

    return config;
  }
}

export const select = (): SelectProp => new SelectProp();

export type PropType =
  | StringProp
  | NumberProp
  | BooleanProp
  | SelectProp
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
