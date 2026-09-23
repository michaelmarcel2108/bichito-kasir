"use client";

import { useState, useEffect } from "react";
import { AppModal, Toast } from "@/lib/swal";

type Employee = {
  id: string;
  name: string;
};

type Attendance = {
  id: string;
  employee: Employee;
  checkIn: string;
  checkOut: string | null;
  totalHours: number | null;
  date: string;
};

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAttendances = async () => {
    const res = await fetch("/api/attendance");
    if (res.ok) {
      const data = await res.json();
      setAttendances(data);
    }
  };

  const fetchEmployees = async () => {
    const res = await fetch("/api/employees");
    if (res.ok) {
      const data = await res.json();
      setEmployees(data);
      if (data.length > 0) setSelectedEmployee(data[0].id);
    }
  };

  useEffect(() => {
    fetchAttendances();
    fetchEmployees();
  }, []);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    
    setIsLoading(true);
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: selectedEmployee }),
    });

    if (res.ok) {
      fetchAttendances();
      Toast.fire({ icon: 'success', title: 'Check-In berhasil' });
    } else {
      const error = await res.json();
      Toast.fire({ icon: 'error', title: error.error || "Gagal check-in" });
    }
    setIsLoading(false);
  };

  const handleCheckOut = async (attendanceId: string) => {
    const result = await AppModal.fire({
      title: "Check-Out sekarang?",
      text: "Selesaikan jam kerja untuk sesi ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Selesaikan",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      const res = await fetch("/api/attendance/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendanceId }),
      });

      if (res.ok) {
        fetchAttendances();
        Toast.fire({ icon: 'success', title: 'Check-Out berhasil' });
      } else {
        const error = await res.json();
        Toast.fire({ icon: 'error', title: error.error || "Gagal check-out" });
      }
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "2rem" }}>
        <h1>Sistem Absensi</h1>
      </div>

      <div className="grid-cols-3">
        <div className="glass-panel" style={{ gridColumn: "span 1" }}>
          <h3>Catat Kehadiran (Check-In)</h3>
          <form onSubmit={handleCheckIn} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-muted)" }}>Pilih Karyawan</label>
              <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} required>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={isLoading || employees.length === 0} style={{ marginTop: "1rem" }}>
              {isLoading ? "Memproses..." : "Check-In Sekarang"}
            </button>
            {employees.length === 0 && (
              <p style={{ fontSize: "0.85rem", color: "var(--warning)", marginTop: "0.5rem" }}>
                * Tambahkan karyawan terlebih dahulu di menu Karyawan.
              </p>
            )}
          </form>
        </div>

        <div className="glass-panel" style={{ gridColumn: "span 2" }}>
          <h3>Riwayat Absensi</h3>
          <div style={{ marginTop: "1.5rem", overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Karyawan</th>
                  <th>Tanggal</th>
                  <th>Jam Masuk</th>
                  <th>Jam Keluar</th>
                  <th>Total Jam</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((record) => {
                  const checkInDate = new Date(record.checkIn);
                  const checkOutDate = record.checkOut ? new Date(record.checkOut) : null;
                  
                  return (
                    <tr key={record.id}>
                      <td><strong>{record.employee.name}</strong></td>
                      <td>{checkInDate.toLocaleDateString("id-ID")}</td>
                      <td>{checkInDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</td>
                      <td>
                        {checkOutDate ? (
                          checkOutDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                        ) : (
                          <span className="badge badge-warning">Aktif</span>
                        )}
                      </td>
                      <td>
                        {record.totalHours ? `${record.totalHours.toFixed(2)} jam` : "-"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {!record.checkOut && (
                          <button onClick={() => handleCheckOut(record.id)} className="btn btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
                            Check-Out
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {attendances.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                      Belum ada data absensi.
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
