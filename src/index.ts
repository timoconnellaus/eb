import { string, number } from "./schema/props";
import { schema } from "./schema";
import { definition } from "./definition";
import type { Config, DeviceRange } from "@easyblocks/core";
import { EBC } from "./config";

type EBProps = {
  config?: EBC;
};
export class EB {
  private config: EBC;

  constructor(props: EBProps) {
    if (props.config === undefined) {
      this.config = new EBC({});
    } else {
      this.config = props.config;
    }
  }

  getConfig = (): EBC => {
    return this.config;
  };

  public schema = schema;
  public string = string;
  public number = number;
  public definition = definition;
}
