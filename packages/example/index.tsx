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

// This step of config sets up tokens, widgets and deviecs - whose types need to be available when setting up custom types
const { inlineType, externalType, tokenType, configWithTypes } = eb.config({
  devices: eb.devices({
    sm: eb.device().hidden(false), // change properties
  }),
  widgets: eb.widgets({
    inline: {
      url: urlWidget,
    },
    token: {
      color: colorWidget,
    },
    external: {
      product: productWidget,
    },
  }),
  tokens: eb.tokens({
    standard: {
      color: eb
        .colorTokens({
          blue: eb.colorToken({ $res: true, xs: "#0000FF", xl: "#0000FF" }),
          red: eb.colorToken("red"),
          orange: eb.colorToken("#FFA500"),
        })
        .default("red"),
      space: eb.spaceTokens({
        "1": eb.spaceToken(1).label("1px"),
        "2": eb.spaceToken(2).label("2px"),
        "3": eb.spaceToken(3).label("3px"),
        "10": eb.spaceToken(10).label("10px"),
        "20": eb.spaceToken(20).label("20px"),
        "30": eb.spaceToken(30).label("30px"),
        "40": eb.spaceToken(40).label("40px"),
      }),
    },
    custom: {
      size: eb
        .customTokens({
          zodType: z.string(),
          tokens: {
            big: eb.customToken("big"),
            small: eb.customToken("small"),
          },
        })
        .default("big"),
    },
  }),
  componentTypes: ["section", "button"],
});

// Now we add the types to the base config - we now have everything we need to set up definitions
// in a type safe way
const {
  definition,
  schema,
  stringProp,
  numberProp,
  selectProp,
  noCodeComponent,
  noCodeComponentArray,
  customTypeInlineProp,
  customTypeTokenProp,
  customTypeExternalProp,
  componentCollectionProp,
  group,
  richText,
  text,
  noCodeComponents,
  noCodeComponentProps,
  noCodeComponentParams,
  componentProp,
  colorProp,
} = configWithTypes({
  inlineTypes: {
    url: inlineType("url").defaultValue({ val: "www.google.com" }),
  },
  tokenTypes: {
    color: tokenType("color").customValueWidget("color"),
  },
  externalTypes: {
    product: externalType(["product"]),
  },
});

export const button = definition({
  id: "button",
  type: "button",
  schema: schema({
    height: numberProp().defaultValue(10),
    size: customTypeTokenProp("color"),
    url: customTypeInlineProp("url"),
  }),
  noCodeComponents: noCodeComponents({
    Button: noCodeComponent(),
  }),
  props: noCodeComponentProps({}),
  params: noCodeComponentParams({
    size: z.string(),
  }),
});

const buttonNCC = button.twNoCodeComponent(({ values }) => {
  const { height } = values;

  const Button = `bg-red-200 height-[${height}px]`;

  return {
    tw: { Button },
    props: {},
  };
});

const buttonComponent = buttonNCC.component((props) => {
  const { Button } = props;
  return <Button.type {...Button.props} />;
});

const richTextTest = definition({
  id: "@easyblocks/richtext",
  type: "item",
  schema: schema({}),
  noCodeComponents: noCodeComponents({}),
});

const section = definition({
  id: "test",
  type: "section",
  schema: schema({
    Button: componentProp(["item"]),
    Buttons: componentCollectionProp([button, richText, text]),
    bg: colorProp(),
  }),
  noCodeComponents: noCodeComponents({
    Section: noCodeComponent(),
  }),
  props: noCodeComponentProps({}),
  params: noCodeComponentParams({}),
});

const sectionNCC = section.twNoCodeComponent(({ values }) => {
  const { bg } = values;
  const Section = `container mx-auto h-[100px] bg-[${bg}]`;

  return {
    tw: { Section },
    props: {},
  };
});

const sectionComponent = sectionNCC.component((props) => {
  const { Section, Button } = props;
  return (
    <Section.type {...Section.props}>
      <Button.type {...Button.props} />
    </Section.type>
  );
});
