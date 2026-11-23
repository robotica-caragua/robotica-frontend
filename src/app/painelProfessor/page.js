'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SideBarProfessor } from '@/components/SideBarProfessor'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import semaforo from '@/assets/semaforo.png'
import containerImg from '@/assets/container.png'
import {
  apiAuth,
  apiEscolas,
  apiEventos,
  apiProjetos,
  apiTutoriais,
  apiUsuarios,
  mapearEventoDaApi,
  mapearProjetoDaApi,
  mapearTutorialDaApi,
  obterToken,
  obterUsuario
} from '@/services/api'
import { IoAddOutline, IoArrowForward, IoOpenOutline } from 'react-icons/io5'
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

function formatarNomeProfessor(usuario) {
  const nome = String(usuario?.name || '').trim()
  if (
    !nome ||
    usuario?.role === 'ADMIN' ||
    nome.toLowerCase().includes('administrador') ||
    nome.toLowerCase() === 'professor(a)'
  ) {
    return 'Prof. Robson Nascimento'
  }
  if (/^prof(\.|essor|essora)?\b/i.test(nome)) {
    return nome
  }
  return `Prof. ${nome}`
}

export default function PainelProfessor() {
  const router = useRouter()
  const [publicacoes, setPublicacoes] = useState([])
  const [avisos, setAvisos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [modal, setModal] = useState({
    aberto: false,
    tipo: 'confirmacao',
    titulo: '',
    mensagem: '',
    pubParaExcluir: null
  })
  const [nomeProfessor, setNomeProfessor] = useState(() => formatarNomeProfessor(obterUsuario()))
  const [nomeEscola, setNomeEscola] = useState('EMEF Prof. Luiz Ribeiro Muniz')

  useEffect(() => {
    let ativo = true

    if (obterToken()) {
      apiAuth
        .me()
        .then((user) => {
          if (!ativo || !user) return
          setNomeProfessor(formatarNomeProfessor(user))
          if (user.id && user.role !== 'ADMIN') {
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
      apiEscolas.listar().catch(() => []),
      apiEventos.listar().catch(() => [])
    ])
      .then(([listaTutoriais, listaProjetos, listaEscolas, listaEventos]) => {
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
            ...mapearProjetoDaApi(item, idx % 2 === 0 ? containerImg : semaforo),
            status: 'publicado',
            visivel: true,
            tipoRecurso: 'projeto',
            chaveUnica: `projeto-${item.id}`
          }))

        const combinados = [...tuts, ...projs]
        setPublicacoes(combinados)

        const avisosDinamicos = (Array.isArray(listaEventos) ? listaEventos : [])
          .map((ev) => mapearEventoDaApi(ev))
          .filter((ev) => ev && ev.status !== 'cancelado')
          .map((ev) => {
            const temDocumentos = Array.isArray(ev.documentos) && ev.documentos.length > 0
            return {
              id: ev.id,
              titulo: 'Atenção, professores!',
              mensagem: temDocumentos
                ? `O regulamento para ${ev.titulo} já está disponível na aba de Documentação.`
                : `O evento "${ev.titulo}" está agendado para ${ev.dataLonga || ev.data} em ${ev.local}.`,
              textoLink: temDocumentos ? 'Acessar Documentos' : 'Ver Detalhes do Evento',
              href: ev.linkUrl || `/detalhesEvento?id=${ev.id}`
            }
          })
        setAvisos(avisosDinamicos)

        const usuarioAtual = obterUsuario()
        const escolaVinculada =
          usuarioAtual?.schoolId && Array.isArray(listaEscolas)
            ? listaEscolas.find((e) => Number(e.id) === Number(usuarioAtual.schoolId))?.name
            : null
        const primeiraEscola =
          escolaVinculada ||
          listaTutoriais?.[0]?.school?.name ||
          listaProjetos?.[0]?.school?.name ||
          listaEscolas?.find((e) => e.name?.includes('Luiz Ribeiro Muniz'))?.name ||
          listaEscolas?.[0]?.name
        if (primeiraEscola) {
          setNomeEscola(primeiraEscola)
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
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background relative">
      <SideBarProfessor />

      <main className="flex-1 flex flex-col pb-16">
        <div className="w-full max-w-[1040px] mx-auto py-8 lg:py-10 px-6 sm:px-10 lg:px-14 flex flex-col gap-6 sm:gap-8">
          {/* Saudação e botão Nova Publicação */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <section className="flex flex-col gap-2">
              <h1 className="text-verde-escuro text-3xl sm:text-4xl font-bold leading-tight">
                Olá, {nomeProfessor}!
              </h1>
              <div className="flex items-center gap-2 text-verde-musgo font-semibold text-sm sm:text-base">
                <MdOutlineLocationOn size={20} className="shrink-0" />
                <span>{nomeEscola}</span>
              </div>
            </section>

            <Link
              href="/cadastrarTutorial"
              className="shrink-0 px-6 py-3 bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo text-white text-sm sm:text-base font-bold rounded-lg shadow-sm flex items-center gap-2 transition"
            >
              <IoAddOutline size={20} />
              Nova Publicação
            </Link>
          </div>

          {/* Cards de métricas */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-verde-musgo shadow-sm flex flex-col gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-verde-pastel text-verde-musgo">
                <MdOutlineFolder size={20} />
              </div>
              <span className="pt-2 text-verde-escuro text-2xl sm:text-3xl font-bold">
                {String(totalPublicados).padStart(2, '0')}
              </span>
              <span className="text-verde-musgo text-xs sm:text-sm font-semibold">
                Projetos Publicados
              </span>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-verde-musgo shadow-sm flex flex-col gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-verde-pastel text-verde-musgo">
                <MdOutlineEditNote size={22} />
              </div>
              <span className="pt-2 text-verde-escuro text-2xl sm:text-3xl font-bold">
                {String(totalRascunhos).padStart(2, '0')}
              </span>
              <span className="text-verde-musgo text-xs sm:text-sm font-semibold">
                Rascunhos em Edição
              </span>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-verde-musgo shadow-sm flex flex-col gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-verde-pastel text-verde-musgo">
                <MdOutlineGroups size={20} />
              </div>
              <span className="pt-2 text-verde-escuro text-2xl sm:text-3xl font-bold">
                {String(totalVisualizacoes).padStart(2, '0')}
              </span>
              <span className="text-verde-musgo text-xs sm:text-sm font-semibold">
                Visualizações na Rede
              </span>
            </div>
          </section>

          {/* Publicações Recentes */}
          <section className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <h2 className="text-verde-escuro text-xl sm:text-2xl font-bold">
                Publicações Recentes
              </h2>
              <Link
                href="/gestaoProjetos"
                className="flex items-center gap-1.5 text-verde-musgo hover:text-verde-escuro text-sm font-bold transition"
              >
                Ver todos os projetos
                <IoArrowForward size={18} />
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {carregando ? (
                <p className="py-8 text-center text-sm text-verde-musgo font-medium">
                  Carregando publicações...
                </p>
              ) : publicacoes.length > 0 ? (
                publicacoes.map((pub) => {
                  const ehRascunho = pub.status === 'rascunho'
                  return (
                    <article
                      key={pub.chaveUnica}
                      className={`p-5 bg-white/80 rounded-2xl border border-verde-musgo shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition ${
                        !pub.visivel ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 w-full sm:w-auto">
                        <div className="relative w-full sm:w-32 h-36 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-gray-200">
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

                          <h3 className="text-verde-escuro text-base sm:text-lg font-bold leading-snug max-w-md">
                            {pub.titulo}
                          </h3>
                        </div>
                      </div>

                      {ehRascunho ? (
                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => editarPublicacao(pub)}
                            className="px-5 py-2 bg-white hover:bg-input-bg border border-verde-musgo border-b-2 rounded-xl text-verde-musgo text-sm font-bold transition cursor-pointer"
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
                <p className="py-8 text-center text-sm text-verde-musgo font-medium">
                  Nenhuma publicação cadastrada ainda.
                </p>
              )}
            </div>
          </section>

          {/* Avisos da Administração */}
          <section className="p-6 sm:p-8 bg-white rounded-2xl border border-verde-musgo shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-2.5 text-verde-escuro">
              <MdOutlineCampaign size={24} className="text-verde-musgo shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold">Avisos da Administração</h2>
            </div>

            {carregando ? (
              <p className="py-4 text-center text-verde-musgo font-medium text-sm">
                Carregando avisos...
              </p>
            ) : avisos.length > 0 ? (
              <div className="flex flex-col gap-4">
                {avisos.map((aviso) => (
                  <div
                    key={aviso.id}
                    className="p-6 bg-input-bg rounded-xl border-l-4 border-verde-musgo flex flex-col gap-2"
                  >
                    <p className="text-verde-escuro text-sm sm:text-base font-bold leading-relaxed">
                      {aviso.titulo}
                      <br />
                      {aviso.mensagem}
                    </p>
                    <Link
                      href={aviso.href}
                      className="inline-flex items-center gap-1 text-verde-musgo hover:underline text-xs font-bold w-fit"
                    >
                      {aviso.textoLink}
                      <IoOpenOutline size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-verde-musgo font-medium text-sm sm:text-base">
                Nenhum aviso da administração no momento.
              </p>
            )}
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
          onConfirmar={
            modal.tipo === 'confirmacao'
              ? handleConfirmarExclusaoPublicacao
              : () => setModal((prev) => ({ ...prev, aberto: false }))
          }
          onCancelar={() => setModal((prev) => ({ ...prev, aberto: false }))}
        />
      )}
    </div>
  )
}
