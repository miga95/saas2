export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 h-full p-4 space-y-4">
      {children}
    </div>
  );
}