import type {
  SchemaProp,
  InlineTypeWidgetComponentProps,
  NonNullish,
  StringSchemaProp,
  NumberSchemaProp,
  SelectSchemaProp,
  Option,
} from "@easyblocks/core";
import { type ComponentType } from "react";
import { z, ZodType, ZodEnum } from "zod";

type OptionConfig = Omit<Exclude<Option, string>, "value">;

class OptionBuilder {
  private config: OptionConfig;

  constructor() {
    this.config = {};
  }

  label(label: string) {
    this.config.label = label;
    return this;
  }

  hideLabel() {
    this.config.hideLabel = true;
    return this;
  }

  icon(icon: string | ComponentType<{ size?: number; isStroke?: boolean }>) {
    this.config.icon = icon;
    return this;
  }

  build() {
    return this.config;
  }
}

function option() {
  return new OptionBuilder();
}

type BaseProp<T extends ZodType<any, any, any>, R = any> = {
  zodType: T;
  _defaultValue?: z.infer<T>;
  getSchema: () => Omit<SchemaProp, "prop">;
  getAdditionalProperties: () => object;
  defaultValue: (defaultValue: z.infer<T>) => BaseProp<ZodType<R, any, any>, R>;
};

type EnsureTuple<T extends string> = [T, ...T[]];
type SelectProp<T extends [string, ...string[]]> = BaseProp<ZodEnum<T>>;

function select<U extends string, T extends [U, ...U[]]>(
  options: T
): SelectProp<T>;

function select<R extends Record<string, OptionBuilder>>(
  options: R
): SelectProp<EnsureTuple<keyof R & string>>;

function select<
  U extends string,
  T extends [U, ...U[]],
  R extends Record<string, OptionBuilder>
>(options: T | R) {
  let zodEnum;

  if (Array.isArray(options)) {
    // Handle array of literals
    const tuple: EnsureTuple<U> = [
      options[0],
      ...options.slice(1),
    ] as EnsureTuple<U>;
    zodEnum = z.enum(tuple);
  } else {
    // Handle object
    const keys = Object.keys(options) as Array<keyof R & string>;
    const tuple: EnsureTuple<keyof R & string> = [
      keys[0],
      ...keys.slice(1),
    ] as EnsureTuple<keyof R & string>;
    zodEnum = z.enum(tuple);
  }

  const self: SelectProp<EnsureTuple<U> | EnsureTuple<keyof R & string>> = {
    zodType: zodEnum as ZodEnum<EnsureTuple<U> | EnsureTuple<keyof R & string>>,
    getAdditionalProperties: () => ({}),
    getSchema: () => {
      const result: Omit<SelectSchemaProp, "prop"> = {
        type: "select",
        params: {
          options: Array.isArray(options)
            ? options.map((option) => ({ value: option, label: option }))
            : Object.entries(options).map(([key, value]) => {
                const config = (value as OptionBuilder).build();
                return {
                  value: key,
                  label: config.label,
                  hideLabel: config.hideLabel,
                  icon: config.icon,
                };
              }),
        },
      };
      return result;
    },
    defaultValue: (defaultValue: z.infer<typeof zodEnum>) => {
      self._defaultValue = defaultValue;
      return self;
    },
  };

  return self;
}

type StringProp = BaseProp<ZodType<string, any, any>>;

// Function to define a string schema
function string(): StringProp {
  let schema = z.string();
  const additionalProperties = {};

  const self: StringProp = {
    zodType: schema,
    defaultValue(value: string) {
      self._defaultValue = value;
      return self;
    },
    getAdditionalProperties: () => additionalProperties,
    getSchema: () => {
      const result: Omit<StringSchemaProp, "prop"> = {
        type: "string",
      };
      return result;
    },
  };

  return self;
}

type NumberProp = BaseProp<ZodType<number, any, any>> & {
  max: (value: number) => NumberProp;
  min: (value: number) => NumberProp;
};

// Function to define a number schema
function number(): NumberProp {
  let schema = z.number();
  const additionalProperties: { max?: number; min?: number } = {};

  const self: NumberProp = {
    zodType: schema,
    defaultValue(value: number) {
      self._defaultValue = value;
      return self;
    },
    max(value: number) {
      schema = schema.max(value);
      additionalProperties.max = value; // Store max value
      self.zodType = schema;
      return self;
    },
    min(value: number) {
      schema = schema.min(value);
      additionalProperties.min = value; // Store min value
      self.zodType = schema;
      return self;
    },
    getAdditionalProperties: () => additionalProperties, // Method to get additional properties
    getSchema: () => {
      const result: Omit<NumberSchemaProp, "prop"> = {
        type: "number",
        params: {
          ...(additionalProperties.max && { max: additionalProperties.max }),
          ...(additionalProperties.min && { min: additionalProperties.min }),
        },
      };
      return result;
    },
  };

  return self;
}

