import { Token } from "./token";
import { Lexer, lex } from "./lexer";

test("testNextToken", () => {
  const input = `=+(){},;`;

  const expected: Token[] = [
    { kind: "assign" },
    { kind: "plus" },
    { kind: "leftParenthesis" },
    { kind: "rightParenthesis" },
    { kind: "leftBrace" },
    { kind: "rightBrace" },
    { kind: "comma" },
    { kind: "semicolon" },
    { kind: "eof" },
  ];

  const actual = lex(input);
  expect(actual).toStrictEqual(expected);
});
