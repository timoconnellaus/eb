# eb - typesafe easyblocks no code component definitions

This is a prototype for building a NoCodeComponentDefinition for easyblocks in a typesafe way.

This doesn't replace the exisiting NoCodeComponentDefinition, but allows one to be defined in similar syntax to zod schemas and then output a NoCodeComponentDefinition.

Key features:

- Typesafe styles function
- Chained functions (easier to read)

Note: that this is currently incomplete and a work in progress

- bun `bunx jsr add @timoconnellaus/eb`
- pnpm `pnpm dlx jsr add @timoconnellaus/eb`
- yarn `yarn dlx jsr add @timoconnellaus/eb`
- npm `npx jsr add @timoconnellaus/eb`
- deno `deno add @timoconnellaus/eb`

<img width="402" alt="image" src="https://github.com/timoconnellaus/easyblocks-typed/assets/3151605/ef8a67b3-570f-4912-b6b2-63ddf370d0fd">

### Progress

#### General

- [ ] Return an easyblocks config object
- [ ] Return an Easyblocks editor component
- [ ] Complete styles function
- [ ] Complete editing function
- [ ] Complete after auto function
- [ ] Define no code component inline typed with type safety

#### Custom Types

- [x] Typed widgets
- [x] External type
- [x] Inline type
- [x] Token type
- [ ] Compoound type

#### Prop types

- [x] String prop
- [x] Number prop
- [x] Select prop
- [x] Token support
- [ ] Boolean prop
- [ ] RadioGroup prop
- [ ] Color prop
- [ ] Space prop
- [ ] Font prop
- [ ] Icon prop
- [ ] Text prop
- [ ] Component prop
- [ ] ComponentCollection prop
- [ ] ComponentCollectionLocalised prop
- [ ] Position prop
- [ ] External prop
- [ ] Local prop

Example can be found here: https://github.com/timoconnellaus/eb/blob/main/packages/example/index.tsx

```ts
// DEVICES
const devices = eb
  // initially set to default devices
  .devices({
    sm: eb.device().hidden(true), // change properties
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
  zodType: z.object({ productId: z.string() }),
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
    urlTwo: urlWidgetTwo,
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
  })
  .default("blue");

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
  });

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

export const s = schema({
  size: group({
    height: numberProp().defaultValue(10),
    width: numberProp().defaultValue(10),
  }),
  title: stringProp().defaultValue("Banner"),
  url: inlineCustom("url"),
  color: tokenCustom("color"),
  product: externalCustom("product"),
});

const banner = definition({
  schema: schema({
    size: group({
      height: numberProp().defaultValue(10),
      width: numberProp().defaultValue(10),
    }),
    title: stringProp().defaultValue("Banner"),
    url: inlineCustom("url"),
    color: tokenCustom("color"),
    product: externalCustom("product"),
  }),
  styles: ({ values }) => {
    const { height, width, title, url, color, product } = values;

    return {};
  },
});
```
