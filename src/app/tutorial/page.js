import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FilterButton } from '@/components/FilterButton'

export default function tutorial() {
  return (
    <>
      <Header />
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-20 mt-20 px-4">
        <div className=" justify-center items-center flex-col gap-12 flex ">
          <h1 className="text-4xl font-bold">
            NOSSOS <span className="text-verde-musgo text-4xl font-bold">TUTORIAIS</span>
          </h1>
          <p className="text-2xl">
            Explore tutoriais práticos desenvolvidos pelas escolas do nosso circuito
          </p>
        </div>
        <div className="flex">
          <div className="flex flex-row gap-4">
            <div className="rounded-3xl bg-verde-oliva items-center py-1 px-4">
              <p className=" mt-1 text-base font-semibold">Recentes</p>
            </div>
            <FilterButton>
              <p className="ms-1  text-base font-semibold">Mais Curtidos</p>
            </FilterButton>
            <FilterButton>
              <p className="text-base font-semibold">Ordem Alfabética</p>
            </FilterButton>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
