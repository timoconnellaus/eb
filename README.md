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

```ts
import { eb } from "../index";
const eb = new EB({
  config: ebc({}),
});

const someComponent = eb.definition({
  id: "someComponent",
  schema: eb.schema({
    paddingGroup: eb.group({
      // use groups - prop name will be converted to label if not explictely set with .label() on the group
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
```

<details><summary>Output</summary><p>

```ts
console.log(JSON.stringify(def, null, 2));
```

```json
{
  "id": "someComponent",
  "schema": [
    {
      "prop": "top",
      "type": "number",
      "buildOnly": false,
      "responsive": false,
      "hideLabel": false,
      "visible": true,
      "group": "Padding Group"
    },
    {
      "prop": "right",
      "type": "number",
      "buildOnly": false,
      "responsive": false,
      "hideLabel": false,
      "visible": true,
      "group": "Padding Group"
    },
    {
      "prop": "trueOrFalse",
      "type": "boolean",
      "buildOnly": false,
      "responsive": false,
      "hideLabel": false,
      "visible": true,
      "defaultValue": true
    },
    {
      "prop": "name",
      "type": "string",
      "buildOnly": true,
      "responsive": false,
      "hideLabel": false,
      "visible": true,
      "params": {}
    },
    {
      "prop": "height",
      "type": "number",
      "buildOnly": false,
      "responsive": false,
      "hideLabel": false,
      "visible": true,
      "defaultValue": {
        "$res": true,
        "sm": 45
      }
    },
    {
      "prop": "size",
      "type": "select",
      "params": {
        "options": [
          {
            "value": "sm",
            "_label": "Small",
            "_hideLabel": false
          },
          {
            "value": "md",
            "_label": "Medium",
            "_hideLabel": false
          },
          {
            "value": "lg",
            "_label": "Large",
            "_hideLabel": false
          }
        ]
      },
      "buildOnly": false,
      "responsive": false,
      "hideLabel": false,
      "visible": true
    },
    {
      "prop": "anotherOption",
      "type": "select",
      "params": {
        "options": ["a", "b"]
      },
      "buildOnly": false,
      "responsive": false,
      "hideLabel": false,
      "visible": true
    }
  ]
}
```

</p></details>

```ts
// Reponsive values are typed correctly
const numberProp = eb.number().defaultValue({ $res: true, sm: 45 });

// access the config values so that they can be used in the easyblocks config object
const devices = eb.getConfig().getDevicesArray(); // DeviceRange[]
```
