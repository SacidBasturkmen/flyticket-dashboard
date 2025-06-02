// src/pages/flight/[id].tsx
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LayoutPublic from "../../components/LayoutPublic";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import styles from "../../styles/public.module.css";
import { getFlightById, Flight, bookTicket } from "../../lib/api";

export default function FlightDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Rezervasyon formu
  const [passenger, setPassenger] = useState({
    name: "",
    surname: "",
    email: "",
    seat_number: "",
  });
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getFlightById(id)
      .then((data) => {
        setFlight(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flight) return;
    setBookingLoading(true);
    setBookingError("");

    try {
      const ticket = await bookTicket({
        passenger_name: passenger.name,
        passenger_surname: passenger.surname,
        passenger_email: passenger.email,
        flight_id: flight.flight_id,
        seat_number: passenger.seat_number || undefined,
      });
      
      // Rezervasyon başarılı → confirmation sayfasına yönlendir
      router.push(`/confirmation?passenger_email=${ticket.passenger_email}`);
    } catch (err: any) {
      setBookingError(err.message);
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <LayoutPublic title="Yükleniyor...">
        <LoadingSpinner />
      </LayoutPublic>
    );
  }
  if (error || !flight) {
    return (
      <LayoutPublic title="Hata">
        <ErrorMessage message={error || "Uçuş bulunamadı."} />
      </LayoutPublic>
    );
  }

  return (
    <LayoutPublic title={`Uçuş Detayı: ${flight.flight_id}`}>
      <div className={styles.heroContainer}>
        <h2 className={styles.heroTitle}>
          {flight.from_city_id} → {flight.to_city_id}
        </h2>
        <p>
          <strong>Kalkış:</strong>{" "}
          {new Date(flight.departure_time).toLocaleString()}
          <br />
          <strong>Varış:</strong>{" "}
          {new Date(flight.arrival_time).toLocaleString()}
          <br />
          <strong>Fiyat:</strong> {flight.price} ₺
          <br />
          <strong>Boş Koltuk:</strong> {flight.seats_available}
        </p>
      </div>

      <h3>Rezervasyon Yap</h3>
      {bookingError && <ErrorMessage message={bookingError} />}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>İsim:</label>
          <input
            type="text"
            value={passenger.name}
            onChange={(e) =>
              setPassenger({ ...passenger, name: e.target.value })
            }
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Soyisim:</label>
          <input
            type="text"
            value={passenger.surname}
            onChange={(e) =>
              setPassenger({ ...passenger, surname: e.target.value })
            }
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>E-posta:</label>
          <input
            type="email"
            value={passenger.email}
            onChange={(e) =>
              setPassenger({ ...passenger, email: e.target.value })
            }
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Koltuk No (opsiyonel):</label>
          <input
            type="text"
            value={passenger.seat_number}
            onChange={(e) =>
              setPassenger({ ...passenger, seat_number: e.target.value })
            }
            className={styles.inputField}
          />
        </div>
        <button type="submit" disabled={bookingLoading}>
          {bookingLoading ? "Rezervasyon Yapılıyor..." : "Bilet Al"}
        </button>
      </form>
    </LayoutPublic>
  );
}
