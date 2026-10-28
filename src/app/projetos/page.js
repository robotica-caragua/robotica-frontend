'use client'

import { useMemo, useState } from 'react'
import { CardProjeto } from '@/components/CardProjeto'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import semaforo from '@/assets/semaforo.png'
import { SearchBar } from '@/components/SearchBar'
import { FilterButton } from '@/components/FilterButton'
import { FilterCategory } from '@/components/FilterCategory'
import { FilterSchool } from '@/components/FilterSchool'
import { Page } from '@/components/Page'
import { correspondeBusca, opcoesUnicas, ordenacoes, ordenar, paginar } from '@/utils/filtros'

const ITENS_POR_PAGINA = 6

// TODO: substituir pelos dados da API quando estiver disponível
const listaProjetos = [
  {
    id: 1,
    titulo: 'Semáforo Inteligente',
    categorias: ['Arduino', 'Smart City'],
    escola: 'EMEF Prof. Luiz Ribeiro Muniz',
    equipe: 'Cibernéticos A',
    descricao:
      'Sistema de tráfego adaptativo que utiliza sensores ultrassônicos para otimizar o fluxo de veículos e reduzir congestionamentos.',
    curtidas: 124,
    data: '2026-09-10',
    destaque: true
  },
  {
    id: 2,
    titulo: 'Horta Automatizada',
    categorias: ['Arduino', 'IoT'],
    escola: 'EMEF Prof. Luiz Silvar do Prado',
    equipe: 'Raízes Tech',
    descricao:
      'Irrigação automática controlada por sensores de umidade do solo, com monitoramento remoto pelo celular.',
    curtidas: 98,
    data: '2026-08-22',
    destaque: true
  },
  {
    id: 3,
    titulo: 'Lixeira Seletiva Robótica',
    categorias: ['Sustentabilidade', 'Arduino'],
    escola: 'EMEF Profª Maria Aparecida De Carvalho',
    equipe: 'EcoBots',
    descricao:
      'Lixeira que identifica o tipo de material descartado e direciona para o compartimento correto de reciclagem.',
    curtidas: 156,
    data: '2026-07-15',
    destaque: false
  },
  {
    id: 4,
    titulo: 'Poste de Luz Solar',
    categorias: ['Smart City', 'Sustentabilidade'],
    escola: 'EMEF Profª Maria Thereza de Souza Castro',
    equipe: 'Luz do Futuro',
    descricao:
      'Protótipo de iluminação pública alimentada por energia solar que acende automaticamente ao anoitecer.',
    curtidas: 73,
    data: '2026-10-01',
    destaque: false
  },
  {
    id: 5,
    titulo: 'Estação Meteorológica',
    categorias: ['IoT'],
    escola: 'EMEF Prof. Luiz Ribeiro Muniz',
    equipe: 'Clima Kids',
    descricao:
      'Estação que mede temperatura, umidade e pressão do ar, publicando os dados em tempo real na internet.',
    curtidas: 61,
    data: '2026-06-30',
    destaque: false
  },
  {
    id: 6,
    titulo: 'Braço Robótico de Sucata',
    categorias: ['Sustentabilidade'],
    escola: 'EMEF Prof. Luiz Silvar do Prado',
    equipe: 'Mãos Mecânicas',
    descricao:
      'Braço robótico hidráulico construído com seringas, papelão e materiais reaproveitados.',
    curtidas: 112,
    data: '2026-05-18',
    destaque: false
  },
  {
    id: 7,
    titulo: 'Alarme de Enchentes',
    categorias: ['IoT', 'Smart City'],
    escola: 'EMEF Profª Maria Aparecida De Carvalho',
    equipe: 'Alerta Rio',
    descricao:
      'Sensor de nível de água que emite alertas sonoros e mensagens quando o rio se aproxima do limite de transbordo.',
    curtidas: 89,
    data: '2026-09-28',
    destaque: false
  },
  {
    id: 8,
    titulo: 'Carrinho Seguidor de Linha',
    categorias: ['Arduino'],
    escola: 'EMEF Profª Maria Thereza de Souza Castro',
    equipe: 'Velozes',
    descricao: 'Robô autônomo que segue trajetos marcados no chão usando sensores infravermelhos.',
    curtidas: 45,
    data: '2026-04-12',
    destaque: false
  }
]

