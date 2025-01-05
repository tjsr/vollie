import { OrganisationIdType, UserIdType, WithId } from "../idTypes";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userReferenceField, userReferenceId } from "./users";

import { idPrimaryKey } from "./types";

export const organiserReferenceId = () => integer("organiser_id").references(() => OrganisationsTable.id);
export const organiserReferenceField = () => organiserReferenceId().$type<Organisation>();

const OrganisationsTableSchema = {
  id: idPrimaryKey(),
  entityName: text("entity_name").notNull(),
  contactUser: userReferenceField("contact_user_id").notNull(),
};

export const OrganisationsTable = sqliteTable('Organisations', OrganisationsTableSchema);

export const OrganisationsTableTO = sqliteTable('Organisations', {
  ...OrganisationsTableSchema,
  contactUser: userReferenceId('contact_user_id').notNull(),
});

export type OrganisationTO = Omit<typeof OrganisationsTable.$inferSelect, 'contactUser'> & { contactUser: UserIdType };
// export type OrganisationTO = typeof OrganisationsTable.$inferSelect & { contactUser: UserIdType };
export type Organisation = WithId<OrganisationIdType, typeof OrganisationsTable.$inferSelect>;
// export type Organisation = WithId<OrganisationIdType, Omit<OrganisationTO, 'contactUser'> & { contactUser: User }>;
