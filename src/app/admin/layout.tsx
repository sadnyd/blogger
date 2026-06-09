export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">Admin Dashboard</h2>
        </div>
        <nav className="p-4 space-y-2">
          <a href="/admin" className="block px-4 py-2 rounded hover:bg-gray-100">Posts</a>
          <a href="/" className="block px-4 py-2 rounded hover:bg-gray-100">Back to Site</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
