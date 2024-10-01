import { InvalidContentError, NotFoundError } from "../types";

import { IdType } from "../model/id";
import { User } from "../model/entity";
import { WithId } from "../orm/drizzle/idTypes";

export const genericPost = async <NewTO, Model>(url: string, converstionFunction: (data: Model) => NewTO, data: Model): Promise<Model> => {
  const formTransferObject: NewTO = converstionFunction(data);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formTransferObject),
  });
  return response.json();
};

export const checkContentType = (response: Response, url: string, contentType: string = 'application/json'): void => {
  if (response.headers.get('content-type') !== contentType) {
    throw new InvalidContentError(`Invalid content type while fetching ${url}`);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchJson = async <O extends WithId<ID, any>, ID extends IdType>(url: string, currentUser: User|undefined|null): Promise<O> => {
  console.log(`fetchJson ${url} called`);
  const response = await fetch("/api" + url, { method: 'GET', headers: { 'Content-Type': 'application/json', 'User': currentUser?.email || 'none' } });
  checkContentType(response, url);
  if (response.status === 404) {
    throw new NotFoundError(`Failed to fetch ${url}`);
  } else if (response.status >= 400) {
    console.error(`Failed to fetch ${url}`, response);
    throw new Error(`Failed to fetch ${url}`);
  }
  console.log(`fetchJson ${url} got response`);
  const json = response.json() as unknown as O;
  return json;
};
