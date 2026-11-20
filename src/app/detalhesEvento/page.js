'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { apiEventos, mapearEventoDaApi } from '@/services/api'
import { CiCalendar, CiClock2, CiLocationOn } from 'react-icons/ci'
import { MdArrowBack, MdOutlineFileDownload } from 'react-icons/md'
import { IoDocumentTextOutline } from 'react-icons/io5'

function DetalhesEventoConteudo() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [evento, setEvento] = useState(null)
  const [carregando, setCarregando] = useState(true)

  const handleVoltar = () =>
    typeof window !== 'undefined' && window.history.length > 1
      ? router.back()
      : router.push('/rede')

  useEffect(() => {
    let ativo = true

    const carregar = async () => {
      try {
        if (id) {
          const encontrado = await apiEventos.buscarPorId(id).catch(() => null)
          if (ativo && encontrado) {
            setEvento(mapearEventoDaApi(encontrado))
            return
          }
        }
        const lista = await apiEventos.listar().catch(() => [])
        if (!ativo) return
        const primeiro = Array.isArray(lista) && lista.length > 0 ? lista[0] : null
        setEvento(primeiro ? mapearEventoDaApi(primeiro) : null)
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    carregar()
    return () => {
      ativo = false
    }
  }, [id])

  if (carregando) {
    return (
      <main className="grow flex items-center justify-center py-16 px-4 bg-branco-esverdeado/30">
        <p className="text-verde-musgo text-base sm:text-lg font-medium">
          Carregando detalhes do evento...
        </p>
      </main>
    )
  }

  if (!evento) {
    return (
      <main className="grow flex flex-col items-center justify-center gap-4 py-16 px-4 bg-branco-esverdeado/30">
        <p className="text-verde-musgo text-base sm:text-lg font-medium">Evento não encontrado.</p>
        <button
          type="button"
          onClick={handleVoltar}
          className="px-5 py-2.5 bg-verde-musgo text-white text-sm font-bold rounded-xl hover:bg-verde-escuro transition cursor-pointer"
        >
          Voltar
        </button>
      </main>
    )
  }

  const temAgenda = Array.isArray(evento.agenda) && evento.agenda.length > 0
  const temDocumentos = Array.isArray(evento.documentos) && evento.documentos.length > 0
  const paragrafosDescricao = String(evento.descricao || '')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <main className="grow flex flex-col items-center py-8 sm:py-12 px-4 sm:px-6 bg-branco-esverdeado/30">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <div className="self-start">
          <button
            type="button"
            onClick={handleVoltar}
            className="text-verde-escuro hover:text-verde-musgo transition-colors font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer bg-white border border-stone-200 px-3.5 py-2 rounded-xl shadow-xs"
          >
            <MdArrowBack size={18} />
            <span>Voltar</span>
          </button>
        </div>

        {/* Banner do Evento */}
        <div className="w-full p-6 sm:p-10 bg-input-bg rounded-2xl border border-verde-musgo/30 border-b-6 border-b-verde-musgo flex flex-col gap-5 shadow-xs">
          <h1 className="text-verde-escuro text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {evento.titulo}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-1">
            {evento.data && (
              <div className="flex items-center gap-2 text-verde-escuro text-xs sm:text-sm font-semibold">
                <CiCalendar size={20} className="shrink-0 text-verde-musgo" />
                <span>{evento.data}</span>
              </div>
            )}

            {evento.horario && (
              <div className="flex items-center gap-2 text-verde-escuro text-xs sm:text-sm font-semibold">
                <CiClock2 size={20} className="shrink-0 text-verde-musgo" />
                <span>{evento.horario}</span>
              </div>
            )}

            {evento.local && (
              <div className="flex items-center gap-2 text-verde-escuro text-xs sm:text-sm font-semibold">
                <CiLocationOn size={20} className="shrink-0 text-verde-musgo" />
                <span>{evento.local}</span>
              </div>
            )}
          </div>
        </div>

        {/* Descrição */}
        {paragrafosDescricao.length > 0 && (
          <div className="w-full flex flex-col gap-3">
            <h2 className="text-verde-escuro text-xl sm:text-2xl font-bold tracking-tight">
              Descrição
            </h2>
            <div className="flex flex-col gap-3 text-stone-700 text-sm sm:text-base leading-relaxed">
              {paragrafosDescricao.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        )}

        {/* Agenda e Documentação — só aparecem se existirem no evento */}
        {(temAgenda || temDocumentos) && (
          <div
            className={`w-full grid grid-cols-1 ${
              temAgenda && temDocumentos ? 'lg:grid-cols-3' : ''
            } gap-8 items-start`}
          >
            {temAgenda && (
              <div className={`${temDocumentos ? 'lg:col-span-2' : ''} flex flex-col gap-4`}>
                <h2 className="text-verde-escuro text-xl sm:text-2xl font-bold tracking-tight">
                  Agenda
                </h2>

                <div className="flex flex-col gap-2.5">
                  {evento.agenda.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white rounded-xl border border-verde-musgo/40 flex items-center gap-4 shadow-2xs"
                    >
                      {item.horario && (
                        <span className="text-verde-escuro font-bold text-sm sm:text-base shrink-0 w-16">
                          {item.horario}
                        </span>
                      )}
                      <span className="text-verde-escuro text-xs sm:text-sm font-semibold">
                        {item.titulo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {temDocumentos && (
              <div className="w-full p-5 sm:p-6 bg-white rounded-2xl border border-stone-300 flex flex-col gap-4 shadow-2xs">
                <h3 className="text-verde-escuro text-lg sm:text-xl font-bold tracking-tight">
                  Documentação
                </h3>

                <div className="flex flex-col gap-2.5">
                  {evento.documentos.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.url || `#download-${idx}`}
                      download={doc.nome}
                      onClick={(e) => {
                        if (!doc.url) e.preventDefault()
                      }}
                      className="w-full px-3.5 py-2.5 bg-verde-pastel/70 hover:bg-verde-limao/50 rounded-xl flex items-center justify-between transition-colors cursor-pointer border border-verde-musgo/20"
                    >
                      <div className="flex items-center gap-2 overflow-hidden text-left">
                        <IoDocumentTextOutline size={18} className="text-verde-musgo shrink-0" />
                        <span className="text-verde-escuro text-xs sm:text-sm font-semibold truncate">
                          {doc.nome}
                        </span>
                      </div>
                      <MdOutlineFileDownload size={18} className="text-verde-musgo shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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
