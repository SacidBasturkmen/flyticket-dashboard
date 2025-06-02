import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../components/LayoutAdmin";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ErrorMessage from "../../../components/ErrorMessage";
import styles from "../../../styles/admin.module.css";
import { getAllCities, getFlightById, updateFlight, Flight, City } from "../../../lib/api";

export default function EditFlightPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [citiesError, setCitiesError] = useState("");

  const [flight, setFlight] = useState<Flight | null>(null);
  const [loadingFlight, setLoadingFlight] = useState(true);
  const [flightError, setFlightError] = useState("");

  const [form, setForm] = useState({
    from_city_id: "",
    to_city_id: "",
    departure_time: "",
    arrival_time: "",
    price: "",
    seats_total: "",
    seats_available: "",
  });
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [updateError, setUpdateError] = useState("");

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

    if (id) {
      getFlightById(id)
        .then((data) => {
          setFlight(data);
          setForm({
            from_city_id: data.from_city_id,
            to_city_id: data.to_city_id,
            departure_time: new Date(data.departure_time)
              .toISOString()
              .slice(0, 16),
            arrival_time: new Date(data.arrival_time)
              .toISOString()
              .slice(0, 16),
            price: data.price.toString(),
            seats_total: data.seats_total.toString(),
            seats_available: data.seats_available.toString(),
          });
          setLoadingFlight(false);
        })
        .catch((err: Error) => {
          setFlightError(err.message);
          setLoadingFlight(false);
        });
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError("");
    setLoadingUpdate(true);
    try {
      await updateFlight(id!, {
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
      setUpdateError(err.message);
      setLoadingUpdate(false);
    }
  };

  if (loadingCities || loadingFlight) {
    return (
      <LayoutAdmin title="Uçuş Düzenleniyor...">
        <LoadingSpinner />
      </LayoutAdmin>
    );
  }

  if (citiesError || flightError || !flight) {
    return (
      <LayoutAdmin title="Hata">
        <ErrorMessage message={citiesError || flightError || "Uçuş bulunamadı"} />
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin title={`Uçuş Düzenle: ${flight.flight_id}`}>
      <h2>Uçuş Düzenle: {flight.flight_id}</h2>
      {updateError && <ErrorMessage message={updateError} />}
      <form onSubmit={handleUpdate} className={styles.formAdmin}>
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
            onChange={(e) => setForm({ ...form, arrival_time: e.target.value })}
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
        <div className={styles.buttonGroup}>
          <button type="submit" disabled={loadingUpdate}>
            {loadingUpdate ? "Güncelleniyor..." : "Güncelle"}
          </button>
        </div>
      </form>
      {loadingUpdate && <LoadingSpinner />}
    </LayoutAdmin>
  );
}
