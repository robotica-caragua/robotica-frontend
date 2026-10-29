'use client'

import { useEffect, useState } from 'react'
import { MdArrowBack, MdArrowForward } from 'react-icons/md'
import { FaRobot } from 'react-icons/fa6'
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
import { apiProjetos, apiTutoriais } from '@/services/api'

const pillars = [
  { title: 'ROBÓTICA ACESSÍVEL', Icon: FaRobot },
  { title: 'APRENDIZADO PRÁTICO', Icon: ImBooks },
  { title: 'SUSTENTABILIDADE', Icon: PiPlant },
  { title: 'COMUNIDADE', Icon: RiCommunityLine }
]

function PillarItem({ Icon, title, size = 90 }) {
  return (
    <div className="flex flex-col items-center">
      <Icon className="text-branco-esverdeado" size={size} />
      <h3 className="mt-4 text-branco-esverdeado text-2xl font-semibold text-center text-shadow-lg/20">
        {title}
      </h3>
    </div>
  )
}

function InfoItem({ Icon, title, children }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex h-22 w-28 items-center justify-center">
        <div className="absolute top-11 h-43 w-42 rounded-full bg-verde-pastel" />

        <Icon className="relative z-10 text-7xl" />
      </div>

      <p className="relative z-10 text-xl leading-snug max-w-60">
        <strong>
          {title}
          <br />
        </strong>
        {children}
      </p>
    </div>
  )
}

