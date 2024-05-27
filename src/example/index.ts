import { ebc } from "../config";
import { EB } from "../index";

const eb = new EB({
  config: ebc({}),
});

const someComponent = eb.definition({
  id: "someComponent",
  schema: eb.schema({
    name: eb.string().buildOnly(),
    height: eb.number().defaultValue({ $res: true, sm: 45 }),
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

console.log(def);
// def returns a NoCodeComponentDefinition
// {
//   id: "someComponent",
//   schema: [
//     {
//       prop: "name",
//       type: "string",
//     }, {
//       prop: "height",
//       type: "number",
//       defaultValue: 42,
//     }
//   ],
// }

// Reponsive values are typed correctly
const numberProp = eb.number().defaultValue({ $res: true, sm: 45 });

// access the config values so that they can be used in the easyblocks config object
const devices = eb.getConfig().getDevicesArray(); // DeviceRange[]
