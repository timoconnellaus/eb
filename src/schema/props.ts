import type { StringSchemaProp, NumberSchemaProp } from "@easyblocks/core";
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
  protected _group: string | undefined;
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
}

interface ResponsiveProp {
  responsive(): this;
}

export class StringProp
  extends Prop<ResponsiveValue<string>>
  implements ResponsiveProp
{
  get typename(): string {
    return "string";
  }

  responsive(): this {
    return this;
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
  get typename(): string {
    return "number";
  }

  responsive(): this {
    return this;
  }
}

/**
 * A number prop
 *
 * @param defaultValue the default value of property
 * @returns a number prop
 */
export const number = (): NumberProp => new NumberProp();

export type PropType =
  | StringProp
  | NumberProp
  | Group<{ [key: string]: PropType }>;

// [ ] BooleanSchemaProp
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
