import { PageLoadStatus, pageLoadStatusString } from './util';

import { Link } from '@mui/material';
import { useUi } from '../stores/ui';

interface LoadingScreenProps {
  children?: React.ReactNode;
  loadStatus: PageLoadStatus;
}

export const LoadingScreen = ({ children, loadStatus }: LoadingScreenProps): React.ReactNode => {
  if (loadStatus & PageLoadStatus.InsufficientPrivileges) {
    return <div className="error access">Permission denied.</div>;
  }

  if (loadStatus & PageLoadStatus.Loading) {
    return <div className="loading">Loading form data...</div>;
  }

  if (loadStatus & PageLoadStatus.SchemaNotLoaded) {
    return <div className="loading">Form schema loading...</div>;
  }

  if (loadStatus & PageLoadStatus.Error) {
    return <div className="error">Error loading data.</div>;
  }

  if (loadStatus & PageLoadStatus.ValidEmptyDataSet) {
    return <div className="error">No data found.</div>;
  }

  return (
    <>
      Loading screen. LoadStatus: {pageLoadStatusString(loadStatus)} {children ? 'Children:' + children : <></>}
    </>
  );
};

export const FooterLinks = (): React.ReactNode => {
  const footerLinks = useUi((state) => state.footerLinks);

  return (
    <footer>
      {footerLinks.map((l) => (
        <div className="link">
          <Link href={l.target}>{l.text}</Link>
        </div>
      ))}
    </footer>
  );
};

export const RequiredDataError = ({
  condition = false,
  missingType,
  creationType,
}: {
  condition?: boolean;
  missingType: string;
  creationType: string;
}): JSX.Element => {
  if (!condition) {
    return <></>;
  }
  return (
    <div className={`error nodata ${missingType}`}>
      No {missingType} available for event creation. You will need to{' '}
      <Link href={`/${missingType}/new`}>create a {missingType}</Link> before being able to create {creationType}.
    </div>
  );
};
