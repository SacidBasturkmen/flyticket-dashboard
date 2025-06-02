// src/app/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import LayoutPublic from "../components/LayoutPublic";
import styles from "../styles/public.module.css";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { getAllCities, getAllFlights, City, Flight } from "../lib/api";

export default function HomePage() {
  const [cities, setCities] = useState<City[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Arama kriterleri
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    // Şehirleri ve uçuşları çek
    Promise.all([getAllCities(), getAllFlights()])
      .then(([cityData, flightData]) => {
        setCities(cityData);
        setFlights(flightData);
        setFilteredFlights(flightData); // İlk başta tümünü göster
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let result = flights;

    if (fromCity) {
      result = result.filter((f) => f.from_city_id === fromCity);
    }
    if (toCity) {
      result = result.filter((f) => f.to_city_id === toCity);
    }
    if (date) {
      result = result.filter(
        (f) =>
          new Date(f.departure_time).toLocaleDateString("tr-TR") ===
          new Date(date).toLocaleDateString("tr-TR")
      );
    }
    setFilteredFlights(result);
  };

  if (loading) {
    return (
      <LayoutPublic title="Yükleniyor...">
        <LoadingSpinner />
      </LayoutPublic>
    );
  }

  return (
    <LayoutPublic title="FlyTicket | Ana Sayfa">
      <div className={styles.heroContainer}>
        <h2 className={styles.heroTitle}>Uçuş Ara</h2>
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSearch}>
          <div className={styles.formGroup}>
            <label>Kalkış Şehir:</label>
            <select
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className={styles.inputField}
            >
              <option value="">Tümü</option>
              {cities.map((c) => (
                <option key={c.city_id} value={c.city_id}>
                  {c.city_name} ({c.city_id})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Varış Şehir:</label>
            <select
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              className={styles.inputField}
            >
              <option value="">Tümü</option>
              {cities.map((c) => (
                <option key={c.city_id} value={c.city_id}>
                  {c.city_name} ({c.city_id})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Tarih:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.inputField}
            />
          </div>

          <button type="submit">Ara</button>
        </form>
      </div>

      <h2>Uçuş Sonuçları</h2>
      {filteredFlights.length === 0 ? (
        <p>Aradığınız kriterlere uygun uçuş bulunamadı.</p>
      ) : (
        <ul className={styles.flightList}>
          {filteredFlights.map((f) => (
            <li key={f.flight_id} className={styles.flightListItem}>
              <div>
                <span>
                  <strong>{f.flight_id}</strong> &mdash;{" "}
                  {f.from_city_id} → {f.to_city_id}
                </span>
                <br />
                <small>
                  {new Date(f.departure_time).toLocaleString()} –{" "}
                  {new Date(f.arrival_time).toLocaleString()}
                </small>
              </div>
              <Link href={`/flight/${f.flight_id}`}>
                <button>Bilet al</button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </LayoutPublic>
  );
}
