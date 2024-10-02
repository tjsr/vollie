import { RaceEvent, User } from '../model/entity';
import { fetchJson, genericPost } from "./util";

import { EventId } from "../model/id";
import { NewRaceEventTO } from "../model/to";
import { NotFoundError } from '../types';

export const fetchEvent = async (eventId: EventId, currentUser: User|undefined|null): Promise<RaceEvent|void> => {  
  return fetchJson<RaceEvent, EventId>(`/event/${eventId}`, currentUser).then((result) => result).catch((err) => {
    if (err instanceof NotFoundError) {
      err.message = `Event ${eventId} not found`;
      throw err;
    }
  });
}

export const postEvent = async (event: RaceEvent): Promise<void> => { // Promise<RaceEvent> => {
  await genericPost('/event', eventFormToRaceEventTO, event);
};

const eventFormToRaceEventTO = (data: RaceEvent): NewRaceEventTO => {
  const to: NewRaceEventTO = {
    name: data.name,
    startDate: data.startDate,
    endDate: data.endDate,
    location: data.location,
    organiser: data.organiser.id,
    description: data.description,
    series: data.series?.id || null,
  };
  return to;
};