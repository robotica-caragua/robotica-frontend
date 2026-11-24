'use client'

import { useEffect, useState } from 'react'
import { CardEvento } from '@/components/CardEvento'
import { CardEscola } from '@/components/CardEscola'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { IoRocketOutline } from 'react-icons/io5'
import { apiEscolas, apiEventos, mapearEventoDaApi } from '@/services/api'

const linksMapasOficiais = {
  'EMEF Profª Maria Aparecida De Carvalho': 'https://maps.app.goo.gl/pH6TnrBJsTyLY3gK8',
  'EMEF Prof. Luiz Ribeiro Muniz': 'https://maps.app.goo.gl/ueybEfw95rgpqRYU6',
  'EMEF Prof. Luiz Silvar do Prado': 'https://maps.app.goo.gl/43diBvZfvfCGr3iZA',
  'EMEF Profª Maria Thereza de Souza Castro': 'https://maps.app.goo.gl/TWYSGxUgsena9FTCA'
}

export default function Rede() {
  const [escolas, setEscolas] = useState([])
  const [carregandoEscolas, setCarregandoEscolas] = useState(true)
  const [destaques, setDestaques] = useState([])

  useEffect(() => {
    let ativo = true

    apiEventos
      .listar()
      .then((listaEventos) => {
        if (!ativo || !Array.isArray(listaEventos)) return
        setDestaques(
          listaEventos.map((ev) => {
            const mapeado = mapearEventoDaApi(ev)
            return {
              id: ev.id,
              title: mapeado.titulo,
              date: mapeado.etiquetaData,
              location: mapeado.local,
              linkUrl: mapeado.linkUrl
            }
          })
        )
      })
      .catch(() => {})

    apiEscolas
      .listar()
      .then((listaEscolas) => {
        if (!ativo) return
        const formatadas = (Array.isArray(listaEscolas) ? listaEscolas : []).map((escola) => ({
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
      })
      .catch(() => {})
      .finally(() => {
        if (ativo) setCarregandoEscolas(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center px-4 py-8 sm:py-12">
        <section className="flex flex-col items-center text-center gap-2 mb-3 px-4">
          <h1 className="font-extrabold text-3xl sm:text-4xl uppercase text-verde-escuro tracking-tight">
            Nossa <span className="text-verde-musgo">Rede!</span>
          </h1>
          <p className="text-sm sm:text-base text-verde-musgo font-medium max-w-2xl mx-auto leading-relaxed">
            Conheça as escolas parceiras e acompanhe tudo o que movimenta o nosso circuito de
            robótica.
          </p>
        </section>

        {/* Eventos em Destaque (como na imagem 2) */}
        <div className="flex flex-col my-8 md:my-14 w-full md:w-[85%] lg:w-[75%] max-w-[1200px] bg-white border-2 border-verde-musgo rounded-2xl py-6 md:py-8 px-4 md:px-6 gap-6 shadow-xs">
          <div className="flex flex-row items-center gap-3 md:gap-4 text-verde-musgo px-2 md:ml-4">
            <IoRocketOutline size={30} />
            <h2 className="font-semibold text-xl sm:text-2xl text-verde-musgo">
              Eventos em Destaque
            </h2>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center px-2 md:px-4">
            {destaques.length > 0 ? (
              destaques.map((item) => (
                <CardEvento
                  key={item.id}
                  title={item.title}
                  date={item.date}
                  location={item.location}
                  linkUrl={item.linkUrl}
                />
              ))
            ) : (
              <p className="text-center text-verde-musgo text-sm sm:text-base font-medium py-4">
                Nenhum evento em destaque no momento.
              </p>
            )}
          </div>
        </div>

        {/* Conheça Nossas Escolas (as 4 escolas da imagem) */}
        <div
          id="escolas"
          className="scroll-mt-8 flex flex-col w-full md:w-[85%] lg:w-[75%] max-w-[1200px] py-6 md:py-8 px-2 gap-6 mb-14 md:mb-16 justify-center items-center"
        >
          <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-10 text-center">
            <h2 className="font-extrabold text-3xl sm:text-4xl text-verde-escuro uppercase tracking-tight">
              Conheça nossas <span className="text-verde-musgo">Escolas!</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-6 sm:gap-8 justify-center w-full">
            {carregandoEscolas ? (
              <p className="text-center text-verde-musgo text-sm sm:text-base font-medium py-6">
                Carregando escolas da rede...
              </p>
            ) : escolas.length > 0 ? (
              escolas.map((escola) => (
                <CardEscola
                  key={escola.id}
                  name={escola.name}
                  location={escola.location}
                  linkUrl={escola.linkUrl}
                />
              ))
            ) : (
              <p className="text-center text-verde-musgo text-sm sm:text-base font-medium py-6">
                Nenhuma escola cadastrada no momento.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
