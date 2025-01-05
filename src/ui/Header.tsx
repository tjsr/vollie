import { useCurrentUser } from "../stores";
import { useUi } from "../stores/ui";

export const VollieHeader = (): React.ReactNode => {
  const currentUser = useCurrentUser(state => state.currentUser);
  const idString =
  currentUser !== null
    ? `${currentUser?.firstName} ${currentUser?.lastName} (${currentUser?.email})`
    : 'Not logged in';

  const { title } = useUi(state => state);

  return (
    <header>
      {currentUser && <div className="loginUser">{idString}</div>}
      <h2>{title}</h2>
    </header>)
};
