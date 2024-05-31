import type {
  NonNullish,
  WidgetComponentProps,
  InlineTypeWidgetComponentProps,
} from "@easyblocks/core";
import type { ComponentType } from "react";
import type { ZodType, z } from "zod";

type WidgetConfig<T extends NonNullish> = {
  label?: string;
  component:
    | ComponentType<WidgetComponentProps<T>>
    | ComponentType<InlineTypeWidgetComponentProps<T>>;
  zodType: ZodType<T, any, any>;
  validate: (value: T) => boolean;
  defaultValue: z.infer<ZodType<T, any, any>>;
};

// Defining WidgetOutputType as a class
export class Widget<T extends NonNullish> {
  private _label: string | undefined;
  private _component:
    | ComponentType<WidgetComponentProps<T>>
    | ComponentType<InlineTypeWidgetComponentProps<T>>;
  private _zodType: ZodType<T, any, any>;
  private _defaultValue: z.infer<ZodType<T, any, any>>;
  private _validateFunction: (value: T) => boolean;

  constructor(
    zodType: ZodType<T, any, any>,
    defaultValue: z.infer<ZodType<T, any, any>>,
    component:
      | ComponentType<WidgetComponentProps<T>>
      | ComponentType<InlineTypeWidgetComponentProps<T>>
  ) {
    this._zodType = zodType;
    this._defaultValue = defaultValue;
    this._component = component;

    // Use the inbuilt zod parse method to validate the value
    this._validateFunction = (value: T) => {
      try {
        zodType.parse(value);
        return true;
      } catch (e) {
        return false;
      }
    };
  }

  label(label: string): this {
    this._label = label;
    return this;
  }

  _getConfig(): WidgetConfig<T> {
    return {
      label: this._label,
      defaultValue: this._defaultValue,
      component: this._component,
      zodType: this._zodType,
      validate: this._validateFunction,
    };
  }
}

// We will force some functions to be chained - so we break up the widget creation into three steps

// Step 1: Create a widget
interface IWidgetInit<T extends NonNullish> {
  defaultValue(
    defaultValue: z.infer<ZodType<T, any, any>>
  ): IWidgetAddComponent<T>;
}

class WidgetInit<T extends NonNullish> implements IWidgetInit<T> {
  private _zodType: ZodType<T, any, any>;

  constructor(zodType: ZodType<T, any, any>) {
    this._zodType = zodType;
  }

  defaultValue(
    defaultValue: z.infer<ZodType<T, any, any>>
  ): IWidgetAddComponent<T> {
    return new IWidgetAddComponent<T>(this._zodType, defaultValue);
  }
}

// Step 2: Add a component
interface IWidgetAddComponent<T extends NonNullish> {
  component(
    component:
      | ComponentType<WidgetComponentProps<T>>
      | ComponentType<InlineTypeWidgetComponentProps<T>>
  ): Widget<T>;
}

class IWidgetAddComponent<T extends NonNullish>
  implements IWidgetAddComponent<T>
{
  private _zodType: ZodType<T, any, any>;
  private _defaultValue: z.infer<ZodType<T, any, any>>;

  constructor(
    zodType: ZodType<T, any, any>,
    defaultValue: z.infer<ZodType<T, any, any>>
  ) {
    this._zodType = zodType;
    this._defaultValue = defaultValue;
  }

  component(
    component:
      | ComponentType<WidgetComponentProps<T>>
      | ComponentType<InlineTypeWidgetComponentProps<T>>
  ): Widget<T> {
    return new Widget<T>(this._zodType, this._defaultValue, component);
  }
}

// Function to create a widget
export function widget<T extends NonNullish>(
  zodType: ZodType<T, any, any>
): WidgetInit<T> {
  return new WidgetInit<T>(zodType);
}
