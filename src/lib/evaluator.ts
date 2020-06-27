import * as ast from "./ast";
import * as obj from "./object";

export function evaluate(node: ast.Node): obj.Object {
  switch (node.kind) {
    // Statements
    case "program":
      return evaluateProgram(node);
    case "blockStatement":
      return evaluateBlockStatement(node);
    case "expressionStatement":
      return evaluate(node.expression);

    // Expressions
    case "integerLiteral":
      return obj.integer(node.value);
    case "booleanLiteral":
      return obj.boolean(node.value);
    case "prefixExpression": {
      const right = evaluate(node.right);
      return evaluatePrefixExpression(node.operator, right);
    }
    case "infixExpression": {
      const left = evaluate(node.left);
      const right = evaluate(node.right);
      return evaluateInfixExpression(node.operator, left, right);
    }
    case "ifExpression":
      return evaluateIfExpression(node);
    case "returnStatement": {
      const value = evaluate(node.returnValue);
      return obj.returnValue(value);
    }
  }
  throw new Error(`unexpected node: '${node.kind}'`);
}

export function evaluateProgram(program: ast.Program): obj.Object {
  let result!: obj.Object;
  for (const statement of program.body) {
    result = evaluate(statement);

    if (result.kind === "returnValue") {
      return result.value
    }
  }
  return result;
}

export function evaluateBlockStatement(node: ast.BlockStatement): obj.Object {
  let result!: obj.Object;
  for (const statement of node.statements) {
    result = evaluate(statement);

    if (result.kind === "returnValue") {
      return result;
    }
  }
  return result;
}

export function evaluateStatements(statements: ast.Statement[]): obj.Object {
  let result: obj.Object | undefined = undefined;
  for (const statement of statements) {
    result = evaluate(statement);

    if (result.kind === "returnValue") {
      return result.value
    }
  }
  if (!result) throw new Error("no returnValue");
  return result;
}

export function evaluatePrefixExpression(
  operator: string,
  right: obj.Object
): obj.Object {
  switch (operator) {
    case "!":
      return evaluateBangOperatorExpression(right);
    case "-":
      return evaluateMinusOperatorExpression(right);
  }
  return obj.NULL;
}

export function evaluateBangOperatorExpression(right: obj.Object): obj.Object {
  switch (right.kind) {
    case "boolean":
      return right.value ? obj.FALSE : obj.TRUE;
    case "null":
      return obj.TRUE;
    default:
      return obj.FALSE;
  }
}

export function evaluateMinusOperatorExpression(right: obj.Object): obj.Object {
  if (right.kind !== "integer") return obj.NULL;
  return obj.integer(-right.value);
}

export function evaluateInfixExpression(
  operator: string,
  left: obj.Object,
  right: obj.Object
): obj.Object {
  switch (operator) {
    case "==":
      return obj.boolean(obj.eq(left, right));
    case "!=":
      return obj.boolean(!obj.eq(left, right));
  }

  if (left.kind === "integer" && right.kind === "integer")
    return evaluateIntegerInfixExpression(operator, left, right);
  return obj.NULL;
}

export function evaluateIntegerInfixExpression(
  operator: string,
  left: obj.Integer,
  right: obj.Integer
): obj.Object {
  switch (operator) {
    case "+":
      return obj.integer(left.value + right.value);
    case "-":
      return obj.integer(left.value - right.value);
    case "*":
      return obj.integer(left.value * right.value);
    case "/":
      return obj.integer(left.value / right.value);
    case ">":
      return obj.boolean(left.value > right.value);
    case "<":
      return obj.boolean(left.value < right.value);
  }
  return obj.NULL;
}

export function evaluateIfExpression(node: ast.IfExpression): obj.Object {
  const condition = evaluate(node.condition);

  if (obj.isTruthy(condition)) {
    return evaluate(node.consequence);
  } else if (node.alternative) {
    return evaluate(node.alternative);
  }

  return obj.NULL;
}