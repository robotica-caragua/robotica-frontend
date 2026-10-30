'use client'

import { useEffect, useState } from 'react'
import { CardEvento } from '@/components/CardEvento'
import { CardEscola } from '@/components/CardEscola'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { IoRocketOutline } from 'react-icons/io5'
import { apiEscolas } from '@/services/api'

const eventosPadrao = [
  {
    id: '1',
    title: 'Torneio Regional FLL',
    date: 'PRÓXIMO EVENTO • 04 AGO',
    location: 'Ginásio do Tinga, Caraguatatuba',
    linkUrl: '/detalhesEvento?id=1'
  },
  {
    id: '2',
    title: 'Hackathon Sustentável',
    date: 'INSCRIÇÕES • 13 AGO',
    location: 'FATEC Caraguatatuba',
    linkUrl: '/detalhesEvento?id=2'
  },
  {
    id: '3',
    title: 'Mostra de Robótica Municipal',
    date: 'EM BREVE • 25 SET',
    location: 'EMEF Profª Maria Aparecida De Carvalho',
    linkUrl: '/detalhesEvento?id=3'
  }
]

const linksMapasOficiais = {
  'EMEF Profª Maria Aparecida De Carvalho': 'https://maps.app.goo.gl/pH6TnrBJsTyLY3gK8',
  'EMEF Prof. Luiz Ribeiro Muniz': 'https://maps.app.goo.gl/ueybEfw95rgpqRYU6',
  'EMEF Prof. Luiz Silvar do Prado': 'https://maps.app.goo.gl/43diBvZfvfCGr3iZA',
  'EMEF Profª Maria Thereza de Souza Castro': 'https://maps.app.goo.gl/TWYSGxUgsena9FTCA'
}

const escolasOficiaisIniciais = [
  {
    id: 3,
    name: 'EMEF Profª Maria Aparecida De Carvalho',
    location: 'R. Seishi Yoshimoto, 120 - Getuba, Caraguatatuba - SP, 11676-403',
    linkUrl: 'https://maps.app.goo.gl/pH6TnrBJsTyLY3gK8'
  },
  {
    id: 4,
    name: 'EMEF Prof. Luiz Ribeiro Muniz',
    location: 'R. Analândia, 355 - Martim de Sá, Caraguatatuba - SP, 11662-320',
    linkUrl: 'https://maps.app.goo.gl/ueybEfw95rgpqRYU6'
  },
  {
    id: 5,
    name: 'EMEF Prof. Luiz Silvar do Prado',
    location: 'R. José Pedro de Oliveira Barbosa, 805 - Jardim Casa Branca, Caraguatatuba - SP',
    linkUrl: 'https://maps.app.goo.gl/43diBvZfvfCGr3iZA'
  },
  {
    id: 6,
    name: 'EMEF Profª Maria Thereza de Souza Castro',
    location: 'R. Seishi Yoshimoto, 120 - Getuba, Caraguatatuba - SP, 11676-403',
    linkUrl: 'https://maps.app.goo.gl/TWYSGxUgsena9FTCA'
  }
]

export default function Rede() {
  const [escolas, setEscolas] = useState(escolasOficiaisIniciais)
  const [destaques, setDestaques] = useState(eventosPadrao)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true

    apiEscolas
      .listar()
      .then((listaEscolas) => {
        if (!ativo) return
        if (Array.isArray(listaEscolas) && listaEscolas.length > 0) {
          const formatadas = listaEscolas.map((escola) => ({
            id: escola.id,
            name: escola.name,
            location: escola.address || 'Caraguatatuba - SP',
            linkUrl:
              linksMapasOficiais[escola.name] ||
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${escola.name} ${escola.address || 'Caraguatatuba SP'}`
              )}`
          }))
          setEscolas(formatadas)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center px-4 py-6 sm:py-10">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3 text-center">
          <h1 className="font-bold text-3xl sm:text-4xl text-verde-escuro uppercase">Nossa</h1>
          <h1 className="font-bold text-3xl sm:text-4xl text-verde-musgo uppercase">Rede!</h1>
        </div>

        <div className="items-center justify-center gap-4 text-base sm:text-lg text-center font-medium max-w-2xl text-verde-musgo">
          <p>
            Conheça as escolas parceiras e acompanhe tudo o que movimenta o nosso circuito de
            robótica.
          </p>
        </div>

        {/* Eventos em Destaque (como na imagem 2) */}
        <div className="flex flex-col my-8 md:my-14 w-full md:w-[85%] lg:w-[75%] bg-white border-2 border-verde-musgo rounded-2xl py-6 md:py-8 px-4 md:px-6 gap-6 shadow-xs">
          <div className="flex flex-row items-center gap-3 md:gap-4 text-verde-musgo px-2 md:ml-4">
            <IoRocketOutline size={30} />
            <h2 className="font-semibold text-xl sm:text-2xl text-verde-musgo">Eventos em Destaque</h2>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center px-2 md:px-4">
            {destaques.map((item) => (
              <CardEvento
                key={item.id}
                title={item.title}
                date={item.date}
                location={item.location}
                linkUrl={item.linkUrl}
              />
            ))}
          </div>
        </div>

        {/* Conheça Nossas Escolas (as 4 escolas da imagem) */}
        <div className="flex flex-col w-full md:w-[85%] lg:w-[75%] py-6 md:py-8 px-2 gap-6 mb-14 md:mb-16 justify-center items-center">
          <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-10 text-center">
            <h2 className="font-bold text-3xl sm:text-4xl text-verde-escuro uppercase">
              conheça nossas
            </h2>
            <h2 className="font-bold text-3xl sm:text-4xl text-verde-musgo uppercase">Escolas!</h2>
          </div>

          <div className="flex flex-wrap gap-6 sm:gap-8 justify-center w-full">
            {escolas.map((escola) => (
              <CardEscola
                key={escola.id}
                name={escola.name}
                location={escola.location}
                linkUrl={escola.linkUrl}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
