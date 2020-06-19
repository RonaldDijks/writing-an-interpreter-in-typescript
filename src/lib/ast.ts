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

export interface ExpressionStatement {
  kind: "expressionStatement";
  expression: Expression;
}

export function expressionStatement(
  expression: Expression
): ExpressionStatement {
  return {
    kind: "expressionStatement",
    expression,
  };
}

export type Statement = LetStatement | ReturnStatement | ExpressionStatement;

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

export interface IntegerLiteral {
  kind: "integerLiteral";
  value: number;
}

export function integerLiteral(value: number): IntegerLiteral {
  return {
    kind: "integerLiteral",
    value,
  };
}

export interface BooleanLiteral {
  kind: "booleanLiteral";
  value: boolean;
}

export function booleanLiteral(value: boolean): BooleanLiteral {
  return {
    kind: "booleanLiteral",
    value,
  };
}

export interface PrefixExpression {
  kind: "prefixExpression";
  operator: string;
  right: Expression;
}

export function prefixExpression(
  operator: string,
  right: Expression
): PrefixExpression {
  return {
    kind: "prefixExpression",
    operator,
    right,
  };
}

export interface InfixExpression {
  kind: "infixExpression";
  operator: string;
  left: Expression;
  right: Expression;
}

export function infixExpression(
  operator: string,
  left: Expression,
  right: Expression
): InfixExpression {
  return {
    kind: "infixExpression",
    operator,
    left,
    right,
  };
}

export type Expression =
  | Identifier
  | IntegerLiteral
  | BooleanLiteral
  | PrefixExpression
  | InfixExpression;

export type Node = Statement | Expression;

export interface Program {
  kind: "program";
  statements: Statement[];
}

export function program(statements: Statement[]): Program {
  return { kind: "program", statements };
}

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
      return `${toString(node.expression)}`;
    case "identifier":
      return node.value;
    case "integerLiteral":
      return `${node.value.toString()}`;
    case "booleanLiteral":
      return `${node.value.toString()}`;
    case "prefixExpression":
      return `(${node.operator}${toString(node.right)})`;
    case "infixExpression":
      let result = "";
      result += "(";
      result += toString(node.left);
      result += " ";
      result += node.operator;
      result += " ";
      result += toString(node.right);
      result += ")";
      return result;
    case "program":
      return node.statements.map(toString).join("");
  }
}
