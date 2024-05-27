import { ebc } from "../config";
import { EB } from "../index";

const eb = new EB({
  config: ebc({}),
});

const someComponent = eb.definition({
  id: "someComponent",
  schema: eb.schema({
    paddingGroup: eb.group({
      // use groups
      top: eb.number().responsive(), // set as responsive
      right: eb.number(),
    }),
    trueOrFalse: eb.boolean().defaultValue(true),
    name: eb
      .string()
      .buildOnly()
      .normalize((value) => value.toUpperCase()), // use normalize
    height: eb.number().defaultValue({ $res: true, sm: 45 }), // set a default value for one of the responsive values
    size: eb.select().options({
      // verbose definition of options
      sm: eb.option().label("Small"),
      md: eb.option().label("Medium"),
      lg: eb.option().label("Large"),
    }),
    anotherOption: eb.select().options(["a", "b"]), // simple string definitions of options
  }),
  styles: ({ values }) => {
    const { name, height } = values; // these are typed

    return {
      styled: {
        Root: {
          marginTop: height,
        },
      },
    };
  },
});

const def = someComponent.def(); // returns a NoCodeComponentDefinition

console.log(JSON.stringify(def, null, 2));

// Reponsive values are typed correctly
const numberProp = eb.number().defaultValue({ $res: true, sm: 45 });

// access the config values so that they can be used in the easyblocks config object
const devices = eb.getConfig().getDevicesArray(); // DeviceRange[]
