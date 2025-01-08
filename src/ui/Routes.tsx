import { Route, Routes } from 'react-router-dom';

import { Index } from './Index';
import { MemoizedEventFormPage } from './Event';
import { MemoizedEventListPage } from './EventList';
import { MemoizedOrganisationFormPage } from './Organisation';
import { MemoizedOrganisationListPage } from './OrganisationList';
import { MemoizedSeriesFormPage } from './Series';
import { MemoizedSeriesListPage } from './SeriesList';
import { MemoizedUserFormPage } from './User';
import { MemoizedUsersListPage } from './UserList';

export const VollieRoutes = (): JSX.Element => (
  <Routes>
    <Route index element={<Index />} />
    <Route path="/event/:eventId" element={<MemoizedEventFormPage />} />
    <Route path="/events" element={<MemoizedEventListPage />} />
    <Route path="/series" element={<MemoizedSeriesListPage />} />
    <Route path="/series/:seriesId" element={<MemoizedSeriesFormPage />} />
    <Route path="/organisations" element={<MemoizedOrganisationListPage />} />
    <Route path="/organisation/:organisationId" element={<MemoizedOrganisationFormPage />} />
    <Route path="/users" element={<MemoizedUsersListPage />} />
    <Route path="/user/:userId" element={<MemoizedUserFormPage />} />
  </Routes>
);
