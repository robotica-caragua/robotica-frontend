
import { Footer } from '@/components/Footer'
import { Header } from '../components/Header'


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">{/* Conteúdo da página */}</main>

      <Footer />
    </div>
  )
}
