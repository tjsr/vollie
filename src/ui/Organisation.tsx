import { PageLoadStatus, isReadyStatus, log } from "./util";
import { QueryClient, useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { postOrganisation, useOrganisationQuery } from "../query/organiser.js";
import { useCurrentUser, useUi, useUser } from "../stores";

import { Form } from "@rjsf/mui";
import { LoadingScreen } from "./Common.js";
import { RJSFSchema } from "@rjsf/utils";
import { createOrgSchema } from "../forms/organiser/fields.js";
import { uiSchema as orgUiSchema } from '../forms/organiser/uiSchema.js';
import { useIntOrNewParam } from "../stores/useIntOrNewParam.js";
import validator from '@rjsf/validator-ajv8';

export const OrganisationFormPage = (): React.ReactNode => {
  const { setFooterLinks, setTitle } = useUi(state => state);
  const { currentUser } = useCurrentUser();
  const { organisationId } = useIntOrNewParam();
  const [orgFormSchema, setOrgFormSchema] = useState<RJSFSchema | undefined>();
  const { users } = useUser();

  const queryClient = new QueryClient();
  const [loadingStatus, setLoadingStatus] = useState<PageLoadStatus>(PageLoadStatus.Initialised);

  useEffect(() => {
    setFooterLinks([{ target: '/organisations', text: 'Back to Organisations' }]);
    if (typeof organisationId === 'string') {
      const organisationIdInt = parseInt(organisationId);
      if (organisationIdInt > 0) {
        console.log(`Setting title as organisationId=${organisationIdInt}`);
        setTitle('Edit organisation');
      } else {
        setTitle('Create organisation');
      }
    } else {
      console.log('eventId may have changed, but is not string: ', organisationId);
    }
  }, [organisationId, setFooterLinks, setTitle]);

  // Mutations
  const saveOrg = useMutation({
    mutationFn: postOrganisation,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['organisations'] });
    },
  });

  const orgQuery = useOrganisationQuery(currentUser, organisationId || undefined);

  useEffect(() => {
    console.log('Main organisation data changed...');
    if (currentUser) {
      setOrgFormSchema(createOrgSchema(users));
    } else {
      console.log('Not logged in - not loading organisation from schema.');
    }
  }, [orgQuery.data, currentUser, users]);

  useEffect(() => {
    if (organisationId !== null && orgQuery.isError) {
      setLoadingStatus(loadingStatus | PageLoadStatus.Error & ~PageLoadStatus.Ready);
    } else {
      setLoadingStatus(loadingStatus & ~PageLoadStatus.Error);
    }
  }, [loadingStatus, organisationId, orgQuery.isError]);

  console.log(`Rendering organisation page for ${organisationId || 'new organisation'}`);

  console.log('Lodaing status:', loadingStatus)
  if (organisationId !== null && !isReadyStatus(loadingStatus)) {
    return <LoadingScreen
      loadStatus={loadingStatus}
    />
  }

  if (orgFormSchema === undefined) {
    return ('Org form schema not loaded.');
  }

  return (
    // hasPermission={!(eventFormSchema !== undefined && !(organisations?.length > 0))}
    // isLoading={!eventFormSchema || seriesQuery.isLoading || eventQuery.isLoading || organisationQuery.isLoading}
    // hasLoadError={seriesQuery.isError || eventQuery.isError || organisationQuery.isError}
    <Form
      schema={orgFormSchema}
      validator={validator}
      uiSchema={orgUiSchema}
      formData={orgQuery.data}
      onChange={(_data, id) => log('changed ' + id)}
      onSubmit={async (d, e) => {
        log('submitted');
        console.log('data: ', d);
        console.log('event: ', e);
        return saveOrg.mutateAsync(d.formData);
      }}
      liveValidate={true}
      // onSubmit={(e) => submit(e.formData)}
      onError={log('errors')}
    />
  );
};

export const MemoizedOrganisationFormPage = React.memo(OrganisationFormPage);
