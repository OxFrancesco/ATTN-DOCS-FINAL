import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Rubik } from 'next/font/google';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'AttentionPad',
    template: '%s | AttentionPad',
  },
  description: 'AttentionPad Documentation',
  icons: {
    icon: '/favicon.svg',
  },
};

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
  display: 'swap',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={rubik.variable} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
