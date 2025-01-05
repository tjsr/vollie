import { Organisation, Series, User } from "../model/entity";

import { RJSFSchema } from "@rjsf/utils";
import { UserId } from "../model/id";

export const getOrganisersDefinition = (organisers: Organisation[]): RJSFSchema => {
  // "organisers": {
  //   "enumNames": [
  //     "GMBC",
  //     "AusCycling"
  //   ],
  //   "enum": [
  //     {
  //       "name": "GMBC",
  //       "id": 1001
  //     },
  //     {
  //       "name": "AusCycling",
  //       "id": 1002
  //     }
  //   ]
  // },
  if (organisers?.length === 0) {
    return undefined;
  }
  return {
    enumNames: organisers.map((o) => o.entityName),
    enum: organisers.map((o) => ({ name: o.entityName, id: o.id }))
  };
};

export const getSeriesDefinition = (series: Series[], organisers: Organisation[]): RJSFSchema => {
  // "series": {
  //   "enumNames": [
  //     "2024 Summer No Frills",
  //     "2024 Summer Dirt Squirts Summer",
  //     "2025 Autumn No Frills",
  //     "2025 Autumn Dirt Squirts",
  //   ],
  //   "enum": [
  //     {
  //       "name": "2024 Summer No Frills",
  //       "id": 2001
  //     },
  //     {
  //       "name": "2024 Summer Dirt Squirts Summer",
  //       "id": 2002
  //     },
  //     {
  //       "name": "2025 Autumn No Frills",
  //       "id": 2003
  //     },
  //     {
  //       "name": "2025 Autumn Dirt Squirts",
  //       "id": 2004
  //     },
  //   ]
  // },
  const orgSeries = series.filter((s: Series) => s.organiser && organisers.map((o) => o.id).includes(s.organiser.id));
  return {
    enumNames: orgSeries.map((s) => s.name),
    enum: orgSeries.map((s) => ({ name: s.name, id: s.id })),
  };
};

type IdentifiableUser = Partial<User> & { firstName: string, lastName: string, id: UserId}; 

export const getUsersDefinition = (users: IdentifiableUser[]): RJSFSchema => {
  if (users?.length === 0) {
    return undefined;
  }
  const fullName = (u: IdentifiableUser): string => `${u.firstName} ${u.lastName}`;
  return {
    enumNames: users.map((u) => fullName(u)),
    enum: users.map((u) => ({ name: fullName(u), id: u.id }))
  };
};
