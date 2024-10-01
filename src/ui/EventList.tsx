import { Link } from "react-router-dom";
import { VolliePageProps } from "./types";

interface EventListPageProps extends VolliePageProps {

}

export const EventListPage = ({ currentUser, setFooters, setTitle } : EventListPageProps ): JSX.Element => {
  setFooters([
    <div className="newEvent"><Link to="/event/new">Create new event</Link></div>
  ]);
  setTitle('Events');
  return (
    <div>

    </div>
  );
};
