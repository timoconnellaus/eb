import type {
  ExternalDataCompoundResourceRejectedResult,
  NonNullish,
  RequestedExternalData,
  WidgetComponentProps,
} from "@easyblocks/core";
import type { ComponentType } from "react";
import type { ZodType } from "zod";
import { z } from "zod";

export type FetchCompoundResourceResultValue<
  Type extends string = string,
  Value extends NonNullish = NonNullish
> = {
  type: Type;
  value: Value;
  label?: string;
};

export type FetchCompoundTextResourceResultValue<ED extends NonNullish> =
  FetchCompoundResourceResultValue<"text", ED>;

export type FetchCompoundResourceResultValues<ED extends NonNullish> = Record<
  string,
  | FetchCompoundTextResourceResultValue<ED>
  | FetchCompoundResourceResultValue<string & Record<never, never>, ED>
>;

export type ExternalDataCompoundResourceResolvedResult<ED extends NonNullish> =
  {
    type: "object";
    value: FetchCompoundResourceResultValues<ED>;
  };

export type FetchOutputCompoundResources<ED extends NonNullish> = Record<
  string,
  | ExternalDataCompoundResourceResolvedResult<ED>
  | ExternalDataCompoundResourceRejectedResult
>;

export type FetchResourceResolvedResult<ED extends NonNullish> = {
  type: string;
  value: ED;
};

type FetchResourceRejectedResult = { error: Error };

export type FetchResourceResult<ED extends NonNullish> =
  | FetchResourceResolvedResult<ED>
  | FetchResourceRejectedResult;

export type FetchOutputBasicResources<ED extends NonNullish> = Record<
  string,
  FetchResourceResult<ED>
>;

export type ExternalData<ED extends NonNullish> = Record<
  string,
  (FetchOutputBasicResources<ED> | FetchOutputCompoundResources<ED>)[string]
>;

export type Callback<T extends NonNullish> = (props: {
  externalData: RequestedExternalData;
  externalDataId: string;
}) => Promise<ExternalData<T>>;

export type HigherOrderCallback<T extends NonNullish> = (props: {
  externalData: RequestedExternalData;
}) => Promise<ExternalData<T>>;

export type ExternalWidgetConfig<EW extends NonNullish> = {
  label?: string;
  component: ComponentType<WidgetComponentProps>;
  zodType: ZodType<EW, any, any>;
  callback: Callback<EW>;
  higherOrderCallback?: HigherOrderCallback<EW>;
  type: string;
};

export type ExternalWidgetProps<EW extends NonNullish> = {
  zodType: ZodType<EW, any, any>;
  component: ComponentType<WidgetComponentProps>;
  callback: Callback<EW>;
  type: string;
};

export class ExternalWidget<T extends NonNullish> {
  private _label: string | undefined;
  private _component: ComponentType<WidgetComponentProps>;
  private _zodType: ZodType<T, any, any>;
  private _callback: Callback<T>;
  private _higherOrderCallback?: HigherOrderCallback<T>;
  private _type: string;

  constructor(props: ExternalWidgetProps<T>) {
    this._component = props.component;
    this._zodType = props.zodType;
    this._callback = props.callback;
    this._type = props.type;
  }

  label(label: string): this {
    this._label = label;
    return this;
  }

  _setHigherOrderCallback(callback: HigherOrderCallback<T>): this {
    this._higherOrderCallback = callback;
    return this;
  }

  _def(): ExternalWidgetConfig<T> {
    return {
      label: this._label,
      component: this._component,
      zodType: this._zodType,
      callback: this._callback,
      higherOrderCallback: this._higherOrderCallback,
      type: this._type,
    };
  }
}

export const externalWidget = <T extends NonNullish>(
  props: ExternalWidgetProps<T>
): ExternalWidget<T> => new ExternalWidget(props);
