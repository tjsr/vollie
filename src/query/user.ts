import { callGenericApiPost, callGenericApiPut, fetchJson, genericSave, useGenericAllQuery, useGenericQuery } from "./util";

import { NewUserTO } from "../model/to";
import { User } from "../model/entity";
import { UserId } from "../model/id";

const userFormToUserTO = (data: User): NewUserTO => {
  const to: NewUserTO = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
  };
  return to;
};

export const fetchUsers = async (currentUser: User|undefined|null): Promise<User[]> => {
  return fetchJson(`/users`, currentUser);
};

export const fetchUser = async (userId: UserId, currentUser: User|undefined|null): Promise<User> => {
  return fetchJson(`/user/${userId}`, currentUser);
}

export const saveUser = async (user: User): Promise<User> => {
  return genericSave('/user', user, userFormToUserTO);
};

export const postUser = async (user: User): Promise<User> => {
  return callGenericApiPost('/user', userFormToUserTO, user);
};

export const putUser = async (user: User): Promise<User> => {
  return callGenericApiPut('/user', userFormToUserTO, user);
};

export const useUserQuery = (currentUser: User|null|undefined, userId: UserId|undefined) => useGenericQuery(
  'user', 'user', userId, currentUser, fetchUser
);

export const useAllUsersQuery = (currentUser: User|null|undefined) => useGenericAllQuery(
  'user', currentUser, fetchUsers
);
