import * as obj from "./object";

export class Environment {
  private store: Map<string, obj.Object>;

  public constructor() {
    this.store = new Map();
  }

  public get(name: string): obj.Object | undefined {
    return this.store.get(name);
  }

  public set(name: string, value: obj.Object): void {
    this.store.set(name, value);
  }
}