export default function HomePage() {
  const [destaques, setDestaques] = useState([])
  const [indiceInicial, setIndiceInicial] = useState(0)

  useEffect(() => {
    let ativo = true

    Promise.all([apiProjetos.listar().catch(() => []), apiTutoriais.listar().catch(() => [])]).then(
      ([projetos, tutoriais]) => {
        if (!ativo) return
        const itensProjetos = (Array.isArray(projetos) ? projetos : []).map((p) => ({
          id: `proj-${p.id}`,
          title: p.name,
          date: `PROJETO • ${new Date(p.createdAt || Date.now())
            .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
            .toUpperCase()}`,
          location: p.school?.name || 'Rede Municipal de Caraguatatuba',
          linkUrl: `/detalhesProjeto?id=${p.id}`
        }))
        const itensTutoriais = (Array.isArray(tutoriais) ? tutoriais : []).map((t) => ({
          id: `tut-${t.id}`,
          title: t.title,
          date: `TUTORIAL • ${new Date(t.createdAt || Date.now())
            .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
            .toUpperCase()}`,
          location: t.school?.name || 'Rede Municipal de Caraguatatuba',
          linkUrl: `/detalhesTutorial?id=${t.id}`
        }))

        const combinados = [...itensProjetos, ...itensTutoriais]
        const unicos = Array.from(new Map(combinados.map((i) => [i.title, i])).values())
        setDestaques(unicos)
      }
    )

    return () => {
      ativo = false
    }
  }, [])

  const destaquesVisiveis = destaques.slice(indiceInicial, indiceInicial + 3)

  return (
    <>
      <Header />

      <main className="relative min-h-[calc(100vh-96px)] overflow-hidden bg-branco-esverdeado">
        <div className="pointer-events-none absolute right-0 top-0 z-0 h-full w-[70%] block">
          <Image
            src={ligacoes}
            alt="Fundo decorativo"
            fill
            priority
            className="object-cover object-center opacity-15"
          />
        </div>

        <div className="pointer-events-none absolute right-1 top-1/2 z-10 -translate-y-1/2 hidden lg:block h-240 w-240">
          <Image
            src={homeBot}
            alt="Ilustração principal de robótica"
            fill
            priority
            className="object-contain"
          />
        </div>

        <section className="relative z-20 mx-4 sm:mx-8 lg:mx-25 flex min-h-[calc(100vh-96px)] max-w-7xl items-center py-12 lg:py-0">
          <div className="max-w-140">
            <h1 className="font-bold uppercase leading-tight text-4xl sm:text-5xl lg:text-6xl">
              <span className="text-verde-oliva">
                Descubra,
                <br />
              </span>

              <span className="text-verde-escuro">
                construa e
                <br />
                compartilhe.
              </span>
            </h1>

            <p className="mt-8 max-w-140 text-black text-lg sm:text-xl lg:text-2xl">
              Conectando escolas, estudantes e a comunidade de Caraguatatuba através da tecnologia.
            </p>

            <Link
              href="/projetos"
              className="mt-10 flex h-15 w-full max-w-74 cursor-pointer items-center justify-between rounded-xl border
            border-verde-musgo bg-white px-5 text-xl font-bold text-verde-musgo transition hover:bg-verde-pastel"
            >
              Explorar Projetos
              <MdArrowForward size={24} />
            </Link>
          </div>
        </section>
      </main>

      <div className="w-full bg-verde-oliva py-8 px-4">
        <div className="flex flex-wrap justify-center gap-8 sm:gap-16 lg:gap-40">
          {pillars.map(({ title, Icon, size }) => (
            <PillarItem key={title} Icon={Icon} title={title} size={size} />
          ))}
        </div>
      </div>

      <section className="w-full flex flex-col items-center mt-12 md:mt-20 px-4">
        <h2 className="max-w-180 text-center text-2xl sm:text-3xl lg:text-4xl font-bold uppercase">
          <span className="text-verde-musgo">Acompanhe os </span>
          <span className="text-verde-escuro">hackathons, eventos e mostras das escolas!</span>
        </h2>

        <div className="flex flex-col justify-center gap-5 mt-10 md:mt-14 w-full">
          {destaquesVisiveis.length > 0 ? (
            <>
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

              {destaques.length > 3 && (
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIndiceInicial((prev) => Math.max(0, prev - 3))}
                    disabled={indiceInicial === 0}
                    className="p-3 border rounded-full border-verde-escuro text-verde-escuro cursor-pointer bg-white hover:brightness-90 transition disabled:opacity-40"
                  >
                    <MdArrowBack size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setIndiceInicial((prev) => (prev + 3 < destaques.length ? prev + 3 : prev))
                    }
                    disabled={indiceInicial + 3 >= destaques.length}
                    className="p-3 border rounded-full border-verde-escuro text-verde-escuro cursor-pointer bg-white hover:brightness-90 transition disabled:opacity-40"
                  >
                    <MdArrowForward size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-verde-musgo text-lg font-medium text-center">
              Nenhuma publicação em destaque cadastrada no momento.
            </p>
          )}
        </div>
      </section>

      <section className="relative my-12 lg:my-16 min-h-82 overflow-visible mx-4 sm:mx-8 lg:mx-25 rounded-lg border border-verde-musgo bg-white px-6 sm:px-8 py-8">
        <div className="hidden xl:block absolute -left-72 -bottom-30 z-20">
          <Image
            src={working}
            alt="Biobot mexendo em peças"
            width={700}
            className="h-auto w-full scale-x-[-1]"
            priority
          />
        </div>

        <div className="xl:ml-58 flex flex-col items-center">
          <h2 className="text-center text-2xl font-bold text-verde-musgo">QUEM SOMOS?</h2>

          <p className="mt-3 max-w-160 text-center font-medium leading-tight text-xl sm:text-2xl">
            Somos um projeto de extensão que une tecnologia e educação para transformar a robótica e
            o futuro. Nosso foco é a democratização da robótica, provando que inovação se faz com
            criatividade.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            <InfoItem Icon={PiPlant} title="Robótica Sustentável:">
              Ensinamos robótica de baixo custo e alternativa, utilizando materiais recicláveis e
              acessíveis.
            </InfoItem>

            <InfoItem Icon={PiHouseLine} title="Conexão Regional:">
              Divulgamos eventos, hackathons e um portfólio de projetos desenvolvidos por nossos
              alunos.
            </InfoItem>

            <InfoItem Icon={ImBooks} title="Educação Inclusiva:">
              Portal totalmente acessível para garantir que a tecnologia chegue a todos.
            </InfoItem>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
