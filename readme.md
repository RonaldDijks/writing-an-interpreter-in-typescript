# Monkey Language Interpreter in TypeScript

This repository contains an implementation of the Monkey programming language interpreter in TypeScript, inspired by the book "Writing an Interpreter in Go" by Thorsten Ball. Monkey is a simple programming language designed for learning purposes, and this interpreter allows you to parse and execute Monkey code.

## Features

- Lexer: Tokenizes Monkey source code into meaningful tokens.
- Parser: Parses the tokens into an Abstract Syntax Tree (AST).
- Evaluator: Evaluates the AST and executes the Monkey code.
- REPL (Read-Eval-Print Loop): Interactive shell for executing Monkey code line by line.
- Support for basic data types and operations including integers, booleans, strings, arrays, and hash maps.
- Control flow statements such as conditionals and looping constructs.

## Getting Started

Follow these steps to get a copy of the Monkey language interpreter up and running on your local machine.

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository to your local machine:

```
git clone https://github.com/ronalddijks/writing-an-interpreter-in-typescript.git
```

2. Navigate to the project directory:

```
cd writing-an-interpreter-in-typescript
```

3. Install dependencies:

```
yarn install
```

### Usage

#### Running the REPL (Read-Eval-Print Loop)

To start the interactive shell, simply run:

```
yarn start --repl
```

This will launch the Monkey REPL where you can type and execute Monkey code.

#### Executing Monkey Scripts

You can also execute Monkey scripts stored in files. For example, to execute a Monkey script named `example.monkey`, run:

```
yarn start example.monkey
```

Replace `example.monkey` with the path to your Monkey script.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, feel free to open a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thorsten Ball for writing the book "Writing an Interpreter in Go" and creating the Monkey programming language.
- The TypeScript community for their excellent resources and support.

---

**Note:** This implementation is for educational purposes and may not be suitable for production use.
