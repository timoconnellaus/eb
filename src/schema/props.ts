import type { StringSchemaProp, NumberSchemaProp } from "@easyblocks/core";

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

  defaultValue(value: T): this {
    this._defaultValue = value;
    return this;
  }

  buildOnly(): this {
    this._buildOnly = true;
    return this;
  }

  abstract get typename(): string;
}

export class StringProp extends Prop<ResponsiveValue<string>> {
  get typename(): string {
    return "string";
  }
}

/**
 * A string prop
 *
 * @param defaultValue the default value of property
 * @returns a string prop
 */
export const string = (): StringProp => new StringProp();

export class NumberProp extends Prop<ResponsiveValue<number>> {
  get typename(): string {
    return "number";
  }
}

/**
 * A number prop
 *
 * @param defaultValue the default value of property
 * @returns a number prop
 */
export const number = (): NumberProp => new NumberProp();
