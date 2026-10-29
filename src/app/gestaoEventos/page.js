'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SideBarAdmin } from '@/components/SideBarAdmin'
import { FilterButton } from '@/components/FilterButton'
import { CardEventoAdmin } from '@/components/CardEventoAdmin'
import { apiProjetos } from '@/services/api'
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
  const [filtroStatus, setFiltroStatus] = useState('agendado')

  useEffect(() => {
    let ativo = true

    apiProjetos
      .listar()
      .then((lista) => {
        if (!ativo) return
        setEventos(
          (Array.isArray(lista) ? lista : []).map((proj, idx) => ({
            id: proj.id,
            icone: iconesEvento[idx % iconesEvento.length],
            titulo: proj.name,
            data: new Date(proj.createdAt || Date.now()).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            }),
            info: proj.school?.name || 'Rede Municipal',
            selo: 'Inscrições Abertas',
            status: 'agendado'
          }))
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

  const excluirEvento = async (evento) => {
    if (!window.confirm(`Deseja realmente excluir o evento "${evento.titulo}"?`)) return
    try {
      await apiProjetos.excluir(evento.id)
      setEventos((prev) => prev.filter((e) => e.id !== evento.id))
    } catch (err) {
      window.alert(err?.message || 'Não foi possível excluir o evento.')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background relative">
      <SideBarAdmin />

      <main className="flex-1 flex flex-col">
        <div className="w-full max-w-6xl mx-auto py-8 lg:py-12 px-4 sm:px-8 flex flex-col gap-8">
          <div className="flex flex-wrap justify-between items-end gap-6">
            <section className="flex flex-col gap-2">
              <h2 className="text-verde-escuro text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Gestão de Eventos
              </h2>
              <p className="text-verde-musgo text-base sm:text-lg lg:text-xl font-normal">
                Cadastre e organize os torneios, mostras e feiras de robótica da rede.
              </p>
            </section>

            <Link
              href="/cadastrarEvento"
              className="shrink-0 px-6 py-3 bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo text-white text-base sm:text-lg font-bold rounded-lg shadow-sm flex items-center gap-2 transition"
            >
              <IoAddOutline size={24} /> Novo Evento
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="text-verde-escuro text-xs font-bold uppercase tracking-wider">
              Status:
            </span>
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
                  status={evento.selo}
                  onEdit={() => router.push(`/cadastrarEvento?id=${evento.id}`)}
                  onDelete={() => excluirEvento(evento)}
                />
              ))}

              <Link
                href="/cadastrarEvento"
                className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-verde-oliva text-verde-escuro hover:bg-input-bg transition"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-verde-pastel">
                  <IoAddCircleOutline size={26} />
                </div>
                <span className="text-sm">Novo Evento</span>
              </Link>
            </div>
          )}

          {!carregando && eventosFiltrados.length === 0 && (
            <p className="text-verde-musgo">Nenhum evento encontrado com este status.</p>
          )}
        </div>
      </main>
    </div>
  )
}
