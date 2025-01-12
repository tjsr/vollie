import { Organisation, User } from '../model/entity';
import { PageLoadStatus, isReadyStatus, isValidLoadedStatus, pageLoadStatusString } from './util';
import React, { useState } from 'react';
import { useCurrentUser, useOrganisation } from '../stores';

import Link from '@mui/material/Link';
import { LoadingScreen } from './Common';
import { useAllOrganisationsQuery } from '../query/organiser';
import { useEffect } from 'react';
import { useUi } from '../stores/ui';

const ContactSummary = ({ contactUser }: { contactUser: Partial<User> }): React.ReactNode => {
  const idEmail = `${contactUser.id}-email`;
  const idName = `${contactUser.id}-name`;
  console.debug('ContactSummary', 'Got User', contactUser);
  const hasContactDetails = contactUser.firstName || contactUser.lastName || contactUser.email;
  if (hasContactDetails) {
    return <div>Organisation had contact which has no details available</div>;
  }
  return (
    <div className="contact-detail">
      <h4>Contact</h4>
      {(contactUser.firstName || contactUser.lastName) && (
        <>
          <label htmlFor={idName}>Name</label>
          <span id={idName} className="name">
            <span className="firstName">{contactUser.firstName}</span>
            <span className="lastName">{contactUser.lastName}</span>
          </span>
        </>
      )}
      {contactUser.email && (
        <>
          <label htmlFor={idEmail}>email</label>
          <span id={idEmail} className="email">
            {contactUser.email}
          </span>
        </>
      )}
    </div>
  );
};

const OrganisationDetailPane = ({ organisation }: { organisation: Organisation }): React.ReactNode => {
  const user = organisation.contactUser;
  const orgLink = `/organisation/${organisation.id}`;

  if (!user) {
    return (
      <div className="organisation-detail error">
        <h3>{organisation.entityName}</h3>
        <Link href={orgLink}>Edit</Link>
        <div className="errorMessage">Organisation has no contact user.</div>
      </div>
    );
  }

  return (
    <div className="organisation-detail">
      <h3>{organisation.entityName}</h3>
      <Link href={orgLink}>Edit</Link>
      <ContactSummary contactUser={user} />
    </div>
  );
};

export const OrganisationListPage = (): JSX.Element => {
  const { currentUser } = useCurrentUser();
  const { setFooterLinks, setTitle } = useUi((state) => state);
  const [loadingStatus, setLoadingStatus] = useState<PageLoadStatus>(PageLoadStatus.Initialised);
  const orgQuery = useAllOrganisationsQuery(currentUser);

  console.log('Org list page rendering...');

  useEffect(() => {
    console.log('Adding footer link to organisations list page...');
    setFooterLinks([{ target: '/organisation/new', text: 'Create new organisation' }]);

    console.log('Adding organisations page title...');
    setTitle('Organisations');
  }, [setTitle, setFooterLinks]);

  const orgStore = useOrganisation((state) => state);

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
    console.log('orgQuery data changed', orgQuery.data);
    if (orgQuery.data && orgQuery.data !== orgStore.organisations) {
      orgStore.setOrganisations(orgQuery.data);
    }
  }, [orgQuery.data, orgStore]);

  useEffect(() => {
    console.log('orgQuery Loading status changed', pageLoadStatusString(loadingStatus));
    let updatedStatus = loadingStatus;
    if (orgQuery.isLoading) {
      updatedStatus = updatedStatus | PageLoadStatus.Loading;
    } else {
      updatedStatus = updatedStatus & ~PageLoadStatus.Loading;
    }
    if (orgQuery.isError) {
      updatedStatus = updatedStatus | PageLoadStatus.Error;
    }
    if (isValidLoadedStatus(updatedStatus) && !isReadyStatus(updatedStatus)) {
      updatedStatus = updatedStatus | PageLoadStatus.Ready;
    }

    if (updatedStatus !== loadingStatus) {
      setLoadingStatus(updatedStatus);
    }
  }, [loadingStatus, orgQuery.isLoading, orgQuery.isError]);

  console.log('Lodaing status:', pageLoadStatusString(loadingStatus));
  if (!isReadyStatus(loadingStatus)) {
    return <LoadingScreen loadStatus={loadingStatus} />;
  }

  if (orgQuery.isError) {
    return <p>Error: {orgQuery.error.message}</p>;
  }

  if (orgStore.organisations === undefined || orgStore.organisations.length === 0) {
    return <p>No organisations found</p>;
  }

  return (
    <>
      {orgStore.organisations.map((org: Organisation) => (
        <OrganisationDetailPane key={org.id} organisation={org} />
      ))}
    </>
  );
};

export const MemoizedOrganisationListPage = React.memo(OrganisationListPage);
