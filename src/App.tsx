/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { FooterLinks } from './ui/Common.js';
import { VollieHeader } from './ui/Header.js';
import { VollieRoutes } from './ui/Routes.js';

// import { UiState, useUi } from './stores/ui.js';
// import { useCurrentUser } from './stores/index.js';

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
const _eventLoader = (params: any) => {
  console.log(`Event context loader: ${JSON.stringify(params)}`);
  const result: EventParams = {
    loginUsername: 'test@tjsr.id.au',
  };

  if (params) {
    result.eventId = params.eventId;
  }
  return params;
};

interface RootParams {}

// @ts-expect-error 6133
const rootLoader = (params: RootParams) => {
  console.log(`Root loader context: ${JSON.stringify(params)}`);
  return {
    loginUsername: 'test@tjsr.id.au',
  };
};

//const FOOTERS_ENABLED = false;

const App = (): JSX.Element => {
  // const [loginUsername, _setLoginUsername] = useState<string|undefined>(defaultUser);

  const queryClient = new QueryClient();
  // const { currentUser } = useCurrentUser();
  // const [additionalFooters, setAdditionalFooters] = useState<JSX.Element | null>(null);
  // const [title, setTitle] = useState<string>('Vollie');
  // const uiState: UiState = useUi(state => state);
  // const title = useUi(state => state.title);
  // const [uiPropState, setPropState] = useState<VolliePageProps>({ currentUser, addFooterLink: uiState.addFooterLink, setTitle: uiState.setTitle });

  // const safeSetAdditionalFooters = (footerComponents: JSX.Element[]): void => {
  //   if (FOOTERS_ENABLED) {
  //     // if (additionalFooters !== footerComponents) {
  //     setAdditionalFooters(<>{footerComponents.map((c) => <div>{c}</div>) || <></>}</>);
  //     // }
  //   }
  // };

  // const safeSetTitle = (newTitle: string): void => {
  //   if (newTitle !== title) {
  //     setTitle(newTitle);
  //   }
  // };

  // const appProps: VolliePageProps = {
  //   currentUser: useCurrentUser(state => state.currentUser),
  //   addFooterLink: useUi(state => state.addLinkTarget),
  //   setTitle: useUi(state => state.setPageTitle),
  // };

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

  console.log('Returning app router...');
  return (
    <>
      <VollieHeader />
      <QueryClientProvider client={queryClient}>
        <VollieRoutes />
      </QueryClientProvider>
      <FooterLinks />
    </>
  );
};

export default App
