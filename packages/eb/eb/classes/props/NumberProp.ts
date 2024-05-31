import type { NumberSchemaProp } from "@easyblocks/core";
import type { ZodType } from "zod";
import { z } from "zod";
import { BaseProp } from "./BaseProp";

export class NumberProp extends BaseProp<number> {
  private _min?: number;
  private _max?: number;
  private _defaultValue?: number;

  max(value: number): this {
    this._max = value;
    return this;
  }

  min(value: number): this {
    this._min = value;
    return this;
  }

  defaultValue(value: number): this {
    this._defaultValue = value;
    return this;
  }

  _def(): Omit<NumberSchemaProp, "prop"> {
    return {
      type: "number",
      // defaultValue: this._defaultValue,
    };
  }
}
