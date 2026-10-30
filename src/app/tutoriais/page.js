'use client'

import { useEffect, useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FilterButton } from '@/components/FilterButton'
import { Card } from '@/components/Card'
import { SearchBar } from '@/components/SearchBar'
import { Category } from '@/components/Category'
import { Level } from '@/components/Level'
import { School } from '@/components/School'
import { BobIdea } from '@/components/BobIdea'
import { Page } from '@/components/Page'
import { correspondeBusca, opcoesUnicas, ordenacoes, ordenar, paginar } from '@/utils/filtros'
import { apiCategorias, apiEscolas, apiTutoriais, mapearTutorialDaApi } from '@/services/api'

const ITENS_POR_PAGINA = 9

export default function Tutoriais() {
  const [tutoriais, setTutoriais] = useState([])
  const [categoriasApi, setCategoriasApi] = useState([])
  const [escolasApi, setEscolasApi] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [nivel, setNivel] = useState('')
  const [escola, setEscola] = useState('')
  const [ordenacao, setOrdenacao] = useState('recentes')
  const [paginaAtual, setPaginaAtual] = useState(1)

  useEffect(() => {
    let ativo = true

    Promise.all([
      apiTutoriais.listar().catch(() => []),
      apiCategorias.listar().catch(() => []),
      apiEscolas.listar().catch(() => [])
    ])
      .then(([listaTutoriais, listaCategorias, listaEscolas]) => {
        if (!ativo) return
        setTutoriais(
          Array.isArray(listaTutoriais)
            ? listaTutoriais.map((item) => mapearTutorialDaApi(item))
            : []
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
    const unicas = new Set([...categoriasApi, ...opcoesUnicas(tutoriais, 'categoria')])
    return Array.from(unicas).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [categoriasApi, tutoriais])

  const escolas = useMemo(() => {
    const unicas = new Set([...escolasApi, ...opcoesUnicas(tutoriais, 'escola')])
    return Array.from(unicas).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [escolasApi, tutoriais])

  const comReset = (setter) => (valor) => {
    setter(valor)
    setPaginaAtual(1)
  }

  const tutoriaisFiltrados = useMemo(() => {
    const filtrados = tutoriais.filter(
      (tutorial) =>
        correspondeBusca(
          busca,
          tutorial.titulo,
          tutorial.descricao,
          tutorial.autor,
          tutorial.categoria
        ) &&
        (!categoria || tutorial.categoria === categoria) &&
        (!nivel || tutorial.nivel === nivel) &&
        (!escola || tutorial.escola === escola)
    )
    return ordenar(filtrados, ordenacao)
  }, [tutoriais, busca, categoria, nivel, escola, ordenacao])

  const totalPaginas = Math.ceil(tutoriaisFiltrados.length / ITENS_POR_PAGINA)
  const tutoriaisPaginados = paginar(tutoriaisFiltrados, paginaAtual, ITENS_POR_PAGINA)

  return (
    <div className="flex flex-col min-h-screen bg-branco-esverdeado/20">
      <Header />

      <main className="grow flex flex-col items-center py-8 sm:py-12">
        {/* Cabeçalho */}
        <section className="flex flex-col items-center text-center gap-2 mb-3 px-4">
          <h1 className="font-extrabold text-3xl sm:text-4xl uppercase text-verde-escuro tracking-tight">
            Nossos <span className="text-verde-musgo">Tutoriais!</span>
          </h1>
          <p className="text-sm sm:text-base text-verde-musgo font-medium max-w-2xl mx-auto leading-relaxed">
            Explore tutoriais práticos desenvolvidos pelas escolas do nosso circuito
          </p>
        </section>

        {/* Container principal */}
        <div className="w-full md:w-[85%] lg:w-[75%] mx-auto px-4 flex flex-col lg:flex-row items-start gap-8 mt-6 sm:mt-8">
          {/* Coluna esquerda */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-5">
            <div className="flex flex-col gap-2 w-full">
              <SearchBar
                value={busca}
                onChange={comReset(setBusca)}
                placeholder="Pesquisar por assunto..."
              />
              <p className="text-verde-musgo text-xs sm:text-sm font-semibold ml-1">
                Mostrando {tutoriaisFiltrados.length}{' '}
                {tutoriaisFiltrados.length === 1 ? 'tutorial' : 'tutoriais'}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Category value={categoria} onChange={comReset(setCategoria)} options={categorias} />
              <Level value={nivel} onChange={comReset(setNivel)} />
              <School value={escola} onChange={comReset(setEscola)} options={escolas} />
            </div>

            <div className="hidden lg:block mt-2">
              <BobIdea />
            </div>
          </aside>

          {/* Coluna direita */}
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
                Carregando tutoriais...
              </p>
            ) : tutoriaisPaginados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-6 justify-items-center sm:justify-items-stretch">
                {tutoriaisPaginados.map((tutorial) => (
                  <Card
                    key={tutorial.id}
                    imageUrl={tutorial.imagem || undefined}
                    title={tutorial.titulo}
                    author={tutorial.autor}
                    description={tutorial.descricao}
                    level={tutorial.nivel}
                    likes={tutorial.curtidas}
                    linkUrl={`/detalhesTutorial?id=${tutorial.id}`}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-12 text-center text-verde-musgo text-base sm:text-lg font-medium">
                Nenhum tutorial encontrado no momento.
              </p>
            )}
          </section>
        </div>

        {totalPaginas > 1 && (
          <div className="mt-10">
            <Page currentPage={paginaAtual} totalPages={totalPaginas} onPageChange={setPaginaAtual} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
