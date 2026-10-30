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
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center">
        {/* Cabeçalho */}
        <section className="flex flex-col items-center text-center gap-4 mt-8 px-4">
          <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-verde-escuro">
            Nossos <span className="text-verde-musgo">Tutoriais!</span>
          </h1>
          <p className="text-base sm:text-xl md:text-[28px] font-medium text-verde-escuro max-w-5xl leading-snug">
            Explore tutoriais práticos desenvolvidos pelas escolas do nosso circuito
          </p>
        </section>

        {/* Container principal */}
        <div className="flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto px-6 lg:pl-[47px] lg:pr-[37px] items-start justify-center gap-10 mt-14">
          {/* Coluna esquerda */}
          <aside className="flex w-full lg:w-[350px] shrink-0 flex-col">
            <div className="flex flex-col gap-2.5 w-full">
              <SearchBar
                value={busca}
                onChange={comReset(setBusca)}
                placeholder="Pesquisar por assunto..."
              />
              <p className="text-[#747A60] text-sm font-semibold">
                Mostrando {tutoriaisFiltrados.length}{' '}
                {tutoriaisFiltrados.length === 1 ? 'projeto' : 'projetos'}
              </p>
            </div>

            <div className="flex flex-col gap-[15px] mt-10">
              <Category value={categoria} onChange={comReset(setCategoria)} options={categorias} />
              <Level value={nivel} onChange={comReset(setNivel)} />
              <School value={escola} onChange={comReset(setEscola)} options={escolas} />
            </div>

            <BobIdea />
          </aside>

          {/* Coluna direita */}
          <div className="flex flex-col gap-[21px] flex-1 max-w-[966px] w-full">
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
              <p className="mt-12 text-center text-verde-musgo text-lg font-medium">
                Carregando tutoriais...
              </p>
            ) : tutoriaisPaginados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-[15px] gap-y-10 place-items-center">
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
              <p className="mt-12 text-center text-verde-musgo text-lg font-medium">
                Nenhum tutorial encontrado no momento.
              </p>
            )}
          </div>
        </div>

        <Page currentPage={paginaAtual} totalPages={totalPaginas} onPageChange={setPaginaAtual} />
      </main>

      <Footer />
    </div>
  )
}
