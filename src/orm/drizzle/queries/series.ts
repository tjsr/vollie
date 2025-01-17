import { Existing, Uninitialised } from "../../../model/to";
import { SeriesTO, SeriesTable, SeriesTableTO } from "../schema/series";

import { CreateFunction } from "./types";
import { OrganisationsTable } from "../schema/organisations";
import { Series } from "../model";
import { SeriesId } from "../../../model/id";
import { SeriesIdType } from "../idTypes";
import { VollieDBConnection } from "../../types";
import { VollieDatabaseError } from "../../errors";
import { VollieDrizzleConnection } from "../types";
import { eq } from "drizzle-orm";
import { safeCheckAndCopy } from "./utils";

type SeriesSelectByIdResult = Awaited<ReturnType<typeof seriesSelectById>>;
type SeriesSelectByIdResultItem = SeriesSelectByIdResult extends Array<infer U> ? U : never;

const seriesSelectToSeriesType = (result: SeriesSelectByIdResultItem): Series => ({
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

export const selectSeries = async (db: VollieDBConnection): Promise<Series[]> => 
  seriesSelectAll(db);

export const createSeries: CreateFunction<SeriesTO> = async (db: VollieDBConnection, series: Uninitialised<SeriesTO>): Promise<Existing<SeriesTO>> => {
  return db.insert(SeriesTableTO).values(series).returning().then((result) => {
    if (result.length > 1) {
      throw new Error('Returned multiple results from insert');
    }
    console.log(`Created series with id ${result[0].id}`);
    return result[0];
  });
};

export const updateSeries = async (db: VollieDBConnection, series: Existing<SeriesTO>): Promise<SeriesId> => {
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
