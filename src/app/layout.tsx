import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { I18nProvider } from '../i18n/context';
import { WalletProvider } from '../context/WalletContext';
import { AuthProvider } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { PwaRegister } from '../components/pwa/PwaRegister';

export const metadata: Metadata = {
  title: 'Kindred AidTrail - Transparent Humanitarian Aid on Stellar',
  description:
    'Decentralized transparent aid and grant disbursement platform on Stellar and Soroban. Track every dollar from donor to merchant.',
  keywords: [
    'Stellar',
    'Soroban',
    'AidTrail',
    'Humanitarian Aid',
    'Smart Contracts',
    'Vouchers',
    'Transparency',
  ],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#10B981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
        <I18nProvider>
          <WalletProvider>
            <AuthProvider>
              <PwaRegister />
              <Navbar />
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </WalletProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
