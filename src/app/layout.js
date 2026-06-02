import './globals.css'

export const metadata = {
  title: 'BioBot',
  description:
    'Conectando escolas, estudantes e a comunidade de Caraguatatuba através da tecnologia.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans bg-branco-creme text-verde-escuro antialiased">
        {children}
      
      </body>

    </html>
  )
}
