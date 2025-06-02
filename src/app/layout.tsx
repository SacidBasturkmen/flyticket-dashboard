// src/app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'FlyTicket',
  description: 'FlyTicket - Uçuş Rezervasyon Uygulaması',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
