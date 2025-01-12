import { Organisation, PartialOrganisation, User } from "../model/entity";
import { callGenericApiPost, callGenericApiPut, fetchJson, useGenericQuery } from "./util";

import { NewOrganisationTO } from "../model/to";
import { OrganisationId } from "../model/id";
import { useQuery } from "@tanstack/react-query";

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
  return callGenericApiPost('/organisation', organisationFormToOrganisationTO, organisation);
};

export const putOrganisation = async (organisation: Organisation): Promise<Organisation> => {
  return callGenericApiPut(`/organisation/${organisation.id}`, organisationFormToOrganisationTO, organisation);
};

const organisationFormToOrganisationTO = (data: Organisation): NewOrganisationTO => {
  if (!data.contactUser) {
    console.warn('No contact user set for new organisation');
  }
  const to: NewOrganisationTO = {
    entityName: data.entityName,
    contactUser: data.contactUser?.id,
  };
  return to;
};

export const useAllOrganisationsQuery = (currentUser: User|null|undefined) => useQuery({
  queryKey: ['organisations'],
  queryFn: () => {
    console.log('Fetching for All Orgs');
    return fetchOrganisations(currentUser);
  },
});

export const useOrganisationQuery = (
  currentUser: User|null|undefined,
  organisationId: OrganisationId|undefined,
) => useGenericQuery<Organisation, OrganisationId>(
  'organisation',
  'organisation',
  organisationId,
  currentUser,
  fetchOrganisation
);
