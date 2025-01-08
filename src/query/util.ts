import { InvalidContentError, NotFoundError } from "../types";

import { IdType } from "../model/id";
import { User } from "../model/entity";
import { WithId } from "../orm/drizzle/idTypes";
import { useQuery } from "@tanstack/react-query";

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
  console.trace(callGenericApiPost.name, apiUrl, data, formTransferObject);
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
  if (response.headers.get('content-type') !== contentType) {
    throw new InvalidContentError(`Invalid content type while fetching ${url}`);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchJson = async <O extends WithId<ID, any>, ID extends IdType>(url: string, currentUser: User|undefined|null): Promise<O> => {
  const fetchUrl = '/api' + url;
  console.log(`fetchJson ${fetchUrl} called`);
  const response = await fetch(fetchUrl, { method: 'GET', headers: { 'Content-Type': 'application/json', 'User': currentUser?.email || 'none' } });
  checkContentType(response, url);
  if (response.status === 404) {
    throw new NotFoundError(`Failed to fetch ${url}`);
  } else if (response.status >= 400) {
    console.error(`Failed to fetch ${fetchUrl}`, response);
    throw new Error(`Failed to fetch ${fetchUrl}`);
  }
  console.log(`fetchJson ${fetchUrl} got response`);
  const json = response.json().then((value) => value as O).catch((err) => {
    console.error(`Failed while fetching JSON from ${fetchUrl}`, err.message);
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
        console.warn(`Skipped event load because ${key}Id=${id}`);
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
      console.error(`Failed to fetch ${key}: ${id}`, err);
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
