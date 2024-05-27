import type { SchemaProp } from "@easyblocks/core";
import { Group, group } from "./group";
import type { PropType } from "./props";

export class Schema<T extends { [key: string]: PropType }> {
  // Ensure T is always an object with string keys
  private schema: T;

  constructor(schemaDefinition: T) {
    this.schema = schemaDefinition;
  }

  getSchemaDefinition(): T {
    return this.schema;
  }
}

/**
 * Create a schema
 *
 * @param schemaDefinition the schema definition
 * @returns a schema
 */
export const schema = <T extends { [key: string]: PropType }>(
  schemaDefinition: T
): Schema<T> => {
  return new Schema<T>(schemaDefinition);
};
