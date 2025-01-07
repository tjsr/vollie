import { NewUserTO } from "../model/to";
import { User } from "../model/entity";
import { callGenericApiPost } from "./util";

const userFormToUserTO = (data: User): NewUserTO => {
  const to: NewUserTO = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
  };
  return to;
};

export const postUser = async (user: User): Promise<void> => { // Promise<RaceEvent> => {
  await callGenericApiPost('/event', userFormToUserTO, user);
};
