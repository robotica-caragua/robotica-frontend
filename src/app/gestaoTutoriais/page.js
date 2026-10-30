'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SideBarProfessor } from '@/components/SideBarProfessor'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { correspondeBusca, opcoesUnicas } from '@/utils/filtros'
import { apiCategorias, apiEscolas, apiTutoriais, mapearTutorialDaApi } from '@/services/api'
import semaforo from '@/assets/semaforo.png'
import containerImg from '@/assets/container.png'
import { IoSearchOutline, IoAddOutline } from 'react-icons/io5'
import {
  MdKeyboardArrowDown,
  MdOutlineEdit,
  MdOutlineVisibilityOff,
  MdOutlineVisibility,
  MdOutlineDeleteOutline
} from 'react-icons/md'

const opcoesNivel = ['Iniciante', 'Intermediário', 'Avançado']

export default function GestaoTutoriais() {
  const router = useRouter()
  const [tutoriais, setTutoriais] = useState([])
  const [categoriasApi, setCategoriasApi] = useState([])
  const [escolasApi, setEscolasApi] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [modal, setModal] = useState({ aberto: false, tipo: 'confirmacao', titulo: '', mensagem: '', tutorialParaExcluir: null })
  const [busca, setBusca] = useState('')
  const [nivel, setNivel] = useState('')
  const [categoria, setCategoria] = useState('')
  const [escola, setEscola] = useState('')

  useEffect(() => {
    let ativo = true

    Promise.all([
      apiTutoriais.listar().catch(() => []),
      apiCategorias.listar().catch(() => []),
      apiEscolas.listar().catch(() => [])
    ])
      .then(([listaDaApi, listaCategorias, listaEscolas]) => {
        if (!ativo) return
        setTutoriais(
          (Array.isArray(listaDaApi) ? listaDaApi : []).map((item, idx) =>
            mapearTutorialDaApi(item, idx % 2 === 0 ? containerImg : semaforo)
          )
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

  const opcoesCategoria = useMemo(() => {
    const unicas = new Set([...categoriasApi, ...opcoesUnicas(tutoriais, 'categoria')])
    return Array.from(unicas).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [categoriasApi, tutoriais])

  const opcoesEscola = useMemo(() => {
    const unicas = new Set([...escolasApi, ...opcoesUnicas(tutoriais, 'escola')])
    return Array.from(unicas).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [escolasApi, tutoriais])

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
    setTutoriais((prev) => prev.map((t) => (t.id === id ? { ...t, visivel: !t.visivel } : t)))
  }

  const excluirTutorial = (tutorial) => {
    setModal({
      aberto: true,
      tipo: 'confirmacao',
      titulo: 'Excluir Tutorial?',
      mensagem: `Deseja realmente remover o tutorial "${tutorial.titulo}"?`,
      tutorialParaExcluir: tutorial
    });
  };

  const handleConfirmarExclusaoTutorial = async () => {
    if (!modal.tutorialParaExcluir) return;
    const tut = modal.tutorialParaExcluir;
    try {
      await apiTutoriais.excluir(tut.id);
      setTutoriais((prev) => prev.filter((item) => item.id !== tut.id));
      setModal({
        aberto: true,
        tipo: 'sucesso',
        titulo: 'Tutorial excluído com sucesso!',
        mensagem: `O tutorial "${tut.titulo}" foi removido do catálogo.`,
        tutorialParaExcluir: null
      });
    } catch (err) {
      setModal({
        aberto: true,
        tipo: 'erro',
        titulo: 'Erro ao excluir tutorial',
        mensagem: err?.message || 'Não foi possível excluir o tutorial.',
        tutorialParaExcluir: null
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background relative">
      <SideBarProfessor />

      <main className="flex-1 flex flex-col">
        <div className="w-full max-w-6xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 flex flex-col gap-6 sm:gap-8">
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
              <h1 className="text-verde-escuro text-3xl sm:text-4xl font-bold leading-tight">
                Meus Tutoriais
              </h1>
              <p className="text-verde-musgo text-sm sm:text-base font-normal">
                Gerencie os seus Tutoriais. Publique novas ideias, continue rascunhos ou remova
                projetos antigos.
              </p>
            </section>

            <Link
              href="/cadastrarTutorial"
              className="shrink-0 px-5 py-2.5 bg-verde-musgo hover:bg-white hover:text-verde-musgo border-2 border-verde-musgo text-white text-sm font-bold rounded-xl shadow-xs flex items-center gap-2 transition cursor-pointer"
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
          {carregando ? (
            <p className="py-10 text-center text-verde-musgo font-medium">
              Carregando tutoriais...
            </p>
          ) : tutoriaisFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-12">
              {tutoriaisFiltrados.map((tutorial) => {
                const ehRascunho = tutorial.status === 'rascunho'
                return (
                  <article
                    key={tutorial.id}
                    className={`w-full max-w-[320px] mx-auto bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
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

                      <h2 className="text-verde-escuro text-base font-bold leading-snug line-clamp-2 min-h-[44px]">
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
              Nenhum tutorial encontrado no momento.
            </p>
          )}
        </div>
      </main>

      {modal.aberto && (
        <ModalConfirmacao
          aberto={modal.aberto}
          tipo={modal.tipo}
          titulo={modal.titulo}
          mensagem={modal.mensagem}
          textoConfirmar="Excluir"
          textoCancelar="Cancelar"
          onConfirmar={modal.tipo === 'confirmacao' ? handleConfirmarExclusaoTutorial : () => setModal((prev) => ({ ...prev, aberto: false }))}
          onCancelar={() => setModal((prev) => ({ ...prev, aberto: false }))}
        />
      )}
    </div>
  )
}
