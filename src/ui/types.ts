import { LinkTarget } from "../stores/ui";
import { User } from "../model/entity";

export interface VolliePageProps {
  // addFooterLink: (elements: LinkElement[]) => void;

  addFooterLink: (elements: LinkTarget) => void;
  clearFooterLinks: () => void;
  setFooterLinks: (elements: LinkTarget[]) => void;
  setTitle: (title: string) => void;
  currentUser?: User | null;
}

export interface ListPageProps extends VolliePageProps {
}
