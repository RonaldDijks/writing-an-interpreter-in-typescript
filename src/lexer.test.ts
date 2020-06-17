import { Token } from "./token";
import { Lexer, lex } from "./lexer";

test("testNextToken", () => {
  const input = `
    let five = 5;
    let ten = 10;
  
    let add = fn(x, y) {
        x + y;
    };

    let result = add(five, ten);
  `;

  const expected: Token[] = [
    { kind: "let" },
    { kind: "identifier", text: "five" },
    { kind: "assign" },
    { kind: "integer", text: "5" },
    { kind: "semicolon" },
    { kind: "let" },
    { kind: "identifier", text: "ten" },
    { kind: "assign" },
    { kind: "integer", text: "10" },
    { kind: "semicolon" },
    { kind: "let" },
    { kind: "identifier", text: "add" },
    { kind: "assign" },
    { kind: "function" },
    { kind: "leftParenthesis" },
    { kind: "identifier", text: "x" },
    { kind: "comma" },
    { kind: "identifier", text: "y" },
    { kind: "rightParenthesis" },
    { kind: "leftBrace" },
    { kind: "identifier", text: "x" },
    { kind: "plus" },
    { kind: "identifier", text: "y" },
    { kind: "semicolon" },
    { kind: "rightBrace" },
    { kind: "semicolon" },
    { kind: "let" },
    { kind: "identifier", text: "result" },
    { kind: "assign" },
    { kind: "identifier", text: "add" },
    { kind: "leftParenthesis" },
    { kind: "identifier", text: "five" },
    { kind: "comma" },
    { kind: "identifier", text: "ten" },
    { kind: "rightParenthesis" },
    { kind: "semicolon" },
    { kind: "eof" },
  ];

  const actual = lex(input);
  expect(actual).toStrictEqual(expected);
});
