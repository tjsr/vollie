import { Organisation, PartialOrganisation, PartialSeries, PartialUser, Series, User } from '../../model/entity.js';
import { getOrganisersDefinition, getSeriesDefinition } from '../schemaDefinitions.js';

import { RJSFSchema } from "@rjsf/utils";
import { isUserInOrg } from '../../model/utils.js';

export const createEventSchema = (organisers: PartialOrganisation[], series: PartialSeries[], user: PartialUser): RJSFSchema => {
  const permittedOrgs = organisers.filter((org) => isUserInOrg(user as User, org as Organisation)) as Organisation[];

  return {
    title: "Event details",
    description: "Event information.",
    type: "object",
    required: [
      "name",
      "startDate",
      "endDate",
      "location",
      "organiser",
    ],
    definitions: {
      organisers: getOrganisersDefinition(permittedOrgs),
      series: getSeriesDefinition(series as Series[], permittedOrgs),
    },
    properties: {
      "organiser": {
        "title": "Organiser",
        "$ref": "#/definitions/organisers"
      },
      "name": {
        "type": "string",
        "title": "Name",
        "default": "New unnamed event"
      },
      "series": {
        "title": "Series",
        "$ref": "#/definitions/series"
      },
      "startDate": {
        "type": "string",
        "format": "date",
        "title": "Start date"
      },
      "endDate": {
        "type": "string",
        "format": "date",
        "title": "End date"
      },
      "description": {
        "type": "string",
        "title": "Description"
      },
      "location": {
        "type": "string",
        "title": "Location"
      },
    }
  }
};

// export const schema: RJSFSchema = createSchema(organisers, series, user);

