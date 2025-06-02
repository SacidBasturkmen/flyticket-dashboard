// src/pages/admin/cities/create.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../components/LayoutAdmin";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ErrorMessage from "../../../components/ErrorMessage";
import styles from "../../../styles/admin.module.css";
import { createCity } from "../../../lib/api";

export default function CreateCityPage() {
  const router = useRouter();
  const [form, setForm] = useState({ city_id: "", city_name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createCity(form);
      router.push("/admin/cities");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <LayoutAdmin title="Yeni Şehir Ekle">
      <h2>Yeni Şehir Ekle</h2>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className={styles.formAdmin}>
        <label>
          Şehir Kodu:
          <input
            type="text"
            value={form.city_id}
            onChange={(e) => setForm({ ...form, city_id: e.target.value })}
            required
          />
        </label>
        <label>
          Şehir Adı:
          <input
            type="text"
            value={form.city_name}
            onChange={(e) => setForm({ ...form, city_name: e.target.value })}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
      {loading && <LoadingSpinner />}
    </LayoutAdmin>
  );
}
