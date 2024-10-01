import { User as DrizzleUserModel, Organisation, RaceEvent, Series } from '../orm/drizzle/model.js';

export type { Organisation, Series, RaceEvent };

export type User = DrizzleUserModel & {
  organisations: Organisation[];
};

export type PartialOrganisation = Partial<{
  [K in keyof Organisation]: K extends 'contactUser' ? Partial<PartialUser> : Organisation[K];
}>;

export type PartialSeries = Partial<{
  [K in keyof Series]: K extends 'organiser' ? Partial<PartialOrganisation> : Series[K];
}>;

export type PartialUser = Partial<{ 
  [K in keyof User]: K extends 'organisations' ? PartialOrganisation[] : User[K];
}>;
