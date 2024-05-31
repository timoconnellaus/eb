import type { NumberSchemaProp, SchemaProp } from "@easyblocks/core";
import type { ZodType, z } from "zod";

// BaseProp as an abstract class
export abstract class BaseProp<T> {
  protected _type?: T;

  // protected _defaultValue?: T;

  abstract _def(): Omit<SchemaProp, "prop">;

  // defaultValue(defaultValue: T): this {
  //   this._defaultValue = defaultValue;
  //   return this;
  // }
}

// export abstract class BasePropWithDefaultValue<T> extends BaseProp<T> {
//   protected _defaultValue?: T;

//   constructor() {
//     super();
//   }

//   defaultValue(defaultValue: T): this {
//     this._defaultValue = defaultValue;
//     return this;
//   }
// }
