import { OrganisationsTable, organiserReferenceField, organiserReferenceId } from './organisations';
import { RaceEventsIdType, WithId } from '../idTypes';
import { SeriesTable, seriesReferenceField, seriesReferenceId } from './series';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { idPrimaryKey } from './types';
import { relations } from 'drizzle-orm';

export const raceEventId = () => integer('event_id');
export const raceEventField = () => raceEventId().$type<RaceEvent>();

const EventsTableSchema = {
  id: idPrimaryKey(),
  name: text("name").notNull(),
  series: seriesReferenceField(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  organiser: organiserReferenceField().notNull(),
};

export const EventsTableTO = sqliteTable('Events', {
  ...EventsTableSchema,
  series: seriesReferenceId(),
  organiser: organiserReferenceId().notNull(),
});

// type eventInsert = typeof EventsTable.$inferInsert;
// type eventInsert2 = InferInsertModel<typeof EventsTableTO>;

// EventsTable._.columns.id.columnType.
export const EventsTable = sqliteTable('Events', EventsTableSchema);

export const RaceEventsRelations = relations(EventsTable, ({ one }) => (
  {
    organiser: one(OrganisationsTable, { fields: [EventsTable.organiser], references: [OrganisationsTable.id] }),
    series: one(SeriesTable, { fields: [EventsTable.series], references: [SeriesTable.id] }),
  }
));

// export type RaceEvent = typeof EventsTable.$inferSelect;
// export type RaceEventTO = typeof EventsTableTO.$inferSelect; // Omit<typeof events.$inferSelect, 'organiser' | 'series'> & { series: SeriesId|null, organiser: OrganiserId };
export type RaceEventTO = WithId<RaceEventsIdType, typeof EventsTableTO.$inferSelect>;
//export type RaceEvent = WithRefId<'organiser', OrganisationIdType, WithRefId<'series', SeriesIdType, WithId<RaceEventsIdType, typeof EventsTable.$inferSelect>>>;
export type RaceEvent = WithId<RaceEventsIdType, typeof EventsTable.$inferSelect>;

// export type oldRaceEventTO = typeof EventsTable.$inferSelect;
// export type oldRaceEvent = Omit<typeof EventsTable.$inferSelect, 'organiser' | 'series'> & { series: Series, organiser: Organisation };
