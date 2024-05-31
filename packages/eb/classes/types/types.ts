import type {
  ExternalDataCompoundResourceRejectedResult,
  NonNullish,
  RequestedExternalData,
  // ExternalData
} from "@easyblocks/core";
import { ZodType, z } from "zod";

export type FetchCompoundResourceResultValue<
  Type extends string = string,
  Value extends NonNullish = NonNullish
> = {
  type: Type;
  value: Value;
  label?: string;
};

export type FetchCompoundTextResourceResultValue<ED extends NonNullish> =
  FetchCompoundResourceResultValue<"text", ED>;

export type FetchCompoundResourceResultValues<ED extends NonNullish> = Record<
  string,
  | FetchCompoundTextResourceResultValue<ED>
  | FetchCompoundResourceResultValue<string & Record<never, never>, ED>
>;

export type ExternalDataCompoundResourceResolvedResult<ED extends NonNullish> =
  {
    type: "object";
    value: FetchCompoundResourceResultValues<ED>;
  };

export type FetchOutputCompoundResources<ED extends NonNullish> = Record<
  string,
  | ExternalDataCompoundResourceResolvedResult<ED>
  | ExternalDataCompoundResourceRejectedResult
>;

export type FetchResourceResolvedResult<ED extends NonNullish> = {
  type: string;
  value: ED;
};

type FetchResourceRejectedResult = { error: Error };

export type FetchResourceResult<ED extends NonNullish> =
  | FetchResourceResolvedResult<ED>
  | FetchResourceRejectedResult;

export type FetchOutputBasicResources<ED extends NonNullish> = Record<
  string,
  FetchResourceResult<ED>
>;

export type ExternalData<ED extends NonNullish> = Record<
  string,
  (FetchOutputBasicResources<ED> | FetchOutputCompoundResources<ED>)[string]
>;

// export type ExternalData<ED extends NonNullish> = Record<
//   string,
//   FetchOutputBasicResources<ED> | FetchOutputCompoundResources<ED>
// >;

// export type { ExternalData }

// type Callback<EW extends NonNullish> = (props: {
//   value: RequestedExternalData;
//   externalDataId: string;
// }) => Promise<ExternalData<EW>>;

// class Test<T extends NonNullish> {
//   private _zodType: z.ZodType<T, any, any>;
//   private _val: ExternalData<T>;

//   constructor(
//     zodType: z.ZodType<T, any, any>,
//     val: ExternalData<T>,
//     callback: Callback<T>
//   ) {
//     this._zodType = zodType;
//     this._val = val;
//   }
// }

// const test2 = testfunc(z.object({ abc: z.string() }),
// {
//   abc: { type: "text", value: { abc: "asb" } },
//   abd: { type: "text", value: { abc: "asb" } },
// },
// async () => {
//   return {
//     abc: { type: "text", value: { abc: "asb" } },
//     abd: { type: "text", value: { a: "asb" } },
//   };
// })

// export function testfunc<EW extends NonNullish>(
//   zodType: ZodType<EW, any, any>,
//   val: ExternalData<EW>,
//   callback: Callback<EW>
// ): Test<EW> {
//   return new Test<EW>(zodType, val, callback);
// }

// const test = z.object({ abc: z.string()})
// type Test<T extends NonNullish> = FetchResourceResolvedResult<T>
// const tset: Test<z.infer<typeof test>> = {
//   type: "test",
//   value: "test"
// }
