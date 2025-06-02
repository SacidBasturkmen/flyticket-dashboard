import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../components/LayoutAdmin";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import styles from "../../styles/admin.module.css";
import { registerAdmin } from "../../lib/api";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { token } = await registerAdmin(form);
      localStorage.setItem("adminToken", token);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <LayoutAdmin title="Admin Kayıt">
      <h2>Admin Kayıt</h2>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className={styles.formAdmin}>
        <label>
          Kullanıcı Adı:
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </label>
        <label>
          Şifre:
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Kaydediliyor..." : "Kayıt Ol"}
        </button>
      </form>
      {loading && <LoadingSpinner />}
    </LayoutAdmin>
  );
}
