'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { CiCalendar, CiClock2, CiLocationOn } from 'react-icons/ci'
import { MdArrowBack, MdOutlineFileDownload } from 'react-icons/md'
import { IoDocumentTextOutline } from 'react-icons/io5'

const eventosMock = [
  {
    id: '1',
    titulo: 'Torneio Regional FLL',
    data: '04 de Agosto de 2026',
    horario: '09:00 AM - 04:00 PM',
    local: 'Ginásio do Tinga, Caraguatatuba',
    descricao: [
      'O Torneio Regional FLL (FIRST LEGO League) chega a Caraguatatuba para reunir as mentes mais brilhantes das nossas escolas parceiras.',
      'Nesta temporada, estudantes de diversas escolas vão projetar, construir e programar robôs para solucionar missões complexas na arena, além de apresentarem um Projeto de Inovação voltado para a nossa comunidade.',
      'Venha prestigiar, torcer pelas equipes locais e ver a tecnologia ganhar vida no Ginásio do Tinga!'
    ],
    agenda: [
      { horario: '09:00', titulo: 'Abertura dos Portões e Credenciamento das Equipes' },
      { horario: '09:30', titulo: 'Cerimônia de Abertura Oficial' },
      { horario: '10:15', titulo: 'Início dos Rounds de Avaliação' },
      { horario: '12:00', titulo: 'Intervalo para Almoço' },
      { horario: '13:30', titulo: 'Desafios na Arena de Robôs' },
      { horario: '15:30', titulo: 'Solenidade de Premiação e Entrega de Medalhas' },
      { horario: '16:00', titulo: 'Encerramento do Evento' }
    ],
    documentos: [
      { nome: 'Guia_de_Missões_da_Arena.pdf', tamanho: '2.4 MB' },
      { nome: 'Manual_das_Equipes', tamanho: '1.8 MB' },
      { nome: 'Regulamento', tamanho: '950 KB' }
    ]
  },
  {
    id: '2',
    titulo: 'Hackathon Sustentável',
    data: '13 de Agosto de 2026',
    horario: '08:30 AM - 05:00 PM',
    local: 'FATEC Caraguatatuba',
    descricao: [
      'Uma maratona intensa de inovação e robótica sustentável onde alunos desenvolvem soluções para desafios ambientais reais da região.',
      'Com o apoio de mentores e professores, as equipes criarão protótipos funcionais com materiais recicláveis e automação de baixo custo.',
      'Participe e apoie as ideias que constroem o futuro sustentável de Caraguatatuba!'
    ],
    agenda: [
      { horario: '08:30', titulo: 'Check-in e Café de Boas-Vindas' },
      { horario: '09:00', titulo: 'Divulgação dos Desafios e Formação das Bancadas' },
      { horario: '09:30', titulo: 'Início da Maratona de Desenvolvimento' },
      { horario: '12:30', titulo: 'Pausa para Almoço' },
      { horario: '14:00', titulo: 'Mentoria Técnica e Testes' },
      { horario: '16:00', titulo: 'Pitch e Apresentação dos Projetos' },
      { horario: '17:00', titulo: 'Premiação e Encerramento' }
    ],
    documentos: [
      { nome: 'Regulamento_Hackathon.pdf', tamanho: '1.2 MB' },
      { nome: 'Criterios_de_Avaliacao.pdf', tamanho: '850 KB' }
    ]
  },
  {
    id: '3',
    titulo: 'Mostra de Robótica Municipal',
    data: '25 de Setembro de 2026',
    horario: '10:00 AM - 03:30 PM',
    local: 'EMEF Profª Maria Aparecida De Carvalho',
    descricao: [
      'Exposição aberta à comunidade com os projetos de robótica criados ao longo do semestre letivo.',
      'Venha ver de perto braços robóticos, carrinhos seguidores de linha, semáforos inteligentes e muito mais.',
      'Entrada gratuita e aberta para pais, alunos e toda a comunidade!'
    ],
    agenda: [
      { horario: '10:00', titulo: 'Abertura da Exposição ao Público' },
      { horario: '11:00', titulo: 'Demonstrações Interativas nas Bancadas' },
      { horario: '12:30', titulo: 'Intervalo' },
      { horario: '13:30', titulo: 'Roda de Conversa com Estudantes e Professores' },
      { horario: '15:30', titulo: 'Encerramento' }
    ],
    documentos: [
      { nome: 'Mapa_dos_Estandes.pdf', tamanho: '3.1 MB' },
      { nome: 'Programacao_Completa.pdf', tamanho: '600 KB' }
    ]
  }
]

