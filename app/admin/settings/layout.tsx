import type React from "react"

export default function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto py-6">
      <div className="flex gap-6">
        <aside className="w-64">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">Settings</h2>
            <nav className="space-y-2">
              <a href="/admin/settings" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                General
              </a>
              <a
                href="/admin/settings/language"
                className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Language
              </a>
              <a
                href="/admin/settings/appearance"
                className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Appearance
              </a>
            </nav>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
