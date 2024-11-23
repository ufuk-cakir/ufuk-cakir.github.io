import './globals.css'
import { Fraunces } from 'next/font/google'
import Navigation from './components/Navigation'

const fraunces = Fraunces({ 
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK', 'opsz'],
})

export const metadata = {
  title: 'Ufuk Çakır',
  description: 'AI Research in Humanitarian Aid',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${fraunces.variable} font-serif bg-[#1a1a1a] text-neutral-200`}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}

