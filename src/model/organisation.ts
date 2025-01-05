import { OrganisationTO } from "./to";
import { ValidationError } from "./errors";

export const validateOrganisationTO = async (to: OrganisationTO): Promise<OrganisationTO> => {
  if (to.contactUser === undefined) {
    throw new ValidationError('contactUser is required');
  }
  return to;
};

