import { RJSFSchema } from "@rjsf/utils";

export const createUserSchema = (): RJSFSchema => {
  return {
    title: "User",
    description: "Create new user.",
    type: "object",
    required: [
      "firstName",
      "surname",
    ],
    properties: {
      "firstName": {
        "type": "string",
        "title": "First name",
        "default": "Joe"
      },
      "surname": {
        "type": "string",
        "title": "Surname",
        "default": "Bloggs"
      }
    }
  }
};