import { useParams } from "react-router-dom";

export type IntParams<
  ParamsOrKey extends string = string
> = {
  [K in ParamsOrKey]: number | null | undefined;
};

export const useIntOrNewParam = <
  Params extends string = string,
>(): IntParams => {
  const params = useParams<Params>();
  
  const keys = Object.keys(params);
  const result:  IntParams = {} as IntParams<Params>;

  keys.forEach((key: string) => {
    const value = (params as never)[key];

    if (value === 'new') {
      result[key] = null;
    } else if (value === undefined) {
      result[key] = undefined;
    } else {
      try {
        const intId = parseInt(value);
        if (intId > 0) {
          result[key] = intId;
        } else {
          result[key] = undefined;
        }
      } catch (err) {
        result[key] = undefined;
      }
    }
  });
  return result as IntParams;
};