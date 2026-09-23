"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/menu", label: "Manajemen Menu", icon: "🍔" },
    { href: "/admin/employees", label: "Karyawan", icon: "👥" },
    { href: "/admin/attendance", label: "Absensi", icon: "⏱️" },
    { href: "/admin/finance", label: "Keuangan", icon: "💰" },
    { href: "/admin/salary", label: "Penggajian", icon: "💵" },
  ];

  return (
    <div className="dashboard-layout animate-fade-in">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/logo.png" alt="Logo" style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "contain" }} />
          <span>Bichito</span> Kasir
        </div>
        <nav>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-link ${
                pathname === link.href ? "active" : ""
              }`}
            >
              <span style={{ fontSize: "1.25rem" }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
