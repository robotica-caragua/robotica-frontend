import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export default function Rede() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main>
        <div className="flex flex-row items-center justify-center gap-2 mb-4">
          <h1 className="font-bold text-4xl text-verde-escuro uppercase">Nossa</h1>
          <h1 className="font-bold text-4xl text-verde-musgo uppercase">Rede!</h1>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 text-xl text-center font-medium">
          <p>Conheça as escolas parceiras e acompanhe tudo o que 
          <br/>movimenta o nosso circuito de robótica.</p>
        </div>
      </main>

      <Footer />
    </div>
  )
}