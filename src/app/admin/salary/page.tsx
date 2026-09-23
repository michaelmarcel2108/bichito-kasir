"use client";

import { useState, useEffect } from "react";
import { Toast } from "@/lib/swal";

type SalaryReport = {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  totalHours: string;
  totalSalary: number;
};

export default function SalaryPage() {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [report, setReport] = useState<SalaryReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSalaryReport = async () => {
    setIsLoading(true);
    const res = await fetch(`/api/salary?month=${month}&year=${year}`);
    if (res.ok) {
      const data = await res.json();
      setReport(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSalaryReport();
  }, [month, year]);

  const totalCompanySalary = report.reduce((acc, emp) => acc + emp.totalSalary, 0);

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "2rem" }}>
        <h1>Penggajian Karyawan</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} style={{ padding: "0.5rem", borderRadius: "8px" }}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("id-ID", { month: "long" })}</option>
            ))}
          </select>
          <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} style={{ width: "100px", padding: "0.5rem" }} />
        </div>
      </div>

      <div className="glass-panel" style={{ marginBottom: "2rem", display: "inline-block" }}>
        <p style={{ margin: 0, fontSize: "0.85rem", textTransform: "uppercase" }}>Total Beban Gaji Keseluruhan (Bulan Ini)</p>
        <h2 style={{ margin: "0.5rem 0 0", color: "var(--danger)" }}>Rp {totalCompanySalary.toLocaleString("id-ID")}</h2>
      </div>

      <div className="grid-cols-3" style={{ marginBottom: "2rem" }}>
        {report.map((emp) => (
          <div key={emp.id} className="glass-panel" style={{ borderLeft: "4px solid var(--secondary)", padding: "1.2rem" }}>
            <p style={{ margin: 0, fontSize: "0.85rem", textTransform: "uppercase", color: "var(--text-muted)" }}>{emp.name}</p>
            <h3 style={{ margin: "0.5rem 0", color: "var(--secondary)" }}>Rp {emp.totalSalary.toLocaleString("id-ID")}</h3>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {emp.totalHours} jam kerja &times; Rp {emp.hourlyRate.toLocaleString("id-ID")}/jam
            </p>
          </div>
        ))}
      </div>

      <div className="glass-panel">
        <h3>Rincian Gaji Karyawan</h3>
        {isLoading ? (
          <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>Memuat data...</p>
        ) : (
          <div style={{ marginTop: "1.5rem", overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Nama Karyawan</th>
                  <th>Role</th>
                  <th>Gaji / Jam</th>
                  <th>Total Jam Kerja</th>
                  <th>Total Gaji</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {report.map((emp) => (
                  <tr key={emp.id}>
                    <td><strong>{emp.name}</strong></td>
                    <td>
                      <span className={`badge ${emp.role === "ADMIN" ? "badge-info" : "badge-success"}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td>Rp {emp.hourlyRate.toLocaleString("id-ID")}</td>
                    <td>{emp.totalHours} jam</td>
                    <td style={{ color: "var(--secondary)", fontWeight: 600 }}>Rp {emp.totalSalary.toLocaleString("id-ID")}</td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }} onClick={() => Toast.fire({ icon: 'info', title: 'Fitur cetak slip gaji akan segera hadir!' })}>
                        Cetak Slip
                      </button>
                    </td>
                  </tr>
                ))}
                {report.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                      Belum ada data gaji untuk bulan ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
