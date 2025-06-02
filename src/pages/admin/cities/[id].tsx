import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../components/LayoutAdmin";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ErrorMessage from "../../../components/ErrorMessage";
import styles from "../../../styles/admin.module.css";
import { getCityById, updateCity } from "../../../lib/api";

export default function EditCityPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    if (!id) return;

    getCityById(id)
      .then((c) => {
        setCityName(c.city_name);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await updateCity(id!, { city_name: cityName });
      router.push("/admin/cities");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LayoutAdmin title="Şehir Bilgisi Yükleniyor">
        <LoadingSpinner />
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin title={`Şehir Düzenle: ${id}`}>
      <h2>Şehir Düzenle: {id}</h2>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleUpdate} className={styles.formAdmin}>
        <label>
          Şehir Adı:
          <input
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Güncelle</button>
      </form>
    </LayoutAdmin>
  );
}
