import { Form } from "@rjsf/mui";
import { log } from "./util";
import { uiSchema as userUiSchema } from '../forms/user/uiSchema.js';
import { RJSFSchema } from "@rjsf/utils";
import { useState } from "react";
import validator from '@rjsf/validator-ajv8';
import { QueryClient, useMutation } from "@tanstack/react-query";
import { useCurrentUser } from "../stores/index.js";
import { useIntOrNewParam } from "../stores/useIntOrNewParam.js";

export const UserFormPage = (): JSX.Element => {
  const { userId } = useIntOrNewParam();
  const [userFormSchema, setUserFormSchema] = useState<RJSFSchema | undefined>();
  const { currentUser } = useCurrentUser();
  const queryClient = new QueryClient();

  const userQuery = useUserQuery(userId || undefined, currentUser);
  
    // Mutations
    const saveUser = useMutation({
      mutationFn: postUser,
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    });
  
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
  return (
    <div>
      <h1>User Form</h1>
      <UserForm />
    </div>
  );
}
};