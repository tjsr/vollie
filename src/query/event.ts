import { RaceEvent, User } from '../model/entity';
import { callGenericApiPost, fetchJson } from "./util";

import { EventId } from "../model/id";
import { NewRaceEventTO } from "../model/to";
import { NotFoundError } from '../errors';
import { useQuery } from '@tanstack/react-query';

export const fetchEvent = async (eventId: EventId, currentUser: User|undefined|null): Promise<RaceEvent|void> => {  
  return fetchJson<RaceEvent, EventId>(`/event/${eventId}`, currentUser).then((result) => result).catch((err) => {
    if (err instanceof NotFoundError) {
      err.message = `Event ${eventId} not found`;
      throw err;
    } else if (eventId === undefined || typeof eventId !== 'number') {
      console.warn('Got to fetchJson with eventId=undefined');
    }
  });
};

export const fetchAllEvents = async (currentUser: User|undefined|null): Promise<RaceEvent[]> => {  
  return fetchJson<RaceEvent[], EventId>(`/events`, currentUser);
};

export const postEvent = async (event: RaceEvent): Promise<void> => { // Promise<RaceEvent> => {
  await callGenericApiPost('/event', eventFormToRaceEventTO, event);
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

export const useEventQuery = (eventId: number|undefined, currentUser: User|null|undefined) => useQuery({
  enabled: !!eventId,
  queryKey: ['events', eventId],
  queryFn: () => {
    if (!eventId || eventId <= 0) {
      console.warn(`Skipped event load because eventId=${eventId}`);
      return;
    }
    if (!currentUser) {
      throw new Error('No current user to load event');
    }
    console.log(`Fetching for Event ID: ${eventId}`);
    return fetchEvent(eventId, currentUser).catch((err) => {
      if (err instanceof NotFoundError) {
        console.error(`Event not found: ${eventId}`);
        throw err;
      }
      console.error(`Failed to fetch event: ${eventId}`, err);
      throw err;
    });
  },
});

export const useAllEventsQuery = (currentUser: User|null|undefined) => useQuery({
  queryKey: ['events'],
  queryFn: () => {
    if (!currentUser) {
      throw new Error('No current user to load event');
    }
    return fetchAllEvents(currentUser);
  },
});
