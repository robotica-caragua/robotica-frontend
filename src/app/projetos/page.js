import { CardEvento } from '@/components/CardEvento'
import { CardEscola } from '@/components/CardEscola'
import { CardProjeto } from '@/components/CardProjeto'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { IoRocketOutline } from 'react-icons/io5'

export default function Projetos() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center ">
        {/* Título da página */}
        <div className="flex flex-row items-center justify-center gap-2 mb-4">
          <h1 className="font-bold text-4xl text-verde-escuro uppercase">Projetos</h1>
          <h1 className="font-bold text-4xl text-verde-musgo uppercase">em Destaque!</h1>
        </div>

        {/* Descrição da página */}
        <div className="items-center justify-center gap-4 text-xl text-center font-medium">
          <p>
            Inspire-se com as invenções, protótipos e soluções sustentáveis
            <br /> criadas pelos alunos da nossa rede municipal.
          </p>
        </div>

        <div>
          <CardProjeto />
        </div>
      </main>

      <Footer />
    </div>
  )
}
