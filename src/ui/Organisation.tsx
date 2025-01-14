import { PageLoadStatus, isReadyStatus, pageLoadStatusString } from './util';
import { QueryClient, useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { saveOrganisation, useOrganisationQuery } from '../query/organiser.js';
import { useCurrentUser, useUi, useUser } from '../stores';

import { LoadingScreen } from './Common.js';
import { RJSFSchema } from '@rjsf/utils';
import { SimpleSchemaForm } from './common/SimpleSchemaForm.js';
import { createOrgSchema } from '../forms/organiser/fields.js';
import { uiSchema as orgUiSchema } from '../forms/organiser/uiSchema.js';
import { useAllUsersQuery } from '../query/user.js';
import { useIntOrNewParam } from '../stores/useIntOrNewParam.js';
import validator from '@rjsf/validator-ajv8';

export const OrganisationFormPage = (): React.ReactNode => {
  const { setFooterLinks, setTitle } = useUi((state) => state);
  const { currentUser } = useCurrentUser();
  const { organisationId } = useIntOrNewParam();
  const [orgFormSchema, setOrgFormSchema] = useState<RJSFSchema | undefined>();
  const { users, addOrUpdateUsers } = useUser();

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
      console.log('organisationId may have changed, but is not string: ', organisationId);
    }
  }, [organisationId, setFooterLinks, setTitle]);

  // Mutations
  const saveOrg = useMutation({
    mutationFn: saveOrganisation,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['organisations'] });
    },
  });

  const orgQuery = useOrganisationQuery(currentUser, organisationId || undefined);
  const usersQuery = useAllUsersQuery(currentUser);

  useEffect(() => {
    console.log('Main user data changed...');
    const isLoaded = loadingStatus & PageLoadStatus.Loaded;
    const hasError = loadingStatus & PageLoadStatus.Error;
    if (usersQuery.data && !isLoaded && !hasError) {
      console.log('Setting users from query data.');
      addOrUpdateUsers(usersQuery.data);
      const updatedStatus = (loadingStatus & ~PageLoadStatus.Loading & ~PageLoadStatus.Error) | PageLoadStatus.Loaded;
      if (loadingStatus !== updatedStatus) {
        setLoadingStatus(updatedStatus);
      }
    }
  }, [usersQuery.data, loadingStatus, setLoadingStatus, addOrUpdateUsers]);

  useEffect(() => {
    if (currentUser) {
      setOrgFormSchema(createOrgSchema(users));
      setLoadingStatus(PageLoadStatus.Ready);
    } else {
      const updatedLoadingStatus = loadingStatus | PageLoadStatus.NotLoggedIn;
      updatedLoadingStatus !== loadingStatus && setLoadingStatus(updatedLoadingStatus);

      console.log('Not logged in - not loading organisation from schema.');
    }
  }, [currentUser, users, loadingStatus, setOrgFormSchema, setLoadingStatus]);

  useEffect(() => {
    let updatedLoadingStatus = loadingStatus;
    if (orgFormSchema === undefined) {
      updatedLoadingStatus = loadingStatus | PageLoadStatus.SchemaNotLoaded;
    }
    if (organisationId !== null && orgQuery.isError) {
      updatedLoadingStatus = loadingStatus | (PageLoadStatus.Error & ~PageLoadStatus.Ready);
    } else {
      updatedLoadingStatus = loadingStatus & ~PageLoadStatus.Error;
    }
    if (updatedLoadingStatus != loadingStatus) {
      setLoadingStatus(updatedLoadingStatus);
    }
  }, [loadingStatus, organisationId, orgQuery.isError, orgFormSchema]);

  useEffect(() => {
    if (orgFormSchema !== undefined) {
      setLoadingStatus(PageLoadStatus.Ready);
    }
  }, [orgFormSchema]);

  console.log(`Rendering organisation page for ${organisationId || 'new organisation'}`);

  console.log('Lodaing status:', pageLoadStatusString(loadingStatus));
  if (organisationId !== null && !isReadyStatus(loadingStatus)) {
    return <LoadingScreen loadStatus={loadingStatus} />;
  }

  if (orgFormSchema === undefined) {
    return 'Org form schema not loaded.';
  }

  return (
    // hasPermission={!(eventFormSchema !== undefined && !(organisations?.length > 0))}
    // isLoading={!eventFormSchema || seriesQuery.isLoading || eventQuery.isLoading || organisationQuery.isLoading}
    // hasLoadError={seriesQuery.isError || eventQuery.isError || organisationQuery.isError}
    <SimpleSchemaForm
      modelId={organisationId || null}
      schema={orgFormSchema}
      uiSchema={orgUiSchema}
      validator={validator}
      formData={orgQuery.data}
      onSubmit={async (d) => saveOrg.mutateAsync(d.formData)} />
    );

  // return (
  //   <Form
  //     schema={orgFormSchema}
  //     validator={validator}
  //     uiSchema={orgUiSchema}
  //     formData={orgQuery.data}
  //     onChange={(_data, id) => log('changed ' + id)}
  //     onSubmit={async (d, e) => {
  //       log('submitted');
  //       console.log('data: ', d);
  //       console.log('event: ', e);
  //       return saveOrg.mutateAsync(d.formData);
  //     }}
  //     liveValidate={true}
  //     // onSubmit={(e) => submit(e.formData)}
  //     onError={log('errors')}
  //   >
  //   <div>
  //     <Button type='submit' color='primary'>{organisationId == undefined ? 'Create' : 'Save changes'}</Button>
  //     <Button type='button' color='secondary'>Cancel</Button>
  //   </div>
  //   </Form>
  // );
};

export const MemoizedOrganisationFormPage = React.memo(OrganisationFormPage);
