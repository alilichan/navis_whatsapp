import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Navis AI — Voice WhatsApp Assistant',
  description: 'Speak naturally. Navis AI finds your contact and crafts the message.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
