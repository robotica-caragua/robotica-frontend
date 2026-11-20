import './globals.css'
import { PageTitleUpdater } from '@/components/PageTitleUpdater'

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
    <html lang="pt-BR">
      <body className="font-sans bg-branco-creme text-verde-escuro antialiased overflow-x-hidden">
        <PageTitleUpdater />
        {children}
      </body>
    </html>
  )
}
