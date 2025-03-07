import { create } from 'zustand'
import { UserDtoType } from '../../../dto/user.dto';
import { Id } from '../../../convex/_generated/dataModel';
import { IProfileFormDto } from '../../../dto/profile-form.dto';

interface IRegistrationStore {
  profile: IProfileFormDto;
  setProfile: (profile: UserDtoType) => void,
  setValue: (props: { field: keyof IProfileFormDto, value: any }) => void,
}

export const usePfofileStore = create<IRegistrationStore>((set) => ({
  profile: {
    _id: "" as Id<"user">,
    name: "",
    email: "",
    avatar: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  },
  setProfile: (profile: UserDtoType) => set((state) => ({ ...state, profile: Object.assign(state.profile, profile) })),
  setValue: ({ field, value }) => set((state) => ({ ...state, profile: Object.assign(state.profile, { [field]: value }) })),
}))