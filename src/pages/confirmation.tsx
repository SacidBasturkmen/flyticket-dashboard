// src/pages/confirmation.tsx
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LayoutPublic from "../components/LayoutPublic";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import styles from "../styles/public.module.css";
import { getTicketsByEmail, Ticket } from "../lib/api";

export default function ConfirmationPage() {
  const router = useRouter();
  const { passenger_email } = router.query as { passenger_email?: string };
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!passenger_email) return;

    // API, ticket_id’ye göre GET /ticket/:email endpoint’i değil, yalnızca /ticket/:email olduğundan
    // burada doğrudan bilet ID üzerinden çekemeyiz. Eğer backend’de GET /ticket/:ticket_id endpoint varsa kullanılır.
    // Mevcut yapıda, Confirmation’da ticket bilgileri halihazırda oluşturulurken dönüyordu.
    // Ancak, tekil GET endpoint’i yoksa, ticket verisini localStorage’dan bile geçirebilirsiniz.
    // Varsayalım ki backend’de GET /ticket/:ticket_id endpoint’i var:
    (async () => {
      try {
        console.log("passenger_email: ",passenger_email)
        const tickets = await getTicketsByEmail(passenger_email); // aslında email’e göre çağrı, burada ID kullanıyoruz.
        console.log("tickets: ",tickets)
        const t = tickets.find((t) => t.passenger_email === passenger_email);
        if (!t) throw new Error("Bilet bulunamadı");
        setTicket(t);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    })();
  }, [passenger_email]);

  if (loading) {
    return (
      <LayoutPublic title="Yükleniyor...">
        <LoadingSpinner />
      </LayoutPublic>
    );
  }
  if (error || !ticket) {
    return (
      <LayoutPublic title="Hata">
        <ErrorMessage message={error || "Bilet bulunamadı"} />
      </LayoutPublic>
    );
  }

  return (
    <LayoutPublic title="Rezervasyon Onayı">
      <div className={styles.ticketCard}>
        <h2 className={styles.heroTitle}>Rezervasyon Başarılı!</h2>
        <p className={styles.ticketDetail}>
          <strong>Bilet No:</strong> {ticket.ticket_id}
        </p>
        <p className={styles.ticketDetail}>
          <strong>Yolcu:</strong> {ticket.passenger_name} {ticket.passenger_surname}
        </p>
        <p className={styles.ticketDetail}>
          <strong>Uçuş:</strong> {ticket.flight_id}
        </p>
        <p className={styles.ticketDetail}>
          <strong>Koltuk:</strong> {ticket.seat_number || "Belirtilmedi"}
        </p>
        <button onClick={() => window.print()}>E-Bileti Yazdır</button>
      </div>
    </LayoutPublic>
  );
}
