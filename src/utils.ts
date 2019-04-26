export function isDefined(value: any) {
  return typeof value !== "undefined" && value !== null;
}

export function formatValue(value: any): string {
  if (value instanceof RegExp) {
    return value.toString();
  }

  return JSON.stringify(value);
}

export function getKeys(object: object) {
  return Object.keys(object).filter(key => Object.prototype.hasOwnProperty.call(object, key));
}
