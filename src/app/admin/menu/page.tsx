"use client";

import { useState, useEffect } from "react";
import { AppModal, Toast } from "@/lib/swal";

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("FOOD");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchMenu = async () => {
    const res = await fetch("/api/menu");
    if (res.ok) {
      const data = await res.json();
      setMenuItems(data);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const res = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, price, cost }),
    });

    if (res.ok) {
      setName("");
      setCategory("FOOD");
      setPrice("");
      setCost("");
      fetchMenu();
      Toast.fire({ icon: 'success', title: 'Menu berhasil ditambahkan' });
    } else {
      Toast.fire({ icon: 'error', title: 'Gagal menambahkan menu' });
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    const result = await AppModal.fire({
      title: "Hapus menu ini?",
      text: "Tindakan ini tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMenu();
        Toast.fire({ icon: 'success', title: 'Menu dihapus' });
      }
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "2rem" }}>
        <h1>Manajemen Menu</h1>
      </div>

      <div className="grid-cols-3">
        <div className="glass-panel" style={{ gridColumn: "span 1" }}>
          <h3>Tambah Menu</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Nama Menu</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Misal: Nasi Goreng Spesial" />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="FOOD">Makanan</option>
                <option value="BEVERAGE">Minuman</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Harga Modal (Rp)</label>
              <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} required placeholder="Misal: 15000" />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Harga Jual (Rp)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="Misal: 25000" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: "1rem" }}>
              {isLoading ? "Menyimpan..." : "Simpan Menu"}
            </button>
          </form>
        </div>

        <div className="glass-panel" style={{ gridColumn: "span 2" }}>
          <h3>Daftar Menu</h3>
          <div style={{ marginTop: "1.5rem", overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Nama Menu</th>
                  <th>Kategori</th>
                  <th>Modal</th>
                  <th>Harga Jual</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.name}</strong></td>
                    <td>
                      <span className={`badge ${item.category === "FOOD" ? "badge-warning" : "badge-info"}`}>
                        {item.category === "FOOD" ? "Makanan" : "Minuman"}
                      </span>
                    </td>
                    <td style={{ color: "var(--danger)" }}>Rp {item.cost.toLocaleString("id-ID")}</td>
                    <td style={{ color: "var(--secondary)" }}>Rp {item.price.toLocaleString("id-ID")}</td>
                    <td style={{ textAlign: "right" }}>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-danger" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {menuItems.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                      Belum ada data menu.
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
