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

```TS
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
// }

// define devices so that types can be inferred
const eb = new EB({
  config: ebc({
    devices: {
      sm: {
        w: 640,
        h: 480,
        breakpoint: 640,
      },
    },
  }),
});

// Reponsive values are typed correctly
const numberProp = eb.number().defaultValue({ $res: true, sm: 45 });
```
