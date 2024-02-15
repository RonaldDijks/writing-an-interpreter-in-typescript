import fs from "node:fs/promises";
import readline from "readline";
import * as env from "./lib/environment";
import * as evaluator from "./lib/evaluator";
import { Lexer } from "./lib/lexer";
import * as obj from "./lib/object";
import { Parser } from "./lib/parser";

main();

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help")) {
    console.log("Usage: monkey [--help] [--repl] [file]");
    return;
  }

  if (args.includes("--repl")) {
    repl();
    return;
  }

  if (args.length === 0) {
    console.error("Error: No input files");
    return;
  }

  if (args.length > 1) {
    console.error("Error: Too many input files");
    return;
  }

  await file(args[0]);
}

async function file(filename: string) {
  const source = await fs.readFile(filename, "utf-8");
  const lexer = new Lexer(source);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();
  if (!program) throw new Error("Expected program");
  if (parser.errors.length) {
    console.log(parser.errors);
  } else {
    const environment = new env.Environment();
    const evaluated = evaluator.evaluate(program, environment);
    if (evaluated) {
      console.log(obj.toString(evaluated));
    }
  }
}

function repl() {
  const environment = new env.Environment();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
  });

  rl.prompt();

  rl.on("line", (input) => {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    if (!program) throw new Error("Expected program");
    if (parser.errors.length) {
      console.log(parser.errors);
    } else {
      const evaluated = evaluator.evaluate(program, environment);
      if (evaluated) {
        console.log(obj.toString(evaluated));
      }
    }

    rl.prompt();
  });
}
