import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import LayoutAdmin from "../../components/LayoutAdmin";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) router.push("/admin/login");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  return (
    <LayoutAdmin title="Dashboard">
      <h3>Hoşgeldiniz, Admin!</h3>
      <ul>
        <li>
          <Link href="/admin/cities">Şehir Yönetimi</Link>
        </li>
        <li>
          <Link href="/admin/flights">Uçuş Yönetimi</Link>
        </li>
        <li>
          <Link href="/admin/tickets">Bilet Yönetimi</Link>
        </li>
      </ul>
      <div style={{ marginTop: "2rem" }}>
        <button onClick={handleLogout} style={{ backgroundColor: "#cc0000" }}>
          Çıkış Yap
        </button>
      </div>
    </LayoutAdmin>
  );
}
