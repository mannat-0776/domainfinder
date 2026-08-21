import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Domain Finder — Find the Perfect Startup Name',
    template: '%s | Domain Finder',
  },
  description:
    'Describe your startup idea and instantly discover available domain names, brand quality scores, and expert recommendations. The smartest way to name your company.',
  keywords: [
    'startup name generator',
    'domain name finder',
    'brand name checker',
    'domain availability',
    'startup naming',
    'business name generator',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Domain Finder',
    title: 'Domain Finder — Find the Perfect Startup Name',
    description:
      'Describe your idea. Get names, domain availability, and brand scores instantly.',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Domain Finder',
    description: 'The smartest way to name your startup.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-surface-50 text-surface-900 antialiased">
        {children}
      </body>
    </html>
  );
}
