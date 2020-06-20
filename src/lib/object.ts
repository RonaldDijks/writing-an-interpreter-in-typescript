export interface Integer {
  kind: "integer";
  value: number;
}

export const integer = (value: number): Integer => ({ kind: "integer", value });

export interface Boolean {
  kind: "boolean";
  value: boolean;
}

export const TRUE: Readonly<Boolean> = { kind: "boolean", value: true };
export const FALSE: Readonly<Boolean> = { kind: "boolean", value: false };

export const boolean = (value: boolean) => (value ? TRUE : FALSE);

export interface Null {
  kind: "null";
}

export const NULL: Readonly<Null> = { kind: "null" };

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
