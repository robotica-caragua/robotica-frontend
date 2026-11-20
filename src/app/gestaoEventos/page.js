'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SideBarAdmin } from '@/components/SideBarAdmin'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { FilterButton } from '@/components/FilterButton'
import { CardEventoAdmin } from '@/components/CardEventoAdmin'
import { apiEventos, mapearEventoDaApi } from '@/services/api'
import { IoAddOutline, IoAddCircleOutline } from 'react-icons/io5'
import { MdOutlineEmojiEvents, MdOutlineScience, MdOutlineCode, MdSmartToy } from 'react-icons/md'

const filtros = [
  { valor: 'agendado', texto: 'Agendados' },
  { valor: 'concluido', texto: 'Concluídos' },
  { valor: 'cancelado', texto: 'Cancelados' }
]

const iconesEvento = [MdOutlineEmojiEvents, MdOutlineScience, MdOutlineCode, MdSmartToy]

export default function GestaoEventos() {
  const router = useRouter()
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [modal, setModal] = useState({
    aberto: false,
    tipo: 'confirmacao',
    titulo: '',
    mensagem: '',
    eventoParaExcluir: null
  })
  const [filtroStatus, setFiltroStatus] = useState('agendado')

  useEffect(() => {
    let ativo = true

    apiEventos
      .listar()
      .then((lista) => {
        if (!ativo) return
        setEventos(
          (Array.isArray(lista) ? lista : []).map((ev, idx) => {
            const mapeado = mapearEventoDaApi(ev)
            return {
              id: ev.id,
              icone: iconesEvento[idx % iconesEvento.length],
              titulo: mapeado.titulo,
              data: mapeado.data,
              info: mapeado.local,
              selo:
                mapeado.inscricoes === 'fechadas' ? 'Inscrições Encerradas' : 'Inscrições Abertas',
              status: mapeado.status || 'agendado'
            }
          })
        )
      })
      .catch(() => {})
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  const eventosFiltrados = eventos.filter((evento) => evento.status === filtroStatus)

  const excluirEvento = (evento) => {
    setModal({
      aberto: true,
      tipo: 'confirmacao',
      titulo: 'Excluir Evento?',
      mensagem: `Deseja realmente remover o evento "${evento.titulo}"?`,
      eventoParaExcluir: evento
    })
  }

  const handleConfirmarExclusaoEvento = async () => {
    if (!modal.eventoParaExcluir) return
    const ev = modal.eventoParaExcluir
    try {
      await apiEventos.excluir(ev.id)
      setEventos((prev) => prev.filter((item) => item.id !== ev.id))
      setModal({
        aberto: true,
        tipo: 'sucesso',
        titulo: 'Evento excluído com sucesso!',
        mensagem: `O evento "${ev.titulo}" foi removido.`,
        eventoParaExcluir: null
      })
    } catch (err) {
      setModal({
        aberto: true,
        tipo: 'erro',
        titulo: 'Erro ao excluir evento',
        mensagem: err?.message || 'Não foi possível excluir o evento.',
        eventoParaExcluir: null
      })
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background relative">
      <SideBarAdmin />

      <main className="flex-1 flex flex-col">
        <div className="w-full max-w-[1040px] mx-auto py-8 lg:py-10 px-6 sm:px-10 lg:px-14 flex flex-col gap-8">
          <div className="flex flex-wrap justify-between items-end gap-6">
            <section className="flex flex-col gap-2 max-w-[600px]">
              <h1 className="text-verde-escuro text-3xl sm:text-4xl font-bold leading-tight">
                Gestão de Eventos
              </h1>
              <p className="text-verde-musgo text-sm sm:text-base font-normal">
                Cadastre e organize os torneios, mostras e feiras de robótica da rede.
              </p>
            </section>

            <Link
              href="/cadastrarEvento"
              className="px-6 py-3 bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo text-white text-sm sm:text-base font-bold rounded-lg flex items-center gap-2 shadow-sm cursor-pointer transition"
            >
              <IoAddOutline size={20} />
              <span>Criar Evento</span>
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {filtros.map(({ valor, texto }) => (
              <FilterButton
                key={valor}
                isActive={filtroStatus === valor}
                onClick={() => setFiltroStatus(valor)}
              >
                {texto}
              </FilterButton>
            ))}
          </div>

          {carregando ? (
            <p className="text-verde-musgo font-medium">Carregando eventos...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventosFiltrados.map((evento) => (
                <CardEventoAdmin
                  key={evento.id}
                  icone={evento.icone}
                  title={evento.titulo}
                  date={evento.data}
                  info={evento.info}
                  selo={evento.selo}
                  onEdit={() => router.push(`/cadastrarEvento?id=${evento.id}`)}
                  onDelete={() => excluirEvento(evento)}
                />
              ))}

              <Link
                href="/cadastrarEvento"
                className="min-h-60 p-6 rounded-2xl border-2 border-dashed border-verde-musgo/60 bg-white/40 hover:bg-verde-pastel/40 transition flex flex-col items-center justify-center gap-3 text-verde-musgo cursor-pointer"
              >
                <IoAddCircleOutline size={36} />
                <span className="text-base font-bold">Agendar Novo Evento</span>
              </Link>
            </div>
          )}

          {!carregando && eventosFiltrados.length === 0 && (
            <p className="text-verde-musgo">Nenhum evento encontrado com este status.</p>
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
          onConfirmar={
            modal.tipo === 'confirmacao'
              ? handleConfirmarExclusaoEvento
              : () => setModal((prev) => ({ ...prev, aberto: false }))
          }
          onCancelar={() => setModal((prev) => ({ ...prev, aberto: false }))}
        />
      )}
    </div>
  )
}
