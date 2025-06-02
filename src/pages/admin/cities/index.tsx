// src/pages/admin/cities/index.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../components/LayoutAdmin";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ErrorMessage from "../../../components/ErrorMessage";
import styles from "../../../styles/admin.module.css";
import { getAllCities, City, deleteCity } from "../../../lib/api";

export default function CitiesListPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    getAllCities()
      .then((data) => {
        setCities(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu şehri silmek istediğinize emin misiniz?")) return;
    try {
      await deleteCity(id);
      setCities(cities.filter((c) => c.city_id !== id));
    } catch (err: any) {
      alert("Silme hatası: " + err.message);
    }
  };

  if (loading) {
    return (
      <LayoutAdmin title="Şehirler">
        <LoadingSpinner />
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin title="Şehir Yönetimi">
      <h2>Şehir Listesi</h2>
      {error && <ErrorMessage message={error} />}
      <div style={{ marginBottom: "1rem" }}>
        <Link href="/admin/cities/create">
          <button>+ Yeni Şehir Ekle</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thTd}>ID</th>
            <th className={styles.thTd}>Şehir Adı</th>
            <th className={styles.thTd}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((c) => (
            <tr key={c.city_id}>
              <td className={styles.thTd}>{c.city_id}</td>
              <td className={styles.thTd}>{c.city_name}</td>
              <td className={styles.thTd}>
                <Link href={`/admin/cities/${c.city_id}`}>
                  <button>Düzenle</button>
                </Link>{" "}
                <button
                  onClick={() => handleDelete(c.city_id)}
                  style={{ backgroundColor: "#cc0000" }}
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </LayoutAdmin>
  );
}
