import React from "react";
import Link from "next/link";
import Head from "next/head";
import "../app/globals.css";

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function LayoutPublic({ children, title = "FlyTicket" }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="FlyTicket - Uçuş Rezervasyon Uygulaması" />
      </Head>

      <header style={headerStyle}>
        <div className="container" style={navContainer}>
          <Link href="/" style={linkStyle}>
            Ana Sayfa
          </Link>
          <Link href="/tickets" style={linkStyle}>
            Biletlerimi Gör
          </Link>
        </div>
      </header>

      <main className="container">{children}</main>

      <footer style={footerStyle}>
        <div className="container">
          © 2025 FlyTicket
        </div>
      </footer>
    </>
  );
}

const headerStyle: React.CSSProperties = {
  backgroundColor: "#003366",
  padding: "1rem 0",
};

const navContainer: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
};

const linkStyle: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
};

const footerStyle: React.CSSProperties = {
  backgroundColor: "#003366",
  color: "white",
  textAlign: "center",
  padding: "1rem 0",
  marginTop: "2rem",
};
