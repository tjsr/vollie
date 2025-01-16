import { Link } from "react-router-dom";
import { VolliePageProps } from "../ui/types";
import { create } from "zustand";

export type LinkElement = typeof Link;
export interface LinkTarget {
  text: string;
  target: string;
}

export interface UiState extends VolliePageProps {
  // footerLinks: LinkElement[];
  footerLinks: LinkTarget[];
  title: string;
  // setFooterLinks: (footers: LinkElement[]) => void;
  // setPageTitle: (t: string) => void;
  // addLinkTarget: (t: LinkTarget) => void;
}

export const useUi = create<UiState>((set) => ({
  footerLinks: [],
  title: 'Vollie',

  // setFooterLinks: (footerLinks: LinkElement[]) => set( { footerLinks}),
  addFooterLink: (t: LinkTarget) => set((state) => {
    if (!state.footerLinks.includes(t)) {
      return { title: state.title, footerLinks: [...state.footerLinks, t]};
    }
    return state;
  }),
  clearFooterLinks: () => set((state) => {
    return { title: state.title, footerLinks: [] };
  }),
  setFooterLinks: (updatedFooterLinks: LinkTarget[]) => set((state) => {
    const outputLinks = {
      title: state.title,
      footerLinks: [
        ...updatedFooterLinks,
        { text: 'Back to main', target: '/' }
      ]
    };

    if (JSON.stringify(outputLinks.footerLinks) === JSON.stringify(state.footerLinks)) {
      return state;
    }
    console.log('Footer links changed', outputLinks, state.footerLinks);
    return outputLinks;
  }),
  setTitle: (t: string):void => set((state) => {
    if (t !== state.title) {
      return { title: t, footerLinks: state.footerLinks };
    }
    return state;
  }),
}));
