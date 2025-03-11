import { HeaderNav } from "@/components/header-nav";
import { useProfileMyselfServer } from "../../hooks/use-profile-myself-server";

export default async function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { profile } = await useProfileMyselfServer();

  return (
    <div
      className="container mx-auto "
    >
      <div
        className="h-screen flex flex-col"
      >
        <div>
          <HeaderNav
            profile={profile}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
