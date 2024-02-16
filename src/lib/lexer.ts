import { Token, lookupIdentifier } from "./token";

export class Lexer {
  private _input: string;
  private _position: number;
  private _current: string;
  private _ended: boolean;

  public constructor(input: string) {
    this._input = input;
    this._position = 0;
    this._current = "";
    this._ended = false;
    this.readChar();
  }

  public readChar(): void {
    if (this._position >= this._input.length) {
      this._current = "\0";
    } else {
      this._current = this._input[this._position];
    }
    this._position += 1;
  }

  private peekChar(): string {
    if (this._position >= this._input.length) {
      return "\0";
    } else {
      return this._input[this._position];
    }
  }

  public nextToken(): Token | undefined {
    if (this._ended) return undefined;
    this.skipWhitespace();
    let token: Token;

    switch (this._current) {
      case "=":
        if (this.peekChar() === "=") {
          this.readChar();
          token = { kind: "equals", text: "==" };
        } else {
          token = { kind: "assign", text: "=" };
        }
        break;
      case "!":
        if (this.peekChar() === "=") {
          this.readChar();
          token = { kind: "notEquals", text: "!=" };
        } else {
          token = { kind: "bang", text: "!" };
        }
        break;
      case "+":
        token = { kind: "plus", text: "+" };
        break;
      case "-":
        token = { kind: "minus", text: "-" };
        break;
      case "/":
        token = { kind: "slash", text: "/" };
        break;
      case "*":
        token = { kind: "asterisk", text: "*" };
        break;
      case "<":
        token = { kind: "lessThen", text: "<" };
        break;
      case ">":
        token = { kind: "greaterThen", text: ">" };
        break;
      case ";":
        token = { kind: "semicolon", text: ";" };
        break;
      case ":":
        token = { kind: "colon", text: ":" };
        break;
      case ",":
        token = { kind: "comma", text: "," };
        break;
      case "(":
        token = { kind: "leftParenthesis", text: "(" };
        break;
      case ")":
        token = { kind: "rightParenthesis", text: ")" };
        break;
      case "{":
        token = { kind: "leftBrace", text: "{" };
        break;
      case "}":
        token = { kind: "rightBrace", text: "}" };
        break;
      case "[":
        token = { kind: "leftBracket", text: "[" };
        break;
      case "]":
        token = { kind: "rightBracket", text: "]" };
        break;
      case '"':
        token = this.readString();
        break;
      case "\0":
        this._ended = true;
        token = { kind: "eof", text: "\0" };
        break;
      default: {
        if (isLetter(this._current)) {
          token = this.readIdentifier();
          return token;
        } else if (isNumber(this._current)) {
          token = this.readNumber();
          return token;
        } else {
          token = { kind: "illegal", text: this._current };
          break;
        }
      }
    }
    this.readChar();
    return token;
  }

  skipWhitespace(): void {
    while (isWhitespace(this._current)) {
      this.readChar();
    }
  }

  readIdentifier(): Token {
    const start = this._position - 1;
    while (isLetter(this._current)) {
      this.readChar();
    }
    const text = this._input.substring(start, this._position - 1);
    return lookupIdentifier(text);
  }

  readNumber(): Token {
    const start = this._position - 1;
    while (isNumber(this._current)) {
      this.readChar();
    }
    const text = this._input.substring(start, this._position - 1);
    return { kind: "integer", text };
  }

  readString(): Token {
    const start = this._position;
    this.readChar();
    while (this._current !== '"') {
      this.readChar();
    }
    const text = this._input.substring(start, this._position - 1);
    return { kind: "string", text };
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
