// src/components/ErrorMessage.tsx
import React from "react";

interface Props {
  message: string;
}

export default function ErrorMessage({ message }: Props) {
  return (
    <div
      style={{
        backgroundColor: "#fdecea",
        color: "#c00",
        padding: "0.75rem",
        borderRadius: "4px",
        marginBottom: "1rem",
      }}
    >
      {message}
    </div>
  );
}
