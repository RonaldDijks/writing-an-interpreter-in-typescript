import * as ast from "./ast";
import * as obj from "./object";

export function evaluate(node: ast.Node): obj.Object {
  switch (node.kind) {
    // Statements
    case "program":
      return evaluateStatements(node.body);
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
  }
  throw new Error(`unexpected node: '${node.kind}'`);
}

export function evaluateStatements(statements: ast.Statement[]): obj.Object {
  let result: obj.Object | undefined = undefined;
  for (const statement of statements) {
    result = evaluate(statement);
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
