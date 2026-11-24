import './globals.css'
import { cookies } from 'next/headers'
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

export default async function RootLayout({ children }) {
  const cookieStore = await cookies()
  const temaCookie = cookieStore.get('biobot_theme')?.value
  const ehEscuro = temaCookie === 'dark'

  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={ehEscuro ? 'dark' : ''}
      style={{ colorScheme: ehEscuro ? 'dark' : 'light' }}
      suppressHydrationWarning
    >
      <body className="font-sans bg-branco-creme text-verde-escuro antialiased overflow-x-hidden">
        <PageTitleUpdater />
        <RouteGuard>{children}</RouteGuard>
      </body>
    </html>
  )
}
