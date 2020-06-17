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
    !-/*5;
    5 < 10 > 5;

    if (5 < 10) {
        return true;
    } else {
        return false;
    }

    10 == 10;
    10 != 9;
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
    { kind: "bang" },
    { kind: "minus" },
    { kind: "slash" },
    { kind: "asterisk" },
    { kind: "integer", text: "5" },
    { kind: "semicolon" },
    { kind: "integer", text: "5" },
    { kind: "lessThen" },
    { kind: "integer", text: "10" },
    { kind: "greaterThen" },
    { kind: "integer", text: "5" },
    { kind: "semicolon" },
    { kind: "if" },
    { kind: "leftParenthesis" },
    { kind: "integer", text: "5" },
    { kind: "lessThen" },
    { kind: "integer", text: "10" },
    { kind: "rightParenthesis" },
    { kind: "leftBrace" },
    { kind: "return" },
    { kind: "true" },
    { kind: "semicolon" },
    { kind: "rightBrace" },
    { kind: "else" },
    { kind: "leftBrace" },
    { kind: "return" },
    { kind: "false" },
    { kind: "semicolon" },
    { kind: "rightBrace" },
    { kind: "integer", text: "10" },
    { kind: "equals" },
    { kind: "integer", text: "10" },
    { kind: "semicolon" },
    { kind: "integer", text: "10" },
    { kind: "notEquals" },
    { kind: "integer", text: "9" },
    { kind: "semicolon" },
    { kind: "eof" },
  ];

  // 10 == 10;
  // 10 != 9;

  const actual = lex(input);
  expect(actual).toStrictEqual(expected);
});
