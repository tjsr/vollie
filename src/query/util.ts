import { IdType, ModelType } from "../model/id";
import { InvalidContentError, InvalidContentTypeError, NotFoundError, VollieError } from "../errors";
import { MutationFunction, QueryClient, UseQueryResult, useMutation } from "@tanstack/react-query";

import { NavigateFunction } from "react-router-dom";
import { User } from "../model/entity";
import { WithId } from "../orm/drizzle/idTypes";
import { useQuery } from "@tanstack/react-query";

export const genericSave = async <NewTO, Model extends ModelType>(urlPrefix: string, obj: Model, conversionFunction: (data: Model) => NewTO): Promise<Model> => {
  if (obj.id !== undefined) {
    const url = `${urlPrefix}/${obj.id}`;
    return callGenericApiPut(url, conversionFunction, obj);
  } else {
    return callGenericApiPost(urlPrefix, conversionFunction, obj);
  }
};

export const callGenericApiPost = async <NewTO, Model>(url: string, conversionFunction: (data: Model) => NewTO, data: Model): Promise<Model> => {
  const apiUrl: string = '/api' + url;
  const formTransferObject: NewTO = conversionFunction(data);
  const body = JSON.stringify(formTransferObject);
  console.trace(callGenericApiPost.name, apiUrl, data, formTransferObject);
  const response: Response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  
  const json = response.json().then((value) => value as Model).catch((err) => {
    if (response.status >= 400) {
      console.error(`HTTP ${response.status} returned while submitting generic POST to ${apiUrl}`, err.message, body);
    } else {
      console.error(`Failed while submitting generic POST to ${apiUrl}`, err.message, body);
    }
    throw err;
  });
  return json;
};


export const callGenericApiPut = async <ExistingTO, Model>(url: string, conversionFunction: (data: Model) => ExistingTO, data: Model): Promise<Model> => {
  const apiUrl: string = '/api' + url;
  const formTransferObject: ExistingTO = conversionFunction(data);
  const body = JSON.stringify(formTransferObject);
  console.trace(callGenericApiPut.name, 'PUT', apiUrl, 'Data:', data);
  console.trace(callGenericApiPut.name, 'PUT', apiUrl, 'TO:', formTransferObject);
  const response: Response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  
  const json = response.json().then((value) => value as Model).catch((err) => {
    if (response.status >= 400) {
      console.error(`HTTP ${response.status} returned while submitting generic PUT to ${apiUrl}`, err.message, body);
    } else {
      console.error(`Failed while submitting generic PUT to ${apiUrl}`, err.message, body);
    }
    throw err;
  });
  return json;
};

export const checkContentType = (response: Response, url: string, contentType: string = 'application/json'): void => {
  const received = response.headers.get('content-type');
  let error: VollieError|undefined = undefined;
  if (!received) {
    error = new InvalidContentError(`No content type while fetching ${url}`);
  } else if (received !== contentType) {
    error = new InvalidContentTypeError(received, url, contentType)
  }
  if (error) {
    error.status = response.status;
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchJson = async <O extends WithId<ID, any>, ID extends IdType>(url: string, currentUser: User|undefined|null): Promise<O> => {
  const fetchUrl = '/api' + url;
  const response = await fetch(fetchUrl, { method: 'GET', headers: { 'Content-Type': 'application/json', 'User': currentUser?.email || 'none' } });
  checkContentType(response, fetchUrl);
  if (response.status === 404) {
    throw new NotFoundError(`Failed to fetch ${url}`);
  } else if (response.status >= 400) {
    console.error(fetchJson.name,'GET', fetchUrl, response.status, `Error response fetching JSON`, response);
    throw new Error(`Failed to fetch ${fetchUrl}`);
  }
  const json = response.json().then((value) => {
    console.log(fetchJson.name, 'GET', fetchUrl, response.status, `Got response`);
    return value as O;
  }).catch((err) => {
    console.error(fetchJson.name,'GET', fetchUrl, response.status, `Failed while fetching JSON`, err.message);
    throw err;
  });
  return json;
};

export const useGenericQuery = <ReturnType extends object, IdType>(
  queryKey: string,
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id: IdType|undefined,
  currentUser: User|null|undefined,
  fetchMethod: (_fetchId: IdType, _fetchCurrentUser: typeof currentUser) => Promise<ReturnType | void>
) => useQuery({
  enabled: !!id,
  queryKey: [queryKey, id],
  queryFn: () => {
    if (!id || (typeof id === 'number' && id <= 0)) {
        console.warn(useGenericQuery.name, `Skipped event load because ${key}Id=${id}`);
        return;
    }

    if (!currentUser) {
      throw new Error('No current user to load event');
    }
    console.log(`Fetching for ${key} ID: ${id}`);
    return fetchMethod(id, currentUser).catch((err) => {
      if (err instanceof NotFoundError) {
        console.error(`${key} not found: ${id}`);
        throw err;
      }
      console.error(useGenericQuery.name, `Failed to fetch ${key}: ${id}`, err, err.status);
      throw err;
    });
  },
});

export const useGenericAllQuery = <ReturnType extends object>(
  queryKey: string,
  currentUser: User|null|undefined,
  fetchAll: (_fetchCurrentUser: typeof currentUser) => Promise<ReturnType[]>) => useQuery({
  queryKey: [queryKey],
  queryFn: () => {
    if (!currentUser) {
      throw new Error(`No current user to load ${queryKey}.`);
    }
    return fetchAll(currentUser);
  },
});


export const useSaveAndRedirectMutation = <M,>(
  navigate: NavigateFunction,
  queryClient: QueryClient,
  query: UseQueryResult<void | M | undefined, Error>,
  saveFn: MutationFunction<M, M> | undefined,
  id: IdType,
  key: string, redirectUrlPrefix: string) => {
  return useMutation({
    mutationFn: saveFn,
    onSuccess: async (obj: M, vars: M, ctx: unknown) => {
      const returnedId: IdType = (obj as WithId<IdType, M>).id as IdType;
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [key] });
      if (!id) {
        console.log('Redirecting to new organisation page.', vars, ctx);
        return queryClient.invalidateQueries({ queryKey: [key] })
          .then(() => navigate(`${redirectUrlPrefix}/${returnedId}`));
      }

      return Promise.all([
        queryClient.invalidateQueries({ queryKey: [key] }),
        query.refetch()
      ]);
    },
  });
};