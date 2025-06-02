// src/pages/admin/flights/index.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../components/LayoutAdmin";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ErrorMessage from "../../../components/ErrorMessage";
import styles from "../../../styles/admin.module.css";
import { getAllFlights, Flight } from "../../../lib/api";

export default function FlightsListPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    getAllFlights()
      .then((data) => {
        setFlights(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <LayoutAdmin title="Uçuşlar">
        <LoadingSpinner />
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin title="Uçuş Yönetimi">
      <h2>Uçuş Listesi</h2>
      {error && <ErrorMessage message={error} />}

      <div style={{ marginBottom: "1rem" }}>
        <Link href="/admin/flights/create">
          <button>+ Yeni Uçuş Ekle</button>
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thTd}>ID</th>
            <th className={styles.thTd}>From</th>
            <th className={styles.thTd}>To</th>
            <th className={styles.thTd}>Kalkış</th>
            <th className={styles.thTd}>Varış</th>
            <th className={styles.thTd}>Fiyat</th>
            <th className={styles.thTd}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((f) => (
            <tr key={f.flight_id}>
              <td className={styles.thTd}>{f.flight_id}</td>
              <td className={styles.thTd}>{f.from_city_id}</td>
              <td className={styles.thTd}>{f.to_city_id}</td>
              <td className={styles.thTd}>
                {new Date(f.departure_time).toLocaleString()}
              </td>
              <td className={styles.thTd}>
                {new Date(f.arrival_time).toLocaleString()}
              </td>
              <td className={styles.thTd}>{f.price} ₺</td>
              <td className={styles.thTd}>
                <Link href={`/admin/flights/${f.flight_id}`}>
                  <button>Düzenle</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </LayoutAdmin>
  );
}
