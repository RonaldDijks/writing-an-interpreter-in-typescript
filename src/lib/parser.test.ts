import { Lexer } from "./lexer";
import { Parser } from "./parser";

test("testLetStatement", () => {
  const input = `
    let x 5;
    let y = 10
    let  = 838383;
  `;

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  expect(program).not.toBe(undefined);

  if (parser.errors.length !== 0) {
    let message = "The parser produces the following errors:\n\n";
    for (const error of parser.errors) {
      message += "ERROR: " + error + "\n";
    }
    throw new Error(message);
  }

  const identifiers = program?.statements.map((x) => x.name.value);
  const tests = ["x", "y", "foobar"];
  expect(identifiers).toStrictEqual(tests);
});
