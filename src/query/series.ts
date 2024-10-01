import { PartialSeries, Series, User } from "../model/entity";
import { fetchJson, genericPost } from "./util";

import { NewSeriesTO } from "../model/to";
import { SeriesId } from "../model/id";
import { organisers } from "./organiser";

export const series: PartialSeries[] = [
  {
    id: 2001,
    name: "2024 Summer No Frills",
    description: 'Test series',
    organiser: organisers[0],
  }
];

const seriesFormToSeriesTO = (data: Series): NewSeriesTO => {
  const to: NewSeriesTO = {
    name: data.name,
    description: data.description,
    organiser: data.organiser?.id || null,
  };
  return to;
};

export const postSeries = async (series: Series): Promise<Series> => {
  return genericPost('/series', seriesFormToSeriesTO, series);
};

export const fetchSeries = async (seriesId: SeriesId, currentUser: User|undefined|null): Promise<Series[]> => {
  return fetchJson(`/series/${seriesId}`, currentUser);
};

export const fetchAllSeries = async (currentUser: User|undefined|null): Promise<Series[]> => {
  return fetchJson(`/series`, currentUser);
};
