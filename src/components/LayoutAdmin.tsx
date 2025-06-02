import React from "react";
import Link from "next/link";
import Head from "next/head";
import "../app/globals.css";
import styles from "../styles/admin.module.css";

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function LayoutAdmin({ children, title = "Admin Dashboard" }: Props) {
  return (
    <>
      <Head>
        <title>{title} | FlyTicket Admin</title>
        <meta name="description" content="FlyTicket Admin Panel" />
      </Head>

      <div className={styles.adminContainer}>
        <aside className={styles.sidebar}>
          <h2>Admin Panel</h2>
          <nav>
            <Link href="/admin/dashboard">Dashboard</Link>
            <Link href="/admin/cities">Şehir Yönetimi</Link>
            <Link href="/admin/flights">Uçuş Yönetimi</Link>
            <Link href="/admin/tickets">Bilet Yönetimi</Link>
            <Link href="/admin/register">Kayıt Ol</Link>
            <Link href="/admin/login">Çıkış</Link>
          </nav>
        </aside>

        <div className={styles.adminMain}>
          <header className={styles.adminHeader}>
            <h1>{title}</h1>
          </header>
          <section className={styles.adminSection}>{children}</section>
        </div>
      </div>
    </>
  );
}
