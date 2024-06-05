import {
  config,
  device,
  devices,
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
  inlineWidget,
  externalWidget,
  tokenWidget,
  widgets,
} from "./config";

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
  config,
};
