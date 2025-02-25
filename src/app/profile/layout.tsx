import { HeaderNav } from "@/components/header-nav";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="container mx-auto "
    >
      <div
        className="h-screen flex flex-col"
      >
        <div>
          <HeaderNav />
        </div>
        {children}
      </div>
    </div>
  );
}
