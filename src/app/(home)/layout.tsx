import { HeaderNav } from "@/components/header-nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="container mx-auto"
    >
      <div>
        <HeaderNav />
      </div>
      {children}
    </div>
  );
}
