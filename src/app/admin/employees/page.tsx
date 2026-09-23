"use client";

import { useState, useEffect } from "react";
import { AppModal, Toast } from "@/lib/swal";

type Employee = {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("STAFF");
  const [hourlyRate, setHourlyRate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const fetchEmployees = async () => {
    const res = await fetch("/api/employees");
    if (res.ok) {
      const data = await res.json();
      setEmployees(data);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role, hourlyRate }),
    });

    if (res.ok) {
      setName("");
      setRole("STAFF");
      setHourlyRate("");
      fetchEmployees();
      Toast.fire({ icon: 'success', title: 'Karyawan berhasil ditambahkan' });
    } else {
      Toast.fire({ icon: 'error', title: 'Gagal menambahkan karyawan' });
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    const result = await AppModal.fire({
      title: "Hapus karyawan ini?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchEmployees();
        Toast.fire({ icon: 'success', title: 'Karyawan dihapus' });
      } else {
        Toast.fire({ icon: 'error', title: 'Gagal menghapus karyawan' });
      }
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "2rem" }}>
        <h1>Manajemen Karyawan</h1>
      </div>

      <div className="grid-cols-3">
        <div className="glass-panel" style={{ gridColumn: "span 1" }}>
          <h3>Tambah Karyawan</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Nama Karyawan</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Masukkan nama..." />
            </div>
            <div style={{ position: "relative" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Peran (Role)</label>
              
              <div 
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                style={{
                  background: "rgba(0, 0, 0, 0.2)",
                  border: `1px solid ${isRoleDropdownOpen ? "var(--primary)" : "var(--glass-border)"}`,
                  color: "var(--text-main)",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  boxShadow: isRoleDropdownOpen ? "0 0 0 2px rgba(99, 102, 241, 0.25)" : "none"
                }}
              >
                <span>{role === "ADMIN" ? "Admin" : "Staff"}</span>
                <svg 
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ 
                    transition: "transform 0.3s ease",
                    transform: isRoleDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    color: "var(--text-muted)"
                  }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              {isRoleDropdownOpen && (
                <>
                  <div 
                    onClick={() => setIsRoleDropdownOpen(false)}
                    style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9 }}
                  />
                  <div 
                    className="animate-fade-in"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      marginTop: "0.5rem",
                      background: "rgba(20, 22, 33, 0.95)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "8px",
                      overflow: "hidden",
                      zIndex: 10,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                    }}
                  >
                    {[
                      { value: "STAFF", label: "Staff", desc: "Karyawan biasa" },
                      { value: "ADMIN", label: "Admin", desc: "Akses penuh manajemen" }
                    ].map((r) => (
                      <div
                        key={r.value}
                        onClick={() => {
                          setRole(r.value);
                          setIsRoleDropdownOpen(false);
                        }}
                        style={{
                          padding: "0.85rem 1rem",
                          cursor: "pointer",
                          background: role === r.value ? "rgba(99, 102, 241, 0.15)" : "transparent",
                          borderLeft: role === r.value ? "3px solid var(--primary)" : "3px solid transparent",
                          transition: "all 0.2s ease",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.25rem"
                        }}
                        onMouseEnter={(e) => {
                          if (role !== r.value) e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        }}
                        onMouseLeave={(e) => {
                          if (role !== r.value) e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <span style={{ color: role === r.value ? "var(--primary)" : "var(--text-main)", fontWeight: role === r.value ? 600 : 400 }}>
                          {r.label}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {r.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Gaji per Jam (Rp)</label>
              <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} required placeholder="Misal: 15000" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: "1rem" }}>
              {isLoading ? "Menyimpan..." : "Simpan Karyawan"}
            </button>
          </form>
        </div>

        <div className="glass-panel" style={{ gridColumn: "span 2" }}>
          <h3>Daftar Karyawan</h3>
          <div style={{ marginTop: "1.5rem", overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Role</th>
                  <th>Gaji / Jam</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td><strong>{emp.name}</strong></td>
                    <td>
                      <span className={`badge ${emp.role === "ADMIN" ? "badge-info" : "badge-success"}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td>Rp {emp.hourlyRate.toLocaleString("id-ID")}</td>
                    <td style={{ textAlign: "right" }}>
                      <button onClick={() => handleDelete(emp.id)} className="btn btn-danger" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                      Belum ada data karyawan.
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
