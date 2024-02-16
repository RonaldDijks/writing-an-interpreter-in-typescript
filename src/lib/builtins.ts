import * as obj from "./object";

export const builtins = new Map<string, obj.Builtin>([
  [
    "puts",
    obj.builtin((args) => {
      args.forEach((arg) => console.log(obj.toString(arg)));
      return obj.NULL;
    }),
  ],
  [
    "len",
    obj.builtin((args) => {
      if (args.length !== 1) {
        return obj.error(
          `wrong number of arguments. got=${args.length}, want=1`
        );
      }

      switch (args[0].kind) {
        case "string":
          return obj.integer(args[0].value.length);
        case "array":
          return obj.integer(args[0].elements.length);
        default:
          return obj.error(
            `argument to \`len\` not supported, got ${args[0].kind}`
          );
      }
    }),
  ],
  [
    "first",
    obj.builtin((args) => {
      if (args.length !== 1) {
        return obj.error(
          `wrong number of arguments. got=${args.length}, want=1`
        );
      }

      if (args[0].kind !== "array") {
        return obj.error(
          `argument to \`first\` must be ARRAY, got ${args[0].kind}`
        );
      }

      const [first] = args[0].elements;
      return first ?? obj.NULL;
    }),
  ],
  [
    "last",
    obj.builtin((args) => {
      if (args.length !== 1) {
        return obj.error(
          `wrong number of arguments. got=${args.length}, want=1`
        );
      }

      if (args[0].kind !== "array") {
        return obj.error(
          `argument to \`last\` must be ARRAY, got ${args[0].kind}`
        );
      }

      const last = args[0].elements[args[0].elements.length - 1];
      return last ?? obj.NULL;
    }),
  ],
  [
    "rest",
    obj.builtin((args) => {
      if (args.length !== 1) {
        return obj.error(
          `wrong number of arguments. got=${args.length}, want=1`
        );
      }

      if (args[0].kind !== "array") {
        return obj.error(
          `argument to \`rest\` must be ARRAY, got ${args[0].kind}`
        );
      }

      const [_, ...rest] = args[0].elements;
      return obj.array(rest);
    }),
  ],
  [
    "push",
    obj.builtin((args) => {
      if (args.length !== 2) {
        return obj.error(
          `wrong number of arguments. got=${args.length}, want=2`
        );
      }

      if (args[0].kind !== "array") {
        return obj.error(
          `argument to \`push\` must be ARRAY, got ${args[0].kind}`
        );
      }

      const elements = [...args[0].elements, args[1]];
      return obj.array(elements);
    }),
  ],
]);
