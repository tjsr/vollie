import { SeriesTO, SeriesTable, SeriesTableTO } from "../schema/series";

import { CreateFunction } from "../../../functionUtils";
import { Existing } from "../../../model/to";
import { OrganisationsTable } from "../schema/organisations";
import { Series } from "../model";
import { SeriesId } from "../../../model/id";
import { SeriesIdType } from "../idTypes";
import { VollieDatabaseError } from "../../errors";
import { VollieDrizzleConnection } from "../../types";
import { eq } from "drizzle-orm";
import { safeCheckAndCopy } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const seriesSelectToSeriesType = (result: any): Series => ({
  ...result.series,
  organiser: result.organiser,
});

const seriesSelectJoined = (db: VollieDrizzleConnection) => db
  .select({ series: SeriesTable, organiser: OrganisationsTable })
  .from(SeriesTable)
  .leftJoin(OrganisationsTable, eq(SeriesTable.organiser, OrganisationsTable.id));
const seriesSelectById = (db: VollieDrizzleConnection, id: number) => seriesSelectJoined(db).where(eq(SeriesTable.id, id));
export const seriesSelectAll = (db: VollieDrizzleConnection) => db.query.SeriesTable.findMany({ with: { organiser: true },  });

export const selectSeriesById = async (db: VollieDrizzleConnection, id: SeriesIdType): Promise<Series|undefined> => {
  const resultPromise = seriesSelectById(db, id).then((result) => {
    if (result.length > 1) {
      throw new VollieDatabaseError(`Database query for event with id ${id} returned more than one result`);
    }
  
    if (result.length === 0) {
      console.debug('No seriesId found', id);
      return undefined;
    }
    const series: Series = seriesSelectToSeriesType(result[0]);
    console.debug('Returned seriesId', series.id);
    return series;
  });
  
  return resultPromise;
};

export const selectSeries = async (db: VollieDrizzleConnection): Promise<Series[]> => {
  // const dbSelect = eventSelect(db);
  // return eventSelectJoined(db);
  const resultPromise = seriesSelectAll(db).then((result) => {
    return result.map((r) => seriesSelectToSeriesType(r));
  });
  return resultPromise;
};


export const createSeries: CreateFunction<SeriesTO> = async (db: VollieDrizzleConnection, event: SeriesTO): Promise<Existing<SeriesTO>> => {
  return db.insert(SeriesTableTO).values(event).returning().then((result) => {
    if (result.length > 1) {
      throw new Error('Returned multiple results from insert');
    }
    console.log(`Created series with id ${result[0].id}`);
    return result[0];
  });
};


export const updateSeries = async (db: VollieDrizzleConnection, series: Existing<SeriesTO>): Promise<SeriesId> => {
  const updateSeries: Partial<SeriesTO> = safeCheckAndCopy(series,
    ['name', 'description', 'organiser']
  );
  return db.update(SeriesTableTO)
    .set(series)
    .where(eq(SeriesTableTO.id, updateSeries.id!))
    .returning({ id: SeriesTableTO.id })
    .then((result) => {
  
    if (result.length > 1) {
      throw new Error('Returned multiple results from insert');
    }
    console.log(`Updated series with id ${result[0].id}`);
    return result[0].id;
  });
};
