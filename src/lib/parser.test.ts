import { Lexer } from "./lexer";
import { Parser } from "./parser";
import * as ast from "./ast";

const checkParserErrors = (parser: Parser) => {
  if (parser.errors.length !== 0) {
    let message = "The parser produced the following errors:\n\n";
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
    ast.program([
      ast.expressionStatement(
        ast.prefixExpression("!", ast.booleanLiteral(true))
      ),
    ]),
    ast.program([
      ast.expressionStatement(
        ast.prefixExpression("!", ast.booleanLiteral(false))
      ),
    ]),
  ];

  const actual = ["!5;", "-15;", "!true", "!false"].map((input) => {
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
  [
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
    ["true", "true"],
    ["true", "true"],
    ["3 > 5 == false", "((3 > 5) == false)"],
    ["3 < 5 == true", "((3 < 5) == true)"],
    ["1 + (2 + 3) + 4", "((1 + (2 + 3)) + 4)"],
    ["(5 + 5) * 2", "((5 + 5) * 2)"],
    ["2 / (5 + 5)", "(2 / (5 + 5))"],
    ["-(5 + 5)", "(-(5 + 5))"],
    ["!(true == true)", "(!(true == true))"],
  ].forEach(([input, expected]) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    if (!program) return;
    checkParserErrors(parser);
    const actual = ast.toString(program);
    expect(actual).toStrictEqual(expected);
  });
});

test("test boolean expression", () => {
  const expected = ast.program([
    ast.expressionStatement(ast.booleanLiteral(true)),
    ast.expressionStatement(ast.booleanLiteral(false)),
    ast.letStatement(ast.identifier("foobar"), ast.booleanLiteral(true)),
    ast.letStatement(ast.identifier("barfoo"), ast.booleanLiteral(false)),
  ]);

  const input = `
    true;
    false;
    let foobar = true;
    let barfoo = false;`;
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  checkParserErrors(parser);

  expect(program).toStrictEqual(expected);
});

test("test if expression", () => {
  const expected = ast.program([
    ast.expressionStatement(
      ast.ifExpression(
        ast.infixExpression("<", ast.identifier("x"), ast.identifier("y")),
        ast.blockStatement([ast.expressionStatement(ast.identifier("x"))])
      )
    ),
  ]);

  const input = `if (x < y) { x }`;
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  checkParserErrors(parser);

  expect(program).toStrictEqual(expected);
});

test("test if else expression", () => {
  const expected = ast.program([
    ast.expressionStatement(
      ast.ifExpression(
        ast.infixExpression("<", ast.identifier("x"), ast.identifier("y")),
        ast.blockStatement([ast.expressionStatement(ast.identifier("x"))]),
        ast.blockStatement([ast.expressionStatement(ast.identifier("y"))])
      )
    ),
  ]);

  const input = `if (x < y) { x } else { y }`;
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  checkParserErrors(parser);

  expect(program).toStrictEqual(expected);
});

test("test function literal", () => {
  const expected = ast.program([
    ast.expressionStatement(
      ast.functionLiteral(
        [ast.identifier("x"), ast.identifier("y")],
        ast.blockStatement([
          ast.expressionStatement(
            ast.infixExpression("+", ast.identifier("x"), ast.identifier("y"))
          ),
        ])
      )
    ),
  ]);

  const input = `fn(x, y) { x + y; }`;
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  checkParserErrors(parser);
  expect(program).toStrictEqual(expected);
});

test("test function parameter parsing", () => {
  const expected = [[], ["x"], ["x", "y", "z"]];

  const input = `
    fn() { };
    fn(x) { };
    fn(x, y, z) { }`;
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  checkParserErrors(parser);

  const stmt = program?.body as ast.ExpressionStatement[];
  const lits = stmt.map((e) => e.expression) as ast.FunctionLiteral[];
  const params = lits.map((f) => f.parameters.map((p) => p.value));
  expect(params).toStrictEqual(expected);
});

test("test call expression", () => {
  const expected = ast.program([
    ast.expressionStatement(
      ast.callExpression(ast.identifier("add"), [
        ast.integerLiteral(1),
        ast.infixExpression("*", ast.integerLiteral(2), ast.integerLiteral(3)),
        ast.infixExpression("+", ast.integerLiteral(4), ast.integerLiteral(5)),
      ])
    ),
  ]);

  const input = `add(1, 2 * 3, 4 + 5);`;
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  checkParserErrors(parser);
  expect(program).toStrictEqual(expected);
});
