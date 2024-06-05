import type {
  BooleanSchemaProp,
  ComponentCollectionSchemaProp,
  ComponentSchemaProp,
  InlineTypeWidgetComponentProps,
  NonNullish,
  NumberSchemaProp,
  SchemaProp,
  SelectSchemaProp,
  StringSchemaProp,
  Option,
  ColorSchemaProp,
  ConfigTokenValue,
  ThemeColor,
  ThemeFont,
  ThemeSpace,
  ExternalDataCompoundResourceRejectedResult,
  RequestedExternalData,
  WidgetComponentProps,
} from "@easyblocks/core";
import { ZodEnum, ZodType, z } from "zod";
import { createElement, type ComponentType, type ReactElement } from "react";
// import { ComponentCollectionProp } from "./props/ComponentCollection";
import type {
  ConvertToReactElement,
  ExtractInnerTypeFromExternalWidget,
  FlattenSchema,
  FlattenSchemaAndCastToReactElement,
} from "./types";

////////////////////////////////////////////////////////////////////////////////
// #region DEVICES
////////////////////////////////////////////////////////////////////////////////

const xs = {
  w: 375,
  h: 667,
  breakpoint: 568,
  label: "Mobile",
} as DeviceType;

const sm = {
  w: 667,
  h: 375,
  breakpoint: 768,
  label: "Mobile SM h",
  hidden: true,
} as DeviceType;

const md = {
  w: 768,
  h: 1024,
  breakpoint: 992,
  label: "Tablet",
} as DeviceType;

const lg = {
  w: 1024,
  h: 768,
  breakpoint: 1280,
  label: "TabletH",
  hidden: true,
} as DeviceType;

const xl = {
  w: 1366,
  h: 768,
  breakpoint: 1600,
  label: "Desktop",
  isMain: true,
} as DeviceType;

const _2xl = {
  w: 1920,
  h: 920,
  label: "Large desktop",
} as DeviceType;

export const DEFAULT_DEVICES = {
  xs,
  sm,
  md,
  lg,
  xl,
  "2xl": _2xl,
} as const;

export type DeviceType = {
  w: number;
  h: number;
  breakpoint: number | null;
  label: string;
  isMain: boolean;
  hidden: boolean;
};

export type DeviceTypeAllOptional = {
  w?: number;
  h?: number;
  breakpoint?: number | null;
  label?: string;
  isMain?: boolean;
  hidden?: boolean;
};

export type DeviceClasssAllOptional = {
  xs?: Device;
  sm?: Device;
  md?: Device;
  lg?: Device;
  xl?: Device;
  "2xl"?: Device;
};

export type DevicesType = {
  xs: DeviceType;
  sm: DeviceType;
  md: DeviceType;
  lg: DeviceType;
  xl: DeviceType;
  "2xl": DeviceType;
};

export class Device {
  private _w?: number;
  private _h?: number;
  private _breakpoint?: number | null;
  private _label?: string;
  private _isMain?: boolean;
  private _hidden?: boolean;

  w(w: number) {
    this._w = w;
    return this;
  }

  h(h: number) {
    this._h = h;
    return this;
  }

  breakpoint(breakpoint: number | null) {
    this._breakpoint = breakpoint;
    return this;
  }

  label(label: string) {
    this._label = label;
    return this;
  }

  isMain() {
    this._isMain = true;
    return this;
  }

  hidden(isHidden: boolean) {
    this._hidden = isHidden;
    return this;
  }

  _getConfig(): DeviceTypeAllOptional {
    return {
      w: this._w,
      h: this._h,
      breakpoint: this._breakpoint,
      label: this._label,
      isMain: this._isMain,
      hidden: this._hidden,
    };
  }
}

export const mergeDevice = (
  device: DeviceTypeAllOptional,
  defaultDevice: DeviceType
) => {
  return {
    w: device.w || defaultDevice.w,
    h: device.h || defaultDevice.h,
    breakpoint: device.breakpoint || defaultDevice.breakpoint,
    label: device.label || defaultDevice.label,
    isMain: device.isMain || defaultDevice.isMain,
    hidden: device.hidden || defaultDevice.hidden,
  };
};

export class DevicesClass {
  private _devices: DevicesType;

  constructor(devices?: DeviceClasssAllOptional) {
    this._devices = DEFAULT_DEVICES;
    if (devices) {
      if (devices.xs) {
        const xs = devices.xs._getConfig();
        this._devices["xs"] = mergeDevice(xs, DEFAULT_DEVICES.xs);
      }
      if (devices.sm) {
        const sm = devices.sm._getConfig();
        this._devices["sm"] = mergeDevice(sm, DEFAULT_DEVICES.sm);
      }
      if (devices.md) {
        const md = devices.md._getConfig();
        this._devices["md"] = mergeDevice(md, DEFAULT_DEVICES.md);
      }
      if (devices.lg) {
        const lg = devices.lg._getConfig();
        this._devices["lg"] = mergeDevice(lg, DEFAULT_DEVICES.lg);
      }
      if (devices.xl) {
        const xl = devices.xl._getConfig();
        this._devices["xl"] = mergeDevice(xl, DEFAULT_DEVICES.xl);
      }
      if (devices["2xl"]) {
        const _2xl = devices["2xl"]._getConfig();
        this._devices["2xl"] = mergeDevice(_2xl, DEFAULT_DEVICES["2xl"]);
      }
    }
  }

  mainDevice(device: keyof DevicesType) {
    // set is main false to everything first
    Object.keys(this._devices).forEach((key) => {
      (this._devices as any)[key].isMain = false;
    });
    (this._devices as any)[device].isMain = true;
    return this;
  }

  _def() {
    return this._devices;
  }
}

export const devices = (devices?: DeviceClasssAllOptional) =>
  new DevicesClass(devices);

export const device = () => new Device();

////////////////////////////////////////////////////////////////////////////////
// #region WIDGETS
////////////////////////////////////////////////////////////////////////////////

/// #region INLINE WIDGET

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
export class InlineWidgetClass<T extends NonNullish> {
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
): InlineWidgetClass<T> {
  return new InlineWidgetClass<T>(props);
}

/// #region TOKEN WIDGET

export type TokenWidgetProps<T extends NonNullish> = InlineWidgetProps<T>;
export type TokenWidgetConfig<T extends NonNullish> = InlineWidgetConfig<T>;
export class TokenWidgetClass<
  T extends NonNullish
