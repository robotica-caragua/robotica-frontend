'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SideBarAdmin } from '@/components/SideBarAdmin'
import { FilterButton } from '@/components/FilterButton'
import { CardEventoAdmin } from '@/components/CardEventoAdmin'
import { IoAddOutline, IoAddCircleOutline } from 'react-icons/io5'
import { MdOutlineEmojiEvents, MdOutlineScience, MdOutlineCode, MdSmartToy } from 'react-icons/md'

const filtros = [
  { valor: 'agendado', texto: 'Agendados' },
  { valor: 'concluido', texto: 'Concluídos' },
  { valor: 'cancelado', texto: 'Cancelados' }
]

const eventosIniciais = [
  {
    id: 1,
    icone: MdOutlineEmojiEvents,
    titulo: 'Torneio Regional FLL - Ginásio Tinga',
    data: '15 de Agosto de 2026',
    info: '12 Equipes Inscritas',
    selo: 'Inscrições Abertas',
    status: 'agendado'
  },
  {
    id: 2,
    icone: MdOutlineScience,
    titulo: 'Mostra de Automação Urbana 2026',
    data: '02 de Setembro de 2026',
    info: '25 Projetos Confirmados',
    selo: 'Inscrições Abertas',
    status: 'agendado'
  },
  {
    id: 3,
    icone: MdOutlineCode,
    titulo: 'Hackathon Social - Code 4 Good',
    data: '22 de Outubro de 2026',
    info: '60 Participantes',
    selo: 'Confirmado',
    status: 'agendado'
  },
  {
    id: 4,
    icone: MdSmartToy,
    titulo: 'Batalha de Robôs - Escola Senai',
    data: '05 de Novembro de 2026',
    info: '8 Robôs Pesados',
    selo: 'Confirmado',
    status: 'agendado'
  },
  {
    id: 5,
    icone: MdOutlineEmojiEvents,
    titulo: 'Feira de Robótica Educacional 2025',
    data: '10 de Novembro de 2025',
    info: '40 Projetos Apresentados',
    selo: 'Concluído',
    status: 'concluido'
  },
  {
    id: 6,
    icone: MdOutlineScience,
    titulo: 'Oficina de Sensores - Massaguaçu',
    data: '18 de Março de 2026',
    info: '15 Inscritos',
    selo: 'Cancelado',
    status: 'cancelado'
  }
]

export default function GestaoEventos() {
  const router = useRouter()
  const [eventos, setEventos] = useState(eventosIniciais)
  const [filtroStatus, setFiltroStatus] = useState('agendado')

  const eventosFiltrados = eventos.filter((evento) => evento.status === filtroStatus)

  const excluirEvento = (evento) => {
    if (window.confirm(`Deseja realmente excluir o evento "${evento.titulo}"?`)) {
      // TODO: integrar com a API de eventos
      setEventos((prev) => prev.filter((e) => e.id !== evento.id))
    }
  }

  return (
    <div className="flex min-h-screen bg-background relative">
      <SideBarAdmin />

      <main className="flex-1 flex flex-col">
        <div className="w-[85%] max-w-6xl mx-auto py-12 px-8 flex flex-col gap-10">
          <div className="flex justify-between items-end gap-6">
            <section className="flex flex-col gap-2">
              <h2 className="text-verde-escuro text-5xl font-bold leading-tight">
                Gestão de Eventos
              </h2>
              <p className="text-verde-musgo text-xl font-normal">
                Cadastre e organize os torneios, mostras e feiras de robótica da rede.
              </p>
            </section>

            <Link
              href="/cadastrarEvento"
              className="shrink-0 px-6 py-3 bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo text-white text-lg font-bold rounded-lg shadow-sm flex items-center gap-2 transition"
            >
              <IoAddOutline size={24} /> Novo Evento
            </Link>
          </div>

          <div className="flex items-center gap-4">
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

          {eventosFiltrados.length === 0 && (
            <p className="text-verde-musgo">Nenhum evento encontrado com este status.</p>
          )}
        </div>
      </main>
    </div>
  )
}
