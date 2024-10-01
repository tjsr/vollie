import { Organisation, PartialOrganisation, User } from "../model/entity";
import { fetchJson, genericPost } from "./util";

import { NewOrganisationTO } from "../model/to";
import { OrganisationId } from "../model/id";

export const organisers: PartialOrganisation[] = [
  {
    id: 1001,
    entityName: "GMBC",
    contactUser: {
      id: 1,
    },
  },
  {
    id: 1002,
    entityName: "AusCycling",
    contactUser: {
      id: 2,
    },
  }
];

export const fetchOrganisations = async (currentUser: User|undefined|null): Promise<Organisation[]> => {
  return fetchJson(`/organisations`, currentUser);
};

export const fetchOrganisation = async (organisationId: OrganisationId, currentUser: User|undefined|null): Promise<Organisation> => {
  return fetchJson(`/organisation/${organisationId}`, currentUser);
}

export const postOrganisation = async (organisation: Organisation): Promise<Organisation> => {
  return genericPost('/organisation', organisationFormToOrganisationTO, organisation);
};

const organisationFormToOrganisationTO = (data: Organisation): NewOrganisationTO => {
  const to: NewOrganisationTO = {
    entityName: data.entityName,
    contactUser: data.contactUser.id,
  };
  return to;
};