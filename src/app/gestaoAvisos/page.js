'use client'

import { useEffect, useState } from 'react'
import { SideBarAdmin } from '@/components/SideBarAdmin'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { apiAvisos } from '@/services/api'
import { IoSendOutline } from 'react-icons/io5'
import { MdOutlineCampaign, MdOutlineDeleteOutline, MdOutlineSchedule } from 'react-icons/md'

export default function GestaoAvisos() {
  const [avisos, setAvisos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [modal, setModal] = useState({
    aberto: false,
    tipo: 'sucesso',
    titulo: '',
    mensagem: '',
    textoConfirmar: 'OK',
    avisoParaExcluir: null
  })

  const carregarAvisos = () => {
    return apiAvisos
      .listar()
      .then((lista) => {
        setAvisos(Array.isArray(lista) ? lista : [])
      })
      .catch(() => {})
  }

  useEffect(() => {
    let ativo = true
    apiAvisos
      .listar()
      .then((lista) => {
        if (!ativo) return
        setAvisos(Array.isArray(lista) ? lista : [])
      })
      .catch(() => {})
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  const handlePublicarAviso = async (e) => {
    e.preventDefault()
    if (!titulo.trim() || !mensagem.trim()) {
      setModal({
        aberto: true,
        tipo: 'erro',
        titulo: 'Campos obrigatórios!',
        mensagem: 'Preencha o título e a mensagem do aviso antes de enviar para os professores.',
        textoConfirmar: 'Entendido',
        avisoParaExcluir: null
      })
      return
    }

    setEnviando(true)
    try {
      const novo = await apiAvisos.criar({
        title: titulo.trim(),
        message: mensagem.trim()
      })
      if (novo) {
        setAvisos((prev) => [novo, ...prev])
      } else {
        await carregarAvisos()
      }
      setTitulo('')
      setMensagem('')
      setModal({
        aberto: true,
        tipo: 'sucesso',
        titulo: 'Aviso publicado com sucesso!',
        mensagem:
          'O comunicado foi registrado e já está visível para todos os professores no bloco "Avisos da Administração".',
        textoConfirmar: 'Entendido',
        avisoParaExcluir: null
      })
    } catch (err) {
      setModal({
        aberto: true,
        tipo: 'erro',
        titulo: 'Não foi possível publicar o aviso!',
        mensagem:
          err?.message || 'Verifique os dados informados e tente enviar o comunicado novamente.',
        textoConfirmar: 'Entendido',
        avisoParaExcluir: null
      })
    } finally {
      setEnviando(false)
    }
  }

  const solicitarExclusao = (aviso) => {
    setModal({
      aberto: true,
      tipo: 'confirmacao',
      titulo: 'Excluir Aviso?',
      mensagem: `Deseja realmente remover o aviso "${aviso.title}" do mural dos professores?`,
      textoConfirmar: 'Excluir',
      avisoParaExcluir: aviso
    })
  }

  const confirmarExclusao = async () => {
    if (!modal.avisoParaExcluir) return
    const alvo = modal.avisoParaExcluir
    try {
      await apiAvisos.excluir(alvo.id)
      setAvisos((prev) => prev.filter((item) => item.id !== alvo.id))
      setModal({
        aberto: true,
        tipo: 'sucesso',
        titulo: 'Aviso excluído com sucesso!',
        mensagem: `O comunicado "${alvo.title}" foi removido do mural dos professores.`,
        textoConfirmar: 'Entendido',
        avisoParaExcluir: null
      })
    } catch (err) {
      setModal({
        aberto: true,
        tipo: 'erro',
        titulo: 'Erro ao excluir aviso',
        mensagem: err?.message || 'Não foi possível excluir o aviso selecionado.',
        textoConfirmar: 'Entendido',
        avisoParaExcluir: null
      })
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background relative">
      <SideBarAdmin />

      <main className="flex-1 flex flex-col pb-16">
        <div className="w-full max-w-[1040px] mx-auto py-8 lg:py-10 px-6 sm:px-10 lg:px-14 flex flex-col gap-6 sm:gap-8">
          {/* Cabeçalho */}
          <section className="flex flex-col gap-2 max-w-[680px]">
            <h1 className="text-verde-escuro text-3xl sm:text-4xl font-bold leading-tight">
              Avisos da Administração
            </h1>
            <p className="text-verde-musgo text-sm sm:text-base font-normal">
              Publique comunicados oficiais, orientações pedagógicas e lembretes para todos os
              professores da rede municipal.
            </p>
          </section>

          {/* Formulário de Novo Aviso */}
          <form
            onSubmit={handlePublicarAviso}
            noValidate
            className="p-6 sm:p-8 bg-white rounded-2xl border border-verde-musgo shadow-sm flex flex-col gap-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-verde-pastel rounded-lg flex justify-center items-center text-verde-musgo shrink-0">
                <MdOutlineCampaign size={22} />
              </div>
              <h2 className="text-verde-escuro text-base sm:text-lg font-bold uppercase tracking-wide">
                Novo Comunicado Oficial
              </h2>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="titulo-aviso" className="text-verde-escuro text-sm font-semibold">
                Título do Aviso
              </label>
              <input
                id="titulo-aviso"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Reunião de Alinhamento do Torneio Municipal"
                maxLength={150}
                className="w-full h-12 px-4 bg-input-bg border border-verde-musgo rounded-xl text-sm sm:text-base text-verde-escuro placeholder:text-verde-escuro/60 focus:outline-none focus:ring-1 focus:ring-verde-musgo transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="mensagem-aviso" className="text-verde-escuro text-sm font-semibold">
                Mensagem para os Professores
              </label>
              <textarea
                id="mensagem-aviso"
                rows={4}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Escreva o conteúdo completo do aviso que aparecerá na Home do Professor..."
                maxLength={2000}
                className="w-full p-4 bg-input-bg border border-verde-musgo rounded-xl text-sm sm:text-base text-verde-escuro placeholder:text-verde-escuro/60 focus:outline-none focus:ring-1 focus:ring-verde-musgo transition resize-none"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={enviando}
                className="px-6 py-3 bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo text-white text-sm sm:text-base font-bold rounded-xl shadow-sm flex items-center gap-2.5 transition cursor-pointer disabled:opacity-60"
              >
                <IoSendOutline size={18} />
                <span>{enviando ? 'Enviando...' : 'Publicar e Enviar Aviso'}</span>
              </button>
            </div>
          </form>

          {/* Lista de Avisos Publicados */}
          <section className="p-6 sm:p-8 bg-white rounded-2xl border border-verde-musgo shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4 border-b border-verde-escuro/10 pb-4">
              <div className="flex items-center gap-2.5 text-verde-escuro">
                <MdOutlineCampaign size={24} className="text-verde-musgo shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold">Avisos Publicados</h2>
              </div>
              <span className="text-xs font-semibold text-verde-musgo">
                {avisos.length} {avisos.length === 1 ? 'aviso ativo' : 'avisos ativos'}
              </span>
            </div>

            {carregando ? (
              <p className="py-6 text-center text-verde-musgo font-medium text-sm">
                Carregando avisos...
              </p>
            ) : avisos.length > 0 ? (
              <div className="flex flex-col gap-4">
                {avisos.map((aviso) => (
                  <article
                    key={aviso.id}
                    className="p-5 sm:p-6 bg-input-bg rounded-xl border-l-4 border-verde-musgo flex flex-col sm:flex-row items-start justify-between gap-4"
                  >
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-verde-limao text-verde-escuro text-[10px] font-bold uppercase">
                          Comunicado Oficial
                        </span>
                        {aviso.createdAt && (
                          <span className="inline-flex items-center gap-1 text-xs text-verde-musgo font-medium">
                            <MdOutlineSchedule size={14} />
                            {new Date(aviso.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                      <h3 className="text-verde-escuro text-base sm:text-lg font-bold leading-snug">
                        {aviso.title}
                      </h3>
                      <p className="text-verde-escuro/90 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                        {aviso.message}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => solicitarExclusao(aviso)}
                      title={`Excluir ${aviso.title}`}
                      aria-label={`Excluir ${aviso.title}`}
                      className="p-2 text-vermelho hover:opacity-75 transition cursor-pointer self-end sm:self-start shrink-0"
                    >
                      <MdOutlineDeleteOutline size={22} />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-verde-musgo font-medium text-sm sm:text-base">
                Nenhum aviso publicado até o momento.
              </p>
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
