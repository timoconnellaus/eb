import type { StringSchemaProp } from "@easyblocks/core";
import type { ZodType } from "zod";
import { z } from "zod";
import { BaseProp } from "./BaseProp";

// StringProp class
export class StringProp extends BaseProp<string> {
  _def(): Omit<StringSchemaProp, "prop"> {
    return {
      type: "string",
      defaultValue: this._defaultValue,
    };
  }
}
