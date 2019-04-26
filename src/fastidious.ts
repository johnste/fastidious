import { getKeys } from "./utils";
import { IObject, ISchema } from "./types";
import { validate } from "./validators";

export function fastidious(object: IObject, schema: ISchema, prefix = "root.") {
  const schemaKeys = getKeys(schema);
  const errors: string[] = [];

  // Validate each property in schema
  schemaKeys.forEach(key => {
    const propChecker = schema[key];
    let result: string | undefined;
    if (typeof propChecker === "function") {
      result = propChecker(object[key], prefix + key);
    } else if (["string", "number"].includes(typeof propChecker)) {
      result = validate.value(propChecker)(object[key], prefix + key);
    } else {
      result = `Expected a validator at key ${prefix + key}`;
    }

    if (typeof result === "string") {
      errors.push(result);
    }
  });

  // Check for extraneous properties in object
  getKeys(object).forEach(key => {
    if (!schemaKeys.includes(key)) {
      errors.push("extraneous key " + prefix + key);
    }
  });

  return errors;
}
