import { Lexer } from "./lexer";
import { Token, TokenKind } from "./token";
import * as ast from "./ast";

type PrefixParserFunction = () => ast.Expression | undefined;
type InfixParserFunction = (_: ast.Expression) => ast.Expression | undefined;

export enum Precedence {
  Lowest = 0,
  Equals = 1,
  LessGreater = 2,
  Sum = 3,
  Product = 4,
  Prefix = 5,
  Call = 6,
}

const precedences = new Map<TokenKind, number>([
  ["equals", Precedence.Equals],
  ["notEquals", Precedence.Equals],
  ["lessThen", Precedence.LessGreater],
  ["greaterThen", Precedence.LessGreater],
  ["plus", Precedence.Sum],
  ["minus", Precedence.Sum],
  ["slash", Precedence.Product],
  ["asterisk", Precedence.Product],
]);

export class Parser {
  private _lexer: Lexer;
  private _currentToken!: Token;
  private _peekToken!: Token | undefined;

  private _prefixParseFunctions = new Map<TokenKind, PrefixParserFunction>([
    ["integer", this.parseIntegerLiteral.bind(this)],
    ["true", this.parseBooleanLiteral.bind(this)],
    ["false", this.parseBooleanLiteral.bind(this)],
    ["identifier", this.parseIdentifier.bind(this)],
    ["bang", this.parsePrefixExpression.bind(this)],
    ["minus", this.parsePrefixExpression.bind(this)],
    ["leftParenthesis", this.parseGroupedExpression.bind(this)],
  ]);

  private _infixParseFunctions = new Map<TokenKind, InfixParserFunction>([
    ["plus", this.parseInfixExpression.bind(this)],
    ["minus", this.parseInfixExpression.bind(this)],
    ["slash", this.parseInfixExpression.bind(this)],
    ["asterisk", this.parseInfixExpression.bind(this)],
    ["equals", this.parseInfixExpression.bind(this)],
    ["notEquals", this.parseInfixExpression.bind(this)],
    ["lessThen", this.parseInfixExpression.bind(this)],
    ["greaterThen", this.parseInfixExpression.bind(this)],
  ]);

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

  private currentPrecedence(): Precedence {
    const precedence = precedences.get(this._currentToken.kind);
    return precedence ?? Precedence.Lowest;
  }

  private peekPrecedence(): Precedence {
    const precedence = this._peekToken && precedences.get(this._peekToken.kind);
    return precedence ?? Precedence.Lowest;
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
      return;
    }

    const name = ast.identifier(this._currentToken.text);

    if (!this.expectPeek("assign")) {
      return;
    }

    this.nextToken();

    const expr = this.parseExpression(Precedence.Lowest);

    while (!this.currentTokenIs("semicolon")) {
      this.nextToken();
    }

    return ast.letStatement(name, expr!);
  }

  private parseReturnStatement(): ast.ReturnStatement | undefined {
    this.nextToken();

    const expression = this.parseExpression(Precedence.Lowest);

    while (!this.currentTokenIs("semicolon")) {
      this.nextToken();
    }

    return ast.returnStatement(expression!);
  }

  private parseExpressionStatement(): ast.ExpressionStatement | undefined {
    const expression = this.parseExpression(Precedence.Lowest);
    if (!expression) return undefined;
    while (this.peekTokenIs("semicolon")) {
      this.nextToken();
    }
    return ast.expressionStatement(expression);
  }

  private parseIdentifier(): ast.Identifier | undefined {
    return ast.identifier(this._currentToken.text);
  }

  private parseIntegerLiteral(): ast.IntegerLiteral | undefined {
    const value = Number(this._currentToken.text);
    if (value === NaN) {
      this.errors.push(`could not parse ${this._currentToken.text} as integer`);
      return undefined;
    }
    return ast.integerLiteral(value);
  }

  private parseBooleanLiteral(): ast.BooleanLiteral | undefined {
    return ast.booleanLiteral(this._currentToken.kind === "true");
  }

  private parseExpression(precedence: Precedence): ast.Expression | undefined {
    const prefix = this._prefixParseFunctions.get(this._currentToken.kind);
    if (!prefix) {
      this.errors.push(`no prefix parse fn for ${this._currentToken.kind}`);
      return;
    }
    let leftExpr = prefix()!;
    while (
      !this.peekTokenIs("semicolon") &&
      precedence < this.peekPrecedence()
    ) {
      const infix = this._infixParseFunctions.get(this._peekToken?.kind!);
      if (!infix) return leftExpr;
      this.nextToken();
      leftExpr = infix(leftExpr)!;
    }
    return leftExpr;
  }

  private parsePrefixExpression(): ast.PrefixExpression | undefined {
    const operator = this._currentToken.text;
    this.nextToken();
    const right = this.parseExpression(Precedence.Prefix);
    if (!right) return undefined;
    return ast.prefixExpression(operator, right);
  }

  private parseInfixExpression(
    left: ast.Expression
  ): ast.InfixExpression | undefined {
    const operator = this._currentToken.text;
    const precedence = this.currentPrecedence();
    this.nextToken();
    const right = this.parseExpression(precedence);
    if (!right) return;
    return ast.infixExpression(operator, left, right);
  }

  private parseGroupedExpression(): ast.Expression | undefined {
    this.nextToken();
    const expression = this.parseExpression(Precedence.Lowest);
    if (!this.expectPeek("rightParenthesis")) {
      return;
    }
    return expression;
  }
}