> extends InlineWidgetClass<T> {
  constructor(props: TokenWidgetProps<T>) {
    super(props);
  }
}
export const tokenWidget = <T extends NonNullish>(
  props: TokenWidgetProps<T>
): TokenWidgetClass<T> => new TokenWidgetClass(props);

/// #region EXTERNAL WIDGET

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

export class ExternalWidgetClass<T extends NonNullish> {
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
): ExternalWidgetClass<T> => new ExternalWidgetClass(props);

//// WIDGET CONFIG /////////////////////////////////////////////////////////////

interface WidgetsComponentsProps<
  Inline extends Record<string, InlineWidgetClass<any>>,
  Token extends Record<string, TokenWidgetClass<any>>,
  External extends Record<string, ExternalWidgetClass<any>>
> {
  inline?: Inline;
  token?: Token;
  external?: External;
}

export class WidgetsClass<
  Inline extends Record<string, InlineWidgetClass<any>>,
  Token extends Record<string, TokenWidgetClass<any>>,
  External extends Record<string, ExternalWidgetClass<any>>
> {
  private _inline: Inline;
  private _token: Token;
  private _external: External;

  constructor(props: WidgetsComponentsProps<Inline, Token, External>) {
    this._inline = props.inline ?? ({} as Inline);
    this._token = props.token ?? ({} as Token);
    this._external = props.external ?? ({} as External);
  }

  _def() {
    return {
      inline: this._inline,
      token: this._token,
      external: this._external,
    };
  }
}

export function widgets<
  Inline extends Record<string, InlineWidgetClass<any>>,
  Token extends Record<string, TokenWidgetClass<any>>,
  External extends Record<string, ExternalWidgetClass<any>>
>(
  props: WidgetsComponentsProps<Inline, Token, External>
): WidgetsClass<Inline, Token, External> {
  return new WidgetsClass<Inline, Token, External>(props);
}

////////////////////////////////////////////////////////////////////////////////
// #region TOKENS
////////////////////////////////////////////////////////////////////////////////

export class TokenClass<T> {
  private _label: string | undefined;
  private _value: T;
  private _isDefault: boolean = false;

  constructor(value: T) {
    this._value = value;
  }

  label(label: string): this {
    this._label = label;
    return this;
  }

  isDefault(): this {
    this._isDefault = true;
    return this;
  }

  _getConfig(): Omit<ConfigTokenValue<T>, "id"> {
    return {
      label: this._label,
      value: this._value,
      isDefault: this._isDefault,
    };
  }
}

export class TokenSetClass<
  ZT,
  T extends Record<string, TokenClass<ZT>>,
  K extends keyof T
> {
  private _tokens: T;
  private _zodType: ZodType<ZT, any, any>;

  constructor(zodType: ZodType<ZT, any, any>, tokens: T) {
    this._tokens = tokens;
    this._zodType = zodType;
  }

  default(value: K): this {
    this._tokens[value].isDefault();
    return this;
  }

  _def() {
    return this._tokens;
  }
}

interface ITokenConfigType<
  CustomTokens extends Record<string, TokenSetClass<any, any, any>>,
  StandardTokens extends Partial<IStandardTokenTypes>
> {
  standard?: StandardTokens;
  custom?: CustomTokens;
}

export interface IStandardTokenTypes {
  color?: TokenSetClass<
    ThemeColor,
    Record<string, TokenClass<ThemeColor>>,
    string
  >;
  font?: TokenSetClass<
    ThemeFont,
    Record<string, TokenClass<ThemeFont>>,
    string
  >;
  space?: TokenSetClass<
    ThemeSpace,
    Record<string, TokenClass<ThemeSpace>>,
    string
  >;
  boxShadow?: TokenSetClass<string, Record<string, TokenClass<string>>, string>;
  containerWidth?: TokenSetClass<
    number,
    Record<string, TokenClass<number>>,
    string
  >;
  aspectRatio?: TokenSetClass<
    string,
    Record<string, TokenClass<string>>,
    string
  >;
  icon?: TokenSetClass<string, Record<string, TokenClass<string>>, string>;
}

export class TokensClass<
  CustomTokens extends Record<string, TokenSetClass<any, any, any>>,
  StandardTokens extends Partial<IStandardTokenTypes>
> {
  private _standardTokens: StandardTokens;
  private _customTokens: CustomTokens;

  constructor(props: ITokenConfigType<CustomTokens, StandardTokens>) {
    this._standardTokens = props.standard as StandardTokens;
    if (!this._standardTokens) {
      this._standardTokens = {} as StandardTokens;
    }
    this._customTokens = props.custom ?? ({} as CustomTokens);
  }

  _def() {
    return {
      standard: Object.fromEntries(
        Object.entries(this._standardTokens).map(([key, value]) => [
          key,
          value._def(),
        ])
      ),
      custom: Object.fromEntries(
        Object.entries(this._customTokens).map(([key, value]) => [
          key,
          value._def(),
        ])
      ),
    };
  }
}

export const tokens = <
  CustomTokens extends Record<string, TokenSetClass<any, any, any>>,
  StandardTokens extends Partial<IStandardTokenTypes>
>(
  props: ITokenConfigType<CustomTokens, StandardTokens>
) => new TokensClass<CustomTokens, StandardTokens>(props);

const responsiveValue = <T>(zodType: ZodType<T>) =>
  z.object({
    $res: z.literal(true),
    xs: zodType.optional(),
    sm: zodType.optional(),
    md: zodType.optional(),
    lg: zodType.optional(),
    xl: zodType.optional(),
  });

const trulyResponsiveValue = <T>(zodType: ZodType<T>) =>
  z.union([responsiveValue<T>(zodType), zodType]);

const themeColorValue = z.string();
export const themeColor = trulyResponsiveValue(themeColorValue);
export const colorToken = (value: z.infer<typeof themeColor>) =>
  new TokenClass<z.infer<typeof themeColor>>(value);

// Note: This is mapping to stitches classes - we might need to change this if stitches is removed or becomes optional
const themeFontValue = z.object({
  fontFamily: z.string(),
  lineHeight: z.number(),
  fontSize: z.number(),
  fontWeight: z.number().optional(),
});
const themeFont = trulyResponsiveValue(themeFontValue);
export const fontToken = (value: z.infer<typeof themeFont>) =>
  new TokenClass<z.infer<typeof themeFont>>(value);

const themeSpaceValue = z.union([z.number(), z.string()]); // Note: this can probably be defined better. It's describing CSS space options
export const themeSpace = trulyResponsiveValue(themeSpaceValue);
export const spaceToken = (value: z.infer<typeof themeSpace>) =>
  new TokenClass<z.infer<typeof themeSpace>>(value);

