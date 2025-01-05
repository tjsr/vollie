import { Organisation, User } from "./entity";

export const isUserInOrg = (user: User, org: Organisation): boolean => {
  if (user.organisations === undefined) {
    return false;
  }

  if (user.organisations.map((o) => o.id).includes(org.id)) {
    return true;
  }
  return false;
};
