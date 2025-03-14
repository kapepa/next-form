import { useProfileMyselfServer } from "./use-profile-myself-server"

export const useGetOwnPostById = async (postId: string) => {
  const { profile } = await useProfileMyselfServer()
}