const themeContainerWidthValue = z.number(); // this is a number like 1024 describing the width of a container
export const themeContainerWidth = themeContainerWidthValue;
export const containerWidthToken = (
  value: z.infer<typeof themeContainerWidth>
) => new TokenClass<z.infer<typeof themeContainerWidth>>(value);

const themeBoxShadowValue = z.string(); // this is CSS for box shadows
export const themeBoxShadow = themeBoxShadowValue;
export const boxShadowToken = (value: z.infer<typeof themeBoxShadow>) =>
  new TokenClass<z.infer<typeof themeBoxShadow>>(value);

const themeAspectRatioValue = z.string(); // should be 2:1 or something like that
export const themeAspectRatio = themeAspectRatioValue;
export const aspectRatioToken = (value: z.infer<typeof themeAspectRatio>) =>
  new TokenClass<z.infer<typeof themeAspectRatio>>(value);

const themeIconValue = z.string(); // this is an svg
export const themeIcon = themeIconValue;
export const iconToken = (value: z.infer<typeof themeIcon>) =>
  new TokenClass<z.infer<typeof themeIcon>>(value);

export const customTokens = <
  ZT,
  T extends Record<string, TokenClass<ZT>>,
  K extends keyof T
>(props: {
  zodType: ZodType<ZT, any, any>;
  tokens: T;
}) => new TokenSetClass<ZT, T, K>(props.zodType, props.tokens);

export const customToken = <T>(value: T) => new TokenClass<T>(value);

export const colorTokens = <
  T extends Record<string, TokenClass<z.infer<typeof themeColor>>>
>(
  colorTokens: T
) => {
  return customTokens({
    zodType: themeColor,
    tokens: colorTokens,
  });
};

export const fontTokens = <
  T extends Record<string, TokenClass<z.infer<typeof themeFont>>>
>(
  fontTokens: T
) => {
  return customTokens({
    zodType: themeFont,
    tokens: fontTokens,
  });
};

export const spaceTokens = <
  T extends Record<string, TokenClass<z.infer<typeof themeSpace>>>
>(
  spaceTokens: T
) => {
  return customTokens({
    zodType: themeSpace,
    tokens: spaceTokens,
  });
};

export const containerWidthTokens = <
  T extends Record<string, TokenClass<z.infer<typeof themeContainerWidth>>>
>(
  containerWidthTokens: T
) => {
  return customTokens({
    zodType: themeContainerWidth,
    tokens: containerWidthTokens,
  });
};

export const boxShadowTokens = <
  T extends Record<string, TokenClass<z.infer<typeof themeBoxShadow>>>
>(
  boxShadowTokens: T
) => {
  return customTokens({
    zodType: themeBoxShadow,
    tokens: boxShadowTokens,
  });
};

export const aspectRatioTokens = <
  T extends Record<string, TokenClass<z.infer<typeof themeAspectRatio>>>
>(
  aspectRatioTokens: T
) => {
  return customTokens({
    zodType: themeAspectRatio,
    tokens: aspectRatioTokens,
  });
};

export const iconTokens = <
  T extends Record<string, TokenClass<z.infer<typeof themeIcon>>>
>(
  iconTokens: T
) => {
  return customTokens({
    zodType: themeIcon,
    tokens: iconTokens,
  });
};

////////////////////////////////////////////////////////////////////////////////
// #region BASE CONFIG
////////////////////////////////////////////////////////////////////////////////

interface IBaseConfigProps<
  InlineWidgets extends Record<string, InlineWidgetClass<any>>,
  TokenWidgets extends Record<string, TokenWidgetClass<any>>,
  ExternalWidgets extends Record<string, ExternalWidgetClass<any>>,
  CustomTokens extends Record<string, TokenSetClass<any, any, any>>,
  StandardTokens extends Partial<IStandardTokenTypes>,
  ComponentType extends string,
  ComponentTypes extends ComponentType[],
  Devices extends DevicesClass
> {
  widgets: WidgetsClass<InlineWidgets, TokenWidgets, ExternalWidgets>;
  tokens: TokensClass<CustomTokens, StandardTokens>;
  componentTypes: ComponentTypes;
  devices: Devices;
}

class BaseConfigClass<
  InlineWidgets extends Record<string, InlineWidgetClass<any>>,
  TokenWidgets extends Record<string, TokenWidgetClass<any>>,
  ExternalWidgets extends Record<string, ExternalWidgetClass<any>>,
  CustomTokens extends Record<string, TokenSetClass<any, any, any>>,
  StandardTokens extends Partial<IStandardTokenTypes>,
  ComponentType extends string,
  ComponentTypes extends ComponentType[],
  Devices extends DevicesClass
> {
  private _widgets: WidgetsClass<InlineWidgets, TokenWidgets, ExternalWidgets>;
  private _tokens: TokensClass<CustomTokens, StandardTokens>;
  private _componentTypes: ComponentTypes;
  private _devices: Devices;

  constructor(
    props: IBaseConfigProps<
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens,
      ComponentType,
      ComponentTypes,
      Devices
    >
  ) {
    this._devices = props.devices;
    this._widgets = props.widgets;
    this._tokens = props.tokens;
    this._componentTypes = props.componentTypes;
  }

  inlineType<K extends keyof InlineWidgets>(inlineWidgetKey: K) {
    return new InlineTypeClass<InlineWidgets, K>(inlineWidgetKey);
  }

  tokenType<
    K extends keyof TokenWidgets,
    TK extends keyof CustomTokens | keyof StandardTokens
  >(tokenKey: TK) {
    return new TokenTypeClass<
      TokenWidgets,
      K,
      CustomTokens,
      StandardTokens,
      TK
    >(tokenKey);
  }

  externalType<K extends keyof ExternalWidgets>(externalWidgetKeys: Array<K>) {
    return new ExternalType<ExternalWidgets, K>(externalWidgetKeys);
  }

  configWithTypes<
    InlineTypes extends Record<string, InlineTypeClass<InlineWidgets, any>>,
    TokenTypes extends Record<
      string,
      TokenTypeClass<TokenWidgets, any, CustomTokens, StandardTokens>
    >,
    ExternalTypes extends Record<string, ExternalType<ExternalWidgets, any>>
  >(
    props: IConfigWithTypesPropsUser<
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens,
      ComponentType,
      ComponentTypes,
      Devices,
      InlineTypes,
      TokenTypes,
      ExternalTypes
    >
  ): ConfigWithTypesClass<
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes,
    Devices,
    InlineTypes,
    TokenTypes,
    ExternalTypes
  > {
    return new ConfigWithTypesClass<
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens,
      ComponentType,
      ComponentTypes,
      Devices,
      InlineTypes,
      TokenTypes,
      ExternalTypes
    >({
      baseConfig: this,
      inlineTypes: props.inlineTypes ?? ({} as InlineTypes),
      tokenTypes: props.tokenTypes ?? ({} as TokenTypes),
      externalTypes: props.externalTypes ?? ({} as ExternalTypes),
    });
  }
}

