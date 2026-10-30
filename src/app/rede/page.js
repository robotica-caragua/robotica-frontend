'use client'

import { useEffect, useState } from 'react'
import { CardEvento } from '@/components/CardEvento'
import { CardEscola } from '@/components/CardEscola'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { IoRocketOutline } from 'react-icons/io5'
import { apiEscolas, apiProjetos } from '@/services/api'

export default function Rede() {
  const [escolas, setEscolas] = useState([])
  const [destaques, setDestaques] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true

    Promise.all([apiEscolas.listar().catch(() => []), apiProjetos.listar().catch(() => [])])
      .then(([listaEscolas, listaProjetos]) => {
        if (!ativo) return
        setEscolas(
          (Array.isArray(listaEscolas) ? listaEscolas : []).map((escola) => ({
            id: escola.id,
            name: escola.name,
            location: escola.address || 'Caraguatatuba - SP',
            linkUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${escola.name} ${escola.address || 'Caraguatatuba SP'}`
            )}`
          }))
        )
        setDestaques(
          (Array.isArray(listaProjetos) ? listaProjetos : []).map((proj) => ({
            id: proj.id,
            title: proj.name,
            date: `PUBLICADO • ${new Date(proj.createdAt || Date.now())
              .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
              .toUpperCase()}`,
            location: proj.school?.name || 'Rede Municipal de Caraguatatuba',
            linkUrl: `/detalhesProjeto?id=${proj.id}`
          }))
        )
      })
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

      <main className="grow flex flex-col items-center px-4">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 text-center">
          <h1 className="font-bold text-3xl sm:text-4xl text-verde-escuro uppercase">Nossa</h1>
          <h1 className="font-bold text-3xl sm:text-4xl text-verde-musgo uppercase">Rede!</h1>
        </div>

        <div className="items-center justify-center gap-4 text-lg sm:text-xl text-center font-medium max-w-2xl">
          <p>
            Conheça as escolas parceiras e acompanhe tudo o que movimenta o nosso circuito de
            robótica.
          </p>
        </div>

        <div className="flex flex-col my-10 md:my-20 w-full md:w-[85%] lg:w-[75%] bg-white border-2 border-verde-musgo rounded-2xl py-6 md:py-10 px-4 md:px-6 gap-5">
          <div className="flex flex-row items-center gap-3 md:gap-5 text-verde-musgo px-2 md:ml-4">
            <IoRocketOutline size={30} />
            <h1 className="font-semibold text-xl md:text-2xl">Projetos e Ações em Destaque</h1>
          </div>

          <div className="flex flex-wrap gap-4 justify-center px-2 md:px-6">
            {carregando ? (
              <p className="text-verde-musgo font-medium py-6">Carregando destaques da rede...</p>
            ) : destaques.length > 0 ? (
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
              <p className="text-verde-musgo font-medium py-6">
                Nenhuma ação em destaque cadastrada no momento.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col w-full md:w-[85%] lg:w-[75%] py-6 md:py-10 px-2 gap-5 mb-16 md:mb-20 justify-center items-center">
          <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-12 text-center">
            <h1 className="font-bold text-3xl sm:text-4xl text-verde-escuro uppercase">
              conheça nossas
            </h1>
            <h1 className="font-bold text-3xl sm:text-4xl text-verde-musgo uppercase">Escolas!</h1>
          </div>

          <div className="flex flex-wrap gap-6 sm:gap-10 justify-center w-full xl:w-[70%]">
            {carregando ? (
              <p className="text-verde-musgo font-medium">Carregando escolas da rede...</p>
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
              <p className="text-verde-musgo font-medium">Nenhuma escola cadastrada no momento.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
