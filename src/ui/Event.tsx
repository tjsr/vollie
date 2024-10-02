import { Organisation, Series } from '../model/entity.js';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { fetchEvent, postEvent } from '../query/event.js';
import { useEffect, useState } from 'react';

import { Form } from '@rjsf/mui';
import { NotFoundError } from '../types.js';
import { RJSFSchema } from '@rjsf/utils';
import { VolliePageProps } from './types.js';
import { createEventSchema } from '../forms/event/fields.js';
import { uiSchema as eventUiSchema } from '../forms/event/uiSchema.js';
import { fetchAllSeries } from '../query/series.js';
import { fetchOrganisations } from '../query/organiser.js';
import { useOrganisation } from '../stores/organisation.js';
import { useParams } from 'react-router-dom';
import { useSeries } from '../stores/series.js';
import validator from '@rjsf/validator-ajv8';

/* eslint-disable @typescript-eslint/no-explicit-any */

const DEV_MODE = true;
const log = (type: string) => console.log.bind(console, type);

// const formData = {
//   "firstName": "Chuck",
//   "lastName": "Norris",
//   "password": "noneed",
//   "telephone": "1-800-KICKASS"
// };

interface EventFormPateProps extends VolliePageProps {
  saveEvent?: (data: any) => Promise<void>;
  //saveEvent: UseMutateAsyncFunction<RaceEvent, Error, any, unknown>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const EventFormPage = ({ currentUser, addFooterLink }: EventFormPateProps): JSX.Element => {
  const { eventId } = useParams();
  console.log(`Rendering events page for ${eventId}`);
  // addFooterLink({ target: '/events', text: 'Back to Events' });
  const [eventFormSchema, setEventFormSchema] = useState<RJSFSchema | undefined>();
  const queryClient = new QueryClient();
  const [eventIdInt, setEventId] = useState<number | undefined>(undefined);
  const [userOrgs, setUserOrgs] = useState<Organisation[] | undefined>(undefined);
  const [userSeries, setUserSeries] = useState<Series[] | undefined>(undefined);

  // const { orgData, orgDataError, orgDataLoading } = useQuery('organisations', fetchOrganisations);

  useEffect(() => {
    if (typeof eventId === 'string') {
      const eventIdInt = parseInt(eventId);
      if (eventIdInt > 0) {
        setEventId(eventIdInt);
      }
    }
  }, [eventId]);

  // Mutations
  const saveEvent = useMutation({
    mutationFn: postEvent,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  // Queries
  const eventQuery = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => {
      console.log(`Fetching for Event ID: ${eventId}`);
      if (eventId) {
        const eventIdInt = parseInt(eventId);
        if (eventIdInt > 0) {
          return fetchEvent(eventIdInt, currentUser).catch((err) => {
            if (err instanceof NotFoundError) {
              console.error(`Event not found: ${eventId}`);
              throw err;
            }
          });
        } else {
          console.error(`returned eventIdInt was not an integer: ${eventId}`);
        }
      }
      return;
    },
  });

  const organisationQuery = useQuery({
    queryKey: ['organisations'],
    queryFn: () => {
      console.log('Fetching for All Orgs');
      return fetchOrganisations(currentUser);
    },
  });

  const seriesQuery = useQuery({
    queryKey: ['series'],
    queryFn: () => {
      console.log('Fetching for All Series');
      return fetchAllSeries(currentUser);
    },
  });

  const { series } = useSeries();
  const { organisations } = useOrganisation();

  useEffect(() => {
    console.log('Main data changed...');
    if (currentUser) {
      if (userOrgs === undefined || userOrgs.length <= 0) {
        console.log(
          `Insufficient oganisations for event details form - ${organisations?.length || 0} orgs and ${
            series?.length || 0
          } series.`
        );
      } else {
        console.log(
          `Loading event form schema with currentUser and ${userOrgs?.length || 0} orgs and ${
            userSeries?.length || 0
          } series.`
        );
        setEventFormSchema(createEventSchema(organisations, series, currentUser));
        return;
      }
    } else {
      console.log('Not loading event from schema.');
    }
    setEventFormSchema(undefined);
  }, [currentUser, organisations, series, seriesQuery.data, userOrgs, userSeries]);

  useEffect(() => {
    console.log('orgs/currentUser changed');
    const retrievedUserOrgs = organisationQuery.data?.filter((org: Organisation) => {
      const userOrgs: Organisation[] =
        currentUser?.organisations?.filter((userOrg: Organisation) => userOrg.id === org.id) || [];
      return userOrgs?.length > 0;
    });
    setUserOrgs(retrievedUserOrgs);
  }, [organisationQuery.data, currentUser]);

  useEffect(() => {
    console.log('Series/userOrgs changed');
    const retrievedUserSeries =
      seriesQuery.data?.filter((series: Series) => {
        series.organiser === undefined ||
          series.organiser === null ||
          userOrgs?.map((org) => org.id).includes(series.organiser?.id);
      }) || [];
    setUserSeries(retrievedUserSeries);
  }, [seriesQuery.data, userOrgs]);

  if (eventQuery.failureReason) {
    return (
      <>
        <h2>Edit Event</h2>
        <div className="error access">
          Failed loading event {eventId}: {eventQuery.failureReason.message}
        </div>
        {DEV_MODE && <div className="dev error access">{eventQuery.failureReason.message}.</div>}
      </>
    );
  }

  if (eventFormSchema !== undefined && !(organisations?.length > 0)) {
    return (
      <>
        <h2>{eventIdInt !== undefined ? 'Edit' : 'Create'} Event</h2>
        <div className="error access">Permission denied.</div>
        {DEV_MODE && <div className="dev error access">No organisations available for event creation.</div>}
      </>
    );
  }
  return (
    <>
      <h2>{eventIdInt !== undefined ? 'Edit' : 'Create'} Event</h2>
      {!eventFormSchema ? (
        <div>Loading form schema...</div>
      ) : (
        <div>
          <div>User: {currentUser?.firstName}</div>
          <Form
            schema={eventFormSchema}
            validator={validator}
            uiSchema={eventUiSchema}
            formData={eventQuery.data}
            onChange={log('changed')}
            onSubmit={async (d, e) => {
              log('submitted');
              console.log('data: ', d);
              console.log('event: ', e);
              await saveEvent.mutateAsync(d.formData);
            }}
            // onSubmit={(e) => submit(e.formData)}
            onError={log('errors')}
          />
        </div>
      )}
    </>
  );
};
