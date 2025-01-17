import { DBType } from "../orm/types";
import { OrganisationId } from "../model/id";
import { OrganisationTO } from "../model/to";
import { UserNotFoundError } from "../errors";
import { selectUserById } from "../orm/users";
import { validateId } from "./id";
import { validateIdIfRequired } from "../../functions/api/generic";
import { validateOrganisationTO } from "../model/organisation";

export const validateOrganisationId = (idParam: string | string[]): number => {
  return validateId<OrganisationId>(idParam, false);
};

/**
 * @throws ValidationError
 */
export const validateOrganisationBody = async (db: DBType, body: Record<string, unknown>, newObject: boolean): Promise<OrganisationTO> => {
  const to: Partial<OrganisationTO> = {
    ...body,
  };
  return validateIdIfRequired(body, newObject)
    .then(() => validateOrganisationTO(to as OrganisationTO))
    .then((to: OrganisationTO) => selectUserById(db, to.contactUser).then((user) => {
      if (user) {
        return to;
      }
      throw new UserNotFoundError(`User ${to.contactUser} not found`);
    }));
};