export const config = <
  InlineWidgets extends Record<string, InlineWidgetClass<any>>,
  TokenWidgets extends Record<string, TokenWidgetClass<any>>,
  ExternalWidgets extends Record<string, ExternalWidgetClass<any>>,
  CustomTokens extends Record<string, TokenSetClass<any, any, any>>,
  StandardTokens extends Partial<IStandardTokenTypes>,
  ComponentType extends string,
  ComponentTypes extends ComponentType[],
  Devices extends DevicesClass
>(
  props: IBaseConfigProps<
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes,
    Devices
  >
) =>
  new BaseConfigClass<
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes,
    Devices
  >(props);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// #region PROPS
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// #region BASE PROP
export abstract class BasePropClass<T> {
  protected _type?: T;

  abstract _def(): Omit<SchemaProp, "prop">;
}

// #region GROUP PROP
export class GroupClass<T extends Record<string, BasePropClass<any>>> {
  _props: T;

  constructor(props: T) {
    this._props = props;
  }

  _def() {
    return {
      props: this._props,
    };
  }
}

// #region NUMBER PROP
export class NumberPropClass extends BasePropClass<number> {
  private _min?: number;
  private _max?: number;
  private _defaultValue?: number;

  max(value: number): this {
    this._max = value;
    return this;
  }

  min(value: number): this {
    this._min = value;
    return this;
  }

  defaultValue(value: number): this {
    this._defaultValue = value;
    return this;
  }

  _def(): Omit<NumberSchemaProp, "prop"> {
    return {
      type: "number",
      // defaultValue: this._defaultValue,
    };
  }
}

// #region STRING PROP
export class StringPropClass extends BasePropClass<string> {
  private _defaultValue?: string;

  defaultValue(value: string): this {
    this._defaultValue = value;
    return this;
  }

  _def(): Omit<StringSchemaProp, "prop"> {
    return {
      type: "string",
      // defaultValue: this._defaultValue,
    };
  }
}

// #region CUSTOM PROP
export class CustomPropClass<T> extends BasePropClass<T> {
  private _customType: string;

  constructor(customType: string) {
    super();
    this._customType = customType;
  }

  _def(): Omit<SchemaProp, "prop"> {
    return {
      type: this._customType,
    };
  }
}

// #region COMPONENT COLLECTION PROP
export class ComponentCollectionPropClass<
  T extends Record<
    string,
    BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
  >,
  Schema extends ISchemaReturnType<T>,
  O extends Record<string, string | string[]>,
  P extends Record<string, any>,
  Params extends Record<string, any>,
  TWFunction extends (props: { values: Schema["flattenedSchema"] }) => O,
  TWFunctionReturnType extends ConvertToReactElement<ReturnType<TWFunction>>,
  ComponentFunction extends (
    props: Schema["reactElements"] & TWFunctionReturnType
  ) => React.JSX.Element,
  InlineWidgets extends Record<string, InlineWidgetClass<any>>,
  TokenWidgets extends Record<string, TokenWidgetClass<any>>,
  ExternalWidgets extends Record<string, ExternalWidgetClass<any>>,
  CustomTokens extends Record<string, TokenSetClass<any, any, any>>,
  StandardTokens extends Partial<IStandardTokenTypes>,
  ComponentType extends string,
  ComponentTypes extends ComponentType[],
  Devices extends DevicesClass,
  InlineTypes extends Record<string, InlineTypeClass<InlineWidgets, any>>,
  TokenTypes extends Record<
    string,
    TokenTypeClass<TokenWidgets, any, CustomTokens, StandardTokens>
  >,
  ExternalTypes extends Record<string, ExternalType<ExternalWidgets, any>>,
  Definitions extends DefinitionClass<
    T,
    Schema,
    O,
    P,
    Params,
    TWFunction,
    TWFunctionReturnType,
    ComponentFunction,
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes,
    Devices,
    InlineTypes,
    TokenTypes,
    ExternalTypes
  >[] = DefinitionClass<
    T,
    Schema,
    O,
    P,
    Params,
    TWFunction,
    TWFunctionReturnType,
    ComponentFunction,
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes,
    Devices,
    InlineTypes,
    TokenTypes,
    ExternalTypes
  >[]
> extends BasePropClass<string> {
  private _components: Definitions;

  constructor(components: Definitions) {
    super();
    this._components = components;
  }

  _def(): Omit<ComponentCollectionSchemaProp, "prop"> {
    return {
      type: "component-collection",
      accepts: this._components.map((c) => c._def().id),
    };
  }
}

// #region BOOLEAN PROP
export class BooleanProp extends BasePropClass<boolean> {
  private _defaultValue?: boolean;

  defaultValue(value: boolean): this {
    this._defaultValue = value;
    return this;
  }

  _def(): Omit<BooleanSchemaProp, "prop"> {
    return {
      type: "boolean",
      defaultValue: this._defaultValue,
    };
  }
}

// #region SELECT PROP

type EnsureTuple<T extends string> = [T, ...T[]];
// type SelectProp<T extends [string, ...string[]]> = BaseProp<ZodEnum<T>>;

// function select<U extends string, T extends [U, ...U[]]>(
//   options: T
// ): SelectProp<T>;

// function select<R extends Record<string, OptionBuilder>>(
//   options: R
// ): SelectProp<EnsureTuple<keyof R & string>>;

// function select<
//   U extends string,
//   T extends [U, ...U[]],
//   R extends Record<string, OptionBuilder>
// >(options: T | R) {
//   let zodEnum;

//   if (Array.isArray(options)) {
//     // Handle array of literals
//     const tuple: EnsureTuple<U> = [
//       options[0],
//       ...options.slice(1),
//     ] as EnsureTuple<U>;
//     zodEnum = z.enum(tuple);
//   } else {
//     // Handle object
// const keys = Object.keys(options) as Array<keyof R & string>;
// const tuple: EnsureTuple<keyof R & string> = [
//   keys[0],
//   ...keys.slice(1),
// ] as EnsureTuple<keyof R & string>;
// zodEnum = z.enum(tuple);
//   }

