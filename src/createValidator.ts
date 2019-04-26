import { isDefined, formatValue } from "./utils";
import { TypeCallback, ICheckType } from "./types";

export function createValidator(typeName: string, typeCallback: TypeCallback): ICheckType {
  function isOptional(value: any, key: string) {
    if (!isDefined(value)) {
      return undefined;
    }

    const result = typeCallback(value, key);
    if (typeof result === "boolean" && !result) {
      return `Value at ${key}: ${formatValue(value)} is not ${typeName}`;
    } else if (Array.isArray(result) && result.length > 0) {
      return result.join(", ");
    }
  }

  function isRequired(value: any, key: string) {
    if (!isDefined(value)) {
      return `Expected "${key}" to be ${typeName}`;
    }
    return isOptional(value, key);
  }

  function checkType(value: any, key: string) {
    return isOptional(value, key);
  }

  checkType.isRequired = isRequired;
  // Save typeName for nice error messages
  checkType.typeName = typeName;

  return checkType;
}
