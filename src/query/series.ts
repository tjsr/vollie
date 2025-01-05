import { Existing, NewSeriesTO, SeriesTO } from "../model/to";
import { PartialSeries, Series, User } from "../model/entity";
import { callGenericApiPost, callGenericApiPut, fetchJson } from "./util";

import { SeriesId } from "../model/id";
import { organisers } from "./organiser";
import { useQuery } from "@tanstack/react-query";

export const series: PartialSeries[] = [
  {
    id: 2001,
    name: "2024 Summer No Frills",
    description: 'Test series',
    organiser: organisers[0],
  }
];

const seriesFormToNewSeriesTO = (data: Series): NewSeriesTO => {
  const to: NewSeriesTO = {
    name: data.name,
    description: data.description,
    organiser: data.organiser?.id || null,
  };
  return to;
};

const seriesFormToSeriesTO = (data: Series): Existing<SeriesTO> => {
  const to: Existing<SeriesTO> = {
    id: data.id,
    name: data.name,
    description: data.description,
    organiser: data.organiser?.id || null,
  };
  return to;
};

export const postSeries = async (series: Series): Promise<Series> => {
  return callGenericApiPost('/series', seriesFormToNewSeriesTO, series);
};

export const putSeries = async (series: Series): Promise<Series> => {
  return callGenericApiPut('/series', seriesFormToSeriesTO, series);
};

export const fetchSeries = async (seriesId: SeriesId, currentUser: User|undefined|null): Promise<Series[]> => {
  return fetchJson(`/series/${seriesId}`, currentUser);
};

export const fetchAllSeries = async (currentUser: User|undefined|null): Promise<Series[]> => {
  return fetchJson(`/series`, currentUser);
};

export const useSeriesQuery = (currentUser: User|null|undefined, seriesId?: SeriesId|undefined) => useQuery({
  queryKey: ['series', seriesId],
  queryFn: () => {
    if (seriesId === undefined) {
      console.log('Fetching for All Series');
      return fetchAllSeries(currentUser);
    } else {
      console.log(`Fetching for Series ID: ${seriesId}`);
      return fetchSeries(seriesId, currentUser);
    }
  },
});
