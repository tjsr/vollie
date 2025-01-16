import { LinkTarget } from "../stores/ui";
import { User } from "../model/entity";

export interface FooterLinkManager {
  addFooterLink: (t: LinkTarget) => void;
  clearFooterLinks: () => void;
  setFooterLinks: (footerLinks: LinkTarget[]) => void;
}

export interface TitleManager {
  setTitle: (t: string) => void;
}

export interface VolliePageProps extends FooterLinkManager, TitleManager {
  currentUser?: User | null;
}

export interface ListPageProps extends VolliePageProps {
}
