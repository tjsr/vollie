import { PageLoadStatus, footerEffectHelper, getLoadStatusFromQueryList, isReadyStatus, pageLoadStatusString } from './util';
import React, { useEffect, useState } from 'react';
import { saveOrganisation, useOrganisationQuery } from '../query/organiser.js';
import { useCurrentUser, useUi, useUser } from '../stores';

import { LoadingScreen } from './Common.js';
import { QueryClient } from '@tanstack/react-query';
import { RJSFSchema } from '@rjsf/utils';
import { SimpleSchemaForm } from './common/SimpleSchemaForm.js';
import { createOrgSchema } from '../forms/organiser/fields.js';
import { uiSchema as orgUiSchema } from '../forms/organiser/uiSchema.js';
import { useAllUsersQuery } from '../query/user.js';
import { useIntOrNewParam } from '../stores/useIntOrNewParam.js';
import { useNavigate } from 'react-router-dom';
import { useSaveAndRedirectMutation } from '../query/util.js';

export const OrganisationFormPage = (): React.ReactNode => {
  const ui = useUi((state) => state);
  const { currentUser } = useCurrentUser();
  const { organisationId } = useIntOrNewParam();
  const [orgFormSchema, setOrgFormSchema] = useState<RJSFSchema | undefined>();
  const { users, addOrUpdateUsers } = useUser();

  const queryClient = new QueryClient();
  const [loadingStatus, setLoadingStatus] = useState<PageLoadStatus>(PageLoadStatus.Initialised);

  const navigate = useNavigate();
  
  useEffect(() => {
    footerEffectHelper(organisationId, 'Organisation', ui);
  }, [organisationId, ui]);

  // Mutations  
  const orgQuery = useOrganisationQuery(currentUser, organisationId || undefined);
  const saveOrg = useSaveAndRedirectMutation(
    navigate, queryClient, orgQuery, saveOrganisation, organisationId || 0, 'organisations', '/organisation'
  );
  const usersQuery = useAllUsersQuery(currentUser);

  useEffect(() => {
    const updatedLoadStatus = getLoadStatusFromQueryList(loadingStatus, usersQuery.status, orgQuery.status);
    console.log('Main user data changed...');

    if (loadingStatus !== updatedLoadStatus) {
      setLoadingStatus(updatedLoadStatus);
    }
  }, [usersQuery.status, orgQuery.status, loadingStatus]);

  useEffect(() => {

  }, [loadingStatus]);

  useEffect(() => {
    const isLoaded = loadingStatus & PageLoadStatus.Loaded;
    const hasError = loadingStatus & PageLoadStatus.Error;
    if (usersQuery.data && isLoaded && !hasError) {
      console.log('Setting users from query data.');
      addOrUpdateUsers(usersQuery.data);
    }
      // const updatedStatus = (loadingStatus & ~PageLoadStatus.Loading & ~PageLoadStatus.Error) | PageLoadStatus.Loaded;
      // if (loadingStatus !== updatedStatus) {
      //   setLoadingStatus(updatedStatus);
      // }
  }, [usersQuery.data, loadingStatus, addOrUpdateUsers]);

  // useEffect(() => {
  //   const updatedLoadStatus = getLoadStatusFromQueryList(loadingStatus, usersQuery.status, orgQuery.status);

  //   console.log('Main user data changed...');

  //   if (loadingStatus !== updatedLoadStatus) {
  //     setLoadingStatus(updatedLoadStatus);
  //   }
  //   let updatedLoadStatus = loadingStatus;

  //   if (usersQuery.data && loadingStatus & PageLoadStatus.Loaded) {
  //     console.log('Setting users from query data.');
  //     addOrUpdateUsers(usersQuery.data);
  //   }
  //   if (orgQuery.data && loadingStatus.PageLoadStatus.Loaded) {
      
  //   }

  // }, [usersQuery.data, orgQuery.data, loadingStatus]);

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
