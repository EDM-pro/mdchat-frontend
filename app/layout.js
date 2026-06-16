import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'MD Chat — Modern Sohbet Platformu',
  description: 'Gerçek zamanlı, güvenli ve modern sohbet platformu. Kanallar arası sohbet, özel mesajlaşma ve daha fazlası.',
  keywords: 'sohbet, chat, anlık mesajlaşma, online sohbet',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
      <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MD Chat" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-screen overflow-hidden">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            },
            success: {
              iconTheme: { primary: '#FF6B00', secondary: '#fff' },
              style: { border: '1px solid #FFE0B2' },
            },
            error: {
              style: { border: '1px solid #fee2e2' },
            },
          }}
        />
      </body>
    </html>
  );
}
