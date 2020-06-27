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
      if (obj.isError(right)) return right;
      return evaluatePrefixExpression(node.operator, right);
    }
    case "infixExpression": {
      const left = evaluate(node.left);
      if (obj.isError(left)) return left;
      const right = evaluate(node.right);
      if (obj.isError(right)) return left;
      return evaluateInfixExpression(node.operator, left, right);
    }
    case "ifExpression":
      return evaluateIfExpression(node);
    case "returnStatement": {
      const value = evaluate(node.returnValue);
      if (obj.isError(value)) return value;
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
      return result.value;
    } else if (result.kind === "error") {
      return result;
    }
  }
  return result;
}

export function evaluateBlockStatement(node: ast.BlockStatement): obj.Object {
  let result!: obj.Object;
  for (const statement of node.statements) {
    result = evaluate(statement);

    if (result.kind === "returnValue" || result.kind === "error") {
      return result;
    }
  }
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
    default:
      return obj.error(`unknown operator: ${operator}${right.kind}`);
  }
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
  if (right.kind !== "integer") {
    return obj.error(`unknown operator: -${right.kind}`);
  }
  return obj.integer(-right.value);
}

export function evaluateInfixExpression(
  operator: string,
  left: obj.Object,
  right: obj.Object
): obj.Object {
  if (left.kind !== right.kind) {
    return obj.error(`type mismatch: ${left.kind} ${operator} ${right.kind}`);
  }

  switch (operator) {
    case "==":
      return obj.boolean(obj.eq(left, right));
    case "!=":
      return obj.boolean(!obj.eq(left, right));
  }

  if (left.kind === "integer" && right.kind === "integer")
    return evaluateIntegerInfixExpression(operator, left, right);

  return obj.error(`unknown operator: ${left.kind} ${operator} ${right.kind}`);
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
    default:
      return obj.error(
        `unknown operator: ${left.kind} ${operator} ${right.kind}`
      );
  }
}

export function evaluateIfExpression(node: ast.IfExpression): obj.Object {
  const condition = evaluate(node.condition);
  if (obj.isError(condition)) return condition;
  if (obj.isTruthy(condition)) {
    return evaluate(node.consequence);
  } else if (node.alternative) {
    return evaluate(node.alternative);
  }

  return obj.NULL;
}
