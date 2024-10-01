import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { idPrimaryKey } from "./types.js";

export const OrganisationRolesTable = sqliteTable('OrganisationRoles', {
  id: idPrimaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});
export type OrganisationRoles = typeof OrganisationRolesTable.$inferSelect;



