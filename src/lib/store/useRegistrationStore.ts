import { z } from 'zod'
import { create } from 'zustand'
import { registrationSchema } from '../schemas/registration-schema'

type RegistrationSchemaType = z.infer<typeof registrationSchema>;

interface IRegistrationStore extends RegistrationSchemaType {
  changeValues: (newValues: Partial<RegistrationSchemaType>) => void
}

export const useRegistrationStore = create<IRegistrationStore>((set) => ({
  name: "Karma",
  email: "karma@gmail.com",
  password: "Uva123456",
  confirmPassword: "Uva123456",
  changeValues: (newValues) => set((state) => ({ ...state, ...newValues })),
}))