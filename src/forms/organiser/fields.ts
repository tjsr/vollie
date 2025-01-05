import { RJSFSchema } from "@rjsf/utils";
import { User } from "../../model/entity";
import { getUsersDefinition } from "../schemaDefinitions";

export const createOrgSchema = (users: User[]): RJSFSchema => {
  const definitions = {
    users: getUsersDefinition(users?.length > 0 ? users : [
      {
        email: 'test@example.com',
        firstName: 'Test',
        id: 1,
        lastName: 'User',
        phone: '5551231234',
      }
    ]),
  }
  return {
    title: "Organisation details",
    description: "Organisation information.",
    type: "object",
    required: [
      "entityName",
      "contactUser",
    ],
    definitions: definitions,
    properties: {
      "entityName": {
        "type": "string",
        "title": "Organisation Name",
        "default": "New unnamed organisation"
      },
      "contactUser": {
        "title": "Contact User",
        "$ref": "#/definitions/users"
      }
    }
  }
};