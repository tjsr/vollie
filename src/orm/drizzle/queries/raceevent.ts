import { EventsTable, EventsTableTO, RaceEvent, RaceEventTO } from "../schema/events.js";

import { EventId } from "../../../model/id.js";
import { Existing } from "../../../model/to.js";
import { OrganisationsTable } from "../schema/organisations.js";
import { SeriesTable } from "../schema/series.js";
import { VollieDatabaseError } from "../../errors.js";
import { VollieDrizzleConnection } from '../../../types.js';
import { eq } from "drizzle-orm";
import { safeCheckAndCopy } from "./utils.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const eventSelectToEventType = (result: any): RaceEvent => ({
    ...result.events,
    series: result.series,
    organiser: result.organiser,
  });

// const eventSelect = (db: DrizzleD1Database) => db.select({ events: EventsTable, series: SeriesTable, organiser: OrganisationsTable }).from(EventsTable).leftJoin(SeriesTable, );
const eventSelectJoined = (db: VollieDrizzleConnection) => db
  .select({ events: EventsTable, series: SeriesTable, organiser: OrganisationsTable })
  .from(EventsTable)
  .leftJoin(SeriesTable, eq(EventsTable.series, SeriesTable.id))
  .leftJoin(OrganisationsTable, eq(EventsTable.organiser, OrganisationsTable.id));
const eventSelectById = (db: VollieDrizzleConnection, id: number) => eventSelectJoined(db).where(eq(EventsTable.id, id));
const eventSelectAll = (db: VollieDrizzleConnection) => db.query.EventsTable.findMany({ with: { series: true, organiser: true },  });
  // .select({ events: EventsTable, series: SeriesTable, organiser: OrganisationsTable })
  // .from(EventsTable)
  // .leftJoin(SeriesTable, eq(EventsTable.series, SeriesTable.id))
  // .leftJoin(OrganisationsTable, eq(EventsTable.organiser, OrganisationsTable.id));

export const selectEventById = async (db: VollieDrizzleConnection, id: number): Promise<RaceEvent|undefined> => {
  const resultPromise = eventSelectById(db, id).then((result) => {
    if (result.length > 1) {
      throw new VollieDatabaseError(`Database query for event with id ${id} returned more than one result`);
    }
  
    if (result.length === 0) {
      return undefined;
    }
    const event: RaceEvent = eventSelectToEventType(result[0]);
    return event;
  });
  
  return resultPromise;
};

export const selectEvents = async (db: VollieDrizzleConnection): Promise<RaceEvent[]> => {
  // const dbSelect = eventSelect(db);
  // return eventSelectJoined(db);
  const resultPromise = eventSelectAll(db).then((result) => {
    return result.map((r) => eventSelectToEventType(r));
  });
  return resultPromise;
}

export const createEvent = async (db: VollieDrizzleConnection, event: RaceEventTO): Promise<RaceEventTO> => {
  return db.insert(EventsTableTO).values(event).returning().then((result) => {
    if (result.length > 1) {
      throw new Error('Returned multiple results from insert');
    }
    console.log(`Created event with id ${result[0].id}`);
    return result[0];
  });
};

export const updateEvent = async (db: VollieDrizzleConnection, event: Existing<RaceEventTO>): Promise<EventId> => {
  const updateEvent: Partial<RaceEventTO> = safeCheckAndCopy(event,
    ['name', 'series', 'startDate', 'endDate', 'location', 'description', 'organiser']
  );
  return db.update(EventsTableTO)
    .set(event)
    .where(eq(EventsTableTO.id, updateEvent.id!))
    .returning({ id: EventsTableTO.id })
    .then((result) => {
  
    if (result.length > 1) {
      throw new Error('Returned multiple results from insert');
    }
    console.log(`Updated event with id ${result[0].id}`);
    return result[0].id;
  });
};

export type { RaceEvent };