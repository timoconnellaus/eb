import type {
  NonNullish,
  WidgetComponentProps,
  InlineTypeWidgetComponentProps,
} from "@easyblocks/core";
import type { ComponentType } from "react";
import type { ZodType, z } from "zod";

export type InlineWidgetConfig<T extends NonNullish> = {
  label?: string;
  component: ComponentType<InlineTypeWidgetComponentProps<T>>;
  zodType: ZodType<T, any, any>;
  validate: (value: T) => boolean;
  defaultValue: z.infer<ZodType<T, any, any>>;
};

export type InlineWidgetProps<T extends NonNullish> = {
  zodType: ZodType<T, any, any>;
  defaultValue: z.infer<ZodType<T, any, any>>;
  component: ComponentType<InlineTypeWidgetComponentProps<T>>;
};

// Defining WidgetOutputType as a class
export class InlineWidget<T extends NonNullish> {
  private _label: string | undefined;
  private _component: ComponentType<InlineTypeWidgetComponentProps<T>>;
  private _zodType: ZodType<T, any, any>;
  private _defaultValue: z.infer<ZodType<T, any, any>>;
  private _validateFunction: (value: T) => boolean;

  constructor(props: InlineWidgetProps<T>) {
    this._zodType = props.zodType;
    this._defaultValue = props.defaultValue;
    this._component = props.component;

    // Use the inbuilt zod parse method to validate the value
    this._validateFunction = (value: T) => {
      try {
        props.zodType.parse(value);
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

  _def(): InlineWidgetConfig<T> {
    return {
      label: this._label,
      defaultValue: this._defaultValue,
      component: this._component,
      zodType: this._zodType,
      validate: this._validateFunction,
    };
  }
}

export function inlineWidget<T extends NonNullish>(
  props: InlineWidgetProps<T>
): InlineWidget<T> {
  return new InlineWidget<T>(props);
}

// We will force some functions to be chained - so we break up the widget creation into three steps

// Step 1: Create a widget
// class InlineWidgetInit<T extends NonNullish> {
//   private _zodType: ZodType<T, any, any>;

//   constructor(zodType: ZodType<T, any, any>) {
//     this._zodType = zodType;
//   }

//   defaultValue(
//     defaultValue: z.infer<ZodType<T, any, any>>
//   ): IWidgetAddComponent<T> {
//     return new IWidgetAddComponent<T>(this._zodType, defaultValue);
//   }
// }

// // Step 2: Add a component
// class IWidgetAddComponent<T extends NonNullish> {
//   private _zodType: ZodType<T, any, any>;
//   private _defaultValue: z.infer<ZodType<T, any, any>>;

//   constructor(
//     zodType: ZodType<T, any, any>,
//     defaultValue: z.infer<ZodType<T, any, any>>
//   ) {
//     this._zodType = zodType;
//     this._defaultValue = defaultValue;
//   }

//   component(
//     component: ComponentType<InlineTypeWidgetComponentProps<T>>
//   ): InlineWidget<T> {
//     return new InlineWidget<T>(this._zodType, this._defaultValue, component);
//   }
// }

// // Function to create a widget
// export function inlineWidget<T extends NonNullish>(
//   zodType: ZodType<T, any, any>
// ): InlineWidgetInit<T> {
//   return new InlineWidgetInit<T>(zodType);
// }
