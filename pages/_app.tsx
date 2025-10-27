// File: pages/_app.tsx (Code Sạch)
import type { AppProps } from 'next/app';
// LƯU Ý: Đảm bảo đường dẫn CSS toàn cục là đúng
import '../styles/globals.css'; 
import { AuthProvider } from '../AuthContext';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
        <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;