const categorias = opcoesUnicas(listaProjetos, 'categorias')
const escolas = opcoesUnicas(listaProjetos, 'escola')

export default function Projetos() {
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [escola, setEscola] = useState('')
  const [ordenacao, setOrdenacao] = useState('recentes')
  const [paginaAtual, setPaginaAtual] = useState(1)

  // Qualquer alteração de filtro volta para a primeira página
  const comReset = (setter) => (valor) => {
    setter(valor)
    setPaginaAtual(1)
  }

  const projetosFiltrados = useMemo(() => {
    const filtrados = listaProjetos.filter(
      (projeto) =>
        correspondeBusca(
          busca,
          projeto.titulo,
          projeto.descricao,
          projeto.equipe,
          projeto.escola,
          ...projeto.categorias
        ) &&
        (!categoria || projeto.categorias.includes(categoria)) &&
        (!escola || projeto.escola === escola)
    )
    return ordenar(filtrados, ordenacao)
  }, [busca, categoria, escola, ordenacao])

  const totalPaginas = Math.ceil(projetosFiltrados.length / ITENS_POR_PAGINA)
  const projetosPaginados = paginar(projetosFiltrados, paginaAtual, ITENS_POR_PAGINA)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center ">
        <div className="flex flex-row items-center justify-center gap-2 mb-4">
          <h1 className="font-bold text-4xl text-verde-escuro uppercase">Projetos</h1>
          <h1 className="font-bold text-4xl text-verde-musgo uppercase">em Destaque!</h1>
        </div>

        <div className="items-center justify-center gap-4 text-xl text-center font-medium">
          <p>
            Inspire-se com as invenções, protótipos e soluções sustentáveis
            <br /> criadas pelos alunos da nossa rede municipal.
          </p>
        </div>

        <div className="flex flex-row w-[90%] max-w-[1600px] mx-auto items-start gap-12 mt-12">
          <div className="flex flex-col gap-6 w-[300px]">
            <div className="flex flex-col gap-2 w-full">
              <SearchBar
                value={busca}
                onChange={comReset(setBusca)}
                placeholder="Pesquisar projetos..."
              />
              <p className="text-verde-musgo text-sm font-semibold ml-2">
                Mostrando {projetosFiltrados.length}{' '}
                {projetosFiltrados.length === 1 ? 'projeto' : 'projetos'}
              </p>
            </div>

            <FilterCategory
              value={categoria}
              onChange={comReset(setCategoria)}
              options={categorias}
            />
            <FilterSchool value={escola} onChange={comReset(setEscola)} options={escolas} />
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex flex-row gap-4 flex-wrap">
              {ordenacoes.map(({ valor, texto }) => (
                <FilterButton
                  key={valor}
                  isActive={ordenacao === valor}
                  onClick={() => comReset(setOrdenacao)(valor)}
                >
                  {texto}
                </FilterButton>
              ))}
            </div>

            {projetosPaginados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12 w-full mt-8">
                {projetosPaginados.map((projeto) => (
                  <CardProjeto
                    key={projeto.id}
                    imageUrl={semaforo}
                    isHighlight={projeto.destaque}
                    title={projeto.titulo}
                    Category1={projeto.categorias[0]}
                    Category2={projeto.categorias[1]}
                    school={projeto.escola}
                    team={projeto.equipe}
                    description={projeto.descricao}
                    likes={projeto.curtidas}
                    linkUrl="/detalhesProjeto"
                  />
                ))}
              </div>
            ) : (
              <p className="mt-12 text-center text-verde-musgo text-lg font-medium">
                Nenhum projeto encontrado com os filtros atuais.
              </p>
            )}
          </div>
        </div>

        {totalPaginas > 1 && (
          <Page currentPage={paginaAtual} totalPages={totalPaginas} onPageChange={setPaginaAtual} />
        )}
      </main>

      <Footer />
    </div>
  )
}
