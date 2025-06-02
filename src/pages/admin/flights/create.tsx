// src/pages/admin/flights/create.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../components/LayoutAdmin";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ErrorMessage from "../../../components/ErrorMessage";
import styles from "../../../styles/admin.module.css";
import { getAllCities, createFlight, City } from "../../../lib/api";

export default function CreateFlightPage() {
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [citiesError, setCitiesError] = useState("");

  const [form, setForm] = useState({
    flight_id: "",
    from_city_id: "",
    to_city_id: "",
    departure_time: "",
    arrival_time: "",
    price: "",
    seats_total: "",
    seats_available: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    getAllCities()
      .then((data) => {
        setCities(data);
        setLoadingCities(false);
      })
      .catch((err: Error) => {
        setCitiesError(err.message);
        setLoadingCities(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createFlight({
        flight_id: form.flight_id,
        from_city_id: form.from_city_id,
        to_city_id: form.to_city_id,
        departure_time: form.departure_time,
        arrival_time: form.arrival_time,
        price: parseFloat(form.price),
        seats_total: parseInt(form.seats_total),
        seats_available: parseInt(form.seats_available),
      });
      router.push("/admin/flights");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loadingCities) {
    return (
      <LayoutAdmin title="Yeni Uçuş">
        <LoadingSpinner />
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin title="Yeni Uçuş Ekle">
      <h2>Yeni Uçuş Ekle</h2>
      {citiesError && <ErrorMessage message={citiesError} />}
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className={styles.formAdmin}>
        <label>
          Uçuş Kodu:
          <input
            type="text"
            value={form.flight_id}
            onChange={(e) => setForm({ ...form, flight_id: e.target.value })}
            required
          />
        </label>
        <label>
          Kalkış Şehir:
          <select
            value={form.from_city_id}
            onChange={(e) => setForm({ ...form, from_city_id: e.target.value })}
            required
          >
            <option value="">Seçiniz</option>
            {cities.map((c) => (
              <option key={c.city_id} value={c.city_id}>
                {c.city_name} ({c.city_id})
              </option>
            ))}
          </select>
        </label>
        <label>
          Varış Şehir:
          <select
            value={form.to_city_id}
            onChange={(e) => setForm({ ...form, to_city_id: e.target.value })}
            required
          >
            <option value="">Seçiniz</option>
            {cities.map((c) => (
              <option key={c.city_id} value={c.city_id}>
                {c.city_name} ({c.city_id})
              </option>
            ))}
          </select>
        </label>
        <label>
          Kalkış Zamanı:
          <input
            type="datetime-local"
            value={form.departure_time}
            onChange={(e) =>
              setForm({ ...form, departure_time: e.target.value })
            }
            required
          />
        </label>
        <label>
          Varış Zamanı:
          <input
            type="datetime-local"
            value={form.arrival_time}
            onChange={(e) =>
              setForm({ ...form, arrival_time: e.target.value })
            }
            required
          />
        </label>
        <label>
          Fiyat:
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </label>
        <label>
          Toplam Koltuk:
          <input
            type="number"
            value={form.seats_total}
            onChange={(e) => setForm({ ...form, seats_total: e.target.value })}
            required
          />
        </label>
        <label>
          Mevcut Koltuk:
          <input
            type="number"
            value={form.seats_available}
            onChange={(e) =>
              setForm({ ...form, seats_available: e.target.value })
            }
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
