import { QueryClient, useMutation } from '@tanstack/react-query';
import { postUser, useUserQuery } from '../query/user.js';
import { useCurrentUser, useUi } from '../stores/index.js';
import { useEffect, useState } from 'react';

import { Form } from '@rjsf/mui';
import { RJSFSchema } from '@rjsf/utils';
import React from 'react';
import { createUserSchema } from '../forms/user/fields.js';
import { log } from './util';
import { useIntOrNewParam } from '../stores/useIntOrNewParam.js';
import { uiSchema as userUiSchema } from '../forms/user/uiSchema.js';
import validator from '@rjsf/validator-ajv8';

const DEV_MODE = true;

export const UserFormPage = (): JSX.Element => {
  const { setFooterLinks, setTitle } = useUi((state) => state);
  const { userId } = useIntOrNewParam();
  const [userFormSchema, setUserFormSchema] = useState<RJSFSchema | undefined>(createUserSchema());
  const { currentUser } = useCurrentUser();
  const queryClient = new QueryClient();

  const userQuery = useUserQuery(currentUser, userId || undefined);
  console.log('Creating user form page', userId);

  useEffect(() => {
    setFooterLinks([{ target: '/users', text: 'Back to Users' }]);
    if (typeof userId === 'string') {
      const userIdInt = parseInt(userId);
      if (userIdInt > 0) {
        console.log(`Setting title as userId=${userIdInt}`);
        setTitle('Edit user');
      } else {
        setTitle('Create user');
      }
    } else {
      console.log('userId may have changed, but is not string: ', userId);
    }
  }, [userId, setFooterLinks, setTitle]);

  useEffect(() => {
    console.log('Main data changed...');
    if (currentUser) {
      setUserFormSchema(createUserSchema());
      return;
    }
    console.log('Not logged in - not loading user from schema.');
    setUserFormSchema(undefined);
  }, [currentUser]);

  // Mutations
  const saveUser = useMutation({
    mutationFn: postUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  if (userId === undefined) {
    return (
      <>
        <div className="error access">No userId proivided.</div>
        {DEV_MODE && <div className="dev error access">No userId provided.</div>}
      </>
    );
  }

  if (userId !== null && userQuery.failureReason) {
    console.log('Setting title on failure...', userQuery.failureReason);
    setTitle('Edit user - failed loading');
    return (
      <>
        <div className="error access">
          Failed loading user {userId}: {userQuery.failureReason.message}
        </div>
        {DEV_MODE && <div className="dev error access">{userQuery.failureReason.message}.</div>}
      </>
    );
  }

  if (!userFormSchema) {
    return <div>Loading...</div>;
  }

  return (
    // hasPermission={!(eventFormSchema !== undefined && !(organisations?.length > 0))}
    // isLoading={!eventFormSchema || seriesQuery.isLoading || eventQuery.isLoading || organisationQuery.isLoading}
    // hasLoadError={seriesQuery.isError || eventQuery.isError || organisationQuery.isError}
    <Form
      schema={userFormSchema}
      validator={validator}
      uiSchema={userUiSchema}
      formData={userQuery.data}
      onChange={log('changed')}
      onSubmit={async (d, e) => {
        log('submitted');
        console.log('data: ', d);
        console.log('event: ', e);
        await saveUser.mutateAsync(d.formData);
      }}
      // onSubmit={(e) => submit(e.formData)}
      onError={log('errors')}
    />
  );
};

export const MemoizedUserFormPage = React.memo(UserFormPage);
