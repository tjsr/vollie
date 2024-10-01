import * as VollieDrizzleSchema from './schema/index.js';

// export { EventsTable, SeriesTable } from './schema/events.js';
// import { events, organisers, series } from './schema/index.js';
import { EventsTable as events, OrganisationsTable as organisers, SeriesTable as series } from './schema/index.js';

// export { OrganisationsTable } from './schema/organisations.js';
export type { OrganisationTO } from './schema/organisations.js';

export { UsersTable } from './schema/users.js';

export type { RaceEventTO } from './schema/events.js';
export type { SeriesTO } from './schema/series.js';
export type { UserTO } from './schema/users.js';

export { VollieDrizzleSchema };

export interface VollieDB {
  events: typeof events;
  series: typeof series;
  organisers: typeof organisers;
  // raceEventsRequiredRoles: typeof RaceEventRequiredRolesTable;
}

// export type VollieSchema = {
//   EventsTable: typeof events;
//   SeriesTable: typeof series;
//   OrganisationsTable: typeof organisers;
// };


// export type UserDBO = typeof UsersTable.$inferSelect;

// export type OrganiserDBO = Omit<typeof OrganiserDB.$inferSelect, 'contactUser'> & { contactUser: UserDBO };

// export type RaceEventDBO = typeof EventsTable.$inferSelect; // Omit<typeof Events.$inferSelect, 'organiser' | 'series'> & { series: SeriesType, organiers: OrganiserType };

// export type SeriesDBO = Omit<typeof SeriesTable.$inferSelect, 'organiser'> & { organiser: OrganiserDBO };

