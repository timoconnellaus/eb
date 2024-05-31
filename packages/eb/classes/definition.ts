import type {
  NoCodeComponentStylesFunctionResult,
  SchemaProp,
} from "@easyblocks/core";
import type { ZodType, z } from "zod";

type StyleFunction<T> = (params: {
  values: T;
}) => NoCodeComponentStylesFunctionResult;

export type DefinitionInputType<T> = {
  schema: {
    // zodType: ZodType<T, any, any>;
    structure: T;
  };
  styles: StyleFunction<T>;
};

export type DefinitionOutputType<T> = {
  schema: {
    // zodType: z.ZodType<T, any, any>;
    structure: T;
  };
  styles: (values: T) => NoCodeComponentStylesFunctionResult;
  // schemaDef: () => SchemaProp[];
};

// Define the definition class
// Add root params
// Add the definition of the component
