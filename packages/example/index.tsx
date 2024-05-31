import { z } from "zod";
import { eb } from "eb";

// DEVICES
const devices = eb
  // initially set to default devices
  .devices({
    sm: eb.device().hidden(false), // change properties
    lg: eb.device(),
  })
  .mainDevice("md"); // we can set the main device

// WIDGETS
const urlWidget = eb
  .inlineWidget({
    zodType: z.object({ val: z.string() }),
    defaultValue: { val: "" },
    component: (props) => {
      return <>{props.value.val}</>;
    },
  })
  .label("URL");

const mikesWidget = eb.inlineWidget({
  zodType: z.object({ name: z.string() }),
  defaultValue: { name: "Mike" },
  component: (props) => {
    return <>{props.value.name}</>;
  },
});

const urlWidgetTwo = eb
  .inlineWidget({
    zodType: z.object({ two: z.string() }),
    defaultValue: { two: "" },
    component: (props) => {
      return <>{props.value.two}</>;
    },
  })
  .label("URL2");

const colorWidget = eb.tokenWidget({
  zodType: z.string(),
  defaultValue: "#000000",
  component: (props) => {
    return <>{props.value}</>;
  },
});

const productWidget = eb.externalWidget({
  zodType: z.object({ productId: z.string(), url: z.string() }),
  component: (props) => {
    return <>{props.id}</>;
  },
  type: "shopify",
  callback: async ({ externalData, externalDataId }) => {
    return {
      a: { type: "text", value: { productId: "asb" } },
      b: { type: "text", value: { productId: "asb" } },
    };
  },
});

const widgets = eb.widgets({
  inline: {
    url: urlWidget,
    urlThree: urlWidgetTwo,
    mikeType: mikesWidget,
  },
  token: {
    color: colorWidget,
  },
  external: {
    product: productWidget,
  },
});

// TOKENS
const colorTokens = eb
  .colorTokens({
    blue: eb.colorToken({ $res: true, xs: "#0000FF", xl: "#0000FF" }),
    red: eb.colorToken("red"),
    orange: eb.colorToken("#FFA500"),
  })
  .default("red");

const customToken = eb
  .customTokens({
    zodType: z.string(),
    tokens: {
      big: eb.customToken("big"),
      small: eb.customToken("small"),
    },
  })
  .default("big");

const customToken2 = eb
  .customTokens({
    zodType: z.number(),
    tokens: {
      big: eb.customToken(10),
      small: eb.customToken(5),
    },
  })
  .default("big");

const tokens = eb.tokens({
  standard: {
    color: colorTokens,
  },
  custom: {
    size: customToken,
    size2: customToken2,
  },
});

// Base Config
// This config sets up tokens and widgets whose types need to be available when setting up easyblocks types
const { inlineType, externalType, tokenType, baseConfigWithTypes } =
  eb.baseConfig({
    devices: devices,
    widgets,
    tokens,
    componentTypes: ["section", "button"],
  });

const mikeType = inlineType("mikeType").defaultValue({ name: "mime" });
const urlType = inlineType("url").defaultValue({ val: "www.google.com" });
const colorType = tokenType("color").customValueWidget("color");
const productType = externalType(["product"]);

// Now we add the types to the base config - we now have everything we need to set up definitions
// in a type safe way
const {
  definition,
  schema,
  stringProp,
  numberProp,
  inlineCustom,
  tokenCustom,
  externalCustom,
  componentCollectionProp,
  group,
} = baseConfigWithTypes({
  inlineTypes: {
    url: urlType,
  },
  tokenTypes: {
    color: colorType,
  },
  externalTypes: {
    product: productType,
  },
});

const button = definition({
  id: "button",
  type: "button",
  schema: schema({
    label: stringProp().defaultValue("Button"),
  }),
}).styles(({ values }) => {
  const { label } = values;

  return {};
});

const buttonTwo = definition({
  id: "button",
  type: "button",
  schema: schema({
    label: stringProp().defaultValue("Button"),
    size: group({
      height: numberProp().defaultValue(10),
      width: numberProp().defaultValue(10),
    }),
  }),
});

const banner = definition({
  id: "banner",
  type: "section",
  pasteSlots: ["Section"],
  label: "Banner",
  schema: schema({
    buttons: componentCollectionProp([button]),
    size: group({
      height: numberProp().defaultValue(10),
      width: numberProp().defaultValue(10),
    }),
    title: stringProp().defaultValue("Banner"),
    url: inlineCustom("url"),
    color: tokenCustom("color"),
    product: externalCustom("product"),
  }),
}).styles(({ values }) => {
  const { height, width, title, url, color, product } = values;

  return {};
});
