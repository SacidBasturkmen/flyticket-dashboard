// src/components/LoadingSpinner.tsx
import React from "react";
import styles from "../styles/spinner.module.css";

export default function LoadingSpinner() {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
}
