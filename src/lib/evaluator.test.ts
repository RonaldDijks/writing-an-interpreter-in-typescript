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
  const actual = [
    "5",
    "10",
    "-5",
    "-10",
    "5 + 5 + 5 + 5 - 10",
    "2 * 2 * 2 * 2 * 2",
    "-50 + 100 + -50",
    "5 * 2 + 10",
    "5 + 2 * 10",
    "20 + 2 * -10",
    "50 / 2 * 2 + 10",
    "2 * (5 + 10)",
    "3 * 3 * 3 + 10",
    "3 * (3 * 3) + 10",
    "(5 + 10 * 2 + 15 / 3) * 2 + -10",
  ].map(testEval);

  const expected = [
    5,
    10,
    -5,
    -10,
    10,
    32,
    0,
    20,
    25,
    0,
    60,
    30,
    37,
    37,
    50,
  ].map(obj.integer);
  expect(actual).toStrictEqual(expected);
});

test("test eval boolean expression", () => {
  const a = [
    "true",
    "false",
    "!true",
    "!false",
    "!5",
    "!!true",
    "!!false",
    "!!5",
    "1 < 2",
    "1 > 2",
    "1 < 1",
    "1 > 1",
    "1 == 1",
    "1 != 1",
    "1 == 2",
    "1 != 2",
    "true == true",
    "false == false",
    "true == false",
    "true != false",
    "false != true",
    "(1 < 2) == true",
    "(1 < 2) == false",
    "(1 > 2) == true",
    "(1 > 2) == false",
  ].map(testEval);

  const expected = [
    true,
    false,
    false,
    true,
    false,
    true,
    false,
    true,
    true,
    false,
    false,
    false,
    true,
    false,
    false,
    true,
    true,
    true,
    false,
    true,
    true,
    true,
    false,
    false,
    true,
  ].map(obj.boolean);

  expect(a).toStrictEqual(expected);
});
