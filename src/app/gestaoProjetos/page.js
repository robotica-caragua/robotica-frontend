'use client'

import { Select } from '@/components/Select'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SideBarProfessor } from '@/components/SideBarProfessor'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { apiCategorias, apiEscolas, apiProjetos, mapearProjetoDaApi } from '@/services/api'
import { IoAddOutline } from 'react-icons/io5'
import {
  MdOutlineEdit,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
  MdOutlineDeleteOutline
} from 'react-icons/md'
import semaforo from '@/assets/semaforo.png'
import containerImg from '@/assets/container.png'

export default function GestaoProjetos() {
  const router = useRouter()
  const [projetos, setProjetos] = useState([])
  const [categoriasApi, setCategoriasApi] = useState([])
  const [escolasApi, setEscolasApi] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [categoria, setCategoria] = useState('')
  const [escola, setEscola] = useState('')
  const [modal, setModal] = useState({ aberto: false, tipo: null, mensagem: '', titulo: '' })

  useEffect(() => {
    let ativo = true

    Promise.all([
      apiProjetos.listar().catch(() => []),
      apiCategorias.listar().catch(() => []),
      apiEscolas.listar().catch(() => [])
    ])
      .then(([listaProjetos, listaCategorias, listaEscolas]) => {
        if (!ativo) return
        const dados = (Array.isArray(listaProjetos) ? listaProjetos : []).map((item, idx) => {
          const mapeado = mapearProjetoDaApi(item, idx % 2 === 0 ? containerImg : semaforo)
          return {
            id: item.id,
            titulo: item.name || mapeado.titulo,
            descricao: item.description || mapeado.descricao,
            imagem: mapeado.imagem,
            status: 'publicado',
            visivel: true,
            escola: item.school?.name || mapeado.escola || 'EMEF Prof. Luiz Ribeiro Muniz',
            categorias: mapeado.categorias || [],
            curtidas: item.likes || mapeado.curtidas || 0,
            infoData: `Criado em ${new Date(item.updatedAt || item.createdAt || Date.now()).toLocaleDateString('pt-BR')}`
          }
        })
        setProjetos(dados)
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
    const cats = new Set(categoriasApi)
    projetos.forEach((p) => (p.categorias || []).forEach((c) => cats.add(c)))
    return Array.from(cats).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [categoriasApi, projetos])

  const opcoesEscola = useMemo(() => {
    const esc = new Set([...escolasApi, ...projetos.map((p) => p.escola).filter(Boolean)])
    return Array.from(esc).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [escolasApi, projetos])

  const projetosFiltrados = useMemo(() => {
    return projetos.filter((proj) => {
      const bateuCat = !categoria || proj.categorias.includes(categoria)
      const bateuEscola = !escola || proj.escola === escola
      return bateuCat && bateuEscola
    })
  }, [projetos, categoria, escola])

  const alternarVisibilidade = (id) => {
    setProjetos((lista) => lista.map((p) => (p.id === id ? { ...p, visivel: !p.visivel } : p)))
  }

  const excluirProjeto = (proj) => {
    setModal({
      aberto: true,
      tipo: 'confirmacao',
      titulo: 'Excluir Projeto?',
      mensagem: `Tem certeza que deseja remover o projeto "${proj.titulo}"?`,
      projetoParaExcluir: proj
    })
  }

  const handleConfirmarExclusaoProjeto = async () => {
    if (!modal.projetoParaExcluir) return
    const proj = modal.projetoParaExcluir
    try {
      await apiProjetos.excluir(proj.id)
      setProjetos((lista) => lista.filter((p) => p.id !== proj.id))
      setModal({
        aberto: true,
        tipo: 'sucesso',
        titulo: 'Projeto removido com sucesso!',
        mensagem: `O projeto "${proj.titulo}" foi removido.`,
        projetoParaExcluir: null
      })
    } catch (err) {
      setModal({
        aberto: true,
        tipo: 'erro',
        titulo: 'Erro ao remover projeto',
        mensagem: err?.message || 'Não foi possível remover o projeto.',
        projetoParaExcluir: null
      })
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background relative">
      <SideBarProfessor />

      <main className="flex-1 flex flex-col pb-16">
        <div className="w-full max-w-[1040px] mx-auto py-8 lg:py-10 px-6 sm:px-10 lg:px-14 flex flex-col gap-6 sm:gap-8">
          {/* Cabeçalho */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <section className="flex flex-col gap-2 max-w-[600px]">
              <h1 className="text-verde-escuro text-3xl sm:text-4xl font-bold leading-tight">
                Meus Projetos
              </h1>
              <p className="text-verde-musgo text-sm sm:text-base font-normal">
                Gerencie os seus Projetos. Publique novas ideias, continue rascunhos ou remova
                projetos antigos.
              </p>
            </section>

            <Link
              href="/novoProjeto"
              className="shrink-0 px-6 py-3 bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo text-white text-sm sm:text-base font-bold rounded-lg shadow-sm flex items-center gap-2 transition cursor-pointer"
            >
              <IoAddOutline size={20} />
              <span>Novo Projeto</span>
            </Link>
          </div>

          {/* Barra técnica de filtros */}
          <div className="w-full p-5 bg-white border border-b-4 border-verde-musgo rounded-2xl flex flex-col md:flex-row items-stretch md:items-center gap-6 md:gap-10">
            <div className="flex-1 flex flex-col gap-1">
              <label
                htmlFor="filtro-categoria"
                className="text-verde-musgo text-xs sm:text-sm font-bold uppercase tracking-wide"
              >
                Categoria
              </label>
              <div className="relative">
                <Select
                  id="filtro-categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full appearance-none bg-transparent text-verde-musgo text-sm sm:text-base font-medium pr-7 focus:outline-none cursor-pointer"
                >
                  <option value="">Todas as Categorias</option>
                  {opcoesCategoria.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-verde-escuro/10" />

            <div className="flex-1 flex flex-col gap-1">
              <label
                htmlFor="filtro-escola"
                className="text-verde-musgo text-xs sm:text-sm font-bold uppercase tracking-wide"
              >
                Escola
              </label>
              <div className="relative">
                <Select
                  id="filtro-escola"
                  value={escola}
                  onChange={(e) => setEscola(e.target.value)}
                  className="w-full appearance-none bg-transparent text-verde-musgo text-sm sm:text-base font-medium pr-7 focus:outline-none cursor-pointer"
                >
                  <option value="">Todas as Escolas</option>
                  {opcoesEscola.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Grade de projetos */}
          {carregando ? (
            <p className="py-10 text-center text-verde-musgo font-medium text-sm">
              Carregando projetos...
            </p>
          ) : projetosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projetosFiltrados.map((projeto) => (
                <article
                  key={projeto.id}
                  className={`w-full max-w-[320px] mx-auto bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
                    !projeto.visivel ? 'opacity-60' : ''
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-full h-[160px] bg-stone-100 overflow-hidden">
                    <Image
                      src={projeto.imagem}
                      alt={projeto.titulo}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Corpo do card */}
                  <div className="p-5 flex flex-col gap-2.5 flex-1">
                    <span className="w-fit px-2.5 py-0.5 rounded-full bg-verde-limao text-verde-escuro text-[11px] font-bold uppercase">
                      Publicado
                    </span>

                    <h2 className="text-verde-escuro text-base font-bold leading-snug line-clamp-2 min-h-[44px]">
                      {projeto.titulo}
                    </h2>

                    <p className="text-xs text-verde-musgo font-semibold truncate">
                      {projeto.escola}
                    </p>

                    {/* Curtidas + data */}
                    <div className="py-2 border-y border-stone-100 flex items-center justify-between text-stone-500 text-xs">
                      <span>{projeto.curtidas} curtidas</span>
                      <span className="truncate">{projeto.infoData}</span>
                    </div>

                    {/* Ações */}
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => router.push(`/editarProjeto?id=${projeto.id}`)}
                        className="inline-flex items-center gap-1.5 text-verde-musgo hover:text-verde-escuro text-xs font-bold uppercase transition cursor-pointer"
                      >
                        <MdOutlineEdit size={16} />
                        <span>Editar</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => alternarVisibilidade(projeto.id)}
                          title={projeto.visivel ? 'Ocultar projeto' : 'Mostrar projeto'}
                          aria-label={projeto.visivel ? 'Ocultar' : 'Mostrar'}
                          className="p-1.5 rounded-lg text-verde-musgo hover:text-verde-escuro transition cursor-pointer"
                        >
                          {projeto.visivel ? (
                            <MdOutlineVisibilityOff size={16} />
                          ) : (
                            <MdOutlineVisibility size={16} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => excluirProjeto(projeto)}
                          title="Excluir projeto"
                          aria-label="Excluir projeto"
                          className="p-1.5 rounded-lg text-vermelho hover:opacity-70 transition cursor-pointer"
                        >
                          <MdOutlineDeleteOutline size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-verde-musgo font-medium text-sm">
              Nenhum projeto encontrado.
            </p>
          )}
        </div>
      </main>

      {modal.aberto && (
        <ModalConfirmacao
          aberto={modal.aberto}
          tipo={modal.tipo}
          tituloPrincipal={modal.titulo}
          tituloDestaque=""
          mensagem={modal.mensagem}
          textoBotaoVoltar="Continuar"
          hrefVoltar="/gestaoProjetos"
          textoConfirmar={modal.tipo === 'confirmacao' ? 'Excluir' : undefined}
          onConfirmar={
            modal.tipo === 'confirmacao'
              ? handleConfirmarExclusaoProjeto
              : () => setModal({ aberto: false, tipo: null, mensagem: '', titulo: '' })
          }
          onCancelar={() => setModal({ aberto: false, tipo: null, mensagem: '', titulo: '' })}
          onTentarNovamente={() =>
            setModal({ aberto: false, tipo: null, mensagem: '', titulo: '' })
          }
        />
      )}
    </div>
  )
}
