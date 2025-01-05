import { QueryClient, useMutation } from "@tanstack/react-query";
import { postSeries, useSeriesQuery } from "../query/series";
import { useCurrentUser, useOrganisation } from "../stores";
import { useEffect, useState } from "react";

import { Form } from "@rjsf/mui";
import Link from "@mui/material/Link";
import { RJSFSchema } from "@rjsf/utils";
import React from "react";
import { createSeriesSchema } from "../forms/series/fields.js";
import { log } from "./util";
import { uiSchema as seriesUiSchema } from '../forms/series/uiSchema.js';
import { useAllOrganisationsQuery } from "../query/organiser";
import { useIntOrNewParam } from "../stores/useIntOrNewParam.js";
import { useUi } from "../stores/ui.js";
import validator from '@rjsf/validator-ajv8';

// interface SeriesFormPageProps extends VolliePageProps {
//   seriesQuery: typeof useSeriesQuery;
// }

export const SeriesFormPage = () => {
  const { currentUser } = useCurrentUser(state => state);
  const { seriesId } = useIntOrNewParam();
  const seriesQuery = useSeriesQuery(currentUser, seriesId || undefined);
  const { setFooterLinks, setTitle } = useUi(state => state);
  const queryClient = new QueryClient();
  const [seriesFormSchema, setSeriesFormSchema] = useState<RJSFSchema | undefined>();

  useEffect(() => {
    setFooterLinks([{ target: '/series', text: 'Back to series list' }]);
  }, [setFooterLinks]);

  useEffect(() => {
    if (seriesId === undefined) {
      setTitle('Create Series');
    } else if (seriesId === null) {
      if (seriesQuery.isLoading) {
        setTitle('Loading...');
      } else {
        setTitle('Edit Series');
      }
    } else {
      setTitle('Edit Series');
    }
  }, [seriesId, seriesQuery.isLoading, setTitle]);

  // Mutations
  const saveSeries = useMutation({
    mutationFn: postSeries,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['series'] });
    },
  });

  // Queries
  // const seriesQuery = useQuery({
  //   queryKey: ['series', seriesId],
  //   queryFn: () => {
  //     console.log(`Fetching for Series ID: ${seriesIdInt}`);
  //     if (seriesIdInt !== undefined && seriesIdInt > 0) {
  //       return fetchSeries(seriesIdInt, currentUser).catch((err) => {
  //         if (err instanceof NotFoundError) {
  //           console.error(`Series not found: ${seriesId}`);
  //           throw err;
  //         }
  //       });
  //     }
  //     return;
  //   },
  // });

  const organisationQuery = useAllOrganisationsQuery(currentUser);

  // const organisationQuery = useQuery({
  //   queryKey: ['organisations'],
  //   queryFn: () => {
  //     console.log('Fetching for All Orgs');
  //     return fetchOrganisations(currentUser);
  //   },
  // });

  const { organisations, setOrganisations } = useOrganisation();

  useEffect(() => {
    console.log('Series main data changed...');
    if (currentUser) {
      if (organisations === undefined || organisations.length <= 0) {
        console.log(
          `No oganisations for series details form - ${organisations?.length || 0} orgs.`
        );
      } else {
        console.log(
          `Loading series form schema with currentUser and ${organisations?.length || 0} orgs.`
        );
      }
      setSeriesFormSchema(createSeriesSchema(organisations, currentUser));
      return;
    } else {
      console.log('Not loading series from schema.');
    }
    setSeriesFormSchema(undefined);
  }, [currentUser, organisations]);

  useEffect(() => {
    console.log('orgs/currentUser changed');
    if (organisationQuery.data) {
      setOrganisations(organisationQuery.data);
    }
  }, [organisationQuery.data, currentUser, setOrganisations]);

  console.log('Organisations:', organisations.length, organisations);

  if (organisations.length === 0) {
    return (<>
      { organisations.length === 0 ? <div className="error nodata orgs">No organisations available for event creation. You will need to <Link href="/organisation/new">create an organisation</Link> before being able to create events.</div> : <></>}
      </>);
  }

  if (!seriesFormSchema) {
    return (
      <>
        <div>Loading form schema...</div>
      </>
    );
  }

  const correctedSeriesUiSchema = {
    ...seriesUiSchema,
    organiser: {
      ...seriesUiSchema.organiser,
      'ui:enumDisabled': organisations.length <= 0,
      'ui:placeholder': organisations.length <= 0 ? 'No organisations available to select from.' : 'Select an organiser',
    },
  };

  return (
    <Form
      schema={seriesFormSchema}
      validator={validator}
      uiSchema={correctedSeriesUiSchema}
      formData={seriesQuery.data}
      onChange={log('changed')}
      onSubmit={async (d, e) => {
        log('submitted');
        console.log('data: ', d);
        console.log('event: ', e);
        await saveSeries.mutateAsync(d.formData);
      }}
      // onSubmit={(e) => submit(e.formData)}
      onError={log('errors')}
    />
  );
};

export const MemoizedSeriesFormPage = React.memo(SeriesFormPage);
