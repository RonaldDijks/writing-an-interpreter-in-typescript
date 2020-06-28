import * as obj from "./object";

export class Environment {
  private store: Map<string, obj.Object>;
  private outer?: Environment;

  public constructor(outer?: Environment) {
    this.store = new Map();
    this.outer = outer;
  }

  public get(name: string): obj.Object | undefined {
    let obj = this.store.get(name);
    if (!obj) {
      obj = this.outer?.get(name);
    }
    return obj;
  }

  public set(name: string, value: obj.Object): void {
    this.store.set(name, value);
  }
}
