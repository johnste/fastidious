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

export function enumerate(names: string[], mode: "or" | "and" = "or") {
  if (names.length === 0) {
    return "";
  }

  if (names.length == 1) {
    return names[0];
  }

  const [tail, ...body] = names.reverse();
  return `${body.join(", ")} ${mode} ${tail}`;
}
