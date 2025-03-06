import { create } from 'zustand'
import { Doc } from '../../../convex/_generated/dataModel';

type User = Doc<"user">;

interface IRegistrationStore {
  profile: null | User;
  setProfile: (profile: User) => void,
}

export const usePfofileStore = create<IRegistrationStore>((set) => ({
  profile: null,
  setProfile: (profile: User) => set((state) => ({ ...state, profile })),
}))