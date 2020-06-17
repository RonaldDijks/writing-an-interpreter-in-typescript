import { Lexer } from "./lexer";
import { Token, TokenKind } from "./token";
import { Program, Statement, LetStatement, Identifier } from "./ast";

export class Parser {
  private _lexer: Lexer;
  private _currentToken!: Token;
  private _peekToken!: Token | undefined;

  public errors: string[];

  public constructor(lexer: Lexer) {
    this._lexer = lexer;
    this.errors = [];
    this._currentToken = lexer.nextToken()!;
    this._peekToken = lexer.nextToken();
  }

  private nextToken() {
    if (!this._peekToken) {
      throw new Error("No more tokens.");
    }
    this._currentToken = this._peekToken;
    this._peekToken = this._lexer.nextToken();
  }

  private currentTokenIs(kind: Token["kind"]): boolean {
    return this._currentToken.kind === kind;
  }

  private peekTokenIs(kind: Token["kind"]): boolean {
    return this._peekToken?.kind === kind;
  }

  private expectPeek(kind: Token["kind"]): boolean {
    if (this.peekTokenIs(kind)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(kind);
      return false;
    }
  }

  private peekError(type: TokenKind) {
    const error = `expected next token to be ${type}, got ${this._peekToken?.kind} instead`;
    this.errors.push(error);
  }

  public parseProgram(): Program | undefined {
    const statements: Statement[] = [];
    while (this._currentToken.kind !== "eof") {
      const statement = this.parseStatement();
      if (statement) statements.push(statement);
      this.nextToken();
    }
    return { statements };
  }

  private parseStatement(): Statement | undefined {
    switch (this._currentToken.kind) {
      case "let":
        return this.parseLetStatement();
      default:
        return undefined;
    }
  }

  private parseLetStatement(): LetStatement | undefined {
    if (!this.expectPeek("identifier")) {
      return undefined;
    }

    const identifier: Identifier = { value: this._currentToken.text };

    if (!this.expectPeek("assign")) {
      return undefined;
    }

    while (this._currentToken.kind !== "semicolon") {
      this.nextToken();
    }

    return { name: identifier, value: identifier };
  }
}
