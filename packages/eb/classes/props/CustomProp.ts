import type { LocalSchemaProp } from "@easyblocks/core";
import type { ZodType, z } from "zod";
import { BaseProp } from "./BaseProp";

export class CustomProp<T> extends BaseProp<T> {
  private _customType: string;

  constructor(customType: string) {
    super();
    this._customType = customType;
  }

  _def(): Omit<LocalSchemaProp, "prop"> {
    return {
      type: this._customType,
    };
  }
}
