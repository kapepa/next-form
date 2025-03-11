export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="container mx-auto"
    >
      <div
        className="h-screen flex flex-col"
      >
        {children}
      </div>
    </div>
  );
}
