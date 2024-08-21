export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="md:p-5">{children}</div>;
}
