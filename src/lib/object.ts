export interface Integer {
  kind: "integer";
  value: number;
}

export const integer = (value: number): Integer => ({ kind: "integer", value });

export interface Boolean {
  kind: "boolean";
  value: boolean;
}

export const boolean = (value: boolean): Boolean => ({
  kind: "boolean",
  value,
});

export interface Null {
  kind: "null";
}

export const Null = (): Null => ({ kind: "null" });

export type Object = Integer | Boolean | Null;

export function toString(object: Object): string {
  switch (object.kind) {
    case "boolean":
      return `${object.value}`;
    case "integer":
      return `${object.value}`;
    case "null":
      return `null`;
  }
}
