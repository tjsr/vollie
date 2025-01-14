import { OrganisationIdType, RaceEventsIdType, SeriesIdType, UserIdType } from "../orm/drizzle/idTypes";

export type IdType = number;
export type EventId = RaceEventsIdType;
export type OrganisationId = OrganisationIdType;
export type SeriesId = SeriesIdType;
export type UserId = UserIdType;
export type ISO8601Date = string;
export type ModelType<Id extends IdType = IdType, T = unknown> = Omit<T, 'id'> & { id?: Id };

type IsStringCompatible<T> = T extends string ? true : false;

export const validateId = <T extends IdType>(idParam: string | string[], raw = true): T => {
  if (idParam === undefined) {
    throw new Error('Missing id param');
  } else if (Array.isArray(idParam)) {
    throw new Error('Invalid id param format');
  }

  if (raw) {
    return idParam as unknown as T;
  }
  type Check = IsStringCompatible<T>;
  const isStringCompatible: Check = true as Check;
  if (isStringCompatible) {
    return idParam as unknown as T;
  }

  const id: number = parseInt(idParam);
  if (isNaN(id) || id < 0) {
    throw new Error('Invalid id');
  }

  return id as T;
};
