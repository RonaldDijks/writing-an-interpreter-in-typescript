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
    { kind: "let", text: "let" },
    { kind: "identifier", text: "five" },
    { kind: "assign", text: "=" },
    { kind: "integer", text: "5" },
    { kind: "semicolon", text: ";" },
    { kind: "let", text: "let" },
    { kind: "identifier", text: "ten" },
    { kind: "assign", text: "=" },
    { kind: "integer", text: "10" },
    { kind: "semicolon", text: ";" },
    { kind: "let", text: "let" },
    { kind: "identifier", text: "add" },
    { kind: "assign", text: "=" },
    { kind: "function", text: "fn" },
    { kind: "leftParenthesis", text: "(" },
    { kind: "identifier", text: "x" },
    { kind: "comma", text: "," },
    { kind: "identifier", text: "y" },
    { kind: "rightParenthesis", text: ")" },
    { kind: "leftBrace", text: "{" },
    { kind: "identifier", text: "x" },
    { kind: "plus", text: "+" },
    { kind: "identifier", text: "y" },
    { kind: "semicolon", text: ";" },
    { kind: "rightBrace", text: "}" },
    { kind: "semicolon", text: ";" },
    { kind: "let", text: "let" },
    { kind: "identifier", text: "result" },
    { kind: "assign", text: "=" },
    { kind: "identifier", text: "add" },
    { kind: "leftParenthesis", text: "(" },
    { kind: "identifier", text: "five" },
    { kind: "comma", text: "," },
    { kind: "identifier", text: "ten" },
    { kind: "rightParenthesis", text: ")" },
    { kind: "semicolon", text: ";" },
    { kind: "bang", text: "!" },
    { kind: "minus", text: "-" },
    { kind: "slash", text: "/" },
    { kind: "asterisk", text: "*" },
    { kind: "integer", text: "5" },
    { kind: "semicolon", text: ";" },
    { kind: "integer", text: "5" },
    { kind: "lessThen", text: "<" },
    { kind: "integer", text: "10" },
    { kind: "greaterThen", text: ">" },
    { kind: "integer", text: "5" },
    { kind: "semicolon", text: ";" },
    { kind: "if", text: "if" },
    { kind: "leftParenthesis", text: "(" },
    { kind: "integer", text: "5" },
    { kind: "lessThen", text: "<" },
    { kind: "integer", text: "10" },
    { kind: "rightParenthesis", text: ")" },
    { kind: "leftBrace", text: "{" },
    { kind: "return", text: "return" },
    { kind: "true", text: "true" },
    { kind: "semicolon", text: ";" },
    { kind: "rightBrace", text: "}" },
    { kind: "else", text: "else" },
    { kind: "leftBrace", text: "{" },
    { kind: "return", text: "return" },
    { kind: "false", text: "false" },
    { kind: "semicolon", text: ";" },
    { kind: "rightBrace", text: "}" },
    { kind: "integer", text: "10" },
    { kind: "equals", text: "==" },
    { kind: "integer", text: "10" },
    { kind: "semicolon", text: ";" },
    { kind: "integer", text: "10" },
    { kind: "notEquals", text: "!=" },
    { kind: "integer", text: "9" },
    { kind: "semicolon", text: ";" },
    { kind: "eof", text: "\0" },
  ];

  const actual = lex(input);
  expect(actual).toStrictEqual(expected);
});
