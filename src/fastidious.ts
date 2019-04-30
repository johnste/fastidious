import { getKeys } from "./utils";
import { IObject, ISchema, Validator, ICheckType } from "./types";
import { createValidator } from "./createValidator";

export function getErrors(object: IObject, schema: ISchema, prefix = "root.") {
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

export const validate = {
  boolean: createValidator("boolean", value => typeof value === "boolean"),
  string: createValidator("string", value => typeof value === "string"),
  number: createValidator("number", value => typeof value === "number" && !Number.isNaN(value)),
  function: createValidator("function", value => typeof value === "function"),
  regex: createValidator("regex", value => value instanceof RegExp),
  value: (expectedValue: any) =>
    createValidator(expectedValue, value => {
      return value === expectedValue;
    }),
  shape: (schema: ISchema) =>
    createValidator("shape", (value, key) => {
      if (typeof value !== "object") {
        return false;
      }

      return getErrors(value, schema, key + ".");
    }),

  arrayOf: (validator: Validator) =>
    createValidator("array", (value, key) => {
      if (!Array.isArray(value)) {
        return false;
      }

      return value.reduce((errors, item, index) => {
        const result = validator(item, `${key}[${index}]`);
        if (typeof result === "string") {
          return [...errors, result];
        }

        return errors;
      }, []);
    }),

  oneOf: (OneOfs: (string | number | ICheckType)[]) => {
    const typeCheckers = OneOfs.map(v => {
      if (["string", "number"].includes(typeof v)) {
        return validate.value(v);
      }
      return v as ICheckType;
    });

    const description = typeCheckers.map(oneOf => oneOf.typeName);

    return createValidator(`oneOf: [${description}]`, (value, key: string) => {
      const errors = typeCheckers.every(
        oneOfValidator => typeof oneOfValidator(value, key) === "string"
      );

      return errors ? [`${key}: Value not one of ${description}`] : true;
    });
  }
};
