import { Lexer } from "./lexer";
import { Parser } from "./parser";

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
