import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { idPrimaryKey } from "./types";

export const accreditationReference = () => integer('accreditation_id').$type<Accreditation>();

export const AccreditationsTable = sqliteTable('Accreditations', {
  id: idPrimaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});
export type AccreditationsTO = typeof AccreditationsTable.$inferSelect;
export type Accreditation = AccreditationsTO;

export const AccreditationFieldsTable = sqliteTable('AccreditationFields', {
  id: idPrimaryKey(),
  accreditation: accreditationReference().notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  fieldType: text("field_type").notNull(),
});
export type AccreditationFields = Omit<typeof AccreditationFieldsTable.$inferSelect, 'accreditation'> & { accreditation: Accreditation };
