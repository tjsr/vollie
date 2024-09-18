import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const OrganisationRoles = sqliteTable('OrganisationRoles', {
  id: integer('id').primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const Accreditations = sqliteTable('Accreditations', {
  id: integer('id').primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const AccreditationFields = sqliteTable('AccreditationFields', {
  id: integer('id').primaryKey(),
  accreditation: integer('accreditation_id').$type<"Accreditations">().notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  fieldType: text("field_type").notNull(),
});



