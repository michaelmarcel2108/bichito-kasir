"use client";

import { useState, useEffect, useMemo } from "react";
import { AppModal, Toast } from "@/lib/swal";

type Transaction = {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
};

export default function FinancePage() {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [capital, setCapital] = useState(0);
  
  const [type, setType] = useState("INCOME");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [newCapital, setNewCapital] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    // Fetch transactions
    const tRes = await fetch(`/api/finance?month=${month}&year=${year}`);
    if (tRes.ok) setTransactions(await tRes.json());

    // Fetch capital
    const cRes = await fetch(`/api/capital?month=${month}&year=${year}`);
    if (cRes.ok) {
      const data = await cRes.json();
      setCapital(data.amount || 0);
      setNewCapital(data.amount || "");
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const res = await fetch("/api/finance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, amount, description }),
    });

    if (res.ok) {
      setAmount("");
      setDescription("");
      fetchData();
      Toast.fire({ icon: 'success', title: 'Transaksi berhasil disimpan' });
    } else {
      Toast.fire({ icon: 'error', title: 'Gagal menyimpan transaksi' });
    }
    setIsLoading(false);
  };

  const handleCapitalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const res = await fetch("/api/capital", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month, year, amount: newCapital }),
    });

    if (res.ok) {
      fetchData();
      Toast.fire({ icon: 'success', title: 'Modal berhasil diperbarui' });
    } else {
      Toast.fire({ icon: 'error', title: 'Gagal memperbarui modal' });
    }
    setIsLoading(false);
  };

  const handleDeleteTransaction = async (id: string) => {
    const result = await AppModal.fire({
      title: "Hapus transaksi ini?",
      text: "Data keuangan akan berubah secara otomatis!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      const res = await fetch(`/api/finance/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
        Toast.fire({ icon: 'success', title: 'Transaksi dihapus' });
      }
    }
  };

  // Calculations
  const totalIncome = useMemo(() => transactions.filter(t => t.type === "INCOME").reduce((acc, t) => acc + t.amount, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t => t.type === "EXPENSE").reduce((acc, t) => acc + t.amount, 0), [transactions]);
  const netProfit = totalIncome - totalExpense;
  const currentSaldo = capital + netProfit;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "2rem" }}>
        <h1>Keuangan & Modal</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} style={{ padding: "0.5rem", borderRadius: "8px" }}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("id-ID", { month: "long" })}</option>
            ))}
          </select>
          <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} style={{ width: "100px", padding: "0.5rem" }} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-cols-4" style={{ marginBottom: "2rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <p style={{ margin: 0, fontSize: "0.85rem", textTransform: "uppercase" }}>Modal Awal Bulan</p>
          <h3 style={{ margin: "0.5rem 0 0", color: "var(--text-main)" }}>Rp {capital.toLocaleString("id-ID")}</h3>
        </div>
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <p style={{ margin: 0, fontSize: "0.85rem", textTransform: "uppercase" }}>Pemasukan</p>
          <h3 style={{ margin: "0.5rem 0 0", color: "var(--secondary)" }}>Rp {totalIncome.toLocaleString("id-ID")}</h3>
        </div>
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <p style={{ margin: 0, fontSize: "0.85rem", textTransform: "uppercase" }}>Pengeluaran</p>
          <h3 style={{ margin: "0.5rem 0 0", color: "var(--danger)" }}>Rp {totalExpense.toLocaleString("id-ID")}</h3>
        </div>
        <div className="glass-panel" style={{ padding: "1.5rem", border: "1px solid var(--primary)" }}>
          <p style={{ margin: 0, fontSize: "0.85rem", textTransform: "uppercase" }}>Saldo Akhir (Modal + Laba)</p>
          <h3 style={{ margin: "0.5rem 0 0", color: "var(--primary)" }}>Rp {currentSaldo.toLocaleString("id-ID")}</h3>
        </div>
      </div>

      <div className="grid-cols-3">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Capital Form */}
          <div className="glass-panel">
            <h3>Set Modal Bulan Ini</h3>
            <form onSubmit={handleCapitalSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              <input type="number" value={newCapital} onChange={(e) => setNewCapital(e.target.value)} required placeholder="Misal: 1000000" />
              <button type="submit" className="btn btn-secondary" disabled={isLoading}>Simpan Modal</button>
            </form>
          </div>

          {/* Transaction Form */}
          <div className="glass-panel">
            <h3>Tambah Transaksi</h3>
            <form onSubmit={handleTransactionSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              <div>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="INCOME">Pemasukan (+)</option>
                  <option value="EXPENSE">Pengeluaran (-)</option>
                </select>
              </div>
              <div>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="Nominal (Rp)" />
              </div>
              <div>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Deskripsi (Misal: Pembelian bahan baku)" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan Transaksi"}
              </button>
            </form>
          </div>
        </div>

        <div className="glass-panel" style={{ gridColumn: "span 2" }}>
          <h3>Riwayat Transaksi</h3>
          <div style={{ marginTop: "1.5rem", overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Deskripsi</th>
                  <th>Tipe</th>
                  <th>Nominal</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.date).toLocaleDateString("id-ID")}</td>
                    <td>{t.description}</td>
                    <td>
                      <span className={`badge ${t.type === "INCOME" ? "badge-success" : "badge-danger"}`}>
                        {t.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </td>
                    <td style={{ color: t.type === "INCOME" ? "var(--secondary)" : "var(--danger)" }}>
                      Rp {t.amount.toLocaleString("id-ID")}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button onClick={() => handleDeleteTransaction(t.id)} className="btn btn-danger" style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                      Belum ada transaksi di bulan ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
