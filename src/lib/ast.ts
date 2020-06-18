export interface Program {
  kind: "program";
  statements: Statement[];
}

export function program(statements: Statement[]): Program {
  return { kind: "program", statements };
}

export interface LetStatement {
  kind: "let";
  name: Identifier;
  value: Expression;
}

export function letStatement(
  name: Identifier,
  value: Expression
): LetStatement {
  return {
    kind: "let",
    name,
    value,
  };
}

export interface ReturnStatement {
  kind: "return";
  returnValue: Expression;
}

export function returnStatement(returnValue: Expression): ReturnStatement {
  return {
    kind: "return",
    returnValue,
  };
}

export interface Identifier {
  kind: "identifier";
  value: string;
}

export function identifier(value: string): Identifier {
  return {
    kind: "identifier",
    value,
  };
}

export interface ExpressionStatement {
  kind: "expressionStatement";
  expression: Expression;
}

export type Statement = LetStatement | ReturnStatement | ExpressionStatement;
export type Expression = Identifier;
export type Node = Statement | Expression;

export function toString(node: Node | Program): string {
  switch (node.kind) {
    case "let": {
      let result = "";
      result += node.kind;
      result += " ";
      result += toString(node.name);
      result += " = ";
      result += toString(node.value);
      result += ";";
      return result;
    }
    case "return": {
      let result = "";
      result += node.kind;
      result += " ";
      result += toString(node.returnValue);
      result += ";";
      return result;
    }
    case "expressionStatement":
      return `${toString(node.expression)};`;
    case "identifier":
      return node.value;
    case "program":
      return node.statements.map(toString).join("\n");
  }
}
