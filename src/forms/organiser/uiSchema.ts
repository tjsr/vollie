export const uiSchema = {
  "name": {
    "ui:autofocus": true,
    "ui:placeholder": "A organiser name to be created.",
    "ui:autocomplete": "organiser-name",
    "ui:required": true,
    "ui:enableMarkdownInDescription": true,
    "ui:description": "The short name that will be used to reference this organiser."
  },
  "contactUser": {
    // "type": "Dropdown",
    "ui:required": true,
    "ui:options": {
      "semantic": {
        "options": {
          text: '{firstName} {lastName} ({email})'
        }
      }
    }
  }
};
