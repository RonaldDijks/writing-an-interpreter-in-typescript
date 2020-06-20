import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { evaluate } from "./evaluator";
import * as obj from "./object";

function testEval(input: string): obj.Object | undefined {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  if (!program) throw new Error("could not parse: " + input);
  const object = evaluate(program);
  return object;
}

test("test eval integer expression", () => {
  const actual = ["5", "10", "-5", "-10"].map(testEval);
  const expected = [5, 10, -5, -10].map(obj.integer);
  expect(actual).toStrictEqual(expected);
});

test("test bang expression", () => {
  const a = ["!true", "!false", "!5", "!!true", "!!false", "!!5"].map(testEval);
  const expected = [false, true, false, true, false, true].map(obj.boolean);
  expect(a).toStrictEqual(expected);
});

test("test eval bool expression", () => {
  const actual = ["true", "false"].map(testEval);
  const expected = [true, false].map(obj.boolean);
  expect(actual).toStrictEqual(expected);
});
