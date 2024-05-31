import type {
  ConfigTokenValue,
  ThemeColor,
  ThemeFont,
  ThemeSpace,
} from "@easyblocks/core";
import { z, type ZodType } from "zod";

// TODO: Add validation of tokens based on the zod types. e.g. color should match a pattern of regex
// TODO: The types of the custom tokens aren't typed correctly - we'll need this fixed for them to be the right types in the definitions

export class Token<T> {
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

export class TokenSet<
  ZT,
  T extends Record<string, Token<ZT>>,
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

interface TokenConfigType<
  CustomTokens extends Record<string, TokenSet<any, any, any>>,
  StandardTokens extends Partial<StandardTokenTypes>
> {
  standard?: StandardTokens;
  custom?: CustomTokens;
}

export interface StandardTokenTypes {
  color?: TokenSet<ThemeColor, Record<string, Token<ThemeColor>>, string>;
  font?: TokenSet<ThemeFont, Record<string, Token<ThemeFont>>, string>;
  space?: TokenSet<ThemeSpace, Record<string, Token<ThemeSpace>>, string>;
  boxShadow?: TokenSet<string, Record<string, Token<string>>, string>;
  containerWidth?: TokenSet<number, Record<string, Token<number>>, string>;
  aspectRatio?: TokenSet<string, Record<string, Token<string>>, string>;
  icon?: TokenSet<string, Record<string, Token<string>>, string>;
}

export class Tokens<
  CustomTokens extends Record<string, TokenSet<any, any, any>>,
  StandardTokens extends Partial<StandardTokenTypes>
> {
  // private _colorTokens: TokenSet<
  //   ThemeColor,
  //   Record<string, Token<ThemeColor>>,
  //   string
  // >;
  // private _fontTokens: TokenSet<
  //   ThemeFont,
  //   Record<string, Token<ThemeFont>>,
  //   string
  // >;
  // private _spaceTokens: TokenSet<
  //   ThemeSpace,
  //   Record<string, Token<ThemeSpace>>,
  //   string
  // >;
  // private _boxShadowTokens: TokenSet<
  //   string,
  //   Record<string, Token<string>>,
  //   string
  // >;
  // private _containerWidthTokens: TokenSet<
  //   number,
  //   Record<string, Token<number>>,
  //   string
  // >;
  // private _aspectRatioTokens: TokenSet<
  //   string,
  //   Record<string, Token<string>>,
  //   string
  // >;
  // private _iconTokens: TokenSet<string, Record<string, Token<string>>, string>;
  private _standardTokens: StandardTokens;
  private _customTokens: CustomTokens;

  constructor(props: TokenConfigType<CustomTokens, StandardTokens>) {
    this._standardTokens = props.standard as StandardTokens;
    if (!this._standardTokens) {
      this._standardTokens = {} as StandardTokens;
    }

    // this._colorTokens =
    //   props.standard?.color ??
    //   ({} as TokenSet<ThemeColor, Record<string, Token<ThemeColor>>, string>);
    // this._fontTokens =
    //   props.standard?.font ??
    //   ({} as TokenSet<ThemeFont, Record<string, Token<ThemeFont>>, string>);
    // this._spaceTokens =
    //   props.standard?.space ??
    //   ({} as TokenSet<ThemeSpace, Record<string, Token<ThemeSpace>>, string>);
    // this._boxShadowTokens =
    //   props.standard?.boxShadow ??
    //   ({} as TokenSet<string, Record<string, Token<string>>, string>);
    // this._containerWidthTokens =
    //   props.standard?.containerWidth ??
    //   ({} as TokenSet<number, Record<string, Token<number>>, string>);
    // this._aspectRatioTokens =
    //   props.standard?.aspectRatio ??
    //   ({} as TokenSet<string, Record<string, Token<string>>, string>);
    // this._iconTokens =
    //   props.standard?.icon ??
    //   ({} as TokenSet<string, Record<string, Token<string>>, string>);
    this._customTokens = props.custom ?? ({} as CustomTokens);
  }

  _def() {
    return {
      // color: this.st_colorTokens._def(),
      // font: this._fontTokens._def(),
      // space: this._spaceTokens._def(),
      // boxShadow: this._boxShadowTokens._def(),
      // containerWidth: this._containerWidthTokens._def(),
      // aspectRatio: this._aspectRatioTokens._def(),
      // icon: this._iconTokens._def(),
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
  CustomTokens extends Record<string, TokenSet<any, any, any>>,
  StandardTokens extends Partial<StandardTokenTypes>
>(
  props: TokenConfigType<CustomTokens, StandardTokens>
) => new Tokens<CustomTokens, StandardTokens>(props);

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
  new Token<z.infer<typeof themeColor>>(value);

// Note: This is mapping to stitches classes - we might need to change this if stitches is removed or becomes optional
const themeFontValue = z.object({
  fontFamily: z.string(),
  lineHeight: z.number(),
  fontSize: z.number(),
  fontWeight: z.number().optional(),
});
const themeFont = trulyResponsiveValue(themeFontValue);
export const fontToken = (value: z.infer<typeof themeFont>) =>
  new Token<z.infer<typeof themeFont>>(value);

const themeSpaceValue = z.union([z.number(), z.string()]); // Note: this can probably be defined better. It's describing CSS space options
export const themeSpace = trulyResponsiveValue(themeSpaceValue);
export const spaceToken = (value: z.infer<typeof themeSpace>) =>
  new Token<z.infer<typeof themeSpace>>(value);

const themeContainerWidthValue = z.number(); // this is a number like 1024 describing the width of a container
export const themeContainerWidth = themeContainerWidthValue;
export const containerWidthToken = (
  value: z.infer<typeof themeContainerWidth>
) => new Token<z.infer<typeof themeContainerWidth>>(value);

const themeBoxShadowValue = z.string(); // this is CSS for box shadows
export const themeBoxShadow = themeBoxShadowValue;
export const boxShadowToken = (value: z.infer<typeof themeBoxShadow>) =>
  new Token<z.infer<typeof themeBoxShadow>>(value);

const themeAspectRatioValue = z.string(); // should be 2:1 or something like that
export const themeAspectRatio = themeAspectRatioValue;
export const aspectRatioToken = (value: z.infer<typeof themeAspectRatio>) =>
  new Token<z.infer<typeof themeAspectRatio>>(value);

const themeIconValue = z.string(); // this is an svg
export const themeIcon = themeIconValue;
export const iconToken = (value: z.infer<typeof themeIcon>) =>
  new Token<z.infer<typeof themeIcon>>(value);

export const customTokens = <
  ZT,
  T extends Record<string, Token<ZT>>,
  K extends keyof T
>(props: {
  zodType: ZodType<ZT, any, any>;
  tokens: T;
}) => new TokenSet<ZT, T, K>(props.zodType, props.tokens);

export const customToken = <T>(value: T) => new Token<T>(value);

export const colorTokens = <
  T extends Record<string, Token<z.infer<typeof themeColor>>>
>(
  colorTokens: T
) => {
  return customTokens({
    zodType: themeColor,
    tokens: colorTokens,
  });
};

export const fontTokens = <
  T extends Record<string, Token<z.infer<typeof themeFont>>>
>(
  fontTokens: T
) => {
  return customTokens({
    zodType: themeFont,
    tokens: fontTokens,
  });
};

export const spaceTokens = <
  T extends Record<string, Token<z.infer<typeof themeSpace>>>
>(
  spaceTokens: T
) => {
  return customTokens({
    zodType: themeSpace,
    tokens: spaceTokens,
  });
};

export const containerWidthTokens = <
  T extends Record<string, Token<z.infer<typeof themeContainerWidth>>>
>(
  containerWidthTokens: T
) => {
  return customTokens({
    zodType: themeContainerWidth,
    tokens: containerWidthTokens,
  });
};

export const boxShadowTokens = <
  T extends Record<string, Token<z.infer<typeof themeBoxShadow>>>
>(
  boxShadowTokens: T
) => {
  return customTokens({
    zodType: themeBoxShadow,
    tokens: boxShadowTokens,
  });
};

export const aspectRatioTokens = <
  T extends Record<string, Token<z.infer<typeof themeAspectRatio>>>
>(
  aspectRatioTokens: T
) => {
  return customTokens({
    zodType: themeAspectRatio,
    tokens: aspectRatioTokens,
  });
};

export const iconTokens = <
  T extends Record<string, Token<z.infer<typeof themeIcon>>>
>(
  iconTokens: T
) => {
  return customTokens({
    zodType: themeIcon,
    tokens: iconTokens,
  });
};

// export interface StandardTokenTypes {
//   color: z.infer<typeof themeColor>;
//   font: z.infer<typeof themeFont>;
//   space: z.infer<typeof themeSpace>;
//   containerWidth: z.infer<typeof themeContainerWidth>;
//   boxShadow: z.infer<typeof themeBoxShadow>;
//   aspectRatio: z.infer<typeof themeAspectRatio>;
//   icon: z.infer<typeof themeIcon>;
// }

// const test2 = colorTokens({
//   blue: colorToken({ $res: true, xs: "#0000FF", xl: "#0000FF" }),
//   red: colorToken("red")
// }).default("blue");

// const test = tokens({
//   zodType: themeColor,
//   tokens: {
//     blue: colorToken({ $res: true, xs: "#0000FF", xl: "#0000FF" }),
//     red: colorToken("red")
//   },
// }).default("blue");

// export const aspectRatioToken = (value: string) => new Token<string>(value);
// export const fontToken = (value: ThemeFont) => new Token<ThemeFont>(value);
// export const boxShadowToken = (value: string) => new Token<string>(value);
// export const containerWidthToken = (value: number) => new Token<number>(value);
// export const colorToken = (value: ThemeColor) => new Token<ThemeColor>(value);
// export const iconToken = (value: string) => new Token<string>(value);
// export const spaceToken = (value: ThemeSpace) => new Token<ThemeSpace>(value);
// export const customToken = <T>(value: T) => new Token<T>(value);
