import { Token } from "./token";

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

  public nextToken(): Token | undefined {
    if (this.ended) return undefined;
    let token: Token;

    switch (this.current) {
      case "=":
        token = { kind: "assign" };
        break;
      case ";":
        token = { kind: "semicolon" };
        break;
      case "(":
        token = { kind: "leftParenthesis" };
        break;
      case ")":
        token = { kind: "rightParenthesis" };
        break;
      case ",":
        token = { kind: "comma" };
        break;
      case "+":
        token = { kind: "plus" };
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
    }
    this.readChar();
    return token!;
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
