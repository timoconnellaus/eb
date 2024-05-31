import type { StringSchemaProp } from "@easyblocks/core";
import type { ZodType } from "zod";
import { z } from "zod";
import { BaseProp } from "./BaseProp";

// StringProp class
export class StringProp extends BaseProp<string> {
  private _defaultValue?: string;

  defaultValue(value: string): this {
    this._defaultValue = value;
    return this;
  }

  _def(): Omit<StringSchemaProp, "prop"> {
    return {
      type: "string",
      // defaultValue: this._defaultValue,
    };
  }
}
