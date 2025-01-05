import { Link } from "react-router-dom";
import { PageLoadStatus } from "./util";
import { useUi } from "../stores/ui";

interface LoadingScreenProps {
  children?: React.ReactNode;
  loadStatus: PageLoadStatus;
}

export const LoadingScreen = ({ children, loadStatus }: LoadingScreenProps): React.ReactNode => {
  if (loadStatus & PageLoadStatus.InsufficientPrivileges) {
    return <div className="error access">Permission denied.</div>;
  }

  if (loadStatus & PageLoadStatus.Loading) {
    return (<div className="loading">Loading form schema...</div>);
  }

  if (loadStatus & PageLoadStatus.Error) {
    return (<div className="error">Error loading data.</div>);
  }

  if (loadStatus & PageLoadStatus.ValidEmptyDataSet) {
    return (<div className="error">No data found.</div>);
  }

  return <>Loading screen. LoadStatus: {loadStatus} { children ? 'Children:' + children : <></> }</>;
};

export const FooterLinks = (): React.ReactNode => {
  const footerLinks = useUi(state => state.footerLinks);
  
  return (
    <footer>
      {footerLinks.map((l) => (
        <div className="link">
          <Link to={l.target}>{l.text}</Link>
        </div>
      ))}
  </footer>
  );
};