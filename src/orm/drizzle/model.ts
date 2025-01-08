
export type { User } from "./schema/users.js";
export type { Series } from "./schema/series.js";
export type { Organisation } from './schema/organisations.js';
export type { RaceEvent } from './schema/events.js';

// export type RaceEventsModelType = Omit<RaceEventsTO, 'organiser' | 'series'> & { series: SeriesDBModelType; organiser: OrganisersDBModelType; };export type SeriesDBModelType = Omit<SeriesTO, 'organiser'> & { organiser: OrganisersDBModelType; };
// export type OrganisersDBModelType = Omit<OrganisersTO, 'contactUser'> & { contactUser: User; };

