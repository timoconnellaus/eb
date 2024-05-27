import { StringProp, NumberProp } from "./props";
import { schema } from "./schema";
import { definition, Definition } from "./definition";

const string = () => new StringProp();
const number = () => new NumberProp();

export const eb = { schema, string, number, definition };
