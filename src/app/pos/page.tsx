"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Toast, AppModal } from "@/lib/swal";

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
};

type CartItem = MenuItem & { qty: number };

export default function POSPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await fetch("/api/menu");
      if (res.ok) {
        setMenuItems(await res.json());
      }
      setIsLoading(false);
    };
    fetchMenu();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => 
      prev.map((c) => {
        if (c.id === id) {
          const newQty = c.qty + delta;
          return newQty > 0 ? { ...c, qty: newQty } : c;
        }
        return c;
      })
    );
  };

  const totalAmount = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.qty), 0), [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsCheckingOut(true);
    const res = await fetch("/api/pos/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    });

    if (res.ok) {
      AppModal.fire({
        icon: 'success',
        title: 'Pembayaran Berhasil!',
        text: 'Transaksi telah dicatat ke Laporan Keuangan.'
      });
      setCart([]);
    } else {
      Toast.fire({ icon: 'error', title: 'Gagal memproses pembayaran' });
    }
    setIsCheckingOut(false);
  };

  if (isLoading) {
    return <div className="flex-center" style={{ height: "100vh" }}><h2>Memuat Mesin Kasir...</h2></div>;
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Menu Area (70%) */}
      <div style={{ flex: "0 0 70%", padding: "2rem", overflowY: "auto", borderRight: "1px solid var(--glass-border)" }}>
        <div className="flex-between" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img src="/logo.png" alt="Logo" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "contain" }} />
            <h2 style={{ margin: 0 }}><span style={{ color: "var(--primary)" }}>Bichito</span> POS</h2>
          </div>
          <Link href="/" className="btn btn-secondary" style={{ fontSize: "0.85rem" }}>
            &larr; Kembali ke Beranda
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }}>
          {menuItems.map((item) => (
            <div 
              key={item.id} 
              className="glass-panel" 
              style={{ cursor: "pointer", padding: "1.5rem", textAlign: "center" }}
              onClick={() => addToCart(item)}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                {item.category === "FOOD" ? "🍛" : "🍹"}
              </div>
              <h4 style={{ margin: "0 0 0.5rem" }}>{item.name}</h4>
              <p style={{ color: "var(--secondary)", fontWeight: 600, margin: 0 }}>
                Rp {item.price.toLocaleString("id-ID")}
              </p>
            </div>
          ))}
          {menuItems.length === 0 && (
            <p style={{ color: "var(--text-muted)", gridColumn: "1 / -1" }}>Menu masih kosong. Hubungi admin untuk menambahkan menu.</p>
          )}
        </div>
      </div>

      {/* Cart Area (30%) */}
      <div style={{ flex: "1", padding: "2rem", display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.2)" }}>
        <h3 style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>Pesanan Saat Ini</h3>
        
        <div style={{ flex: "1", overflowY: "auto" }}>
          {cart.length === 0 ? (
            <div className="flex-center" style={{ height: "100%", color: "var(--text-muted)", flexDirection: "column" }}>
              <span style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</span>
              <p>Keranjang kosong</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {cart.map((item) => (
                <div key={item.id} className="glass-panel" style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h5 style={{ margin: "0 0 0.25rem" }}>{item.name}</h5>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Rp {item.price.toLocaleString("id-ID")}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button onClick={() => updateQty(item.id, -1)} className="btn btn-secondary" style={{ padding: "0.2rem 0.6rem" }}>-</button>
                    <span style={{ width: "20px", textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="btn btn-secondary" style={{ padding: "0.2rem 0.6rem" }}>+</button>
                    <button onClick={() => removeFromCart(item.id)} className="btn btn-danger" style={{ padding: "0.2rem 0.5rem", marginLeft: "0.5rem" }}>×</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "1.5rem", marginTop: "1.5rem" }}>
          <div className="flex-between" style={{ marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>Total:</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--secondary)" }}>Rp {totalAmount.toLocaleString("id-ID")}</span>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ width: "100%", padding: "1rem", fontSize: "1.1rem" }}
            onClick={handleCheckout}
            disabled={cart.length === 0 || isCheckingOut}
          >
            {isCheckingOut ? "Memproses..." : "Bayar Pesanan"}
          </button>
        </div>
      </div>
    </div>
  );
}
