import { ListPageProps } from "./types";

export const OrganisationListPage = ({ currentUser } : ListPageProps ): JSX.Element => {
  const idString = currentUser !== null ?
    `${currentUser?.firstName} ${currentUser?.lastName} (${currentUser?.email})` :
    'Not logged in';
  return (
    <div>
      <h2>Organisations</h2>
      <div>User: { idString } </div>

    </div>
  );
};
