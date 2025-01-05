import { PageLoadStatus, isReadyStatus, isValidLoadedStatus } from "./util";
import React, { useState } from "react";
import { useCurrentUser, useOrganisation } from "../stores";

import { LoadingScreen } from "./Common";
import { useAllOrganisationsQuery } from "../query/organiser";
import { useEffect } from "react";
import { useUi } from "../stores/ui";

export const OrganisationListPage = (): JSX.Element => {
  const { currentUser } = useCurrentUser();
  const { setFooterLinks, setTitle } = useUi(state => state);
  const [loadingStatus, setLoadingStatus] = useState<PageLoadStatus>(PageLoadStatus.Initialised);
  const orgQuery = useAllOrganisationsQuery(currentUser);

  console.log('Org list page rendering...');

  useEffect(() => {
    console.log('Adding footer link to organisations list page...');
    setFooterLinks([{ target: '/organisation/new', text: 'Create new organisation' }]);

    console.log('Adding organisations page title...');
    setTitle('Organisations');
  }, [setTitle, setFooterLinks]);

  const orgStore = useOrganisation(state => state);
  
  // const orgQuery = useQuery({
  //   queryKey: ['organisation'],
  //   queryFn: () => {
  //     console.log('Fetching for All Organisations');
  //     return fetchOrganisations(currentUser).then((data) => {
  //       orgStore.setOrganisations(data || []);
  //       setLoadingStatus(loadingStatus & ~PageLoadStatus.Loading & ~PageLoadStatus.Error | PageLoadStatus.Loaded);
  //       return data;
  //     });
  //   },
  // });

  useEffect(() => {
    console.log('orgQuery Loading status changed', loadingStatus);
    let updatedStatus = loadingStatus;
    if (orgQuery.isLoading) {
      updatedStatus = updatedStatus | PageLoadStatus.Loading;
    } else {
      if (orgQuery.isError) {
        updatedStatus = updatedStatus & ~PageLoadStatus.Error;
      }
      updatedStatus = updatedStatus & ~PageLoadStatus.Loading;
      
    }
    if (updatedStatus !== loadingStatus) {
      setLoadingStatus(updatedStatus);
    }
  }, [loadingStatus, orgQuery.isLoading, orgQuery.isError]);

  useEffect(() => {
    console.log('Loading status changed', loadingStatus);
    if (isValidLoadedStatus(loadingStatus) && !isReadyStatus(loadingStatus)) {
      setLoadingStatus(loadingStatus | PageLoadStatus.Ready);
    }
  }, [loadingStatus]);

  console.log('Lodaing status:', loadingStatus)
  if (!isReadyStatus(loadingStatus)) {
    return <LoadingScreen
      loadStatus={loadingStatus}
    />
  }

  if (orgQuery.isError) {
    return <p>Error: {orgQuery.error.message}</p>;
  }

  if (orgStore.organisations.length === 0) {
    return <p>No organisations found</p>;
  }

  return <div>
    {orgStore.organisations.map((org) => (
      <div key={org.id}>
        <h3>{org.entityName}</h3>
        <p>Contact: {org.contactUser.email}</p>
      </div>  
    ))}

  </div>;

};

export const MemoizedOrganisationListPage = React.memo(OrganisationListPage);
