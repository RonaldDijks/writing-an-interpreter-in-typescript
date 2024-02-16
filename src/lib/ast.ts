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
  kind: "returnStatement";
  returnValue: Expression;
}

export function returnStatement(returnValue: Expression): ReturnStatement {
  return {
    kind: "returnStatement",
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

export interface StringLiteral {
  kind: "stringLiteral";
  value: string;
}

export function stringLiteral(value: string): StringLiteral {
  return {
    kind: "stringLiteral",
    value,
  };
}

export interface ArrayLiteral {
  kind: "arrayLiteral";
  elements: Expression[];
}

export function arrayLiteral(elements: Expression[]): ArrayLiteral {
  return {
    kind: "arrayLiteral",
    elements,
  };
}

export interface HashLiteral {
  kind: "hashLiteral";
  pairs: Array<KeyValuePair<Expression, Expression>>;
}

export interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

export function hashLiteral(
  pairs: Array<KeyValuePair<Expression, Expression>>
): HashLiteral {
  return {
    kind: "hashLiteral",
    pairs,
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

export interface CallExpression {
  kind: "callExpression";
  func: Identifier | FunctionLiteral;
  args: Expression[];
}

export function callExpression(
  func: Identifier | FunctionLiteral,
  args: Expression[]
): CallExpression {
  return {
    kind: "callExpression",
    func,
    args,
  };
}

export interface IndexExpression {
  kind: "indexExpression";
  left: Expression;
  index: Expression;
}

export function indexExpression(
  left: Expression,
  index: Expression
): IndexExpression {
  return {
    kind: "indexExpression",
    left,
    index,
  };
}

export type Expression =
  | Identifier
  | IntegerLiteral
  | BooleanLiteral
  | ArrayLiteral
  | HashLiteral
  | StringLiteral
  | FunctionLiteral
  | PrefixExpression
  | InfixExpression
  | IfExpression
  | CallExpression
  | IndexExpression;

export type Node = Statement | Expression | Program;

export interface Program {
  kind: "program";
  body: Statement[];
}

export function program(statements: Statement[]): Program {
  return { kind: "program", body: statements };
}

export function toString(node: Node): string {
  switch (node.kind) {
    case "let": {
      const name = toString(node.name);
      const value = toString(node.value);
      return `let ${name} = ${value};`;
    }
    case "returnStatement": {
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
    case "stringLiteral":
      return `"${node.value}"`;
    case "arrayLiteral":
      return `[${node.elements.map(toString).join(", ")}]`;
    case "hashLiteral":
      return `{${node.pairs
        .map((pair) => `${toString(pair.key)}: ${toString(pair.value)}`)
        .join(", ")}}`;
    case "prefixExpression":
      return `(${node.operator}${toString(node.right)})`;
    case "infixExpression": {
      const left = toString(node.left);
      const op = node.operator;
      const right = toString(node.right);
      return `(${left} ${op} ${right})`;
    }
    case "callExpression": {
      const func = toString(node.func);
      const args = node.args.map(toString).join(", ");
      return `${func}(${args})`;
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
    case "indexExpression": {
      const left = toString(node.left);
      const index = toString(node.index);
      return `(${left}[${index}])`;
    }
  }
}
