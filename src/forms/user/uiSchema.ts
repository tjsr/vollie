export const uiSchema = {
  "firstName": {
    "ui:autofocus": true,
    "ui:description": "User first name.",
    "ui:enableMarkdownInDescription": false,
    "ui:required": true,
  },
  "lastName": {
    "ui:autofocus": true,
    "ui:description": "User last name.",
    "ui:enableMarkdownInDescription": false,
    "ui:required": true
  },
  "email": {
    "ui:autofocus": true,
    "ui:description": "User email.",
    "ui:enableMarkdownInDescription": false,
    "ui:required": true,
    "ui:widget": "email"
  },
  "phone": {
    "ui:options": {
      "inputType": "tel"
    }
  }
};
