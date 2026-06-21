import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BBN Investment Academy',
  description: 'Learn to grow your money on the Malawi Stock Exchange',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}