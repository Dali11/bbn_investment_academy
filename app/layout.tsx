import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Malawi Investor',
  description: 'Malawi Stock Exchange analysis, courses, and community.',
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