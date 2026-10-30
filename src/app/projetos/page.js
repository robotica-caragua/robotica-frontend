'use client'

import { useEffect, useMemo, useState } from 'react'
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
import { apiCategorias, apiEscolas, apiProjetos, mapearProjetoDaApi } from '@/services/api'

const ITENS_POR_PAGINA = 6

export default function Projetos() {
  const [projetos, setProjetos] = useState([])
  const [categoriasApi, setCategoriasApi] = useState([])
  const [escolasApi, setEscolasApi] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [escola, setEscola] = useState('')
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
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 text-center px-4">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-verde-escuro uppercase">
            Projetos
          </h1>
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-verde-musgo uppercase">
            em Destaque!
          </h1>
        </div>

        <div className="items-center justify-center gap-4 text-base sm:text-lg md:text-xl text-center font-medium px-4">
          <p>
            Inspire-se com as invenções, protótipos e soluções sustentáveis
            <br className="hidden sm:inline" /> criadas pelos alunos da nossa rede municipal.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row w-[90%] max-w-[1600px] mx-auto items-start gap-8 lg:gap-12 mt-8 lg:mt-12">
          <div className="flex flex-col gap-6 w-full lg:w-[300px] shrink-0">
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

          <div className="flex flex-col flex-1 w-full">
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

            {carregando ? (
              <p className="mt-12 text-center text-verde-musgo text-lg font-medium">
                Carregando projetos...
              </p>
            ) : projetosPaginados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12 w-full mt-8">
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
              <p className="mt-12 text-center text-verde-musgo text-lg font-medium">
                Nenhum projeto encontrado no momento.
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
