import { ListPageProps } from "./types";

export const SeriesListPage = ({ addFooterLink, setTitle }: ListPageProps): JSX.Element => {
  console.debug(`Rendering series list page...`);
  addFooterLink({ target: '/series/new', text: 'Create new series' });
  setTitle('Series');
  return <div></div>;
};
