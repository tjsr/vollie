import { UsersTable, userReferenceField } from "./users.js";
import { primaryKey, sqliteTable } from "drizzle-orm/sqlite-core";

import { organiserReferenceField } from "./organisations.js";
import { relations } from "drizzle-orm";

export const UserOrganisationsTable = sqliteTable('UserOrganisations', {
  userId: userReferenceField().notNull(),
  organiserId: organiserReferenceField().notNull(), /// integer('organiser_id').notNull().references(() => OrganisationsTable.id),
},
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.organiserId] }),
  }),
);

export const UserOrganisationsRelations = relations(UsersTable, ({ many }) => (
  {
    UserOrganisationsTable: many(UserOrganisationsTable),
  }
));
