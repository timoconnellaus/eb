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
        const result: SchemaProp = {
          prop: key,
          type: value.typename,
        };

        if (value._defaultValue !== undefined) {
          result.defaultValue = value._defaultValue;
        }

        return result;
      }
    );

    return {
      id: this.id,
      schema: schemaProps,
      styles: this.stylesFunction,
    };
  }
}

/**
 * Define an easyblocks no code component definition in a type-safe way.
 *
 * @param id the id of the component
 * @param schema the schema of the component
 * @param styles a styles function callback
 * @returns a definition object - use the `def` method to get the NoCodeComponentDefinition object for easyblocks
 */
export const definition = <T extends { [key: string]: any }>(config: {
  id: string;
  schema: Schema<T>;
  styles?: (props: {
    values: SchemaValues<T>;
  }) => NoCodeComponentStylesFunctionResult;
}): Definition<T> => {
  return new Definition(config.id, config.schema, config.styles);
};