//   const self: SelectProp<EnsureTuple<U> | EnsureTuple<keyof R & string>> = {
//     zodType: zodEnum as ZodEnum<EnsureTuple<U> | EnsureTuple<keyof R & string>>,
//     getAdditionalProperties: () => ({}),
//     getSchema: () => {
//       const result: Omit<SelectSchemaProp, "prop"> = {
//         type: "select",
//         params: {
//           options: Array.isArray(options)
//             ? options.map((option) => ({ value: option, label: option }))
//             : Object.entries(options).map(([key, value]) => {
//                 const config = (value as OptionBuilder).build();
//                 return {
//                   value: key,
//                   label: config.label,
//                   hideLabel: config.hideLabel,
//                   icon: config.icon,
//                 };
//               }),
//         },
//       };
//       return result;
//     },
//     defaultValue: (defaultValue: z.infer<typeof zodEnum>) => {
//       self._defaultValue = defaultValue;
//       return self;
//     },
//   };

//   return self;
// }

// type EnsureTuple<T extends string> = [T, ...T[]];
// type SelectProp<T extends [string, ...string[]]> = BaseProp<ZodEnum<T>>;

// type OptionConfig = Omit<Exclude<Option, string>, "value">;

// class OptionBuilder {
//   private config: OptionConfig;

//   constructor() {
//     this.config = {};
//   }

//   label(label: string): this {
//     this.config.label = label;
//     return this;
//   }

//   hideLabel(): this {
//     this.config.hideLabel = true;
//     return this;
//   }

//   icon(
//     icon: string | ComponentType<{ size?: number; isStroke?: boolean }>
//   ): this {
//     this.config.icon = icon;
//     return this;
//   }

//   build(): OptionConfig {
//     return this.config;
//   }
// }

function createZodEnum<T extends [string, ...string[]]>(
  options: T
): ZodEnum<T> {
  return z.enum(options) as ZodEnum<T>;
}

export class SelectPropClass<
  U extends string,
  T extends [U, ...U[]]
> extends BasePropClass<ZodEnum<T>> {
  private _options: ZodEnum<T>;
  private _optionsArray: string[];
  private _defaultValue?: U;

  constructor(options: T) {
    super();
    this._options = createZodEnum(options);
    this._optionsArray = options;
  }

  defaultValue(value: T[number]): this {
    this._defaultValue = value;
    return this;
  }

  _def(): Omit<SelectSchemaProp, "prop"> {
    return {
      type: "select",
      params: {
        options: this._optionsArray,
      },
    };
  }
}

// #region COMPONENT PROP
export class ComponentPropClass<
  T extends Record<
    string,
    BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
  >,
  Schema extends ISchemaReturnType<T>,
  O extends Record<string, string | string[]>,
  P extends Record<string, any>,
  Params extends Record<string, any>,
  TWFunction extends (props: { values: Schema["flattenedSchema"] }) => O,
  TWFunctionReturnType extends ConvertToReactElement<ReturnType<TWFunction>>,
  ComponentFunction extends (
    props: Schema["reactElements"] & TWFunctionReturnType
  ) => React.JSX.Element,
  InlineWidgets extends Record<string, InlineWidgetClass<any>>,
  TokenWidgets extends Record<string, TokenWidgetClass<any>>,
  ExternalWidgets extends Record<string, ExternalWidgetClass<any>>,
  CustomTokens extends Record<string, TokenSetClass<any, any, any>>,
  StandardTokens extends Partial<IStandardTokenTypes>,
  ComponentType extends string,
  ComponentTypes extends ComponentType[],
  Devices extends DevicesClass,
  InlineTypes extends Record<string, InlineTypeClass<InlineWidgets, any>>,
  TokenTypes extends Record<
    string,
    TokenTypeClass<TokenWidgets, any, CustomTokens, StandardTokens>
  >,
  ExternalTypes extends Record<string, ExternalType<ExternalWidgets, any>>,
  Definitions extends DefinitionClass<
    T,
    Schema,
    O,
    P,
    Params,
    TWFunction,
    TWFunctionReturnType,
    ComponentFunction,
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes,
    Devices,
    InlineTypes,
    TokenTypes,
    ExternalTypes
  >[] = DefinitionClass<
    T,
    Schema,
    O,
    P,
    Params,
    TWFunction,
    TWFunctionReturnType,
    ComponentFunction,
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes,
    Devices,
    InlineTypes,
    TokenTypes,
    ExternalTypes
  >[]
> extends BasePropClass<string> {
  private _components: Definitions;

  constructor(components: Definitions) {
    super();
    this._components = components;
  }

  _def(): Omit<ComponentSchemaProp, "prop"> {
    return {
      type: "component",
      accepts: this._components.map((c) => c._def().id),
    };
  }
}

// #region COLOR PROP
// TODO: Add default color - with validation from tokens
export class ColorPropClass extends BasePropClass<string> {
  _def(): Omit<ColorSchemaProp, "prop"> {
    return {
      type: "color",
    };
  }
}

////////////////////////////////////////////////////////////////////////////////
// #region CUSTOM TYPES
////////////////////////////////////////////////////////////////////////////////

type ExtractInnerTypeFromInlineWidget<T> = T extends InlineWidgetClass<infer U>
  ? U
  : never;

export class InlineTypeClass<InlineWidgets, K extends keyof InlineWidgets> {
  private _widgetKey: K;
  private _defaultValue?: ExtractInnerTypeFromInlineWidget<InlineWidgets[K]>;

  defaultValue(value: ExtractInnerTypeFromInlineWidget<InlineWidgets[K]>) {
    this._defaultValue = value;
    return this;
  }

  constructor(widgetKey: K) {
    this._widgetKey = widgetKey;
  }
}

type ExtractInnerTypeFromTokenWidget<T> = T extends TokenWidgetClass<infer U>
  ? U
  : never;

export class TokenTypeClass<
  TokenWidgets,
  WK extends keyof TokenWidgets,
  CustomTokens extends Record<string, TokenSetClass<any, any, any>>,
  StandardTokens extends Partial<IStandardTokenTypes>,
  TK extends keyof CustomTokens | keyof StandardTokens =
    | keyof CustomTokens
    | keyof StandardTokens
> {
  private _tokenKey: TK;
  private _widgetKey?: WK;
  private _defaultValue?: ExtractInnerTypeFromTokenWidget<TokenWidgets[WK]>;

  defaultValue(value: ExtractInnerTypeFromTokenWidget<TokenWidgets[WK]>) {
    this._defaultValue = value;
    return this;
  }

  customValueWidget(value: WK) {
    this._widgetKey = value;
    return this;
  }

  // TODO: We want the types to be forced to match. This is hard to do!
  constructor(tokenKey: TK) {
    this._tokenKey = tokenKey;
  }
}

