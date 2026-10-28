'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SideBarProfessor } from '@/components/SideBarProfessor'
import { correspondeBusca, opcoesUnicas } from '@/utils/filtros'
import { tutoriaisProfessorPadrao as tutoriaisIniciais } from '@/utils/tutoriaisProfessor'
import { IoSearchOutline, IoAddOutline } from 'react-icons/io5'
import {
  MdKeyboardArrowDown,
  MdOutlineEdit,
  MdOutlineVisibilityOff,
  MdOutlineVisibility,
  MdOutlineDeleteOutline
} from 'react-icons/md'

const opcoesNivel = ['Iniciante', 'Intermediário', 'Avançado']
const opcoesCategoria = opcoesUnicas(tutoriaisIniciais, 'categoria')
const opcoesEscola = opcoesUnicas(tutoriaisIniciais, 'escola')

export default function GestaoTutoriais() {
  const router = useRouter()
  const [tutoriais, setTutoriais] = useState(tutoriaisIniciais)
  const [busca, setBusca] = useState('')
  const [nivel, setNivel] = useState('')
  const [categoria, setCategoria] = useState('')
  const [escola, setEscola] = useState('')

  const tutoriaisFiltrados = useMemo(
    () =>
      tutoriais.filter(
        (t) =>
          correspondeBusca(busca, t.titulo, t.categoria, t.nivel, t.escola) &&
          (!nivel || t.nivel === nivel) &&
          (!categoria || t.categoria === categoria) &&
          (!escola || t.escola === escola)
      ),
    [tutoriais, busca, nivel, categoria, escola]
  )

  const alternarVisibilidade = (id) => {
    // TODO: integrar com a API
    setTutoriais((prev) => prev.map((t) => (t.id === id ? { ...t, visivel: !t.visivel } : t)))
  }

  const excluirTutorial = (tutorial) => {
    if (window.confirm(`Deseja realmente excluir o tutorial "${tutorial.titulo}"?`)) {
      // TODO: integrar com a API
      setTutoriais((prev) => prev.filter((t) => t.id !== tutorial.id))
    }
  }

  return (
    <div className="flex min-h-screen bg-background relative">
      <SideBarProfessor />

      <main className="flex-1 flex flex-col">
        <div className="w-[85%] max-w-[900px] mx-auto py-10 px-4 flex flex-col gap-10">
          {/* Busca superior */}
          <div className="relative w-full max-w-[350px]">
            <IoSearchOutline
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-verde-escuro pointer-events-none"
            />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar projetos..."
              aria-label="Pesquisar tutoriais"
              className="w-full h-9 pl-11 pr-4 bg-input-bg border border-verde-musgo rounded-full text-sm font-semibold text-verde-escuro placeholder:text-verde-escuro/80 focus:outline-none focus:ring-1 focus:ring-verde-musgo"
            />
          </div>

          {/* Cabeçalho da página */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <section className="flex flex-col gap-2 max-w-[647px]">
              <h1 className="text-verde-escuro text-5xl font-bold leading-tight">Meus Tutoriais</h1>
              <p className="text-verde-musgo text-xl font-normal">
                Gerencie os seus Tutoriais. Publique novas ideias, continue rascunhos ou remova
                projetos antigos.
              </p>
            </section>

            <Link
              href="/cadastrarTutorial"
              className="shrink-0 px-6 py-3 bg-[#4C6700] hover:bg-white hover:text-verde-musgo border border-verde-musgo text-white text-xl font-bold rounded-lg shadow-sm flex items-center gap-3 transition"
            >
              <IoAddOutline size={22} />
              Nova Publicação
            </Link>
          </div>

          {/* Barra técnica de filtros */}
          <div className="w-full p-6 bg-white/80 backdrop-blur-sm border border-verde-musgo rounded-[20px] flex flex-col md:flex-row items-stretch md:items-center gap-6 md:gap-10">
            <div className="flex-1 flex flex-col gap-1">
              <label
                htmlFor="filtro-nivel"
                className="text-verde-musgo text-base font-bold uppercase tracking-wide"
              >
                Nível
              </label>
              <div className="relative">
                <select
                  id="filtro-nivel"
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  className="w-full appearance-none bg-transparent text-verde-musgo text-base font-medium pr-7 focus:outline-none cursor-pointer"
                >
                  <option value="">Todos os Níveis</option>
                  {opcoesNivel.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                <MdKeyboardArrowDown
                  size={21}
                  className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-verde-musgo"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-verde-escuro/10" />

            <div className="flex-1 flex flex-col gap-1">
              <label
                htmlFor="filtro-categoria"
                className="text-verde-musgo text-base font-bold uppercase tracking-wide"
              >
                Categoria
              </label>
              <div className="relative">
                <select
                  id="filtro-categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full appearance-none bg-transparent text-verde-musgo text-base font-medium pr-7 focus:outline-none cursor-pointer"
                >
                  <option value="">Todas as Categorias</option>
                  {opcoesCategoria.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                <MdKeyboardArrowDown
                  size={21}
                  className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-verde-musgo"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-verde-escuro/10" />

            <div className="flex-1 flex flex-col gap-1">
              <label
                htmlFor="filtro-escola"
                className="text-verde-musgo text-base font-bold uppercase tracking-wide"
              >
                Escola
              </label>
              <div className="relative">
                <select
                  id="filtro-escola"
                  value={escola}
                  onChange={(e) => setEscola(e.target.value)}
                  className="w-full appearance-none bg-transparent text-verde-musgo text-base font-medium pr-7 focus:outline-none cursor-pointer"
                >
                  <option value="">Todas as Escolas</option>
                  {opcoesEscola.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                <MdKeyboardArrowDown
                  size={21}
                  className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-verde-musgo"
                />
              </div>
            </div>
          </div>

          {/* Grade de vídeos / tutoriais */}
          {tutoriaisFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-12">
              {tutoriaisFiltrados.map((tutorial) => {
                const ehRascunho = tutorial.status === 'rascunho'
                return (
                  <article
                    key={tutorial.id}
                    className={`w-full max-w-[280px] mx-auto bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col transition ${
                      !tutorial.visivel ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Thumbnail com duração */}
                    <div className="relative w-full h-[159px] bg-gray-200 overflow-hidden">
                      <Image
                        src={tutorial.imagem}
                        alt={tutorial.titulo}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-sm font-semibold">
                        {tutorial.duracao}
                      </span>
                    </div>

                    {/* Corpo do card */}
                    <div className="p-6 flex flex-col gap-3 flex-1">
                      {ehRascunho ? (
                        <span className="w-fit px-3 py-0.5 rounded-full bg-[#E1E3E4] text-verde-escuro text-xs font-black uppercase">
                          Rascunho
                        </span>
                      ) : (
                        <span className="w-fit px-3 py-0.5 rounded-full bg-verde-limao shadow-[0_0_10px_rgba(190,252,0,0.6)] text-verde-escuro text-xs font-black uppercase">
                          Publicado
                        </span>
                      )}

                      <h2 className="text-verde-escuro text-2xl font-bold leading-snug line-clamp-2 min-h-[60px]">
                        {tutorial.titulo}
                      </h2>

                      {/* Visualizações + data */}
                      <div className="py-2.5 border-y border-verde-escuro/10 flex items-center gap-3 text-verde-musgo text-xs font-bold">
                        <span className="inline-flex items-center gap-1 shrink-0">
                          <MdOutlineVisibility size={16} />
                          {tutorial.visualizacoes}
                        </span>
                        <span className="truncate">{tutorial.infoData}</span>
                      </div>

                      {/* Ações */}
                      <div className="mt-auto pt-2 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => router.push(`/editarTutorial?id=${tutorial.id}`)}
                          className="inline-flex items-center gap-1.5 text-verde-musgo hover:text-verde-escuro text-sm font-bold uppercase transition cursor-pointer"
                        >
                          <MdOutlineEdit size={18} />
                          Editar
                        </button>

                        <div className="flex items-center gap-2">
                          {!ehRascunho && (
                            <button
                              type="button"
                              onClick={() => alternarVisibilidade(tutorial.id)}
                              title={tutorial.visivel ? 'Ocultar tutorial' : 'Mostrar tutorial'}
                              aria-label={
                                tutorial.visivel
                                  ? `Ocultar ${tutorial.titulo}`
                                  : `Mostrar ${tutorial.titulo}`
                              }
                              className="p-1.5 rounded-lg text-verde-musgo hover:text-verde-escuro transition cursor-pointer"
                            >
                              {tutorial.visivel ? (
                                <MdOutlineVisibilityOff size={18} />
                              ) : (
                                <MdOutlineVisibility size={18} />
                              )}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => excluirTutorial(tutorial)}
                            title="Excluir tutorial"
                            aria-label={`Excluir ${tutorial.titulo}`}
                            className="p-1.5 rounded-lg text-vermelho hover:opacity-70 transition cursor-pointer"
                          >
                            <MdOutlineDeleteOutline size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="py-10 text-center text-verde-musgo font-medium">
              Nenhum tutorial encontrado com os filtros atuais.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
