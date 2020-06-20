import * as ast from "./ast";
import * as obj from "./object";

export function evaluate(node: ast.Node): obj.Object | undefined {
  switch (node.kind) {
    // Statements
    case "program":
      return evaluateStatements(node.body);
    case "expressionStatement":
      return evaluate(node.expression);

    // Expressions
    case "integerLiteral":
      return obj.integer(node.value);

    default:
      throw new Error(`unexpected node: '${node.kind}'`);
  }
}

export function evaluateStatements(
  statements: ast.Statement[]
): obj.Object | undefined {
  let result: obj.Object | undefined;
  for (const statement of statements) {
    result = evaluate(statement);
  }
  return result;
}
