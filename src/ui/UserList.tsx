import React, { useEffect } from 'react';

import { Link } from '@mui/material';
import { useAllUsersQuery } from '../query/user';
import { useCurrentUser } from '../stores';
import { useUi } from '../stores/ui';

// interface EventListPageProps extends VolliePageProps {}

export const UsersListPage = (): React.ReactNode => {
  const { setFooterLinks, setTitle } = useUi((state) => state);
  const { currentUser } = useCurrentUser((state) => state);

  const userQuery = useAllUsersQuery(currentUser);

  // useEffect(() => {
  //   console.log('Adding footer link to event list page...');
  // addFooterLink({ target: '/event/new', text: 'Create new event' });
  // setTitle('Events');
  // }, [setTitle, addFooterLink]);

  useEffect(() => {
    console.log('Adding footer link to user list page...');
    setFooterLinks([{ target: '/user/new', text: 'Create new user' }]);
    setTitle('Users');
  }, [setTitle, setFooterLinks]);

  if (userQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (userQuery.isError) {
    return <div>Error: {userQuery.error.message}</div>;
  }

  if (userQuery.data?.length === 0) {
    return <div>No users found</div>;
  }

  if (userQuery.data === undefined) {
    return <div>User data is undefined</div>;
  }

  console.log('User data:', userQuery.data);

  return (
    <ul className="user-list">
      {userQuery.data?.map((user) => (
        <li className="user-list-item">
          <Link href={`/user/${user.id}`}>
            {user.firstName} {user.lastName}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const MemoizedUsersListPage = React.memo(UsersListPage);
