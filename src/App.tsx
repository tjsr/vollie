/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Route,
  Routes,
} from "react-router-dom";

import { EventFormPage } from './ui/Event.js';
import { EventListPage } from './ui/EventList.js';
import { Index } from './ui/Index.js';
import { OrganisationListPage } from './ui/OrganisationList.js';
import { SeriesListPage } from './ui/SeriesList.js';
import { VolliePageProps } from "./ui/types.js";
import { useCurrentUser } from './stores/index.js';
import { useState } from 'react';

// import * as ReactDOM from 'react-dom';



// const schema: RJSFSchema = {
//   "title": "A registration form",
//   "description": "A simple form example.",
//   "type": "object",
//   "required": [
//     "firstName",
//     "lastName"
//   ],
//   "properties": {
//     "firstName": {
//       "type": "string",
//       "title": "First name",
//       "default": "Chuck"
//     },
//     "lastName": {
//       "type": "string",
//       "title": "Last name"
//     },
//     "password": {
//       "type": "string",
//       "title": "Password",
//       "minLength": 3
//     },
//     "telephone": {
//       "type": "string",
//       "title": "Telephone",
//       "minLength": 10
//     }
//   }
// };

// const formData = {
//   "firstName": "Chuck",
//   "lastName": "Norris",
//   "password": "noneed",
//   "telephone": "1-800-KICKASS"
// };

// const uiSchema = {
//   "firstName": {
//     "ui:autofocus": true,
//     "ui:emptyValue": "",
//     "ui:placeholder": "ui:emptyValue causes this field to always be valid despite being required",
//     "ui:autocomplete": "family-name",
//     "ui:enableMarkdownInDescription": true,
//     "ui:description": "Make text **bold** or *italic*. Take a look at other options [here](https://markdown-to-jsx.quantizor.dev/)."
//   },
//   "lastName": {
//     "ui:autocomplete": "given-name",
//     "ui:enableMarkdownInDescription": true,
//     "ui:description": "Make things **bold** or *italic*. Embed snippets of `code`. <small>And this is a small texts.</small> "
//   },
//   "password": {
//     "ui:widget": "password",
//     "ui:help": "Hint: Make it strong!"
//   },
//   "telephone": {
//     "ui:options": {
//       "inputType": "tel"
//     }
//   }
// };

interface EventParams {
  eventId?: string;
  loginUsername: string;
}

// @ts-expect-error unused
const _eventLoader = (params:any) => {
  console.log(`Event context loader: ${JSON.stringify(params)}`);
  const result: EventParams = {
    loginUsername: 'test@tjsr.id.au',
  };

  if (params) {
    result.eventId = params.eventId;
  }
  return params;
};

interface RootParams {

}

// @ts-expect-error 6133
const rootLoader = (params: RootParams ) => {
  console.log(`Root loader context: ${JSON.stringify(params)}`);
  return {
    loginUsername: 'test@tjsr.id.au',
  };
};

function App() {
  // const [loginUsername, _setLoginUsername] = useState<string|undefined>(defaultUser);

  const queryClient = new QueryClient();
  const { currentUser } = useCurrentUser();
  const [additionalFooters, setAdditionalFooters] = useState<JSX.Element|null>(null);
  const [title, setTitle] = useState<string>('Vollie');

  const safeSetAdditionalFooters = (footerComponents: JSX.Element[]): void => {
    // if (additionalFooters !== footerComponents) {
      // setAdditionalFooters(<>{footerComponents.map((c) => <div>{c}</div>) || <></>}</>);
    // }
  }

  const safeSetTitle = (newTitle: string): void => {
    if (newTitle !== title) {
      setTitle(newTitle);
    }
  };

  const appProps: VolliePageProps = {
    currentUser: currentUser,
    setFooters: safeSetAdditionalFooters,
    setTitle: safeSetTitle,
  };

  // const userStore = useUser();
  // const organisationStore = useOrganisation();
  // const seriesStore = useSeries();
  // const user = useCurrentUser();

  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <Root loginUsername={loginUsername} />,
  //     loader: rootLoader,
  //     children: [
  //       { 
  //         path: "event",
  //         element: <Event loginUsername={loginUsername} />,
  //         loader: eventLoader,
  //       },
  //       {
  //         path: "event/:eventId?",
  //         element: <Event loginUsername={loginUsername} />,
  //         loader: eventLoader,
  //       },
  //     ],
  //   },
  // ]);


  const idString = currentUser !== null ?
  `${currentUser?.firstName} ${currentUser?.lastName} (${currentUser?.email})` :
  'Not logged in';

  console.log('Returning app router...');
  return (<>
    <header>
      { currentUser && <div className="loginUser">{idString}</div> }
      <h2>{title}</h2>
    </header>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route index element={<Index />} />
        <Route path="/event/:eventId" element={<EventFormPage {...appProps} />} />
        <Route path="/event/new" element={<EventFormPage {...appProps} />} />
        <Route path="/event/list" element={<EventListPage {...appProps} />} />
        <Route path="/events" element={<EventListPage {...appProps} />} />
        <Route path="/organisations" element={<OrganisationListPage {...appProps} />} />
        <Route path="/series" element={<SeriesListPage {...appProps} />} />
      </Routes>
    </QueryClientProvider>
    <footer>
      {additionalFooters}
      <div className="linkHome"><a href="/">Back to main</a></div>
      {additionalFooters}
    </footer>
    </>
  )
}

export default App
