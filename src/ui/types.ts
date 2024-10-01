import { User } from "../model/entity";

export interface VolliePageProps {
  setFooters: (elements: JSX.Element[]) => void;
  setTitle: (title: string) => void;
  currentUser?: User | null;
}

export interface ListPageProps extends VolliePageProps {
}
