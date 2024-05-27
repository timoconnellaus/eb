import type { PropType } from "./props";

export class Group<T extends { [key: string]: PropType }> {
  // Ensure T is always an object with string keys
  private schema: T;
  private isGroup = true;
  private _label: string | undefined;

  constructor(schemaDefinition: T) {
    this.schema = schemaDefinition;
  }

  getSchemaDefinition(): T {
    return this.schema;
  }

  label(label: string): this {
    this._label = label;
    return this;
  }

  getLabel(): string | undefined {
    return this._label;
  }
}

/**
 * Create a group
 *
 * @param schemaDefinition the schema definition for the group
 * @returns a schema
 */
export const group = <T extends { [key: string]: PropType }>(
  schemaDefinition: T
): Group<T> => {
  return new Group<T>(schemaDefinition);
};
