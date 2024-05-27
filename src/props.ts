export abstract class Prop<T> {
  protected _defaultValue: T | undefined;

  defaultValue(value: T): this {
    this._defaultValue = value;
    return this;
  }

  abstract get typename(): string;
}

export class StringProp extends Prop<string> {
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

export class NumberProp extends Prop<number> {
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
