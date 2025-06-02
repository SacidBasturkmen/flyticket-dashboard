// src/pages/admin/login.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../components/LayoutAdmin";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import styles from "../../styles/admin.module.css";
import { loginAdmin } from "../../lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) router.push("/admin/dashboard");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = await loginAdmin(form);
      localStorage.setItem("adminToken", token);
      setLoading(false);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <LayoutAdmin title="Admin Girişi">
      <h2>Admin Girişi</h2>
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
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
      {loading && <LoadingSpinner />}
    </LayoutAdmin>
  );
}
