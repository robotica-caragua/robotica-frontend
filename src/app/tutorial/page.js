import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FilterButton } from '@/components/FilterButton'
import { Card } from '@/components/Card'
import { SearchBar } from '@/components/SearchBar'

export default function tutorial() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-20 mt-20 ">
        <div className="justify-center items-center flex-col gap-4 flex">
          <h1 className="text-4xl font-bold">
            NOSSOS <span className="text-verde-musgo text-4xl font-bold">TUTORIAIS</span>
          </h1>
          <p className="text-2xl">
            Explore tutoriais práticos desenvolvidos pelas escolas do nosso circuito
          </p>
        </div>

        {/* CONTAINER PRINCIPAL LADO A LADO */}
        <div className="flex flex-row justify-between w-full items-start gap-8">
          
          {/* COLUNA DA ESQUERDA */}
          <div className="mt-4 flex flex-col gap-4">
            <SearchBar />
          </div>

          {/* COLUNA DA DIREITA: FILTROS + GRID DE CARDS */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-row gap-4">
              <div className="rounded-3xl bg-verde-oliva items-center py-1 px-4">
                <p className="mt-1 text-base font-semibold">Recentes</p>
              </div>
              <FilterButton>
                <p className="ms-1 text-base font-semibold">Mais Curtidos</p>
              </FilterButton>
              <FilterButton>
                <p className="text-base font-semibold">Ordem Alfabética</p>
              </FilterButton>
            </div>

            {/* CARDS EM COLUNAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
              <Card> </Card>
              <Card> </Card>
              <Card> </Card>
              <Card> </Card>
              <Card> </Card>
              <Card> </Card>
              <Card> </Card>
              <Card> </Card>
              <Card> </Card>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  )
}