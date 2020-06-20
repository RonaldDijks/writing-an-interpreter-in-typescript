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

export type BlockStatement = {
  kind: "blockStatement";
  statements: Statement[];
};

export function blockStatement(statements: Statement[]): BlockStatement {
  return {
    kind: "blockStatement",
    statements,
  };
}

export type Statement =
  | LetStatement
  | ReturnStatement
  | ExpressionStatement
  | BlockStatement;

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

export interface FunctionLiteral {
  kind: "functionLiteral";
  parameters: Identifier[];
  body: BlockStatement;
}

export function functionLiteral(
  parameters: Identifier[],
  body: BlockStatement
): FunctionLiteral {
  return {
    kind: "functionLiteral",
    parameters,
    body,
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

export interface IfExpression {
  kind: "ifExpression";
  condition: Expression;
  consequence: BlockStatement;
  alternative?: BlockStatement;
}

export function ifExpression(
  condition: Expression,
  consequence: BlockStatement,
  alternative?: BlockStatement
): IfExpression {
  return {
    kind: "ifExpression",
    condition,
    consequence,
    alternative,
  };
}

export type Expression =
  | Identifier
  | IntegerLiteral
  | BooleanLiteral
  | FunctionLiteral
  | PrefixExpression
  | InfixExpression
  | IfExpression;

export type Node = Statement | Expression;

export interface Program {
  kind: "program";
  body: Statement[];
}

export function program(statements: Statement[]): Program {
  return { kind: "program", body: statements };
}

export function toString(node: Node | Program): string {
  switch (node.kind) {
    case "let": {
      const name = toString(node.name);
      const value = toString(node.value);
      return `let ${name} = ${value};`;
    }
    case "return": {
      const value = toString(node.returnValue);
      return `return ${value};`;
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
    case "infixExpression": {
      const left = toString(node.left);
      const op = node.operator;
      const right = toString(node.right);
      return `(${left} ${op} ${right})`;
    }
    case "program":
      return node.body.map(toString).join("");
    case "ifExpression": {
      const cond = toString(node.condition);
      const cons = toString(node.consequence);
      const alt = node.alternative && toString(node.alternative);

      return !alt
        ? `if (${cond}) {${cons}}`
        : `if (${cond}) {${cons}} else {${alt}}`;
    }
    case "functionLiteral": {
      const parameters = node.parameters.map(toString).join(", ");
      const body = toString(node.body);
      return `fn(${parameters}) ${body}`;
    }
    case "blockStatement": {
      return node.statements.map(toString).join("");
    }
  }
}
