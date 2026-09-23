"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type DashboardStats = {
  totalEmployees: number;
  totalMenuItems: number;
  finance: {
    income: number;
    expense: number;
    profit: number;
  };
  activeCheckIns: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        setStats(await res.json());
      }
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-center" style={{ height: "80vh" }}>
        <h2>Memuat Dashboard...</h2>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1>Dashboard Utama</h1>
        <p>Ringkasan sistem dan bisnis untuk bulan ini.</p>
      </div>

      <div className="grid-cols-3" style={{ marginBottom: "2rem" }}>
        {/* Laba Bersih */}
        <div className="glass-panel" style={{ borderTop: "4px solid var(--secondary)" }}>
          <p style={{ margin: 0, fontSize: "0.85rem", textTransform: "uppercase" }}>Laba Bersih Bulan Ini</p>
          <h2 style={{ margin: "0.5rem 0 1rem", color: "var(--secondary)" }}>
            Rp {stats?.finance.profit.toLocaleString("id-ID") || 0}
          </h2>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
            <span>Pemasukan: Rp {stats?.finance.income.toLocaleString("id-ID")}</span>
            <span style={{ color: "var(--danger)" }}>Keluar: Rp {stats?.finance.expense.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* Karyawan Aktif */}
        <div className="glass-panel" style={{ borderTop: "4px solid var(--warning)" }}>
          <p style={{ margin: 0, fontSize: "0.85rem", textTransform: "uppercase" }}>Sedang Bekerja (Hari Ini)</p>
          <h2 style={{ margin: "0.5rem 0 1rem", color: "var(--warning)" }}>
            {stats?.activeCheckIns || 0} <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/ {stats?.totalEmployees || 0}</span>
          </h2>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Jumlah Karyawan yang telah Check-In.
          </div>
        </div>

        {/* Menu Tersedia */}
        <div className="glass-panel" style={{ borderTop: "4px solid var(--primary)" }}>
          <p style={{ margin: 0, fontSize: "0.85rem", textTransform: "uppercase" }}>Total Item Menu</p>
          <h2 style={{ margin: "0.5rem 0 1rem", color: "var(--primary)" }}>
            {stats?.totalMenuItems || 0} <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>Items</span>
          </h2>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Makanan dan Minuman terdaftar.
          </div>
        </div>
      </div>

      <h3>Akses Cepat</h3>
      <div className="grid-cols-4" style={{ marginTop: "1.5rem" }}>
        <Link href="/admin/finance" className="glass-panel flex-center" style={{ flexDirection: "column", gap: "0.5rem", textDecoration: "none" }}>
          <span style={{ fontSize: "2rem" }}>💰</span>
          <strong>Catat Transaksi</strong>
        </Link>
        <Link href="/admin/attendance" className="glass-panel flex-center" style={{ flexDirection: "column", gap: "0.5rem", textDecoration: "none" }}>
          <span style={{ fontSize: "2rem" }}>⏱️</span>
          <strong>Absensi Karyawan</strong>
        </Link>
        <Link href="/admin/menu" className="glass-panel flex-center" style={{ flexDirection: "column", gap: "0.5rem", textDecoration: "none" }}>
          <span style={{ fontSize: "2rem" }}>🍔</span>
          <strong>Tambah Menu</strong>
        </Link>
        <Link href="/admin/salary" className="glass-panel flex-center" style={{ flexDirection: "column", gap: "0.5rem", textDecoration: "none" }}>
          <span style={{ fontSize: "2rem" }}>💵</span>
          <strong>Hitung Gaji</strong>
        </Link>
      </div>
    </div>
  );
}
