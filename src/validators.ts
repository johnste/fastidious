import { createValidator } from "./createValidator";
import { ISchema, Validator, ICheckType } from "./types";
import { fastidious } from ".";

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

      return fastidious(value, schema, key + ".");
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
