import { ListPageProps } from "./types";

export const SeriesListPage = ({ currentUser } : ListPageProps ): JSX.Element => {
  console.debug(`Rendering series list page...`);
  const idString = currentUser !== null ?
    `${currentUser?.firstName} ${currentUser?.lastName} (${currentUser?.email})` :
    'Not logged in';
  return (
    <div>
      <h2>Series</h2>
      <div>User: { idString } </div>
      <div><a href="/series/new">Create new series</a></div>
    </div>
  );
};
