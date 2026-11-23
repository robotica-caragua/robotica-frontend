'use client'

import { useEffect, useState } from 'react'
import { MdArrowBack, MdArrowForward } from 'react-icons/md'
import { FaRobot, FaGraduationCap } from 'react-icons/fa6'
import { ImBooks } from 'react-icons/im'
import { PiHouseLine, PiPlant } from 'react-icons/pi'
import { RiCommunityLine } from 'react-icons/ri'
import Image from 'next/image'
import Link from 'next/link'
import homeBot from '../assets/home.png'
import ligacoes from '../assets/fundo.png'
import working from '../assets/working.png'
import { Header } from '@/components/Header'
import { CardEvento } from '@/components/CardEvento'
import { Footer } from '@/components/Footer'
import { apiEscolas, apiEventos, mapearEventoDaApi } from '@/services/api'

const pillars = [
  { title: 'ROBÓTICA ACESSÍVEL', Icon: FaRobot },
  { title: 'APRENDIZADO PRÁTICO', Icon: ImBooks },
  { title: 'SUSTENTABILIDADE', Icon: PiPlant },
  { title: 'COMUNIDADE', Icon: RiCommunityLine }
]

function PillarItem({ Icon, title, size = 60 }) {
  return (
    <div className="flex flex-col items-center justify-center text-center w-full max-w-[200px]">
      <Icon className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]" size={size} />
      <h3 className="mt-2.5 text-white text-xs sm:text-sm font-bold text-center uppercase tracking-wider drop-shadow-xs">
        {title}
      </h3>
    </div>
  )
}

function InfoItem({ Icon, title, children }) {
  return (
    <div className="flex flex-col items-center text-center p-3">
      <div className="flex h-16 w-16 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-verde-pastel text-verde-escuro mb-3 shadow-2xs">
        <Icon className="text-3xl sm:text-2xl" />
      </div>

      <h4 className="text-base font-bold text-verde-escuro mb-1.5">{title}</h4>
      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xs">{children}</p>
    </div>
  )
}

const escolasHomePadrao = [
  {
    id: 1,
    name: 'EMEF Prof. Luiz Silvar do Prado',
    location: 'R. José Pedro de Oliveira Barbosa, 805 - Caraguatatuba'
  },
  {
    id: 2,
    name: 'EMEF Profª Maria Aparecida De Carvalho',
    location: 'R. Seishi Yoshimoto, 120 - Getuba, Caraguatatuba'
  },
  {
    id: 3,
    name: 'EMEF Profª Maria Thereza de Souza Castro',
    location: 'R. Seishi Yoshimoto, 120 - Getuba, Caraguatatuba'
  },
  {
    id: 4,
    name: 'EMEF Prof. Luiz Ribeiro Muniz',
    location: 'R. Analândia, 355 - Martim de Sá, Caraguatatuba'
  }
]

