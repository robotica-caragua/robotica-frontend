import './globals.css'
import { PageTitleUpdater } from '@/components/PageTitleUpdater'
import { RouteGuard } from '@/components/RouteGuard'

export const metadata = {
  title: {
    default: 'BioBot | Página Inicial',
    template: 'BioBot | %s'
  },
  description:
    'Conectando escolas, estudantes e a comunidade de Caraguatatuba através da tecnologia.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans bg-branco-creme text-verde-escuro antialiased overflow-x-hidden">
        <PageTitleUpdater />
        <RouteGuard>{children}</RouteGuard>
      </body>
    </html>
  )
}
