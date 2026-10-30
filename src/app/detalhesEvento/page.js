'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { CiCalendar, CiClock2, CiLocationOn } from 'react-icons/ci'
import { MdArrowBack, MdOutlineFileDownload } from 'react-icons/md'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { apiProjetos } from '@/services/api'

function DetalhesEventoConteudo() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [evento, setEvento] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true

    const promessa = id
      ? apiProjetos.buscarPorId(id)
      : apiProjetos.listar().then((lista) => lista?.[0] || null)

    promessa
      .then((proj) => {
        if (!ativo) return
        if (proj) {
          setEvento({
            titulo: proj.name,
            data: new Date(proj.createdAt || Date.now()).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            }),
            horario: '09:00 AM - 04:00 PM',
            local: proj.school?.name || 'Rede Municipal de Caraguatatuba',
            descricao: proj.description || ''
          })
        } else {
          setEvento(null)
        }
      })
      .catch(() => {
        if (ativo) setEvento(null)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [id])

  if (carregando) {
    return (
      <main className="grow flex items-center justify-center py-20">
        <p className="text-verde-musgo text-xl font-medium">Carregando detalhes do evento...</p>
      </main>
    )
  }

  if (!evento) {
    return (
      <main className="grow flex flex-col items-center justify-center gap-6 py-20">
        <p className="text-verde-musgo text-xl font-medium">Evento não encontrado.</p>
        <Link
          href="/rede"
          className="px-6 py-3 bg-verde-musgo text-white font-bold rounded-lg hover:opacity-90 transition"
        >
          Voltar para a Rede
        </Link>
      </main>
    )
  }

  return (
    <main className="grow flex flex-col items-center px-4 sm:px-6">
      <div className="w-full max-w-5xl flex justify-start mt-6">
        <Link
          href="/rede"
          aria-label="Voltar para Rede"
          className="text-verde-escuro hover:opacity-80 transition-opacity text-3xl sm:text-4xl flex items-center cursor-pointer"
        >
          <MdArrowBack />
        </Link>
      </div>

      <div className="w-full max-w-5xl p-6 sm:p-10 lg:p-14 relative bg-linear-57 from-input-bg to-input-bg rounded-[20px] border-b-8 sm:border-b-10 border-verde-musgo flex flex-col justify-end items-start overflow-hidden mt-4">
        <div className="w-full h-full left-0 top-0 absolute opacity-10 bg-radial from-verde-limao to-verde-limao/0 to-70% pointer-events-none" />

        <div className="self-stretch flex flex-col justify-start items-start gap-6 relative z-10">
          <div className="self-stretch">
            <h1 className="text-verde-escuro text-2xl sm:text-4xl lg:text-5xl font-bold">
              {evento.titulo}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 text-verde-musgo text-base sm:text-lg">
              <CiCalendar size={24} className="shrink-0" />
              <span>{evento.data}</span>
            </div>

            <div className="flex items-center gap-2 text-verde-musgo text-base sm:text-lg">
              <CiClock2 size={24} className="shrink-0" />
              <span>{evento.horario}</span>
            </div>

            <div className="flex items-center gap-2 text-verde-musgo text-base sm:text-lg">
              <CiLocationOn size={24} className="shrink-0" />
              <span>{evento.local}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl min-h-48 flex flex-col justify-start items-start my-10 sm:my-14">
        <h2 className="text-verde-musgo text-2xl sm:text-4xl font-semibold">Descrição</h2>

        <div className="self-stretch h-3 border-b border-verde-musgo" />

        <div className="self-stretch py-4 flex flex-col justify-start items-start">
          <p className="text-verde-escuro text-lg sm:text-2xl leading-relaxed">
            {evento.descricao}
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row justify-between items-start gap-10 mb-20">
        <div className="w-full lg:w-[60%] flex flex-col items-start gap-6">
          <div className="self-stretch pb-1 border-b border-verde-musgo flex flex-col justify-start items-start">
            <h3 className="text-verde-musgo text-2xl sm:text-4xl font-semibold">Agenda</h3>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="self-stretch p-4 sm:p-5 bg-white rounded-xl border-l-5 border-r border-t border-b border-verde-musgo flex items-center gap-4 sm:gap-8">
              <span className="text-verde-musgo text-xl sm:text-2xl font-bold shrink-0">09:00</span>
              <span className="text-verde-escuro text-base sm:text-xl font-bold">
                Abertura e Credenciamento das Equipes
              </span>
            </div>
            <div className="self-stretch p-4 sm:p-5 bg-white rounded-xl border-l-5 border-r border-t border-b border-verde-musgo flex items-center gap-4 sm:gap-8">
              <span className="text-verde-musgo text-xl sm:text-2xl font-bold shrink-0">13:30</span>
              <span className="text-verde-escuro text-base sm:text-xl font-bold">
                Apresentação de Protótipos e Avaliações
              </span>
            </div>
            <div className="self-stretch p-4 sm:p-5 bg-white rounded-xl border-l-5 border-r border-t border-b border-verde-musgo flex items-center gap-4 sm:gap-8">
              <span className="text-verde-musgo text-xl sm:text-2xl font-bold shrink-0">16:00</span>
              <span className="text-verde-escuro text-base sm:text-xl font-bold">
                Encerramento do Evento
              </span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[35%] px-5 py-8 bg-white rounded-xl outline -outline-offset-1 outline-verde-musgo flex flex-col items-start gap-6 mt-0 lg:mt-14">
          <div className="w-full flex flex-col items-start border-b border-verde-musgo pb-2">
            <h2 className="text-verde-musgo text-2xl sm:text-3xl font-semibold">Documentação</h2>
          </div>

          <div className="w-full flex flex-col gap-4">
            <button className="w-full px-4 py-3 bg-input-bg rounded-lg flex items-center justify-between hover:bg-verde-limao/20 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 overflow-hidden">
                <IoDocumentTextOutline size={26} className="text-verde-escuro shrink-0" />
                <span className="text-verde-escuro text-base sm:text-lg font-medium truncate">
                  Regulamento.pdf
                </span>
              </div>
              <MdOutlineFileDownload size={26} className="text-verde-escuro shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function DetalhesEvento() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Suspense fallback={null}>
        <DetalhesEventoConteudo />
      </Suspense>
      <Footer />
    </div>
  )
}
