import type { BaseProp } from "./BaseProp";

export class Group<T extends Record<string, BaseProp<any>>> {
  _props: T;

  constructor(props: T) {
    this._props = props;
  }

  _def() {
    return {
      props: this._props,
    };
  }
}