function DetalhesEventoConteudo() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [evento, setEvento] = useState(eventosMock[0])

  useEffect(() => {
    if (id) {
      const encontrado = eventosMock.find((e) => e.id === id) || eventosMock[0]
      setEvento(encontrado)
    }
  }, [id])

  return (
    <main className="grow flex flex-col items-center py-8 sm:py-12 px-4 sm:px-6 bg-branco-esverdeado/30 min-h-screen">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <div className="self-start">
          <Link
            href="/rede"
            className="text-verde-escuro hover:text-verde-musgo transition-colors font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer bg-white border border-stone-200 px-3.5 py-2 rounded-xl shadow-xs"
          >
            <MdArrowBack size={18} />
            <span>Voltar para a Rede</span>
          </Link>
        </div>

        {/* Banner do Evento (como na imagem 3) */}
        <div className="w-full p-6 sm:p-10 bg-input-bg rounded-2xl border border-verde-musgo/30 border-b-6 border-b-verde-musgo flex flex-col gap-5 shadow-xs">
          <h1 className="text-verde-escuro text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            {evento.titulo}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-1">
            <div className="flex items-center gap-2 text-verde-escuro text-xs sm:text-sm font-semibold">
              <CiCalendar size={20} className="shrink-0 text-verde-musgo" />
              <span>{evento.data}</span>
            </div>

            <div className="flex items-center gap-2 text-verde-escuro text-xs sm:text-sm font-semibold">
              <CiClock2 size={20} className="shrink-0 text-verde-musgo" />
              <span>{evento.horario}</span>
            </div>

            <div className="flex items-center gap-2 text-verde-escuro text-xs sm:text-sm font-semibold">
              <CiLocationOn size={20} className="shrink-0 text-verde-musgo" />
              <span>{evento.local}</span>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div className="w-full flex flex-col gap-3">
          <h2 className="text-verde-escuro text-xl sm:text-2xl font-bold tracking-tight">
            Descrição
          </h2>
          <div className="flex flex-col gap-3 text-stone-700 text-sm sm:text-base leading-relaxed">
            {Array.isArray(evento.descricao) ? (
              evento.descricao.map((p, idx) => <p key={idx}>{p}</p>)
            ) : (
              <p>{evento.descricao}</p>
            )}
          </div>
        </div>

        {/* Agenda e Documentação (duas colunas como na imagem 3) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Agenda */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-verde-escuro text-xl sm:text-2xl font-bold tracking-tight">
              Agenda
            </h2>

            <div className="flex flex-col gap-2.5">
              {evento.agenda.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white rounded-xl border border-verde-musgo/40 flex items-center gap-4 shadow-2xs"
                >
                  <span className="text-verde-escuro font-bold text-sm sm:text-base shrink-0 w-16">
                    {item.horario}
                  </span>
                  <span className="text-verde-escuro text-xs sm:text-sm font-semibold">
                    {item.titulo}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Documentação */}
          <div className="w-full p-5 sm:p-6 bg-white rounded-2xl border border-stone-300 flex flex-col gap-4 shadow-2xs">
            <h3 className="text-verde-escuro text-lg sm:text-xl font-bold tracking-tight">
              Documentação
            </h3>

            <div className="flex flex-col gap-2.5">
              {evento.documentos.map((doc, idx) => (
                <a
                  key={idx}
                  href={`#download-${idx}`}
                  download={doc.nome}
                  onClick={(e) => e.preventDefault()}
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
