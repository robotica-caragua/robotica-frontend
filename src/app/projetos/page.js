import { CardProjeto } from '@/components/CardProjeto'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import semaforo from '@/assets/semaforo.png'
import { SearchBar } from '@/components/SearchBar'
import { FilterButton } from '@/components/FilterButton'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { FilterCategory } from '@/components/FilterCategory'
import { FilterSchool } from '@/components/FilterSchool'

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

        {/* CONTAINER PRINCIPAL LADO A LADO */}
        <div className="flex flex-row w-[90%] max-w-[1600px] mx-auto items-start gap-12 mt-12">
          {/* COLUNA DA ESQUERDA */}
          <div className="flex flex-col gap-6 w-[300px]">
            {/* Barra de Pesquisa */}
            <div className="flex flex-col gap-2 w-full">
              <SearchBar />
              <p className="text-verde-musgo text-sm font-semibold ml-2">Mostrando 48 projetos</p>
            </div>

            <FilterCategory />
            <FilterSchool />
          </div>

          {/* COLUNA DA DIREITA: FILTROS + GRID DE CARDS */}
          <div className="flex flex-col flex-1">
            <div className="flex flex-row gap-4 flex-wrap">
              <div className="rounded-3xl bg-verde-oliva items-center py-2 px-6 cursor-pointer">
                <p className="text-base font-semibold text-verde-escuro">Recentes</p>
              </div>
              <FilterButton>
                <p className="text-base font-semibold text-verde-musgo cursor-pointer">
                  Mais Curtidos
                </p>
              </FilterButton>
              <FilterButton>
                <p className="text-base font-semibold text-verde-musgo cursor-pointer">
                  Ordem Alfabética
                </p>
              </FilterButton>
            </div>

            {/* GRID DE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12 w-full mt-8">
              <CardProjeto
                imageUrl={semaforo}
                isHighlight={true}
                title="Semáforo Inteligente"
                Category1="Arduino"
                Category2="Smart City"
                school="EMEF Prof. Luiz Ribeiro Muniz"
                team="Cibernéticos A"
                description="Sistema de tráfego adaptativo que utiliza sensores ultrassônicos para otimizar o fluxo de veículos e reduzir congestionamentos."
                likes={124}
                linkUrl="/detalhesProjeto"
              />
              <CardProjeto
                imageUrl={semaforo}
                isHighlight={true}
                title="Semáforo Inteligente"
                Category1="Arduino"
                Category2="Smart City"
                school="EMEF Prof. Luiz Ribeiro Muniz"
                team="Cibernéticos A"
                description="Sistema de tráfego adaptativo que utiliza sensores ultrassônicos para otimizar o fluxo de veículos e reduzir congestionamentos."
                likes={124}
                linkUrl="/detalhesProjeto"
              />
              <CardProjeto
                imageUrl={semaforo}
                isHighlight={false}
                title="Semáforo Inteligente"
                Category1="Arduino"
                Category2="Smart City"
                school="EMEF Prof. Luiz Ribeiro Muniz"
                team="Cibernéticos A"
                description="Sistema de tráfego adaptativo que utiliza sensores ultrassônicos para otimizar o fluxo de veículos e reduzir congestionamentos."
                likes={124}
                linkUrl="/detalhesProjeto"
              />
              <CardProjeto
                imageUrl={semaforo}
                isHighlight={false}
                title="Semáforo Inteligente"
                Category1="Arduino"
                Category2="Smart City"
                school="EMEF Prof. Luiz Ribeiro Muniz"
                team="Cibernéticos A"
                description="Sistema de tráfego adaptativo que utiliza sensores ultrassônicos para otimizar o fluxo de veículos e reduzir congestionamentos."
                likes={124}
                linkUrl="/detalhesProjeto"
              />
              <CardProjeto
                imageUrl={semaforo}
                isHighlight={false}
                title="Semáforo Inteligente"
                Category1="Arduino"
                Category2="Smart City"
                school="EMEF Prof. Luiz Ribeiro Muniz"
                team="Cibernéticos A"
                description="Sistema de tráfego adaptativo que utiliza sensores ultrassônicos para otimizar o fluxo de veículos e reduzir congestionamentos."
                likes={124}
                linkUrl="/detalhesProjeto"
              />
              <CardProjeto
                imageUrl={semaforo}
                isHighlight={false}
                title="Semáforo Inteligente"
                Category1="Arduino"
                Category2="Smart City"
                school="EMEF Prof. Luiz Ribeiro Muniz"
                team="Cibernéticos A"
                description="Sistema de tráfego adaptativo que utiliza sensores ultrassônicos para otimizar o fluxo de veículos e reduzir congestionamentos."
                likes={124}
                linkUrl="/detalhesProjeto"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 my-20">
          <button className="text-verde-musgo hover:text-verde-escuro transition-colors cursor-pointer">
            <IoIosArrowBack size={24} />
          </button>

          <button className="w-10 h-10 bg-verde-limao rounded-full flex justify-center items-center font-bold text-verde-escuro cursor-pointer">
            1
          </button>
          <button className="w-10 h-10 rounded-full outline outline-1 outline-verde-musgo flex justify-center items-center font-normal text-verde-escuro hover:bg-verde-limao/30 transition-colors cursor-pointer">
            2
          </button>
          <button className="w-10 h-10 rounded-full outline outline-1 outline-verde-musgo flex justify-center items-center font-normal text-verde-escuro hover:bg-verde-limao/30 transition-colors cursor-pointer">
            3
          </button>

          <span className="text-verde-musgo font-bold px-2">...</span>

          <button className="text-verde-musgo hover:text-verde-escuro transition-colors cursor-pointer">
            <IoIosArrowForward size={24} />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
