export interface IObject {
  [index: string]: IObject | any;
}

export interface ISchema {
  [index: string]: Validator | number | string;
}

export type Validator = (value: any, key: string) => string | undefined;

export interface ICheckType {
  (value: any, key: string): string | undefined;
  isRequired: Validator;
  typeName: string;
}

export type TypeCallback = (value: any, key: string) => string[] | boolean;
