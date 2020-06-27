import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { evaluate } from "./evaluator";
import * as obj from "./object";
import * as env from "./environment";

function fst<A, B>(tuple: [A, B]): A {
  return tuple[0];
}

function snd<A, B>(tuple: [A, B]): B {
  return tuple[1];
}

function testEval(input: string): obj.Object | undefined {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  if (parser.errors.length !== 0) {
    parser.errors.forEach(console.log);
    return;
  }
  const program = parser.parseProgram();
  if (!program) throw new Error("could not parse: " + input);
  const object = evaluate(program, new env.Environment());
  return object;
}

test("test eval integer expression", () => {
  const tests: [string, number][] = [
    ["5", 5],
    ["10", 10],
    ["-5", -5],
    ["-10", -10],
    ["5 + 5 + 5 + 5 - 10", 10],
    ["2 * 2 * 2 * 2 * 2", 32],
    ["-50 + 100 + -50", 0],
    ["5 * 2 + 10", 20],
    ["5 + 2 * 10", 25],
    ["20 + 2 * -10", 0],
    ["50 / 2 * 2 + 10", 60],
    ["2 * (5 + 10)", 30],
    ["3 * 3 * 3 + 10", 37],
    ["3 * (3 * 3) + 10", 37],
    ["(5 + 10 * 2 + 15 / 3) * 2 + -10", 50],
  ];

  const actual = tests.map(fst).map(testEval);
  const expected = tests.map(snd).map(obj.integer);
  expect(actual).toStrictEqual(expected);
});

test("test eval boolean expression", () => {
  const tests: [string, boolean][] = [
    ["true", true],
    ["false", false],
    ["!true", false],
    ["!false", true],
    ["!5", false],
    ["!!true", true],
    ["!!false", false],
    ["!!5", true],
    ["1 < 2", true],
    ["1 > 2", false],
    ["1 < 1", false],
    ["1 > 1", false],
    ["1 == 1", true],
    ["1 != 1", false],
    ["1 == 2", false],
    ["1 != 2", true],
    ["true == true", true],
    ["false == false", true],
    ["true == false", false],
    ["true != false", true],
    ["false != true", true],
    ["(1 < 2) == true", true],
    ["(1 < 2) == false", false],
    ["(1 > 2) == true", false],
    ["(1 > 2) == false", true],
  ];

  const actual = tests.map(fst).map(testEval);
  const expected = tests.map(snd).map(obj.boolean);
  expect(actual).toStrictEqual(expected);
});

test("test eval if else expressions", () => {
  const tests: [string, obj.Object][] = [
    ["if (true) { 10 }", obj.integer(10)],
    ["if (false) { 10 }", obj.NULL],
    ["if (1) { 10 }", obj.integer(10)],
    ["if (1 < 2) { 10 }", obj.integer(10)],
    ["if (1 > 2) { 10 }", obj.NULL],
    ["if (1 > 2) { 10 } else { 20 }", obj.integer(20)],
    ["if (1 < 2) { 10 } else { 20 }", obj.integer(10)],
  ];
  const actual = tests.map(fst).map(testEval);
  const expected = tests.map(snd);
  expect(actual).toStrictEqual(expected);
});

const nestedReturnStatements = `
  if (10 > 1) {
    if (10 > 1) {
      return 10;
    }
    return 1;
  }
`;

test("test return statement", () => {
  const tests: [string, number][] = [
    ["return 10;", 10],
    ["return 10; 9;", 10],
    ["return 2 * 5; 9;", 10],
    ["9; return 2 * 5; 9;", 10],
    [nestedReturnStatements, 10],
  ];

  const actual = tests.map(fst).map(testEval);
  const expected = tests.map(snd).map(obj.integer);
  expect(actual).toStrictEqual(expected);
});

test("test error handling", () => {
  const tests: [string, string][] = [
    ["foobar", "identifier not found: foobar"],
    ["5 + true;", "type mismatch: integer + boolean"],
    ["5 + true; 5;", "type mismatch: integer + boolean"],
    ["-true;", "unknown operator: -boolean"],
    ["true + false;", "unknown operator: boolean + boolean"],
    ["5; true + false; 5", "unknown operator: boolean + boolean"],
    ["if (10 > 1) { true + false; }", "unknown operator: boolean + boolean"],
    [
      `
    if (10 > 1) {
      if (10 > 1) {
        return true + false;
      }
      return 1;
    }
    `,
      "unknown operator: boolean + boolean",
    ],
  ];

  const actual = tests.map(fst).map(testEval);
  const expected = tests.map(snd).map(obj.error);
  expect(actual).toStrictEqual(expected);
});

test("test let statements", () => {
  const tests: [string, number][] = [
    ["let a = 5; a;", 5],
    ["let a = 5 * 5; a;", 25],
    ["let a = 5; let b = a; b;", 5],
    ["let a = 5; let b = a; let c = a + b + 5; c;", 15],
  ];

  const actual = tests.map(fst).map(testEval);
  const expected = tests.map(snd).map(obj.integer);
  expect(actual).toStrictEqual(expected);
});
