import { RJSFSchema } from "@rjsf/utils";

export const createUserSchema = (): RJSFSchema => {
  return {
    title: "User",
    description: "Create new user.",
    type: "object",
    required: [
      "firstName",
      "lastName",
      "email",
      "phone"
    ],
    properties: {
      "firstName": {
        "type": "string",
        "title": "First name",
        "default": "Joe"
      },
      "lastName": {
        "type": "string",
        "title": "Last name",
        "default": "Bloggs"
      },
      "email": {
        "type": "string",
        "title": "Email",
        "default": ""
      },
      "phone": {
        "type": "string",
        "title": "Phone",
        "default": ""
      }
    }
  }
};
