'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CardProjeto } from '@/components/CardProjeto'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import semaforo from '@/assets/semaforo.png'
import { SearchBar } from '@/components/SearchBar'
import { FilterButton } from '@/components/FilterButton'
import { FilterCategory } from '@/components/FilterCategory'
import { FilterSchool } from '@/components/FilterSchool'
import { Page } from '@/components/Page'
import { BobIdea } from '@/components/BobIdea'
import { correspondeBusca, opcoesUnicas, ordenacoes, ordenar, paginar } from '@/utils/filtros'
import { apiCategorias, apiEscolas, apiProjetos, mapearProjetoDaApi } from '@/services/api'

const ITENS_POR_PAGINA = 9

function ProjetosConteudo() {
  const searchParams = useSearchParams()
  const escolaUrl = searchParams.get('escola') || ''

  const [projetos, setProjetos] = useState([])
  const [categoriasApi, setCategoriasApi] = useState([])
  const [escolasApi, setEscolasApi] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [escolaSelecionada, setEscolaSelecionada] = useState(null)
  const escola = escolaSelecionada !== null ? escolaSelecionada : escolaUrl
  const setEscola = (valor) => setEscolaSelecionada(valor)
  const [ordenacao, setOrdenacao] = useState('recentes')
  const [paginaAtual, setPaginaAtual] = useState(1)

  useEffect(() => {
    let ativo = true

    Promise.all([
      apiProjetos.listar().catch(() => []),
      apiCategorias.listar().catch(() => []),
      apiEscolas.listar().catch(() => [])
    ])
      .then(([listaProjetos, listaCategorias, listaEscolas]) => {
        if (!ativo) return
        setProjetos(
          Array.isArray(listaProjetos) ? listaProjetos.map((item) => mapearProjetoDaApi(item)) : []
        )
        setCategoriasApi(
          Array.isArray(listaCategorias) ? listaCategorias.map((c) => c.name).filter(Boolean) : []
        )
        setEscolasApi(
          Array.isArray(listaEscolas) ? listaEscolas.map((s) => s.name).filter(Boolean) : []
        )
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  const categorias = useMemo(() => {
    const unicas = new Set([...categoriasApi, ...opcoesUnicas(projetos, 'categorias')])
    return Array.from(unicas).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [categoriasApi, projetos])

  const escolas = useMemo(() => {
    const unicas = new Set([...escolasApi, ...opcoesUnicas(projetos, 'escola')])
    return Array.from(unicas).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [escolasApi, projetos])

  const comReset = (setter) => (valor) => {
    setter(valor)
    setPaginaAtual(1)
  }

  const projetosFiltrados = useMemo(() => {
    const filtrados = projetos.filter(
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
  }, [projetos, busca, categoria, escola, ordenacao])

  const totalPaginas = Math.ceil(projetosFiltrados.length / ITENS_POR_PAGINA)
  const projetosPaginados = paginar(projetosFiltrados, paginaAtual, ITENS_POR_PAGINA)

  return (
    <div className="flex flex-col min-h-screen bg-branco-esverdeado/20">
      <Header />

      <main className="grow flex flex-col items-center py-8 sm:py-12">
        {/* Cabeçalho padronizado com Tutoriais */}
        <section className="flex flex-col items-center text-center gap-2 mb-3 px-4">
          <h1 className="font-extrabold text-3xl sm:text-4xl uppercase text-verde-escuro tracking-tight">
            Projetos <span className="text-verde-musgo">em Destaque!</span>
          </h1>
          <p className="text-sm sm:text-base text-verde-musgo font-medium max-w-2xl mx-auto leading-relaxed">
            Inspire-se com as invenções, protótipos e soluções sustentáveis criadas pelos alunos da
            nossa rede municipal.
          </p>
        </section>

        <div className="w-full md:w-[85%] lg:w-[75%] max-w-[1200px] mx-auto px-4 flex flex-col lg:flex-row items-start gap-8 mt-6 sm:mt-8">
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-5">
            <div className="flex flex-col gap-2 w-full">
              <SearchBar
                value={busca}
                onChange={comReset(setBusca)}
                placeholder="Pesquisar projetos..."
              />
              <p className="text-verde-musgo text-xs sm:text-sm font-semibold ml-1">
                Mostrando {projetosFiltrados.length}{' '}
                {projetosFiltrados.length === 1 ? 'projeto' : 'projetos'}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <FilterCategory
                value={categoria}
                onChange={comReset(setCategoria)}
                options={categorias}
              />
              <FilterSchool value={escola} onChange={comReset(setEscola)} options={escolas} />
            </div>

            <div className="hidden lg:block">
              <BobIdea />
            </div>
          </aside>

          <section className="flex flex-col flex-1 w-full min-w-0">
            <div className="flex flex-row gap-2.5 flex-wrap">
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

            {carregando ? (
              <p className="mt-12 text-center text-verde-musgo text-base sm:text-lg font-medium">
                Carregando projetos...
              </p>
            ) : projetosPaginados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-6 justify-items-center sm:justify-items-stretch">
                {projetosPaginados.map((projeto) => (
                  <CardProjeto
                    key={projeto.id}
                    imageUrl={projeto.imagem || semaforo}
                    isHighlight={projeto.destaque}
                    title={projeto.titulo}
                    Category1={projeto.categorias[0]}
                    Category2={projeto.categorias[1]}
                    school={projeto.escola}
                    team={projeto.equipe}
                    description={projeto.descricao}
                    likes={projeto.curtidas}
                    linkUrl={`/detalhesProjeto?id=${projeto.id}`}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-12 text-center text-verde-musgo text-base sm:text-lg font-medium">
                Nenhum projeto encontrado no momento.
              </p>
            )}
          </section>
        </div>

        {totalPaginas > 1 && (
          <div className="mt-10">
            <Page
              currentPage={paginaAtual}
              totalPages={totalPaginas}
              onPageChange={setPaginaAtual}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function Projetos() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-branco-esverdeado/20" />}>
      <ProjetosConteudo />
    </Suspense>
  )
}