function schema<T>(structure: {
  [K in keyof T]: BaseProp<ZodType<T[K], any, any>> & ThisType<{}>;
}): { zodType: ZodType<T, any, any>; structure: typeof structure } {
  const schemaObject: any = {};
  Object.keys(structure).forEach((key) => {
    schemaObject[key as keyof T] = structure[key as keyof T].zodType;
  });
  const fullStructure: { [K in keyof T]: any } = {} as any;
  (Object.keys(structure) as Array<keyof T>).forEach((key) => {
    fullStructure[key] = {
      ...structure[key],
      // Safely spread additional properties if they exist
      ...(structure[key].getAdditionalProperties?.() ?? {}),
    };
  });
  return {
    // @ts-ignore
    zodType: z.object(schemaObject),
    structure: fullStructure,
  };
}

// Type for the style function, ensuring correct typings
type StyleFunction<T> = (params: { values: T }) => object;

type DefinitionInputType<T> = {
  schema: { zodType: ZodType<T, any, any>; structure: any };
  styles: StyleFunction<T>;
};

type DefinitionOutputType<T> = {
  schema: {
    zodType: z.ZodType<T, any, any>;
    structure: any;
  };
  styles: (values: T) => object;
  schemaDef: () => SchemaProp[];
};

// CONFIG

type WidgetOutputType<T extends NonNullish> = {
  label: (label: string) => WidgetOutputType<T>;
  component: (
    component:
      | ComponentType<WidgetComponentProps<T>>
      | ComponentType<InlineTypeWidgetComponentProps<T>>
  ) => WidgetOutputType<T>;
  zodType: ZodType<T, any, any>;
};

interface WidgetComponentProps<T> {
  value: T;
  onChange: (value: T) => void;
}

function widget<T extends NonNullish>(
  zodType: ZodType<T, any, any>
): WidgetOutputType<T> {
  let label: string | undefined = undefined;
  let component;

  const self: WidgetOutputType<T> = {
    label(value: string) {
      label = value;
      return self;
    },
    component(value: ComponentType<WidgetComponentProps<T>>) {
      component = value;
      return self;
    },
    zodType,
  };

  return self;
}

const emptyWidget = widget(z.any())
  .label("No widget defined")
  .component(() => null);

type Config<T extends Record<string, WidgetOutputType<any>>> = {
  widgets?: T;
};

type CustomProp<T> = BaseProp<ZodType<T, any, any>>;

function config<T extends Record<string, WidgetOutputType<any>>>(
  config: Config<T>
) {
  let definitions: Record<string, DefinitionOutputType<any>> = {};

  function custom<
    K extends keyof T,
    V extends T[K] extends WidgetOutputType<infer U> ? U : never
  >(key: K): CustomProp<V> {
    if (!config.widgets) {
      throw new Error(
        `No widgets defined. The widget "${key as string}" does not exist`
      );
    }

    const widget: WidgetOutputType<V> = config.widgets[
      key
    ] as WidgetOutputType<V>;
    const schema = widget.zodType;

    const self: CustomProp<V> = {
      zodType: schema,
      getAdditionalProperties: () => ({}),
      defaultValue(value: V) {
        self._defaultValue = value;
        return self;
      },
      getSchema: () => {
        const result: Omit<SchemaProp, "prop"> = {
          type: key as string,
        };
        return result;
      },
    };

    return self;
  }

  function definition<U>(
    input: DefinitionInputType<U>
  ): DefinitionOutputType<U> {
    return {
      schema: input.schema,
      styles: (values: U) => input.styles({ values }),
      schemaDef: (): SchemaProp[] => {
        const result: SchemaProp[] = [];
        Object.keys(input.schema.structure).forEach((key) => {
          const prop = input.schema.structure[key];
          const schema = prop.getSchema();
          result.push({
            prop: key,
            ...schema,
          });
        });
        return result;
      },
    };
  }

  const self = {
    definitions: (def: Record<string, DefinitionOutputType<any>>) => {
      definitions = Object.keys(def).reduce((acc, key) => {
        acc[key] = def[key]; // Apply config params to each definition
        return acc;
      }, {} as Record<string, DefinitionOutputType<any>>);
      return self;
    },
    build: () => {
      return definitions;
    },
    definition,
    schema,
    select,
    string,
    number,
    custom,
    option,
  };

  return self;
}

export const ebc = {
  config,
  widget,
};
