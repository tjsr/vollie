import { DBType } from "../orm/types";
import { RaceEventTO } from "../model/to";
import { validateIdIfRequired } from "./id";

export const validateEventBody = async (
  _db: DBType,
  body: Record<string, unknown>,
  isNew: boolean
): Promise<RaceEventTO> => {
    return validateIdIfRequired(body, isNew)
      .then(() => {  
    const to: Partial<RaceEventTO> = {
      ...body,
    };
    return to as RaceEventTO;
  });
};
