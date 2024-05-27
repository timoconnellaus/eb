import type { SchemaProp, StringSchemaProp } from "@easyblocks/core";
import { Group, group } from "./group";
import type { PropType, StringProp } from "./props";
import camelCaseToLabel from "../helpers/camelCaseToLabel";

export class Schema<T extends { [key: string]: PropType }> {
  // Ensure T is always an object with string keys
  private schema: T;
  private definition: SchemaProp[] = [];

  constructor(schemaDefinition: T) {
    this.schema = schemaDefinition;

    for (const [key, value] of Object.entries(this.schema)) {
      if (value instanceof Group && value.isGroup) {
        for (const [groupKey, groupValue] of Object.entries(
          value.getSchemaDefinition() as {
            [key: string]: Exclude<PropType, Group<any>>;
          }
        )) {
          // const def = handleProp(groupKey, groupValue);
          const config = groupValue.getConfig;
          config.group = value.getLabel() || camelCaseToLabel(key);
          this.definition.push({
            prop: groupKey,
            ...config,
          });
        }
      } else {
        const prop = value as Exclude<PropType, Group<any>>;
        const config = prop.getConfig;
        this.definition.push({
          prop: key,
          ...config,
        });
      }
    }
  }

  getSchemaDefinition(): SchemaProp[] {
    return this.definition;
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
