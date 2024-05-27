import { eb } from "../index";

const someComponent = eb.definition({
  id: "someComponent",
  schema: eb.schema({
    name: eb.string(),
    height: eb.number().defaultValue(42),
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
