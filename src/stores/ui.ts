import { Link } from "react-router-dom";
import { create } from "zustand";

export type LinkElement = typeof Link;
export interface LinkTarget {
  text: string;
  target: string;
}

export interface UiState {
  // footerLinks: LinkElement[];
  footerLinks: LinkTarget[];
  title: string;
  // setFooterLinks: (footers: LinkElement[]) => void;
  setPageTitle: (t: string) => void;
  addLinkTarget: (t: LinkTarget) => void;
}

export const useUi = create<UiState>((set) => ({
  footerLinks: [],
  title: 'Vollie',

  // setFooterLinks: (footerLinks: LinkElement[]) => set( { footerLinks}),
  addLinkTarget: (t: LinkTarget) => set((state) => ({ footerLinks: [...state.footerLinks, t]})),
  setPageTitle: (t: string):void => set( { title: t }),
}));
