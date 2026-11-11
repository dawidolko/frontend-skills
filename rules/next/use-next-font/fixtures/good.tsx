import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
const brand = localFont({ src: './fonts/brand.woff2', variable: '--font-brand' })

export default function RootLayout({ children, fontHref }: { children: React.ReactNode; fontHref: string }) {
  return (
    <html lang="en" className={`${inter.variable} ${brand.variable}`}>
      <head>
        <link rel="stylesheet" href={fontHref} />
        <link rel="stylesheet" href="/print.css" media="print" />
      </head>
      <body>{children}</body>
    </html>
  )
}
