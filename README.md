# easyblocks-typed

This is a prototype for building a NoCodeCompoenntDefinition for easyblocks in a typesafe way.

This doesn't replace the exisiting NoCodeComponentDefinition, but allows one to be defined in similar syntax to zod schemas and then output a NoCodeComponentDefinition.

Key features:

- Typesafe styles function
- Chained functions (easier to read)

Note that this is currently incomplete and a work in progress.

````JS
import { eb } from "../index";

const someComponent = eb.definition({
  id: "someComponent",
  schema: eb.schema({
    name: eb.string().defaultValue("bob"),
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

const def = someComponent.def();

// def returns a NoCodeComponentDefinition
// {
//   id: "someComponent",
//   schema: [
//     {
//       prop: "name",
//       type: "string",
//     }, {
//       prop: "age",
//       type: "number",
//     }
//   ],
//   styles: [Function: styles],
// }```
````
