
export const uiSchema = {
  "name": {
    "ui:autofocus": true,
    "ui:emptyValue": "",
    "ui:placeholder": "ui:emptyValue causes this field to always be valid despite being required",
    "ui:autocomplete": "event-name",
    "ui:enableMarkdownInDescription": true,
    "ui:description": "The short name that will be used to reference this event."
  },
  "startDate": {
    "ui:widget": "date",
    "ui:options": {
      "yearsRange": [
        2024,
        2030
      ]
    },
    "ui:description": "First day on which this event will take place."
  },
  "endDate": {
    "ui:widget": "date",
    "ui:options": {
      "yearsRange": [
        2024,
        2030
      ]
    },
    "ui:description": "Final day which the event concludes."
  }
};
