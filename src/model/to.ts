import { OrganisationTO, RaceEventTO, SeriesTO, UserTO } from '../orm/drizzle/types.js';

import { IdType } from './id.js';

// import { EventId, ISO8601Date, OrganiserId, SeriesId, UserId } from './id.js';
// import { UserIdType } from '../orm/drizzle/idTypes.js';

// interface TO<T = number> {
//   id: T;
// }

// export interface UserTO extends TO<UserId> {
//   organisations: number[];  
// }
export type { UserTO, OrganisationTO, RaceEventTO, SeriesTO };

export type Existing<T, TOIdType extends IdType = IdType> = T & { id: TOIdType };
export type TransferObject<T, TOIdType extends IdType = IdType> = T & { id?: TOIdType };
export type Uninitialised<T> = Omit<T, 'id'>;

export type NewRaceEventTO = Uninitialised<RaceEventTO>;
export type NewOrganisationTO = Uninitialised<OrganisationTO>;
export type NewSeriesTO = Uninitialised<SeriesTO>;

// export interface EventTO extends TO<EventId> {
//   name: string;
//   series: SeriesId;
//   startDate: ISO8601Date;
//   endDate: ISO8601Date;
//   location: string;
//   organiser: OrganiserId;
// }