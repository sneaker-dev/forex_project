import { AdminRoot } from "@/components/admin/admin-root"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen">
      <AdminRoot>{children}</AdminRoot>
    </div>
  )
}
