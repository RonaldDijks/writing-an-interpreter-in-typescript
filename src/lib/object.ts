/* eslint-disable @typescript-eslint/ban-types */
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

export const boolean = (value: boolean): Boolean => (value ? TRUE : FALSE);

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
    kind: "returnValue",
    value,
  };
};

export interface Error {
  kind: "error";
  value: string;
}

export const error = (value: string): Error => ({
  kind: "error",
  value,
});

export const isError = (value: unknown): value is Error => {
  if ((value as Error).kind === "error") {
    return true;
  }

  return false;
};

export type Object = Integer | Boolean | Null | Error | ReturnValue;

export function toString(object: Object): string {
  switch (object.kind) {
    case "boolean":
      return `${object.value} : boolean`;
    case "integer":
      return `${object.value} : integer`;
    case "null":
      return `null`;
    case "error":
      return `ERROR: ${object.value}`;
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
