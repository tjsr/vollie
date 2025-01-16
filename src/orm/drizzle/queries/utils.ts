import { Existing } from "../../../model/to";

const cloneDefinedKeys = <T extends object>(source: T, keys: (keyof T)[]): T => {
  const result = {} as T;
  keys.forEach(key => {
    if (key in source) {
      result[key] = source[key];
    }
  });
  return result;
};

export const safeCheckAndCopy = <T extends Existing<object>>(source: T, keys: (keyof T)[]): T => {
  if (source.id === undefined) {
    throw new Error(`Can't update element without an id`);
  }
  const updatedElement: T = cloneDefinedKeys(source,
    keys
  );
  updatedElement.id = source.id;
  return updatedElement;
};
