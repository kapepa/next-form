import { z } from 'zod'
import { create } from 'zustand'
import { registrationSchema } from '../schemas/registration-schema'

type RegistrationSchemaType = z.infer<typeof registrationSchema>;

interface IRegistrationStore extends RegistrationSchemaType {
  changeValues: (newValues: Partial<RegistrationSchemaType>) => void
}

export const useRegistrationStore = create<IRegistrationStore>((set) => ({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  changeValues: (newValues) => set((state) => ({ ...state, ...newValues })),
}))