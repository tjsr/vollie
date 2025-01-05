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
  return (<>
    <ul>
      <li><Link to="/event/1">Event</Link></li>
      <li><Link to="/events">Event list</Link></li>
      <li><Link to="/organisations">Organisations</Link></li>
      <li><Link to="/series">Series</Link></li>
      <li><Link to="/organisation/new">New Organisation</Link></li>
    </ul>

    { !currentUser && <Link to="/login">Login</Link> }
    { currentUser && <Link to="/logout">Logout</Link> }
  </>);
};
