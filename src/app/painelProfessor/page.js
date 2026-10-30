'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SideBarProfessor } from '@/components/SideBarProfessor'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { correspondeBusca } from '@/utils/filtros'
import semaforo from '@/assets/semaforo.png'
import containerImg from '@/assets/container.png'
import {
  apiAuth,
  apiEscolas,
  apiProjetos,
  apiTutoriais,
  apiUsuarios,
  mapearProjetoDaApi,
  mapearTutorialDaApi,
  obterToken,
  obterUsuario
} from '@/services/api'
import { IoSearchOutline, IoAddOutline, IoArrowForward, IoOpenOutline } from 'react-icons/io5'
import {
  MdOutlineLocationOn,
  MdOutlineFolder,
  MdOutlineEditNote,
  MdOutlineGroups,
  MdOutlineEdit,
  MdOutlineVisibilityOff,
  MdOutlineVisibility,
  MdOutlineDeleteOutline,
  MdOutlineCampaign
} from 'react-icons/md'

export default function PainelProfessor() {
  const router = useRouter()
  const [busca, setBusca] = useState('')
  const [publicacoes, setPublicacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [modal, setModal] = useState({ aberto: false, tipo: 'confirmacao', titulo: '', mensagem: '', pubParaExcluir: null })
  const [nomeProfessor, setNomeProfessor] = useState(() => obterUsuario()?.name || 'Professor(a)')
  const [nomeEscola, setNomeEscola] = useState('Rede Municipal de Caraguatatuba')

  useEffect(() => {
    let ativo = true

    if (obterToken()) {
      apiAuth
        .me()
        .then((user) => {
          if (!ativo || !user) return
          if (user.name) setNomeProfessor(user.name)
          if (user.id) {
            apiUsuarios
              .buscarEscolaDoUsuario(user.id)
              .then((esc) => {
                if (ativo && esc?.name) setNomeEscola(esc.name)
              })
              .catch(() => {})
          }
        })
        .catch(() => {})
    }

    Promise.all([
      apiTutoriais.listar().catch(() => []),
      apiProjetos.listar().catch(() => []),
      apiEscolas.listar().catch(() => [])
    ])
      .then(([listaTutoriais, listaProjetos, listaEscolas]) => {
        if (!ativo) return

        const tuts = (Array.isArray(listaTutoriais) ? listaTutoriais : []).map((item, idx) => ({
          ...mapearTutorialDaApi(item, idx % 2 === 0 ? semaforo : containerImg),
          tipoRecurso: 'tutorial',
          chaveUnica: `tutorial-${item.id}`
        }))

        const idsTutoriais = new Set(tuts.map((t) => t.titulo))
        const projs = (Array.isArray(listaProjetos) ? listaProjetos : [])
          .filter((p) => !idsTutoriais.has(p.name))
          .map((item, idx) => ({
            ...mapearProjetoDaApi(item),
            status: 'publicado',
            imagem: idx % 2 === 0 ? containerImg : semaforo,
            visivel: true,
            tipoRecurso: 'projeto',
            chaveUnica: `projeto-${item.id}`
          }))

        const combinados = [...tuts, ...projs]
        setPublicacoes(combinados)

        const primeiraEscola =
          listaTutoriais?.[0]?.school?.name ||
          listaProjetos?.[0]?.school?.name ||
          listaEscolas?.[0]?.name
        if (primeiraEscola) {
          setNomeEscola((atual) =>
            atual === 'Rede Municipal de Caraguatatuba' ? primeiraEscola : atual
          )
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  const totalPublicados = publicacoes.filter((p) => p.status === 'publicado').length
  const totalRascunhos = publicacoes.filter((p) => p.status === 'rascunho').length
  const totalVisualizacoes = publicacoes.reduce((acc, p) => acc + (p.visualizacoes || 0), 0)

  const publicacoesFiltradas = useMemo(
    () =>
      publicacoes.filter((pub) => correspondeBusca(busca, pub.titulo, pub.status, pub.infoData)),
    [busca, publicacoes]
  )

  const alternarVisibilidade = (chaveUnica) => {
    setPublicacoes((prev) =>
      prev.map((p) => (p.chaveUnica === chaveUnica ? { ...p, visivel: !p.visivel } : p))
    )
  }

  const excluirPublicacao = (pub) => {
    setModal({
      aberto: true,
      tipo: 'confirmacao',
      titulo: 'Excluir Publicação?',
      mensagem: `Deseja realmente remover "${pub.titulo}" da rede?`,
      pubParaExcluir: pub
    })
  }

  const handleConfirmarExclusaoPublicacao = async () => {
    if (!modal.pubParaExcluir) return
    const pub = modal.pubParaExcluir
    try {
      if (pub.tipoRecurso === 'projeto') {
        await apiProjetos.excluir(pub.id)
      } else {
        await apiTutoriais.excluir(pub.id)
      }
      setPublicacoes((prev) => prev.filter((p) => p.chaveUnica !== pub.chaveUnica))
      setModal({
        aberto: true,
        tipo: 'sucesso',
        titulo: 'Publicação excluída com sucesso!',
        mensagem: `"${pub.titulo}" foi removida com sucesso.`,
        pubParaExcluir: null
      })
    } catch (err) {
      setModal({
        aberto: true,
        tipo: 'erro',
        titulo: 'Erro ao excluir',
        mensagem: err?.message || 'Não foi possível excluir a publicação.',
        pubParaExcluir: null
      })
    }
  }

  const editarPublicacao = (pub) => {
    if (pub.tipoRecurso === 'projeto') {
      router.push(`/editarProjeto?id=${pub.id}`)
    } else {
      router.push(`/editarTutorial?id=${pub.id}`)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background relative">
      <SideBarProfessor />

      <main className="flex-1 flex flex-col">
        <div className="w-[92%] sm:w-[85%] max-w-[900px] mx-auto py-8 lg:py-10 px-2 sm:px-4 flex flex-col gap-8 lg:gap-10">
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
              aria-label="Pesquisar projetos"
              className="w-full h-9 pl-11 pr-4 bg-input-bg border border-verde-musgo rounded-full text-sm font-semibold text-verde-escuro placeholder:text-verde-escuro/80 focus:outline-none focus:ring-1 focus:ring-verde-musgo"
            />
          </div>

          {/* Saudação e botão Nova Publicação */}
          <section className="flex flex-col gap-3">
            <h1 className="text-verde-escuro text-3xl sm:text-5xl font-bold leading-tight">
              Olá, {nomeProfessor}!
            </h1>
            <div className="flex items-center gap-2 text-verde-musgo font-bold text-lg sm:text-xl">
              <MdOutlineLocationOn size={22} />
              <span>{nomeEscola}</span>
            </div>
            <div className="flex justify-end pt-1">
              <Link
                href="/cadastrarTutorial"
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo text-white text-base sm:text-lg font-bold rounded-lg shadow-sm flex items-center gap-2 sm:gap-3 transition"
              >
                <IoAddOutline size={22} />
                Nova Publicação
              </Link>
            </div>
          </section>

          {/* Cards de métricas */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-verde-musgo shadow-sm flex flex-col gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-verde-pastel text-verde-musgo">
                <MdOutlineFolder size={20} />
              </div>
              <span className="pt-2 text-verde-escuro text-2xl font-semibold">
                {String(totalPublicados).padStart(2, '0')}
              </span>
              <span className="text-verde-musgo text-lg">Projetos Publicados</span>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-verde-musgo shadow-sm flex flex-col gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-verde-pastel text-verde-musgo">
                <MdOutlineEditNote size={22} />
              </div>
              <span className="pt-2 text-verde-escuro text-2xl font-semibold">
                {String(totalRascunhos).padStart(2, '0')}
              </span>
              <span className="text-verde-musgo text-lg">Rascunhos em Edição</span>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-verde-musgo shadow-sm flex flex-col gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-verde-pastel text-verde-musgo">
                <MdOutlineGroups size={20} />
              </div>
              <span className="pt-2 text-verde-escuro text-2xl font-semibold">
                {String(totalVisualizacoes).padStart(2, '0')}
              </span>
              <span className="text-verde-musgo text-lg">Visualizações na Rede</span>
            </div>
          </section>

          {/* Publicações Recentes */}
          <section className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <h2 className="text-verde-musgo text-2xl sm:text-3xl font-semibold">
                Publicações Recentes
              </h2>
              <Link
                href="/projetos"
                className="flex items-center gap-1.5 text-verde-musgo hover:text-verde-escuro text-base sm:text-lg font-bold transition"
              >
                Ver todos os projetos
                <IoArrowForward size={18} />
              </Link>
            </div>

            <div className="flex flex-col gap-5">
              {carregando ? (
                <p className="py-8 text-center text-verde-musgo font-medium">
                  Carregando publicações...
                </p>
              ) : publicacoesFiltradas.length > 0 ? (
                publicacoesFiltradas.map((pub) => {
                  const ehRascunho = pub.status === 'rascunho'
                  return (
                    <article
                      key={pub.chaveUnica}
                      className={`p-5 bg-white/80 rounded-3xl border border-verde-musgo shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition ${
                        !pub.visivel ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className="relative w-32 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                          <Image src={pub.imagem} alt={pub.titulo} fill className="object-cover" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            {ehRascunho ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-200 text-verde-escuro text-[10px] font-black uppercase">
                                <span className="size-2 rounded-full bg-verde-escuro/70" />
                                Rascunho
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-verde-limao text-verde-musgo text-[10px] font-black uppercase">
                                <span className="size-2 rounded-full bg-verde-musgo" />
                                Publicado
                              </span>
                            )}
                            <span className="text-xs font-medium text-verde-escuro/70">
                              {pub.infoData}
                            </span>
                          </div>

                          <h3 className="text-verde-escuro text-xl font-normal leading-snug max-w-md">
                            {pub.titulo}
                          </h3>
                        </div>
                      </div>

                      {ehRascunho ? (
                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => editarPublicacao(pub)}
                            className="px-5 py-2 bg-white hover:bg-input-bg border border-verde-musgo rounded-xl text-verde-musgo text-sm font-bold transition cursor-pointer"
                          >
                            Continuar Editando
                          </button>
                          <button
                            type="button"
                            onClick={() => excluirPublicacao(pub)}
                            title="Excluir rascunho"
                            aria-label={`Excluir ${pub.titulo}`}
                            className="p-2 text-vermelho hover:opacity-70 transition cursor-pointer"
                          >
                            <MdOutlineDeleteOutline size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => editarPublicacao(pub)}
                            title="Editar"
                            aria-label={`Editar ${pub.titulo}`}
                            className="p-2 text-verde-musgo hover:text-verde-escuro transition cursor-pointer"
                          >
                            <MdOutlineEdit size={20} />
                          </button>
                          <button
                            type="button"
                            onClick={() => alternarVisibilidade(pub.chaveUnica)}
                            title={pub.visivel ? 'Ocultar publicação' : 'Mostrar publicação'}
                            aria-label={
                              pub.visivel ? `Ocultar ${pub.titulo}` : `Mostrar ${pub.titulo}`
                            }
                            className="p-2 text-verde-musgo hover:text-verde-escuro transition cursor-pointer"
                          >
                            {pub.visivel ? (
                              <MdOutlineVisibilityOff size={20} />
                            ) : (
                              <MdOutlineVisibility size={20} />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => excluirPublicacao(pub)}
                            title="Excluir"
                            aria-label={`Excluir ${pub.titulo}`}
                            className="p-2 text-vermelho hover:opacity-70 transition cursor-pointer"
                          >
                            <MdOutlineDeleteOutline size={20} />
                          </button>
                        </div>
                      )}
                    </article>
                  )
                })
              ) : (
                <p className="py-8 text-center text-verde-musgo font-medium">
                  {busca
                    ? `Nenhuma publicação encontrada para "${busca}".`
                    : 'Nenhuma publicação cadastrada ainda.'}
                </p>
              )}
            </div>
          </section>

          {/* Avisos da Administração */}
          <section className="p-6 bg-white rounded-3xl border border-verde-musgo shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-2.5 text-verde-musgo">
              <MdOutlineCampaign size={28} />
              <h2 className="text-2xl font-semibold">Avisos da Administração</h2>
            </div>

            <div className="p-6 bg-input-bg rounded-xl border border-verde-musgo flex flex-col gap-2">
              <p className="text-verde-escuro text-base font-bold leading-relaxed">
                Atenção, professores!
                <br />O regulamento para a Mostra Maker de Inverno já está disponível na aba de
                Documentação.
              </p>
              <Link
                href="/rede"
                className="inline-flex items-center gap-1 text-verde-musgo hover:underline text-xs font-bold w-fit"
              >
                Acessar Documentos
                <IoOpenOutline size={14} />
              </Link>
            </div>
          </section>
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
          onConfirmar={modal.tipo === 'confirmacao' ? handleConfirmarExclusaoPublicacao : () => setModal((prev) => ({ ...prev, aberto: false }))}
          onCancelar={() => setModal((prev) => ({ ...prev, aberto: false }))}
        />
      )}
    </div>
  )
}
