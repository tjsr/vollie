import { PageLoadStatus, isReadyStatus } from "./util";
import React, { useState } from "react";
import { useCurrentUser, useOrganisation, useSeries } from "../stores";

import Link from "@mui/material/Link";
import { LoadingScreen } from "./Common";
import { useAllOrganisationsQuery } from "../query/organiser";
import { useEffect } from "react";
import { useSeriesQuery } from "../query/series";
import { useUi } from "../stores/ui";

// import { Series } from "../model/entity";

// import { useQuery } from "@tanstack/react-query";


export const SeriesListPage = (): JSX.Element => {
  // const [userSeries, setUserSeries] = useState<Series[] | undefined>(undefined);
  const seriesStore = useSeries(state => state);

  const { currentUser } = useCurrentUser();
  const { setTitle, setFooterLinks } = useUi(state => state);
  const [loadingStatus, setLoadingStatus] = useState<PageLoadStatus>(PageLoadStatus.Initialised);

  useEffect(() => {
    console.log('Adding footer link to series list page...');
    setFooterLinks([{ target: '/series/new', text: 'Create new series' }]);
    setTitle('Event Series');
  }, [setTitle, setFooterLinks]);

  const seriesQuery = useSeriesQuery(currentUser);
  // useQuery({
  //   queryKey: ['series'],
  //   queryFn: () => {
  //     console.log('Fetching for All Series');
  //     return fetchAllSeries(currentUser).then((data: Series[]) => {
  //       seriesStore.setSeries(data || []);
  //       return data;
  //     });
  //   },
  // });

  useEffect(() => {
    console.log('seriesQuery Loading status changed', loadingStatus);
    if (seriesQuery.isLoading) {
      setLoadingStatus(loadingStatus | PageLoadStatus.Loading);
    } else {
      setLoadingStatus(loadingStatus & ~PageLoadStatus.Loading);
    }
  }, [loadingStatus, seriesQuery.isLoading]);

  useEffect(() => {
    console.log('series store data changed', loadingStatus);
    let updatedStatus = loadingStatus;

    if (seriesStore.series !== undefined) {
      updatedStatus = updatedStatus | PageLoadStatus.Loaded & ~PageLoadStatus.Loading & ~PageLoadStatus.Error;
      if (seriesStore.series.length > 0) {
        updatedStatus = updatedStatus | PageLoadStatus.Ready;
      } else {
        updatedStatus = updatedStatus | PageLoadStatus.ValidEmptyDataSet;
      }
      if (updatedStatus !== loadingStatus) {
        setLoadingStatus(updatedStatus);
      }
    }
  }, [seriesStore.series, loadingStatus]);


  const organisationQuery = useAllOrganisationsQuery(currentUser);

  // const organisationQuery = useQuery({
  //   queryKey: ['organisations'],
  //   queryFn: () => {
  //     console.log('Fetching for All Orgs');
  //     return fetchOrganisations(currentUser);
  //   },
  // });

  const { organisations, setOrganisations } = useOrganisation();

  useEffect(() => {
    console.log('orgs/currentUser changed');
    if (organisationQuery.data) {
      setOrganisations(organisationQuery.data);
    }
  }, [organisationQuery.data, currentUser, setOrganisations]);


  console.log('Organisations:', organisations.length, organisations);

  if (organisations.length === 0) {
    return (<>
      { organisations.length === 0 ? <div className="error nodata orgs">No organisations available for event creation. You will need to <Link href="/organisation/new">create an organisation</Link> before being able to create events.</div> : <></>}
      </>
    );
  }

  console.debug(`Rendering series list page...`);

  if (!isReadyStatus(loadingStatus)) {
    return <LoadingScreen
      loadStatus={loadingStatus}
    />
  }

  if (seriesQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (seriesQuery.isError) {
    return <p>Error: {seriesQuery.error.message}</p>;
  }

  if (seriesStore.series.length === 0) {
    return <p>No series found</p>;
  }

  return <div>
    {seriesStore.series.map((series) => (
      <div key={series.id}>
        <h3>{series.name}</h3>
        <p>{series.description}</p>
      </div>  
    ))}

  </div>;
};

export const MemoizedSeriesListPage = React.memo(SeriesListPage);
