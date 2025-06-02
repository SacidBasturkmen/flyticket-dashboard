import { useState } from "react";
import LayoutPublic from "../components/LayoutPublic";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import styles from "../styles/public.module.css";
import { getTicketsByEmail, Ticket } from "../lib/api";

export default function TicketsByEmailPage() {
  const [email, setEmail] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTickets([]);

    try {
      const data = await getTicketsByEmail(email);
      setTickets(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <LayoutPublic title="Biletlerimi Gör">
      <h2>Bilet Sorgula</h2>
      <form onSubmit={handleSearch}>
        <div className={styles.formGroup}>
          <label>E-posta Adresiniz:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Sorgulanıyor..." : "Sorgula"}
        </button>
      </form>

      {error && <ErrorMessage message={error} />}

      {loading && <LoadingSpinner />}

      {tickets.length > 0 && (
        <div>
          <h3>Bulunan Biletler</h3>
          {tickets.map((t) => (
            <div key={t.ticket_id} className={styles.ticketCard}>
              <p>
                <strong>Bilet No:</strong> {t.ticket_id}
              </p>
              <p>
                <strong>Uçuş:</strong> {t.flight_id}
              </p>
              <p>
                <strong>Yolcu:</strong> {t.passenger_name} {t.passenger_surname}
              </p>
              <p>
                <strong>Koltuk:</strong> {t.seat_number || "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </LayoutPublic>
  );
}
