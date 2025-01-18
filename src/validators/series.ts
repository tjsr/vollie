import { OrganisationId, SeriesId } from "../model/id";
import { SeriesTO, TransferObject } from "../model/to";

import { DBType } from "../orm/types";
import { validateIdIfRequired } from "./id";

export const validateSeriesBody = async (
  _db: DBType,
  body: Record<string, unknown>,
  isNew: boolean
): Promise<TransferObject<SeriesTO>> => {
  return validateIdIfRequired(body, isNew)
    .then(() => {
      const to: Partial<SeriesTO> = {
        name: body['name'] as string,
        description: body['description'] as string,
        organiser: body['organiser'] as OrganisationId,
      };
      if (body['id'] !== undefined) {
        to.id = body['id'] as SeriesId;
        return to as SeriesTO;
      }
      return to as SeriesTO;
    });
};
