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
  const expected = ast.program([
    ast.letStatement(ast.identifier("x"), ast.integerLiteral(5)),
    ast.letStatement(ast.identifier("y"), ast.integerLiteral(10)),
    ast.letStatement(ast.identifier("foobar"), ast.integerLiteral(838383)),
  ]);

  const input = `
    let x = 5;
    let y = 10;
    let foobar = 838383;
  `;

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  checkParserErrors(parser);
  expect(program).toStrictEqual(expected);
});

test("test return statement", () => {
  const expected = ast.program([
    ast.returnStatement(ast.integerLiteral(5)),
    ast.returnStatement(ast.integerLiteral(10)),
    ast.returnStatement(ast.integerLiteral(993322)),
  ]);

  const input = `
    return 5;
    return 10;
    return 993322;
  `;

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  checkParserErrors(parser);
  expect(program).toStrictEqual(expected);
});

test("test identifier expression", () => {
  const expected = ast.program([
    ast.expressionStatement(ast.identifier("foobar")),
  ]);

  const input = "foobar;";
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  checkParserErrors(parser);
  expect(program).toStrictEqual(expected);
});

test("test integer literal expression", () => {
  const expected = ast.program([
    ast.expressionStatement(ast.integerLiteral(5)),
  ]);

  const input = "5;";
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  checkParserErrors(parser);
  expect(program).toStrictEqual(expected);
});

test("test parsing prefix expressions", () => {
  const expected = [
    ast.program([
      ast.expressionStatement(ast.prefixExpression("!", ast.integerLiteral(5))),
    ]),
    ast.program([
      ast.expressionStatement(
        ast.prefixExpression("-", ast.integerLiteral(15))
      ),
    ]),
  ];

  const actual = ["!5;", "-15;"].map((input) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    checkParserErrors(parser);
    return program;
  });

  expect(actual).toStrictEqual(expected);
});

test("test parsing infix expression", () => {
  const operators = ["+", "-", "*", "/", ">", "<", "==", "!="];

  const expected = operators.map((operator) => {
    return ast.program([
      ast.expressionStatement(
        ast.infixExpression(
          operator,
          ast.integerLiteral(5),
          ast.integerLiteral(5)
        )
      ),
    ]);
  });

  const actual = operators.map((operator) => {
    const lexer = new Lexer(`5 ${operator} 5;`);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    checkParserErrors(parser);
    return program;
  });

  expect(actual).toStrictEqual(expected);
});

test("test operator precedence parsing", () => {
  const expected = [
    "((-a) * b)",
    "(!(-a))",
    "((a + b) + c)",
    "((a + b) - c)",
    "((a * b) * c)",
    "((a * b) / c)",
    "(a + (b / c))",
    "(((a + (b * c)) + (d / e)) - f)",
    "(3 + 4)((-5) * 5)",
    "((5 > 4) == (3 < 4))",
    "((5 < 4) != (3 > 4))",
    "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))",
  ];

  const actual = [
    "-a * b",
    "!-a",
    "a + b + c",
    "a + b - c",
    "a * b * c",
    "a * b / c",
    "a + b / c",
    "a + b * c + d / e - f",
    "3 + 4; -5 * 5",
    "5 > 4 == 3 < 4",
    "5 < 4 != 3 > 4",
    "3 + 4 * 5 == 3 * 1 + 4 * 5",
  ].map((input) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    if (!program) return;
    checkParserErrors(parser);
    return ast.toString(program);
  });

  expect(actual).toStrictEqual(expected);
});
