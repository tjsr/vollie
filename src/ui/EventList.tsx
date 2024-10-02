import { VolliePageProps } from './types';

interface EventListPageProps extends VolliePageProps {}

export const EventListPage = ({ addFooterLink, setTitle }: EventListPageProps): JSX.Element => {
  addFooterLink({ target: '/event/new', text: 'Create new event' });
  setTitle('Events');
  return <div></div>;
};
