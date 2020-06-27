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

export interface ReturnValue {
  kind: "returnValue";
  value: Object;
}

export const returnValue = (value: Object): ReturnValue => {
  return {
    kind: 'returnValue',
    value
  }
}

export type Object = Integer | Boolean | Null | ReturnValue;

export function toString(object: Object): string {
  switch (object.kind) {
    case "boolean":
      return `${object.value}`;
    case "integer":
      return `${object.value}`;
    case "null":
      return `null`;
    case "returnValue":
      return toString(object);
  }
}

export function eq(a: Object, b: Object): boolean {
  if (a.kind === "null" && b.kind === "null") return true;
  if (a.kind === "null") return false;
  if (b.kind === "null") return false;
  return a.value === b.value;
}

export function isTruthy(a: Object): boolean {
  switch (a.kind) {
    case "null":
      return false;
    case "boolean":
      return a.value;
    case "integer":
      return true;
  }
  return true;
}
