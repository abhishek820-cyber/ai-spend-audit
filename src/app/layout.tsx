import type { Metadata } from 'next'
import '@/styles/globals.css'
import { ToastProvider } from '@/components/Toast'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'AI Spend Audit — Find Hidden Savings in Your AI Stack',
  description: 'Get an instant audit of your AI tool spending. See exactly where you\'re overspending and discover real savings opportunities. Free, no signup required.',
  openGraph: {
    title: 'AI Spend Audit — Find Hidden Savings in Your AI Stack',
    description: 'Get an instant audit of your AI tool spending. Free, no signup required.',
    type: 'website',
    url: 'https://ai-spend-audit-smoky.vercel.app',
    siteName: 'AI Spend Audit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Spend Audit — Find Hidden Savings in Your AI Stack',
    description: 'Get an instant audit of your AI tool spending. Free, no signup required.',
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}