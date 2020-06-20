import * as ast from "./ast";

test("test nodeToString", () => {
  const program = ast.program(
    ast.blockStatement([
      ast.letStatement(ast.identifier("myVar"), ast.identifier("anotherVar")),
    ])
  );
  const repr = ast.toString(program);
  expect(repr).toBe("let myVar = anotherVar;");
});
