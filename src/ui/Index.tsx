import { Link } from 'react-router-dom';
import { useCurrentUser } from '../stores';
import { useEffect } from 'react';
import { useUi } from '../stores/ui';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Index = (): JSX.Element => {
  const { clearFooterLinks, setTitle } = useUi(state => state);
  useEffect(() => {
    setTitle('Vollie');
    clearFooterLinks();
  },[setTitle, clearFooterLinks]);

  const { currentUser } = useCurrentUser();
  return (
    <>
      <ul>
        <li>
          <Link to="/event/1">Sample event</Link>
        </li>
        <li>
          <Link to="/events">Event list</Link>
        </li>
        <li>
          <Link to="/event/new">New event</Link>
        </li>
        <li>
          <Link to="/series">Series</Link>
        </li>
        <li>
          <Link to="/series/new">New series</Link>
        </li>
        <li>
          <Link to="/organisations">Organisations</Link>
        </li>
        <li>
          <Link to="/organisation/new">New Organisation</Link>
        </li>
        <li>
          <Link to="/users">Users list</Link>
        </li>
        <li>
          <Link to="/user/new">New user</Link>
        </li>
      </ul>

      {!currentUser && <Link to="/login">Login</Link>}
      {currentUser && <Link to="/logout">Logout</Link>}
    </>
  );
};
