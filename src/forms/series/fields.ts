import { Organisation, PartialOrganisation, PartialUser, User } from "../../model/entity";

import { RJSFSchema } from "@rjsf/utils";
import { getOrganisersDefinition } from "../schemaDefinitions";
import { isUserInOrg } from "../../model/utils";

export const createSeriesSchema = (organisers: PartialOrganisation[], user: PartialUser): RJSFSchema => {
  const permittedOrgs = organisers.filter((org) => isUserInOrg(user as User, org as Organisation)) as Organisation[];
  const organisersDefinitions = getOrganisersDefinition(permittedOrgs);
  const definitions = organisersDefinitions ? { organisers: organisersDefinitions } : { name: 'None', id: -1 };
  const organiserRefProperty = organisersDefinitions ? { "$ref": "#/definitions/organisers" } : { "editable": false, "type": "string", "enum": [] };

  return {
    title: "Series details",
    description: "Series information.",
    type: "object",
    required: [
      "name",
    ],
    definitions: definitions,
    properties: {
      "organiser": {
        ...organiserRefProperty,
        "title": "Organiser",
      },
      "name": {
        "type": "string",
        "title": "Name",
        "default": "New unnamed series"
      },
      "description": {
        "type": "string",
        "title": "Description"
      },
    }
  }
};