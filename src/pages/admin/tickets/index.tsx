// src/pages/admin/tickets/index.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../components/LayoutAdmin";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ErrorMessage from "../../../components/ErrorMessage";
import styles from "../../../styles/admin.module.css";
import { getAllTickets, Ticket } from "../../../lib/api";

export default function TicketsListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    getAllTickets()
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <LayoutAdmin title="Biletler">
        <LoadingSpinner />
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin title="Bilet Yönetimi">
      <h2>Tüm Biletler</h2>
      {error && <ErrorMessage message={error} />}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thTd}>Bilet ID</th>
            <th className={styles.thTd}>Yolcu</th>
            <th className={styles.thTd}>E-posta</th>
            <th className={styles.thTd}>Uçuş ID</th>
            <th className={styles.thTd}>Koltuk</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.ticket_id}>
              <td className={styles.thTd}>{t.ticket_id}</td>
              <td className={styles.thTd}>
                {t.passenger_name} {t.passenger_surname}
              </td>
              <td className={styles.thTd}>{t.passenger_email}</td>
              <td className={styles.thTd}>{t.flight_id}</td>
              <td className={styles.thTd}>{t.seat_number || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </LayoutAdmin>
  );
}
