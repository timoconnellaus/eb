import { string, number, boolean, select, option } from "./schema/props";
import { schema } from "./schema";
import { definition } from "./definition";
import type { Config, DeviceRange } from "@easyblocks/core";
import { EBC } from "./config";
import { group } from "./schema/group";

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

  public group = group;
  public schema = schema;
  public string = string;
  public number = number;
  public boolean = boolean;
  public select = select;
  public option = option;
  public definition = definition;
}
