import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-center" style={{ height: "100vh", flexDirection: "column", gap: "2rem" }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
          <img src="/logo.png" alt="Bichito Logo" style={{ width: "80px", height: "80px", objectFit: "contain", borderRadius: "50%" }} />
          <h1 style={{ fontSize: "3.5rem", margin: 0 }}>
            Bichito <span style={{ color: "var(--primary)" }}>Kasir</span>
          </h1>
        </div>
        <p style={{ fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
          Sistem Manajemen F&B yang elegan. Kelola absensi, keuangan, penggajian karyawan, dan menu makanan dengan mudah.
        </p>
      </div>

      <div style={{ display: "flex", gap: "1.5rem" }}>
        <Link href="/pos" className="btn btn-primary" style={{ fontSize: "1.2rem", padding: "1rem 2.5rem", borderRadius: "12px" }}>
          Buka Mesin Kasir &rarr;
        </Link>
        <Link href="/admin/dashboard" className="btn btn-secondary" style={{ fontSize: "1.2rem", padding: "1rem 2.5rem", borderRadius: "12px", background: "rgba(255,255,255,0.05)" }}>
          Panel Admin
        </Link>
      </div>
    </div>
  );
}
