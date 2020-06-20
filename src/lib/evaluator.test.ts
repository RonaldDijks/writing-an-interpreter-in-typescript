import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { evaluate } from "./evaluator";
import * as obj from "./object";

test("test eval integer expression", () => {
  const tests: [string, number][] = [
    ["5", 5],
    ["10", 10],
  ];

  for (const [input, value] of tests) {
    const expected = obj.integer(value);
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    const object = evaluate(program!);
    expect(object).toStrictEqual(expected);
  }
});

test("test eval bool expression", () => {
  const tests: [string, boolean][] = [
    ["true", true],
    ["false", false],
  ];

  for (const [input, value] of tests) {
    const expected = obj.boolean(value);
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    const object = evaluate(program!);
    expect(object).toStrictEqual(expected);
  }
});
