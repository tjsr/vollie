import { EventsTable } from "./schema/events.js";
import { IdType } from "./schema/types.js";
import { OrganisationsTable } from "./schema/organisations.js";
import { SeriesTable } from "./schema/series.js";
import { UsersTable } from "./schema/users.js";

export type RaceEventsIdType = typeof EventsTable.$inferSelect['id'] & IdType;
export type OrganisationIdType = typeof OrganisationsTable.$inferSelect['id'] & IdType;
export type SeriesIdType = typeof SeriesTable.$inferSelect['id'] & IdType;
export type UserIdType = typeof UsersTable.$inferSelect['id'] & IdType;
// export type WithId<IdType, T> = Omit<T, 'id'> & { id: IdType };
export type WithId<IdType, T> = T & { id: IdType };
export type WithRefId<Key extends string, IdType, T> = Omit<T, Key> & { [K in Key]: IdType };
