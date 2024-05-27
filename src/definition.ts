import type {
  NoCodeComponentDefinition,
  NoCodeComponentStylesFunctionResult,
  SchemaProp,
} from "@easyblocks/core";
import type { Prop } from "./props";
import { Schema } from "./schema";

type SchemaValues<T> = {
  [P in keyof T]: T[P] extends Prop<infer U> ? U : never;
};

export class Definition<T extends { [key: string]: any }> {
  id: string;
  schema: Schema<T>;
  stylesFunction?: (props: {
    values: SchemaValues<T>;
  }) => NoCodeComponentStylesFunctionResult;

  constructor(
    id: string,
    schema: Schema<T>,
    styles?: (props: {
      values: SchemaValues<T>;
    }) => NoCodeComponentStylesFunctionResult
  ) {
    this.id = id;
    this.schema = schema;
    if (styles) {
      this.stylesFunction = styles;
    }
  }

  def(): NoCodeComponentDefinition<SchemaValues<T>> {
    const schemaDefinition = this.schema.getSchemaDefinition();

    const schemaProps: SchemaProp[] = Object.entries(schemaDefinition).map(
      ([key, value]) => {
        return {
          prop: key,
          type: value.typename,
        };
      }
    );

    return {
      id: this.id,
      schema: schemaProps,
      styles: this.stylesFunction,
    };
  }
}

export const definition = <T extends { [key: string]: any }>(config: {
  id: string;
  schema: Schema<T>;
  styles?: (props: {
    values: SchemaValues<T>;
  }) => NoCodeComponentStylesFunctionResult;
}): Definition<T> => {
  return new Definition(config.id, config.schema, config.styles);
};
