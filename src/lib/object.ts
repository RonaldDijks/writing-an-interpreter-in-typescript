import * as ast from "./ast";
import * as env from "./environment";

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

export interface String {
  kind: "string";
  value: string;
}

export const string = (value: string): String => ({ kind: "string", value });

export interface Array {
  kind: "array";
  elements: Object[];
}

export const array = (elements: Object[]): Array => ({
  kind: "array",
  elements,
});

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

export interface Func {
  kind: "func";
  parameters: ast.Identifier[];
  body: ast.BlockStatement;
  env: env.Environment;
}

export const func = (
  parameters: ast.Identifier[],
  body: ast.BlockStatement,
  env: env.Environment
): Func => {
  return {
    kind: "func",
    parameters,
    body,
    env,
  };
};

export type BuiltInFunction = (args: Object[]) => Object;

export interface Builtin {
  kind: "builtin";
  fn: BuiltInFunction;
}

export const builtin = (fn: BuiltInFunction): Builtin => {
  return {
    kind: "builtin",
    fn,
  };
};

export type Object =
  | Integer
  | Boolean
  | String
  | Array
  | Null
  | Error
  | ReturnValue
  | Func
  | Builtin;

export function toString(object: Object): string {
  switch (object.kind) {
    case "boolean":
      return `${object.value} : boolean`;
    case "integer":
      return `${object.value} : integer`;
    case "string":
      return `${object.value} : string`;
    case "array":
      return `[${object.elements.map(toString).join(", ")}]`;
    case "null":
      return `null`;
    case "error":
      return `ERROR: ${object.value}`;
    case "returnValue":
      return toString(object);
    case "func": {
      const parameters = object.parameters.map(ast.toString).join(", ");
      const body = ast.toString(object.body);
      return `fn(${parameters}){\n${body}\n}`;
    }
    case "builtin":
      return "builtin function";
  }
}

export function eq(a: Object, b: Object): boolean {
  if (a.kind === "null" && b.kind === "null") return true;
  if (a.kind === "null") return false;
  if (b.kind === "null") return false;
  if (a.kind === "func" || b.kind === "func") return false;
  if (a.kind === "builtin" || b.kind === "builtin") return false;
  if (a.kind === "array" || b.kind === "array") {
    if (a.kind !== "array" || b.kind !== "array") return false;
    if (a.elements.length !== b.elements.length) return false;
    for (let i = 0; i < a.elements.length; i++) {
      if (!eq(a.elements[i], b.elements[i])) return false;
    }
    return true;
  }

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
