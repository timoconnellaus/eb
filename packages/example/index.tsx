import { useEffect, useState } from "react";
import { eb } from "eb";
import { z } from "zod";

const urlWidget = eb
  .widget(z.string()) // set the input type of the widget with zod
  .label("URL")
  .component((props) => {
    const [active, setActive] = useState(false);
    const [value, setValue] = useState(props.value); // this is typed based on the zod type

    useEffect(() => {
      if (!active) {
        setValue(props.value);
      }
    });

    return (
      <input
        value={value}
        onChange={(event) => {
          setActive(true);
          setValue(event.target.value);
        }}
        onBlur={() => {
          setActive(false);
          props.onChange(value);
        }}
      />
    );
  });

const testConfig = eb.config({
  widgets: {
    url: urlWidget, // this widget's type will be available to use in a definition (correctly typed)
  },
});

const { definition, select, string, number, schema, custom, option } =
  testConfig; // export from config so we have the context of what is set in config (e.g. widgets)

const test = definition({
  schema: schema({
    name: string(),
    height: number().min(5).max(10),
    select: select(["a", "b"]),
    selectTwo: select({
      a: option().label("A").hideLabel(),
      b: option().label("B"),
    }),
    url: custom("url"), // this is typed - url is based on the widgets defined in the config
  }),
  styles: ({ values }) => {
    const { name, height, select, url, selectTwo } = values; // these are all typed correctly (including unions for select)

    return {};
  },
});

testConfig.definitions({
  test: test,
});

const noCodeComponentDefenition = testConfig.build().test.schemaDef();
