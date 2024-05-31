import { baseConfig } from "./baseConfig";
import { device, devices } from "./devices";
import {
  colorToken,
  colorTokens,
  fontToken,
  fontTokens,
  spaceToken,
  spaceTokens,
  boxShadowToken,
  boxShadowTokens,
  aspectRatioToken,
  aspectRatioTokens,
  containerWidthToken,
  containerWidthTokens,
  customToken,
  customTokens,
  tokens,
} from "./tokens";
import { externalWidget } from "./widgets/external-widget";
import { inlineWidget } from "./widgets/inline-widget";
import { tokenWidget } from "./widgets/token-widget";
import { widgets } from "./widgets/widgets";

// Example of how you might export and use these classes
export const eb = {
  devices,

  // for creating widgets
  inlineWidget,
  tokenWidget,
  externalWidget,
  widgets,
  device,

  // tokens
  tokens,
  colorToken,
  colorTokens,
  fontToken,
  fontTokens,
  spaceToken,
  spaceTokens,
  boxShadowToken,
  boxShadowTokens,
  aspectRatioToken,
  aspectRatioTokens,
  containerWidthToken,
  containerWidthTokens,
  customToken,
  customTokens,

  // base config to be used in the app
  baseConfig,
};
