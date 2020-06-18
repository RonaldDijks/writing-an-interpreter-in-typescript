import { Lexer } from "./lexer";
import { Token, TokenKind } from "./token";
import * as ast from "./ast";

type PrefixParserFunction = () => ast.Expression;
type InfixParserFunction = (_: ast.Expression) => ast.Expression;

export enum Precedence {
  Lowest = 0,
  Equals = 1,
  LessGreater = 2,
  Sum = 3,
  Product = 4,
  Prefix = 5,
  Call = 6,
}

export class Parser {
  private _lexer: Lexer;
  private _currentToken!: Token;
  private _peekToken!: Token | undefined;
  private _prefixParseFunctions: Map<TokenKind, PrefixParserFunction>;
  private _infixParseFunctions: Map<TokenKind, InfixParserFunction>;

  public errors: string[];

  public constructor(lexer: Lexer) {
    this._lexer = lexer;
    this.errors = [];
    this._prefixParseFunctions = new Map();
    this._prefixParseFunctions.set(
      "identifier",
      this.parseIdentifier.bind(this)
    );
    this._infixParseFunctions = new Map();
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

  public parseProgram(): ast.Program | undefined {
    const statements: ast.Statement[] = [];
    while (this._currentToken.kind !== "eof") {
      const statement = this.parseStatement();
      if (statement) statements.push(statement);
      this.nextToken();
    }
    return ast.program(statements);
  }

  private parseStatement(): ast.Statement | undefined {
    switch (this._currentToken.kind) {
      case "let":
        return this.parseLetStatement();
      case "return":
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  private parseLetStatement(): ast.LetStatement | undefined {
    if (!this.expectPeek("identifier")) {
      return undefined;
    }

    const name = ast.identifier(this._currentToken.text);

    if (!this.expectPeek("assign")) {
      return undefined;
    }

    while (!this.currentTokenIs("semicolon")) {
      this.nextToken();
    }

    return ast.letStatement(name, ast.identifier("placeholder"));
  }

  private parseReturnStatement(): ast.ReturnStatement | undefined {
    this.nextToken();

    while (!this.currentTokenIs("semicolon")) {
      this.nextToken();
    }

    return ast.returnStatement(ast.identifier("placeholder"));
  }

  private parseExpressionStatement(): ast.ExpressionStatement | undefined {
    const expression = this.parseExpression(Precedence.Lowest);

    if (!expression) return undefined;

    while (this.peekTokenIs("semicolon")) {
      this.nextToken();
    }

    return { kind: "expressionStatement", expression };
  }

  private parseExpression(precedence: Precedence): ast.Expression | undefined {
    const prefix = this._prefixParseFunctions.get(this._currentToken.kind);
    if (!prefix) return undefined;
    const leftExpression = prefix();
    return leftExpression;
  }

  private parseIdentifier(): ast.Identifier {
    return { kind: "identifier", value: this._currentToken.text };
  }
}
