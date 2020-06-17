import { Token, lookupIdentifier } from "./token";

export class Lexer {
  private input: string;
  private position: number;
  private current: string;
  private ended: boolean;

  public constructor(input: string) {
    this.input = input;
    this.position = 0;
    this.current = "";
    this.ended = false;
    this.readChar();
  }

  public readChar() {
    if (this.position >= this.input.length) {
      this.current = "\0";
    } else {
      this.current = this.input[this.position];
    }
    this.position += 1;
  }

  private peekChar(): string {
    if (this.position >= this.input.length) {
      return "\0";
    } else {
      return this.input[this.position];
    }
  }

  public nextToken(): Token | undefined {
    if (this.ended) return undefined;
    this.skipWhitespace();
    let token: Token;

    switch (this.current) {
      case "=":
        if (this.peekChar() === "=") {
          this.readChar();
          token = { kind: "equals" };
        } else {
          token = { kind: "assign" };
        }
        break;
      case "!":
        if (this.peekChar() === "=") {
          this.readChar();
          token = { kind: "notEquals" };
        } else {
          token = { kind: "bang" };
        }
        break;
      case "+":
        token = { kind: "plus" };
        break;
      case "-":
        token = { kind: "minus" };
        break;
      case "/":
        token = { kind: "slash" };
        break;
      case "*":
        token = { kind: "asterisk" };
        break;
      case "<":
        token = { kind: "lessThen" };
        break;
      case ">":
        token = { kind: "greaterThen" };
        break;
      case ";":
        token = { kind: "semicolon" };
        break;
      case ",":
        token = { kind: "comma" };
        break;
      case "(":
        token = { kind: "leftParenthesis" };
        break;
      case ")":
        token = { kind: "rightParenthesis" };
        break;
      case "{":
        token = { kind: "leftBrace" };
        break;
      case "}":
        token = { kind: "rightBrace" };
        break;
      case "\0":
        this.ended = true;
        token = { kind: "eof" };
        break;
      default: {
        if (isLetter(this.current)) {
          token = this.readIdentifier();
          return token;
        } else if (isNumber(this.current)) {
          token = this.readNumber();
          return token;
        } else {
          token = { kind: "illegal" };
          break;
        }
      }
    }
    this.readChar();
    return token!;
  }
  skipWhitespace() {
    while (isWhitespace(this.current)) {
      this.readChar();
    }
  }
  readIdentifier(): Token {
    const start = this.position - 1;
    while (isLetter(this.current)) {
      this.readChar();
    }
    const text = this.input.substring(start, this.position - 1);
    return lookupIdentifier(text);
  }
  readNumber(): Token {
    const start = this.position - 1;
    while (isNumber(this.current)) {
      this.readChar();
    }
    const text = this.input.substring(start, this.position - 1);
    return { kind: "integer", text };
  }
}

export const lex = (input: string): Token[] => {
  const lexer = new Lexer(input);
  const tokens: Token[] = [];
  let token = lexer.nextToken();
  while (token) {
    tokens.push(token);
    token = lexer.nextToken();
  }
  return tokens;
};

const isNumber = (char: string) => /^[0-9]$/.test(char);
const isLetter = (char: string) => /^[a-zA-Z]$/.test(char);
const isWhitespace = (char: string) => /^\s$/.test(char);
