import { CurrentUserState } from "./currentUser.js";
import { OrganisationsState } from "./organisation.js";
import { SeriesState } from "./series.js";
import { UserState } from "./user.js";

export type StateSet = {
  currentUser: CurrentUserState,
  series?: SeriesState,
  organisations: OrganisationsState,
  users: UserState,
};