export default function HomePage() {
  const [destaques, setDestaques] = useState([])
  const [escolasHome, setEscolasHome] = useState(escolasHomePadrao)
  const [indiceInicial, setIndiceInicial] = useState(0)
  const [palavraAtiva, setPalavraAtiva] = useState(0)

  // Efeito de transição em loop para o título da Hero
  useEffect(() => {
    const intervalo = setInterval(() => {
      setPalavraAtiva((prev) => (prev + 1) % 3)
    }, 1800)
    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    let ativo = true

    apiEventos
      .listar()
      .then((lista) => {
        if (!ativo || !Array.isArray(lista)) return
        setDestaques(
          lista.map((ev) => {
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
      .then((lista) => {
        if (!ativo || !Array.isArray(lista) || lista.length === 0) return
        setEscolasHome(
          lista.map((e) => ({
            id: e.id,
            name: e.name,
            location: e.address || 'Caraguatatuba - SP'
          }))
        )
      })
      .catch(() => {})

    return () => {
      ativo = false
    }
  }, [])

  const destaquesVisiveis = destaques.slice(indiceInicial, indiceInicial + 3)

  return (
    <div className="flex flex-col min-h-screen bg-branco-esverdeado overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <main className="relative min-h-[560px] lg:min-h-[640px] overflow-hidden bg-branco-esverdeado flex items-center">
        <div className="pointer-events-none absolute right-0 top-0 z-0 h-full w-[70%] block">
          <Image
            src={ligacoes}
            alt="Fundo decorativo"
            fill
            priority
            className="object-cover object-center opacity-15 dark:invert dark:opacity-10"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 mx-auto w-full max-w-[1440px]">
          <div className="pointer-events-none absolute right-[-20px] sm:right-2 xl:right-10 top-12 sm:top-1/2 z-10 sm:-translate-y-1/2 block w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-120 lg:h-120 xl:w-140 xl:h-140 opacity-85 sm:opacity-95 lg:opacity-100">
            <Image
              src={homeBot}
              alt="Ilustração principal de robótica"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

        <section className="relative z-20 w-full md:w-[85%] lg:w-[75%] max-w-[1200px] mx-auto px-4 sm:px-6 py-10 lg:py-0">
          <div className="max-w-xl">
            {/* Título com transição da cor verde mais clara em loop e tamanho equilibrado */}
            <h1 className="font-bold uppercase leading-tight text-3xl sm:text-5xl md:text-6xl">
              <span
                className={`block transition-colors duration-700 ${
                  palavraAtiva === 0 ? 'text-verde-oliva' : 'text-verde-escuro'
                }`}
              >
                Descubra,
              </span>
              <span
                className={`block transition-colors duration-700 ${
                  palavraAtiva === 1 ? 'text-verde-oliva' : 'text-verde-escuro'
                }`}
              >
                construa e
              </span>
              <span
                className={`block transition-colors duration-700 ${
                  palavraAtiva === 2 ? 'text-verde-oliva' : 'text-verde-escuro'
                }`}
              >
                compartilhe.
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 max-w-xl text-verde-escuro/85 dark:text-[#B7C4BB] text-base sm:text-xl leading-relaxed">
              Conectando escolas, estudantes e a comunidade de Caraguatatuba através da tecnologia.
            </p>

            {/* Botão de explorar projetos com hover em verde musgo */}
            <Link
              href="/projetos"
              className="mt-6 sm:mt-8 flex h-13 sm:h-14 w-full max-w-[260px] sm:w-72 cursor-pointer items-center justify-between rounded-xl border-2 border-verde-musgo bg-white px-5 text-base sm:text-lg font-bold text-verde-musgo transition hover:bg-verde-musgo hover:text-white shadow-xs"
            >
              <span>Explorar Projetos</span>
              <MdArrowForward size={24} />
            </Link>
          </div>
        </section>
      </main>

      {/* Faixa de Pilares (exatamente como na imagem 1) */}
      <section className="w-full bg-verde-oliva py-6 sm:py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 items-center justify-items-center">
          {pillars.map(({ title, Icon }) => (
            <PillarItem key={title} Icon={Icon} title={title} />
          ))}
        </div>
      </section>

      {/* 1. Quem Somos */}
      <section className="relative my-12 sm:my-16 lg:my-24 w-[92%] sm:w-[85%] md:w-[75%] lg:w-[65%] max-w-[1000px] mx-auto rounded-3xl border-2 border-verde-musgo bg-white px-5 sm:px-10 py-8 sm:py-10 shadow-xs">
        {/* Robô no desktop / laptop (lateral esquerda - tamanho original) */}
        <div className="hidden lg:block absolute -left-44 xl:-left-60 -bottom-16 lg:-bottom-24 xl:-bottom-28 z-20 pointer-events-none w-[360px] lg:w-[460px] xl:w-[540px]">
          <Image
            src={working}
            alt="Biobot mexendo em peças"
            width={600}
            height={480}
            className="h-auto w-full scale-x-[-1] drop-shadow-lg"
            priority
          />
        </div>

        {/* Robô no mobile / tablet (topo do card) */}
        <div className="flex lg:hidden justify-center -mt-16 sm:-mt-20 mb-3">
          <Image
            src={working}
            alt="Biobot mexendo em peças"
            width={240}
            height={180}
            className="h-auto w-44 sm:w-48 object-contain scale-x-[-1] drop-shadow-sm"
            priority
          />
        </div>

        <div className="lg:ml-40 xl:ml-52 flex flex-col items-center">
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-verde-musgo uppercase tracking-tight">
            QUEM SOMOS?
          </h2>

          <p className="mt-3 max-w-xl text-center font-medium leading-relaxed text-sm sm:text-base text-stone-700">
            Somos uma plataforma que une tecnologia e educação para transformar a robótica e o
            futuro. Nosso foco é a democratização da robótica, provando que inovação se faz com
            criatividade.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full">
            <InfoItem Icon={PiPlant} title="Robótica Sustentável">
              Ensinamos robótica de baixo custo e alternativa, utilizando materiais recicláveis e
              acessíveis.
            </InfoItem>

            <InfoItem Icon={PiHouseLine} title="Conexão Regional">
              Divulgamos eventos, hackathons e um portfólio de projetos desenvolvidos por nossos
              alunos.
            </InfoItem>

            <InfoItem Icon={ImBooks} title="Educação Inclusiva">
              Portal totalmente acessível para garantir que a tecnologia chegue a todos os
              estudantes.
            </InfoItem>
          </div>
        </div>
      </section>

      {/* 2. Conheça Nossas Escolas */}
      <section className="w-[92%] sm:w-[85%] md:w-[75%] max-w-[1200px] mx-auto flex flex-col items-center mb-12 sm:mb-16 px-2">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold uppercase tracking-tight mb-6">
          <span className="text-verde-escuro">Conheça nossas </span>
          <span className="text-verde-musgo">escolas!</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full mb-8">
          {escolasHome.map((escola) => (
            <div
              key={escola.id}
              className="flex flex-col justify-between bg-white rounded-2xl p-5 border border-verde-musgo/30 hover:border-verde-musgo shadow-2xs transition"
            >
              <div>
                <div className="flex items-center gap-2 text-verde-musgo mb-2.5">
                  <FaGraduationCap size={24} />
                </div>
                <h3 className="font-bold text-base text-verde-escuro line-clamp-2 mb-1.5">
                  {escola.name}
                </h3>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${escola.name} ${escola.location || 'Caraguatatuba SP'}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ver localização no Google Maps"
                  className="text-xs text-stone-600 hover:text-verde-musgo hover:underline line-clamp-2 transition-colors"
                >
                  {escola.location}
                </a>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/rede#escolas"
          className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl border-2 border-verde-musgo bg-white font-bold text-verde-musgo text-base hover:bg-verde-musgo hover:text-white transition-colors duration-300 shadow-xs"
        >
          <span>Ver Todas as Escolas</span>
          <MdArrowForward size={20} />
        </Link>
      </section>

      {/* 3. Acompanhe Mostras e Hackathons (Eventos) */}
      <section className="w-full md:w-[85%] lg:w-[75%] max-w-[1200px] mx-auto flex flex-col items-center mb-14 sm:mb-18 px-4">
        <h2 className="max-w-3xl text-center text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
          <span className="text-verde-musgo">Acompanhe os </span>
          <span className="text-verde-escuro">hackathons, eventos e mostras das escolas!</span>
        </h2>

        <div className="flex flex-col justify-center gap-5 mt-8 md:mt-10 w-full">
          {destaquesVisiveis.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-5">
              {destaquesVisiveis.map((item) => (
                <CardEvento
                  key={item.id}
                  title={item.title}
                  date={item.date}
                  location={item.location}
                  linkUrl={item.linkUrl}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-verde-musgo text-sm sm:text-base font-medium py-4">
              Nenhum evento agendado no momento.
            </p>
          )}

          {destaques.length > 3 && (
            <div className="flex justify-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => setIndiceInicial((prev) => Math.max(0, prev - 3))}
                disabled={indiceInicial === 0}
                aria-label="Anteriores"
                className="p-2.5 border rounded-full border-verde-escuro text-verde-escuro cursor-pointer bg-white hover:brightness-90 transition disabled:opacity-40"
              >
                <MdArrowBack size={18} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setIndiceInicial((prev) => (prev + 3 < destaques.length ? prev + 3 : prev))
                }
                disabled={indiceInicial + 3 >= destaques.length}
                aria-label="Próximos"
                className="p-2.5 border rounded-full border-verde-escuro text-verde-escuro cursor-pointer bg-white hover:brightness-90 transition disabled:opacity-40"
              >
                <MdArrowForward size={18} />
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