export class ExternalType<ExternalWidgets, WK extends keyof ExternalWidgets> {
  private _externalWidgetKeys: Array<WK>;

  constructor(externalWidgetKeys: Array<WK>) {
    this._externalWidgetKeys = externalWidgetKeys;
  }
}

////////////////////////////////////////////////////////////////////////////////
// #region CONFIG WITH TYPES
////////////////////////////////////////////////////////////////////////////////

interface IConfigWithTypes<
  InlineWidgets extends Record<string, InlineWidgetClass<any>>,
  TokenWidgets extends Record<string, TokenWidgetClass<any>>,
  ExternalWidgets extends Record<string, ExternalWidgetClass<any>>,
  CustomTokens extends Record<string, TokenSetClass<any, any, any>>,
  StandardTokens extends Partial<IStandardTokenTypes>,
  InlineTypes extends Record<string, InlineTypeClass<InlineWidgets, any>>,
  TokenTypes extends Record<
    string,
    TokenTypeClass<TokenWidgets, any, CustomTokens, StandardTokens>
  >,
  ExternalTypes extends Record<string, ExternalType<ExternalWidgets, any>>
> {}

interface IConfigWithTypesPropsUser<
  InlineWidgets extends Record<string, InlineWidgetClass<any>>,
  TokenWidgets extends Record<string, TokenWidgetClass<any>>,
  ExternalWidgets extends Record<string, ExternalWidgetClass<any>>,
  CustomTokens extends Record<string, TokenSetClass<any, any, any>>,
  StandardTokens extends Partial<IStandardTokenTypes>,
  ComponentType extends string,
  ComponentTypes extends ComponentType[],
  Devices extends DevicesClass,
  InlineTypes extends Record<string, InlineTypeClass<InlineWidgets, any>>,
  TokenTypes extends Record<
    string,
    TokenTypeClass<TokenWidgets, any, CustomTokens, StandardTokens>
  >,
  ExternalTypes extends Record<string, ExternalType<ExternalWidgets, any>>
> {
  inlineTypes?: InlineTypes;
  tokenTypes?: TokenTypes;
  externalTypes?: ExternalTypes;
}

interface IConfigWithTypesProps<
  InlineWidgets extends Record<string, InlineWidgetClass<any>>,
  TokenWidgets extends Record<string, TokenWidgetClass<any>>,
  ExternalWidgets extends Record<string, ExternalWidgetClass<any>>,
  CustomTokens extends Record<string, TokenSetClass<any, any, any>>,
  StandardTokens extends Partial<IStandardTokenTypes>,
  ComponentType extends string,
  ComponentTypes extends ComponentType[],
  Devices extends DevicesClass,
  InlineTypes extends Record<string, InlineTypeClass<InlineWidgets, any>>,
  TokenTypes extends Record<
    string,
    TokenTypeClass<TokenWidgets, any, CustomTokens, StandardTokens>
  >,
  ExternalTypes extends Record<string, ExternalType<ExternalWidgets, any>>
> extends IConfigWithTypesPropsUser<
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes,
    Devices,
    InlineTypes,
    TokenTypes,
    ExternalTypes
  > {
  baseConfig: BaseConfigClass<
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes,
    Devices
  >;
}

interface ISchemaReturnType<
  T extends Record<
    string,
    BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
  >
> {
  schema: T;
  flattenedSchema: FlattenSchema<T>;
  reactElements: FlattenSchemaAndCastToReactElement<T>;
}

class ConfigWithTypesClass<
  InlineWidgets extends Record<string, InlineWidgetClass<any>>,
  TokenWidgets extends Record<string, TokenWidgetClass<any>>,
  ExternalWidgets extends Record<string, ExternalWidgetClass<any>>,
  CustomTokens extends Record<string, TokenSetClass<any, any, any>>,
  StandardTokens extends Partial<IStandardTokenTypes>,
  ComponentType extends string,
  ComponentTypes extends ComponentType[],
  Devices extends DevicesClass,
  InlineTypes extends Record<string, InlineTypeClass<InlineWidgets, any>>,
  TokenTypes extends Record<
    string,
    TokenTypeClass<TokenWidgets, any, CustomTokens, StandardTokens>
  >,
  ExternalTypes extends Record<string, ExternalType<ExternalWidgets, any>>
