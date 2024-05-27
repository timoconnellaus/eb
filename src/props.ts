export abstract class Prop<T> {
  protected thisDefaultValue: T | undefined;

  defaultValue(value: T): this {
    this.thisDefaultValue = value;
    return this;
  }

  abstract get typename(): string;
}

export class StringProp extends Prop<string> {
  get typename(): string {
    return "string";
  }
}

export class NumberProp extends Prop<number> {
  get typename(): string {
    return "number";
  }
}
