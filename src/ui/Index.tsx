import { Link } from 'react-router-dom';
/* eslint-disable @typescript-eslint/no-explicit-any */
import reactLogo from '../assets/react.svg';
import { useState } from "react";
import viteLogo from '../assets/vite.svg';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Index = (context: any & { loginUsername?: string }, _loginUsername: string ): JSX.Element => {
  const [count, setCount] = useState(0);
  console.log(`Root context: ${JSON.stringify(context)}`);

  return (<>
  {/* <Routes>
    <Route index element={<Root />} />
    <Route path="/event" element={<Event loginUsername={context.loginUsername} />} />
    <Route path="/event/:eventId" element={<Event loginUsername={context.loginUsername} />} />
  </Routes> */}
    <h1>Root</h1>
    { context.loginUsername && <h2>Logged in, {context.loginUsername}!</h2> }
    <ul>
      <li><Link to="/event/1">Event</Link></li>
      <li><a href="/events">Event list</a></li>
      <li><a href="/organistions">Organisations</a></li>
      <li><a href="/series">Series</a></li>
      <li><a href="/organisation/new">New Organisation</a></li>
    </ul>
    <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      { !context.loginUsername && <a href="#login">Login</a> }
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR.
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
  </>);
};
