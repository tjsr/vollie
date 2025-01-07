import React, { useEffect } from 'react';

import { useAllEventsQuery } from '../query/event';
import { useCurrentUser } from '../stores';
import { useUi } from '../stores/ui';

// interface EventListPageProps extends VolliePageProps {}

export const EventListPage = (): React.ReactNode => {
const { setFooterLinks, setTitle } = useUi(state => state);
const { currentUser } = useCurrentUser(state => state);

const eventQuery = useAllEventsQuery(currentUser);

// useEffect(() => {
//   console.log('Adding footer link to event list page...');
  // addFooterLink({ target: '/event/new', text: 'Create new event' });
  // setTitle('Events');
// }, [setTitle, addFooterLink]);


  useEffect(() => {
    console.log('Adding footer link to event list page...');
    setFooterLinks([{ target: '/event/new', text: 'Create new event' }]);
    setTitle('Events');
  }, [setTitle, setFooterLinks]);

  if (eventQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (eventQuery.isError) {
    return <div>Error: {eventQuery.error.message}</div>;
  }

  if (eventQuery.data?.length === 0) {
    return <div>No events found</div>;
  }

  if (eventQuery.data === undefined) {
    return <div>Event data is undefined</div>;
  }

  console.log('Event data:', eventQuery.data);

  return (
    <div>
      {eventQuery.data?.map((event) => (
        <div>
          <div className="event-list-item">{event.name}</div>
        </div>
      ))}
    </div>
  );
};

export const MemoizedEventListPage = React.memo(EventListPage);
