import { useProfileMyselfServer } from "../../hooks/use-profile-myself-server";
import { FormUser } from "./component/form-user";

export default async function Profile(props: any) {
  const { profile } = await useProfileMyselfServer();

  return (
    <div
      className="grow flex justify-center items-center"
    >
      <FormUser
        profile={profile}
      />
    </div>
  );
}
