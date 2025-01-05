import { Organisation } from '../model/entity';
import { OrganisationId } from '../model/id';
import { create } from 'zustand';

export interface OrganisationsState {
  organisations: Organisation[];
  fetch: (id: OrganisationId) => Promise<Organisation>;
  setOrganisations: (organisations: Organisation[]) => void;
  addOrganisation: (organisation: Organisation) => void;
  removeOrganisation: (organisation: Organisation) => void;
  updateOrganisation: (organisation: Organisation) => void;
}

export const useOrganisation = create<OrganisationsState>((set) => ({
  organisations: [],

  fetch: async (id: OrganisationId) => {
    // const org = this.organisations.find((org) => org.id === id) as Organisation;
    // set((state) => ({ organisations: [...state.organisations, org] }));
    // return org;
    return { id } as Organisation;
  },
  setOrganisations: (organisations: Organisation[]) => set({ organisations }),
  addOrganisation: (organisation: Organisation) => set((state) => ({ organisations: [...state.organisations, organisation] })),
  removeOrganisation: (organisation: Organisation) => set((state) => ({ organisations: state.organisations.filter((org: Organisation) => org.id !== organisation.id) })),
  updateOrganisation: (organisation: Organisation) => set((state) => ({ organisations: state.organisations.map((org: Organisation) => org.id === organisation.id ? organisation : org) })),
}));