> {
  private _baseConfig: BaseConfigClass<
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes,
    Devices
  >;

  constructor(
    props: IConfigWithTypesProps<
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens,
      ComponentType,
      ComponentTypes,
      Devices,
      InlineTypes,
      TokenTypes,
      ExternalTypes
    >
  ) {
    this._baseConfig = props.baseConfig;
  }

  schema<
    T extends Record<
      string,
      BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
    >
  >(schema: T): ISchemaReturnType<T> {
    const schemaStructure: any = {};
    const reactElements: any = {};
    Object.keys(schema).forEach((key) => {
      const prop = schema[key as keyof T];
      if (prop instanceof GroupClass) {
        const GroupClassProps = prop._props;
        Object.keys(GroupClassProps).forEach((key) => {
          const gProp = GroupClassProps[key as keyof T as string];
          schemaStructure[key as keyof T as string] = gProp;
        });
      } else if (
        prop instanceof ComponentCollectionPropClass ||
        prop instanceof ComponentPropClass
      ) {
        reactElements[key as keyof T as string] = createElement("div");
      } else {
        schemaStructure[key as keyof T as string] = prop;
      }
    });
    return {
      schema: schema,
      flattenedSchema: schemaStructure,
      reactElements: reactElements,
    };
  }

  stringProp() {
    return new StringPropClass();
  }

  numberProp() {
    return new NumberPropClass();
  }

  selectProp<U extends string, T extends [U, ...U[]]>(options: T) {
    return new SelectPropClass<U, T>(options);
  }

  group<T extends Record<string, BasePropClass<any>>>(props: T): GroupClass<T> {
    return new GroupClass<T>(props);
  }

  // token props
  colorProp() {
    return new ColorPropClass();
  }

  customTypeInlineProp<K extends Extract<keyof InlineTypes, string>>(
    inlineType: K
  ): CustomPropClass<ExtractInnerTypeFromInlineWidget<InlineWidgets[K]>> {
    return new CustomPropClass<
      ExtractInnerTypeFromInlineWidget<InlineWidgets[K]>
    >(inlineType);
  }

  customTypeTokenProp<K extends Extract<keyof TokenTypes, string>>(
    tokenType: K
  ): CustomPropClass<ExtractInnerTypeFromTokenWidget<TokenWidgets[K]>> {
    return new CustomPropClass<
      ExtractInnerTypeFromTokenWidget<TokenWidgets[K]>
    >(tokenType);
  }

  customTypeExternalProp<K extends Extract<keyof ExternalTypes, string>>(
    externalType: K
  ): CustomPropClass<ExtractInnerTypeFromExternalWidget<ExternalWidgets[K]>> {
    return new CustomPropClass<
      ExtractInnerTypeFromExternalWidget<ExternalWidgets[K]>
    >(externalType);
  }

  componentCollectionProp<
    U extends Record<
      string,
      BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
    >,
    Schema extends ISchemaReturnType<U>,
    O extends Record<string, string | string[]>,
    P extends Record<string, any>,
    Params extends Record<string, any>,
    TWFunction extends (props: { values: Schema["flattenedSchema"] }) => O,
    TWFunctionReturnType extends ConvertToReactElement<ReturnType<TWFunction>>,
    ComponentFunction extends (
      props: Schema["reactElements"] & TWFunctionReturnType
    ) => React.JSX.Element
  >(
    input: DefinitionClass<
      U,
      Schema,
      O,
      P,
      Params,
      TWFunction,
      TWFunctionReturnType,
      ComponentFunction,
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens,
      ComponentType,
      ComponentTypes,
      Devices,
      InlineTypes,
      TokenTypes,
      ExternalTypes
    >[]
  ): ComponentCollectionPropClass<
    U,
    Schema,
    O,
    P,
    Params,
    TWFunction,
    TWFunctionReturnType,
    ComponentFunction,
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes,
    Devices,
    InlineTypes,
    TokenTypes,
    ExternalTypes
  > {
    return new ComponentCollectionPropClass<
      U,
      Schema,
      O,
      P,
      Params,
      TWFunction,
      TWFunctionReturnType,
      ComponentFunction,
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens,
      ComponentType,
      ComponentTypes,
      Devices,
      InlineTypes,
      TokenTypes,
      ExternalTypes
    >(input);
  }

  componentProp<
    U extends Record<
      string,
      BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
    >,
    Schema extends ISchemaReturnType<U>,
    O extends Record<string, string | string[]>,
    P extends Record<string, any>,
    Params extends Record<string, any>,
    TWFunction extends (props: { values: Schema["flattenedSchema"] }) => O,
    TWFunctionReturnType extends ConvertToReactElement<ReturnType<TWFunction>>,
    ComponentFunction extends (
      props: Schema["reactElements"] & TWFunctionReturnType
    ) => React.JSX.Element
  >(
    input: DefinitionClass<
      U,
      Schema,
      O,
      P,
      Params,
      TWFunction,
      TWFunctionReturnType,
      ComponentFunction,
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens,
      ComponentType,
      ComponentTypes,
      Devices,
      InlineTypes,
      TokenTypes,
      ExternalTypes
    >[]
  ): ComponentPropClass<
    U,
    Schema,
    O,
    P,
    Params,
    TWFunction,
    TWFunctionReturnType,
    ComponentFunction,
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes,
    Devices,
    InlineTypes,
    TokenTypes,
    ExternalTypes
  > {
    return new ComponentPropClass<
      U,
      Schema,
      O,
      P,
      Params,
      TWFunction,
      TWFunctionReturnType,
      ComponentFunction,
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens,
      ComponentType,
      ComponentTypes,
      Devices,
      InlineTypes,
      TokenTypes,
      ExternalTypes
    >(input);
  }

  noCodeComponent = () => z.string();
  noCodeComponentArray = () => z.string().array();
  noCodeComponents = z.object;
  noCodeComponentProps = z.object;
  noCodeComponentParams = z.object;

  definition<
    U extends Record<
      string,
      BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
    >,
    Schema extends ISchemaReturnType<U>,
    O extends Record<string, string | string[]>,
    P extends Record<string, any>,
    Params extends Record<string, any>,
    TWFunction extends (props: { values: Schema["flattenedSchema"] }) => O,
    TWFunctionReturnType extends ConvertToReactElement<ReturnType<TWFunction>>,
    ComponentFunction extends (
      props: Schema["reactElements"] & TWFunctionReturnType
    ) => React.JSX.Element
  >(
    input: IDefinitionProps<
      U,
      Schema,
      O,
      P,
      Params,
      ComponentType,
      ComponentTypes
    >
  ): DefinitionClass<
    U,
    Schema,
    O,
    P,
    Params,
    TWFunction,
    TWFunctionReturnType,
    ComponentFunction,
    InlineWidgets,
    TokenWidgets,
    ExternalWidgets,
    CustomTokens,
    StandardTokens,
    ComponentType,
    ComponentTypes,
    Devices,
    InlineTypes,
    TokenTypes,
    ExternalTypes
  > {
    return new DefinitionClass<
      U,
      Schema,
      O,
      P,
      Params,
      TWFunction,
      TWFunctionReturnType,
      ComponentFunction,
      InlineWidgets,
      TokenWidgets,
      ExternalWidgets,
      CustomTokens,
      StandardTokens,
      ComponentType,
      ComponentTypes,
      Devices,
      InlineTypes,
      TokenTypes,
      ExternalTypes
    >(input);
  }
}

////////////////////////////////////////////////////////////////////////////////
// #region DEFINITION
////////////////////////////////////////////////////////////////////////////////

interface IDefinitionProps<
  T extends Record<
    string,
    BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
  >,
  Schema extends ISchemaReturnType<T>,
  O extends Record<string, string | string[]>,
  P extends Record<string, any>,
  Params extends Record<string, any>,
  ComponentType extends string,
  ComponentTypes extends ComponentType[]
> {
  id: string;
  schema: Schema;
  type: ComponentTypes[number] | Array<ComponentTypes[number]>;
  noCodeComponents: ZodType<O, any, any>;
  props?: ZodType<P, any, any>;
  params?: ZodType<Params, any, any>;
}

interface IDefinitionDef<
  T extends Record<
    string,
    BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
  >,
  Schema extends ISchemaReturnType<T>,
  O extends Record<string, string | string[]>,
  P extends Record<string, any>,
  Params extends Record<string, any>,
  ComponentType extends string,
  ComponentTypes extends ComponentType[]
