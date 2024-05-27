import type {
  NoCodeComponentDefinition,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import type { Prop, PropType } from "./schema/props";
import { Schema } from "./schema";

type SchemaValues<T> = {
  [P in keyof T]: T[P] extends Prop<infer U> ? U : never;
};

export class Definition<T extends { [key: string]: PropType }> {
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
    return {
      id: this.id,
      schema: this.schema.getSchemaDefinition(),
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
