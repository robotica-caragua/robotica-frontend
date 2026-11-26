'use client'

import { useEffect, useMemo, useState } from 'react'
import { SideBarAdmin } from '@/components/SideBarAdmin'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { Select } from '@/components/Select'
import { apiContatos } from '@/services/api'
import {
  MdOutlineEmail,
  MdOutlineMarkEmailRead,
  MdOutlineMarkEmailUnread,
  MdOutlineDeleteOutline,
  MdOutlineReply,
  MdOutlineSchedule
} from 'react-icons/md'
import { IoSearchOutline } from 'react-icons/io5'

function formatarDataHora(valorData) {
  if (!valorData) return ''
  const data = new Date(valorData)
  if (Number.isNaN(data.getTime())) return ''
  return `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })}`
}

export default function GestaoDuvidasPage() {
  const [duvidas, setDuvidas] = useState([])
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todas')
  const [modal, setModal] = useState({
    aberto: false,
    tipo: 'sucesso',
    titulo: '',
    mensagem: '',
    textoConfirmar: 'Entendido',
    alvoExcluir: null
  })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDuvidas(apiContatos.listar())
  }, [])

  const duvidasFiltradas = useMemo(() => {
    return duvidas.filter((item) => {
      const termo = busca.trim().toLowerCase()
      const matchBusca =
        !termo ||
        item.nomeCompleto?.toLowerCase().includes(termo) ||
        item.email?.toLowerCase().includes(termo) ||
        item.assunto?.toLowerCase().includes(termo) ||
        item.mensagem?.toLowerCase().includes(termo)

      const matchStatus =
        filtroStatus === 'todas' ||
        (filtroStatus === 'nao_lidas' && !item.lida) ||
        (filtroStatus === 'lidas' && item.lida)

      return matchBusca && matchStatus
    })
  }, [duvidas, busca, filtroStatus])

  const totalNaoLidas = duvidas.filter((d) => !d.lida).length

  const handleAlternarLida = (item) => {
    const atualizadas = apiContatos.marcarComoLida(item.id, !item.lida)
    setDuvidas(atualizadas)
  }

  const handleResponder = (item) => {
    const atualizadas = apiContatos.marcarComoLida(item.id, true)
    setDuvidas(atualizadas)
    setModal({
      aberto: true,
      tipo: 'sucesso',
      titulo: 'Resposta por E-mail',
      mensagem: `A integração de disparo automático de resposta para "${item.email}" (Assunto: "${item.assunto}") será habilitada na próxima etapa. A dúvida foi marcada como lida.`,
      textoConfirmar: 'Entendido',
      alvoExcluir: null
    })
  }

  const solicitarExclusao = (item) => {
    setModal({
      aberto: true,
      tipo: 'confirmacao',
      titulo: 'Excluir Dúvida?',
      mensagem: `Deseja realmente excluir a mensagem enviada por "${item.nomeCompleto}" sobre "${item.assunto}"?`,
      textoConfirmar: 'Excluir',
      alvoExcluir: item
    })
  }

  const confirmarExclusao = () => {
    if (!modal.alvoExcluir) return
    const atualizadas = apiContatos.excluir(modal.alvoExcluir.id)
    setDuvidas(atualizadas)
    setModal({
      aberto: true,
      tipo: 'sucesso',
      titulo: 'Dúvida excluída com sucesso!',
      mensagem: 'A mensagem foi removida da caixa de entrada do painel administrativo.',
      textoConfirmar: 'Entendido',
      alvoExcluir: null
    })
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background relative">
      <SideBarAdmin />

      <main className="flex-1 flex flex-col pb-16">
        <div className="w-full max-w-[1040px] mx-auto py-8 lg:py-10 px-6 sm:px-10 lg:px-14 flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <section className="flex flex-col gap-2 max-w-[680px]">
              <h1 className="text-verde-escuro text-3xl sm:text-4xl font-bold leading-tight">
                Dúvidas e Mensagens (Contato)
              </h1>
              <p className="text-verde-musgo text-sm sm:text-base font-normal">
                Visualize e gerencie as dúvidas, sugestões e solicitações enviadas pelos visitantes
                através do formulário de contato do portal.
              </p>
            </section>

            <span className="rounded-full bg-verde-pastel border border-verde-musgo/30 px-4 py-1.5 text-xs sm:text-sm font-bold text-verde-musgo">
              {totalNaoLidas} {totalNaoLidas === 1 ? 'não lida' : 'não lidas'}
            </span>
          </div>

          {/* Barra de busca e filtro */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 px-4 py-3 bg-white border border-verde-musgo rounded-2xl shadow-xs">
            <div className="flex-1 flex items-center gap-3 min-w-[200px]">
              <IoSearchOutline size={20} className="text-verde-musgo shrink-0" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome, e-mail, assunto ou conteúdo..."
                className="w-full bg-transparent text-sm sm:text-base text-verde-escuro placeholder:text-verde-musgo/75 focus:outline-none"
              />
            </div>

            <div className="sm:border-l border-verde-musgo/30 sm:pl-4 min-w-[190px]">
              <Select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-verde-escuro focus:outline-none cursor-pointer"
              >
                <option value="todas">Status: Todas ({duvidas.length})</option>
                <option value="nao_lidas">Não Lidas ({totalNaoLidas})</option>
                <option value="lidas">Lidas ({duvidas.length - totalNaoLidas})</option>
              </Select>
            </div>
          </div>

          {/* Lista de dúvidas recebidas */}
          <section className="p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-verde-musgo flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-verde-escuro">
                <MdOutlineEmail size={22} className="text-verde-musgo shrink-0" />
                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">
                  Mensagens Recebidas ({duvidasFiltradas.length})
                </h2>
              </div>
            </div>

            {duvidasFiltradas.length === 0 ? (
              <p className="py-10 text-center text-sm sm:text-base text-verde-musgo font-medium">
                Nenhuma dúvida ou mensagem encontrada. As mensagens enviadas na página de Contato
                aparecerão aqui.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {duvidasFiltradas.map((item) => (
                  <article
                    key={item.id}
                    className={`p-5 sm:p-6 bg-input-bg rounded-xl border-l-4 ${
                      item.lida ? 'border-verde-musgo/40 opacity-85' : 'border-verde-musgo'
                    } flex flex-col gap-3`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-verde-escuro text-base sm:text-lg font-bold">
                            {item.assunto || 'Sem assunto'}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                              item.lida
                                ? 'bg-verde-pastel text-verde-musgo'
                                : 'bg-verde-limao text-verde-escuro'
                            }`}
                          >
                            {item.lida ? 'Lida' : 'Nova'}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-verde-musgo">
                          De: <span className="text-verde-escuro">{item.nomeCompleto}</span> (
                          {item.email})
                        </p>

                        <span className="inline-flex items-center gap-1 text-xs font-medium text-verde-musgo">
                          <MdOutlineSchedule size={14} />
                          {formatarDataHora(item.createdAt)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleResponder(item)}
                          title="Responder por e-mail"
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo text-white text-xs font-bold uppercase transition cursor-pointer"
                        >
                          <MdOutlineReply size={16} />
                          Responder
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAlternarLida(item)}
                          title={item.lida ? 'Marcar como não lida' : 'Marcar como lida'}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-verde-pastel border border-verde-musgo text-verde-escuro text-xs font-bold uppercase transition cursor-pointer"
                        >
                          {item.lida ? (
                            <>
                              <MdOutlineMarkEmailUnread size={16} />
                              Não Lida
                            </>
                          ) : (
                            <>
                              <MdOutlineMarkEmailRead size={16} />
                              Marcar Lida
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => solicitarExclusao(item)}
                          title="Excluir dúvida"
                          aria-label={`Excluir mensagem de ${item.nomeCompleto}`}
                          className="p-2 rounded-xl border border-vermelho bg-white text-vermelho hover:bg-vermelho hover:text-white transition cursor-pointer"
                        >
                          <MdOutlineDeleteOutline size={18} />
                        </button>
                      </div>
                    </div>

                    <p className="pt-2 border-t border-verde-musgo/20 text-verde-escuro text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {item.mensagem}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <ModalConfirmacao
        aberto={modal.aberto}
        tipo={modal.tipo}
        titulo={modal.titulo}
        mensagem={modal.mensagem}
        textoConfirmar={modal.textoConfirmar}
        textoCancelar="Cancelar"
        onConfirmar={
          modal.tipo === 'confirmacao'
            ? confirmarExclusao
            : () => setModal((prev) => ({ ...prev, aberto: false }))
        }
        onCancelar={() => setModal((prev) => ({ ...prev, aberto: false }))}
      />
    </div>
  )
}
