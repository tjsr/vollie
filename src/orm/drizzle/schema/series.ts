import { OrganisationsTable, organiserReferenceField, organiserReferenceId } from "./organisations";
import { SeriesIdType, WithId } from "../idTypes";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { idPrimaryKey } from "./types";
import { relations } from "drizzle-orm/relations";

export const seriesReferenceId = () => integer("series_id").references(() => SeriesTable.id);
export const seriesReferenceField = () => seriesReferenceId().$type<Series>();

const seriesFields = {
  id: idPrimaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  organiser: organiserReferenceField(),
};

export const SeriesTable = sqliteTable('Series', seriesFields);
export const SeriesTableTO = sqliteTable('Series', {
  ...seriesFields,
  organiser: organiserReferenceId(),
});

export const SeriesRelations = relations(SeriesTable, ({ one }) => (
  {
    organiser: one(OrganisationsTable, { fields: [SeriesTable.organiser], references: [OrganisationsTable.id] }),
  }
));

// export type SeriesTO = Omit<typeof SeriesTableTO.$inferInsert, 'organiser'> & { organiser: OrganisationIdType | null };
export type SeriesTO = WithId<SeriesIdType, typeof SeriesTableTO.$inferSelect>;
export type Series = WithId<SeriesIdType, typeof SeriesTable.$inferSelect>;
