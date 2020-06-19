import { Lexer } from "./lexer";
import { Parser } from "./parser";
import * as ast from "./ast";

const checkParserErrors = (parser: Parser) => {
  if (parser.errors.length !== 0) {
    let message = "The parser produces the following errors:\n\n";
    for (const error of parser.errors) {
      message += "ERROR: " + error + "\n";
    }
    throw new Error(message);
  }
};

test("testLetStatement", () => {
  const input = `
    let x = 5;
    let y = 10;
    let foobar = 838383;
  `;

  const tests = ["x", "y", "foobar"];

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  expect(program).not.toBeUndefined();
  checkParserErrors(parser);

  const identifiers = program?.statements.map((x) => {
    if (x.kind !== "let") {
      throw new Error(`expected let, got ${x.kind}`);
    }
    return x.name.value;
  });

  expect(identifiers).toStrictEqual(tests);
});

test("test return statement", () => {
  const input = `
    return 5;
    return 10;
    return 993322;
  `;

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  checkParserErrors(parser);

  expect(program).not.toBeUndefined();
  expect(program?.statements.length).toBe(3);

  program?.statements.forEach((statement) => {
    if (statement.kind !== "return") {
      throw new Error(`expected return, got ${statement.kind}`);
    }
  });
});

test("test identifier expression", () => {
  const input = "foobar;";
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  checkParserErrors(parser);

  if (!program) {
    throw new Error(`Program cannot be undefined.`);
  }

  const statement = program.statements[0];

  if (statement.kind !== "expressionStatement") {
    throw new Error("program.statements[0] must be expressionStatement");
  }

  const identifier = statement.expression;

  if (identifier.kind !== "identifier") {
    throw new Error(`ident is not an identifier`);
  }

  expect(identifier.value).toBe("foobar");
});

test("test integer literal expression", () => {
  const input = "5;";
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  checkParserErrors(parser);

  const statement = program?.statements[0];

  if (!statement || statement.kind !== "expressionStatement") {
    throw new Error("statement is not an expressionstatement");
  }

  if (statement.expression.kind !== "integerLiteral") {
    throw new Error("statement is not an integerLiteral");
  }

  expect(statement.expression.value).toBe(5);
});

test("test parsing prefix expressions", () => {
  const tests: [string, string, number][] = [
    ["!5;", "!", 5],
    ["-15;", "-", 15],
  ];

  for (const [input, operator, integerValue] of tests) {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    checkParserErrors(parser);

    expect(program?.statements.length).toBe(1);

    const statement = program?.statements[0];

    if (!statement) {
      throw new Error("statement cannot be null.");
    }

    if (statement.kind !== "expressionStatement") {
      throw new Error(`expected expressionStatement, got ${statement.kind}`);
    }

    if (statement.expression.kind !== "prefixExpression") {
      throw new Error(
        "expected prefixExpression, got " + statement.expression.kind
      );
    }

    if (statement.expression.operator != operator) {
      throw new Error(
        `expected operator ${operator}, got ${statement.expression.operator}`
      );
    }

    testIntegerLiteral(statement.expression.right, integerValue);
  }
});

const testIntegerLiteral = (expr: ast.Expression, value: number) => {
  if (expr.kind !== "integerLiteral") {
    throw new Error(`expected integerLiteral, got ${expr.kind}`);
  }
  if (expr.value !== value) {
    throw new Error(`expected ${value}, got ${expr.value}`);
  }
};

test("test parsing infix expression", () => {
  const tests: [string, number, string, number][] = [
    ["5 + 5;", 5, "+", 5],
    ["5 - 5;", 5, "-", 5],
    ["5 * 5;", 5, "*", 5],
    ["5 / 5;", 5, "/", 5],
    ["5 > 5;", 5, ">", 5],
    ["5 < 5;", 5, "<", 5],
    ["5 == 5;", 5, "==", 5],
    ["5 != 5;", 5, "!=", 5],
  ];

  for (const [input, left, operator, right] of tests) {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    checkParserErrors(parser);

    const statement = program?.statements[0];

    if (!statement) {
      throw new Error("statement cannot be null.");
    }

    if (statement.kind !== "expressionStatement") {
      throw new Error(`expected expressionStatement, got ${statement.kind}`);
    }

    const expression = statement.expression;

    if (expression.kind !== "infixExpression") {
      throw new Error(`expected infixExpression, got: ${expression.kind}`);
    }

    if (expression.operator != operator) {
      throw new Error(`expected ${operator}, got: ${expression.operator}`);
    }

    testIntegerLiteral(expression.left, left);
    testIntegerLiteral(expression.right, right);
  }
});

test("test operator precedence parsing", () => {
  const tests = [
    ["-a * b", "((-a) * b)"],
    ["!-a", "(!(-a))"],
    ["a + b + c", "((a + b) + c)"],
    ["a + b - c", "((a + b) - c)"],
    ["a * b * c", "((a * b) * c)"],
    ["a * b / c", "((a * b) / c)"],
    ["a + b / c", "(a + (b / c))"],
    ["a + b * c + d / e - f", "(((a + (b * c)) + (d / e)) - f)"],
    ["3 + 4; -5 * 5", "(3 + 4)((-5) * 5)"],
    ["5 > 4 == 3 < 4", "((5 > 4) == (3 < 4))"],
    ["5 < 4 != 3 > 4", "((5 < 4) != (3 > 4))"],
    ["3 + 4 * 5 == 3 * 1 + 4 * 5", "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))"],
  ];

  for (const [input, expected] of tests) {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    checkParserErrors(parser);
    expect(program).not.toBeUndefined();
    const actual = ast.toString(program!);
    expect(actual).toBe(expected);
  }
});