> {
  id: string;
  flattenedSchema: FlattenSchema<T>;
  reactElements: FlattenSchemaAndCastToReactElement<T>;
  type: ComponentTypes[number] | Array<ComponentTypes[number]>;
  noCodeComponents: ZodType<O, any, any>;
  props: ZodType<P, any, any> | z.ZodObject<any, any>;
  params: ZodType<Params, any, any> | z.ZodObject<any, any>;
}

class DefinitionClass<
  T extends Record<
    string,
    BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
  >,
  Schema extends ISchemaReturnType<T>,
  O extends Record<string, string | string[]>,
  P extends Record<string, any>,
  Params extends Record<string, any>,
  TWFunction extends (props: { values: Schema["flattenedSchema"] }) => O,
  TWFunctionReturnType extends ConvertToReactElement<ReturnType<TWFunction>>,
  ComponentFunction extends (
    props: Schema["reactElements"] & TWFunctionReturnType
  ) => React.JSX.Element,
  InlineWidgets extends Record<string, InlineWidgetClass<any>>,
  TokenWidgets extends Record<string, TokenWidgetClass<any>>,
  ExternalWidgets extends Record<string, ExternalWidgetClass<any>>,
  CustomTokens extends Record<string, TokenSetClass<any, any, any>>,
  StandardTokens extends Partial<IStandardTokenTypes>,
  ComponentType extends string,
  ComponentTypes extends ComponentType[],
  Devices extends DevicesClass,
  InlineTypes extends Record<string, InlineTypeClass<InlineWidgets, any>>,
  TokenTypes extends Record<
    string,
    TokenTypeClass<TokenWidgets, any, CustomTokens, StandardTokens>
  >,
  ExternalTypes extends Record<string, ExternalType<ExternalWidgets, any>>
> {
  private _id: string;
  private _schema: T;
  private _flattenedSchema: FlattenSchema<T>;
  private _schemaReactElements: FlattenSchemaAndCastToReactElement<T>;
  private _type: ComponentTypes[number] | Array<ComponentTypes[number]>;
  private _noCodeComponents: ZodType<O, any, any>;
  private _props?: ZodType<P, any, any>;
  private _params?: ZodType<Params, any, any>;

  constructor(
    props: IDefinitionProps<
      T,
      Schema,
      O,
      P,
      Params,
      ComponentType,
      ComponentTypes
    >
  ) {
    this._id = props.id;
    this._schema = props.schema.schema;
    this._flattenedSchema = props.schema.flattenedSchema;
    this._schemaReactElements = props.schema.reactElements;
    this._type = props.type;
    this._noCodeComponents = props.noCodeComponents;
    this._props = props.props;
    this._params = props.params;
  }

  twNoCodeComponent(
    twFunction: TWFunction
  ): DefinitionNoCodeTwFunction<
    T,
    Schema,
    O,
    P,
    Params,
    TWFunction,
    TWFunctionReturnType,
    ComponentFunction
  > {
    return new DefinitionNoCodeTwFunction<
      T,
      Schema,
      O,
      P,
      Params,
      TWFunction,
      TWFunctionReturnType,
      ComponentFunction
    >({
      twFunction,
    });
  }

  _def(): IDefinitionDef<
    T,
    Schema,
    O,
    P,
    Params,
    ComponentType,
    ComponentTypes
  > {
    return {
      id: this._id,
      flattenedSchema: this._flattenedSchema,
      reactElements: this._schemaReactElements,
      type: this._type,
      noCodeComponents: this._noCodeComponents,
      props: this._props ?? z.object({}),
      params: this._params ?? z.object({}),
    };
  }
}

///////////////////////////////////////////////////////////////////////////////
// #region DEF NCC TW FUNCTION
///////////////////////////////////////////////////////////////////////////////

interface IDefinitionNoCodeTwFunctionProps<
  T extends Record<
    string,
    BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
  >,
  Schema extends ISchemaReturnType<T>,
  O extends Record<string, string | string[]>,
  P extends Record<string, any>,
  Params extends Record<string, any>,
  TWFunction extends (props: { values: Schema["flattenedSchema"] }) => O
> {
  twFunction: TWFunction;
}

class DefinitionNoCodeTwFunction<
  T extends Record<
    string,
    BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
  >,
  Schema extends ISchemaReturnType<T>,
  O extends Record<string, string | string[]>,
  P extends Record<string, any>,
  Params extends Record<string, any>,
  TWFunction extends (props: { values: Schema["flattenedSchema"] }) => O,
  TWFunctionReturnType extends ConvertToReactElement<ReturnType<TWFunction>>,
  ComponentFunction extends (
    props: Schema["reactElements"] & TWFunctionReturnType
  ) => React.JSX.Element
> {
  _twFunction: TWFunction;

  constructor(
    props: IDefinitionNoCodeTwFunctionProps<T, Schema, O, P, Params, TWFunction>
  ) {
    this._twFunction = props.twFunction;
  }

  component(
    component: ComponentFunction
  ): DefinitionReactComponent<
    T,
    Schema,
    O,
    P,
    Params,
    TWFunctionReturnType,
    ComponentFunction
  > {
    return new DefinitionReactComponent<
      T,
      Schema,
      O,
      P,
      Params,
      TWFunctionReturnType,
      ComponentFunction
    >({
      component,
    });
  }
}

///////////////////////////////////////////////////////////////////////////////
// #region DEF REACT COMPONENT
///////////////////////////////////////////////////////////////////////////////

interface IDefinitionReactComponentProps<
  T extends Record<
    string,
    BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
  >,
  Schema extends ISchemaReturnType<T>,
  O extends Record<string, string | string[]>,
  P extends Record<string, any>,
  Params extends Record<string, any>,
  TWFunctionReturnType,
  ComponentFunction extends (
    props: Schema["reactElements"] & TWFunctionReturnType
  ) => React.JSX.Element
> {
  component: ComponentFunction;
}

class DefinitionReactComponent<
  T extends Record<
    string,
    BasePropClass<any> | GroupClass<Record<string, BasePropClass<any>>>
  >,
  Schema extends ISchemaReturnType<T>,
  O extends Record<string, string | string[]>,
  P extends Record<string, any>,
  Params extends Record<string, any>,
  TWFunctionReturnType,
  ComponentFunction extends (
    props: Schema["reactElements"] & TWFunctionReturnType
  ) => React.JSX.Element
> {
  private _component: ComponentFunction;

  constructor(
    props: IDefinitionReactComponentProps<
      T,
      Schema,
      O,
      P,
      Params,
      TWFunctionReturnType,
      ComponentFunction
    >
  ) {
    this._component = props.component;
  }
}
