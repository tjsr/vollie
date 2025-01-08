import {  } from '../stores/organisation.js';

import { Organisation, Series } from '../model/entity.js';
import { PageLoadStatus, isReadyStatus, isValidLoadedStatus, log } from './util.js';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { postEvent, useEventQuery } from '../query/event.js';
import {
  useCurrentUser,
  useOrganisation,
  useSeries,
  useUi
} from '../stores/index.js';
import { useEffect, useState } from 'react';

import { Form } from '@rjsf/mui';
import { Link } from '@mui/material';
import { LoadingScreen } from './Common.js';
import { RJSFSchema } from '@rjsf/utils';
import React from 'react';
import { createEventSchema } from '../forms/event/fields.js';
import { uiSchema as eventUiSchema } from '../forms/event/uiSchema.js';
import { useAllOrganisationsQuery } from '../query/organiser.js';
import { useAllSeriesQuery } from '../query/series.js';
import { useIntOrNewParam } from '../stores/useIntOrNewParam.js';
import validator from '@rjsf/validator-ajv8';

/* eslint-disable @typescript-eslint/no-explicit-any */

const DEV_MODE = true;
// const formData = {
//   "firstName": "Chuck",
//   "lastName": "Norris",
//   "password": "noneed",
//   "telephone": "1-800-KICKASS"
// };

// interface EventFormPateProps extends VolliePageProps {
//   saveEvent?: (data: any) => Promise<void>;
//   //saveEvent: UseMutateAsyncFunction<RaceEvent, Error, any, unknown>
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const EventFormPage = (): React.ReactNode => {
  const { setFooterLinks, setTitle } = useUi((state) => state);
  const { currentUser } = useCurrentUser();
  const { eventId } = useIntOrNewParam();
  console.log(`Rendering events page for ${eventId}`);
  const [eventFormSchema, setEventFormSchema] = useState<RJSFSchema | undefined>();
  const queryClient = new QueryClient();
  // const [eventIdInt, setEventId] = useState<number | undefined>(undefined);
  const [userOrgs, setUserOrgs] = useState<Organisation[] | undefined>(undefined);
  const [userSeries, setUserSeries] = useState<Series[] | undefined>(undefined);
  const [loadingStatus, setLoadingStatus] = useState<PageLoadStatus>(PageLoadStatus.Initialised);

  // const { orgData, orgDataError, orgDataLoading } = useQuery('organisations', fetchOrganisations);

  useEffect(() => {
    setFooterLinks([{ target: '/events', text: 'Back to Events' }]);
    if (typeof eventId === 'string') {
      const eventIdInt = parseInt(eventId);
      if (eventIdInt > 0) {
        console.log(`Setting title as eventId=${eventIdInt}`);
        setTitle('Edit event');
      } else {
        setTitle('Create event');
      }
    } else {
      console.log('eventId may have changed, but is not string: ', eventId);
    }
  }, [eventId, setFooterLinks, setTitle]);

  const eventQuery = useEventQuery(eventId || undefined, currentUser);

  // Mutations
  const saveEvent = useMutation({
    mutationFn: postEvent,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  // // Queries
  // const eventQuery = useEventQuery({
  //   queryKey: ['events', eventId],
  //   queryFn: () => {
  //     if (eventIdInt && eventIdInt > 0) {
  //       console.log(`Fetching for Event ID: ${eventId}`);
  //       return fetchEvent(eventIdInt, currentUser).catch((err) => {
  //         if (err instanceof NotFoundError) {
  //           console.error(`Event not found: ${eventId}`);
  //           throw err;
  //         }
  //         console.error(`Failed to fetch event: ${eventId}`, err);
  //         throw err;
  //       });
  //     } else {
  //       console.warn(`Skipped event load because eventIntId=${eventIdInt}`);
  //     }
  //     return;
  //   },
  // });

  const organisationQuery = useAllOrganisationsQuery(currentUser);
  const seriesQuery = useAllSeriesQuery(currentUser);
  const { series } = useSeries();
  const { organisations } = useOrganisation();

  // const localStateSet: StateSet = {
  //   currentUser: useCurrentUser(),
  //   series: useSeries(),
  //   organisations: useOrganisation(),
  //   users: useUser(),
  // };

  // const series = stateSet.series!.series;
  // const organisations = stateSet.organisations!.organisations;

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
      console.log('Not logged in - not loading event from schema.');
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
        if (!series.organiser) {
          return false;
        }

        userOrgs?.map((org) => org.id).filter((id) => id === series.organiser?.id);
      }) || [];
    setUserSeries(retrievedUserSeries as Series[]);
  }, [seriesQuery.data, userOrgs]);

  useEffect(() => {
    if (seriesQuery.isError || (eventId !== null && eventQuery.isError) || organisationQuery.isError) {
      setLoadingStatus(loadingStatus | (PageLoadStatus.Error & ~PageLoadStatus.Ready));
    } else {
      setLoadingStatus(loadingStatus & ~PageLoadStatus.Error);
    }
  }, [loadingStatus, eventId, seriesQuery.isError, eventQuery.isError, organisationQuery.isError]);

  useEffect(() => {
    if (eventFormSchema && isValidLoadedStatus(loadingStatus) && !isReadyStatus(loadingStatus)) {
      setLoadingStatus(loadingStatus | PageLoadStatus.Ready);
    }
  }, [eventFormSchema, loadingStatus]);

  if (eventId === undefined) {
    return (
      <>
        <div className="error access">No eventId proivided.</div>
        {DEV_MODE && <div className="dev error access">No eventId provided.</div>}
      </>
    );
  }

  if (eventId !== null && eventQuery.failureReason) {
    console.log('Setting title on failure...', eventQuery.failureReason);
    setTitle('Edit event - failed loading');
    return (
      <>
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
        <div className="error access">Permission denied.</div>
        {DEV_MODE && <div className="dev error access">No organisations available for event creation.</div>}
      </>
    );
  }

  console.log('Lodaing status:', loadingStatus);
  if (eventId !== null && !isReadyStatus(loadingStatus)) {
    return <LoadingScreen loadStatus={loadingStatus} />;
  }

  console.log('Series:', series.length, series);
  console.log('Organisations:', organisations.length, organisations);

  if (series.length === 0 || organisations.length === 0) {
    if (series.length === 0) {
      return (
        <>
          {organisations.length === 0 ? (
            <div className="error nodata orgs">
              No organisations available for event creation. You will need to{' '}
              <Link href="/organisation/new">create an organisation</Link> before being able to create events.
            </div>
          ) : (
            <></>
          )}
          {series.length === 0 ? (
            <div className="error nodata series">
              No series available for event creation. You will need to <Link href="/series/new">create a series</Link>{' '}
              before being able to create events.
            </div>
          ) : (
            <></>
          )}
        </>
      );
    }
  }

  return (
    // hasPermission={!(eventFormSchema !== undefined && !(organisations?.length > 0))}
    // isLoading={!eventFormSchema || seriesQuery.isLoading || eventQuery.isLoading || organisationQuery.isLoading}
    // hasLoadError={seriesQuery.isError || eventQuery.isError || organisationQuery.isError}
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
  );
};

export const MemoizedEventFormPage = React.memo(EventFormPage);
