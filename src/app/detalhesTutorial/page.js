'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BsArchive } from 'react-icons/bs'
import {
  MdArrowBack,
  MdOutlineRecycling,
  MdCable,
  MdOutlinePrecisionManufacturing
} from 'react-icons/md'
import { IoMdBatteryFull } from 'react-icons/io'
import { BiRuler } from 'react-icons/bi'
import { FaArrowRightLong } from 'react-icons/fa6'
import { GoLocation } from 'react-icons/go'
import Link from 'next/link'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Material } from '@/components/Material'
import { Project } from '@/components/Project'
import { apiTutoriais, mapearTutorialDaApi } from '@/services/api'

const iconesMateriais = [
  MdOutlineRecycling,
  MdOutlinePrecisionManufacturing,
  MdCable,
  IoMdBatteryFull,
  BiRuler
]

function DetalhesTutorialConteudo() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [tutorial, setTutorial] = useState(null)
  const [outrosTutoriais, setOutrosTutoriais] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true

    Promise.all([
      id ? apiTutoriais.buscarPorId(id).catch(() => null) : Promise.resolve(null),
      apiTutoriais.listar().catch(() => [])
    ])
      .then(([detalheApi, listaApi]) => {
        if (!ativo) return
        const lista = Array.isArray(listaApi) ? listaApi : []
        const selecionado = detalheApi || lista[0] || null

        if (selecionado) {
          const mapeado = mapearTutorialDaApi(selecionado)
          setTutorial({
            id: mapeado.id,
            titulo: mapeado.titulo,
            descricao: mapeado.descricao,
            escola: mapeado.escola,
            schoolId: mapeado.schoolId,
            enderecoEscola: selecionado.school?.address || mapeado.enderecoEscola,
            tutorialUrl: mapeado.tutorialUrl || '/video-exemplo.mp4',
            materiaisTexto: mapeado.materiaisTexto
          })

          const relacionados = lista
            .filter((item) => item.id !== selecionado.id)
            .sort((a, _b) => (a.schoolId === selecionado.schoolId ? -1 : 1))
            .slice(0, 3)
            .map((item) => mapearTutorialDaApi(item))

          setOutrosTutoriais(relacionados)
        } else {
          setTutorial(null)
          setOutrosTutoriais([])
        }
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
      <div className="flex min-h-screen w-full items-center justify-center px-4">
        <p className="text-verde-musgo text-xl font-medium">Carregando detalhes do tutorial...</p>
      </div>
    )
  }

  if (!tutorial) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-4">
        <p className="text-verde-musgo text-xl font-medium">Tutorial não encontrado.</p>
        <Link
          href="/tutoriais"
          className="px-6 py-3 bg-verde-musgo text-white font-bold rounded-lg hover:opacity-90 transition"
        >
          Voltar para Tutoriais
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 sm:gap-14 mt-8 sm:mt-14 px-4">
      <div className="w-full max-w-225 flex justify-start -mb-4 sm:-mb-8">
        <Link
          href="/tutoriais"
          aria-label="Voltar para Tutoriais"
          className="text-verde-escuro hover:opacity-80 transition-opacity text-3xl sm:text-4xl md:text-5xl flex items-center cursor-pointer"
        >
          <MdArrowBack />
        </Link>
      </div>
      <div className="border border-verde-musgo justify-center items-center flex-col gap-4 flex rounded-lg p-4 sm:p-6 w-full max-w-225 bg-white">
        <h1 className="text-verde-musgo font-bold text-2xl sm:text-3xl md:text-4xl text-center md:text-left w-full max-w-3xl uppercase">
          {tutorial.titulo}
        </h1>
        <video
          key={tutorial.tutorialUrl}
          className="w-full max-w-200 aspect-video rounded-md bg-black"
          controls
        >
          <source src={tutorial.tutorialUrl} type="video/mp4" />
          Seu navegador não suporta a tag de vídeo.
        </video>
        <p className="text-verde-escuro text-sm sm:text-base text-center leading-relaxed">
          {tutorial.descricao}
        </p>
      </div>

      <div className="border border-verde-musgo justify-center items-center flex-col gap-4 flex rounded-lg p-4 sm:p-6 w-full max-w-225 bg-white">
        <div className="flex items-center gap-4 w-full max-w-210 mb-2 sm:mb-4">
          <BsArchive className="fill-verde-musgo shrink-0" size={34} />
          <h2 className="text-verde-escuro font-bold text-2xl sm:text-3xl md:text-4xl">
            Materiais Necessários
          </h2>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-210">
          {tutorial.materiaisTexto.length > 0 ? (
            tutorial.materiaisTexto.map((item, idx) => {
              const Icone = iconesMateriais[idx % iconesMateriais.length]
              return (
                <Material key={`${item}-${idx}`}>
                  <Icone className="fill-verde-musgo shrink-0" size={26} />
                  <p className="text-base sm:text-xl ms-3 sm:ms-4">{item}</p>
                </Material>
              )
            })
          ) : (
            <p className="text-verde-musgo text-base">
              Nenhum material listado para este tutorial.
            </p>
          )}
        </div>
      </div>

      <div className="border border-verde-musgo mb-16 sm:mb-28 gap-8 rounded-2xl flex flex-col md:flex-row justify-between p-6 sm:p-8 w-full max-w-6xl bg-white">
        <div className="flex flex-col gap-3 w-full md:w-1/2">
          <h3 className="text-verde-musgo font-medium text-xl sm:text-2xl md:text-3xl uppercase">
            {tutorial.escola}
          </h3>
          <div className="flex items-center text-verde-musgo">
            <GoLocation className="fill-verde-musgo shrink-0 mr-2" size={20} />
            <p className="text-base sm:text-lg">{tutorial.enderecoEscola}</p>
          </div>
          <p className="text-base sm:text-xl md:text-2xl text-gray-700 mt-2 leading-relaxed">
            Referência regional em robótica educacional inclusiva. Nossa escola desenvolve projetos
            que integram tecnologia e consciência ambiental desde os anos iniciais.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-1/2">
          <p className="text-verde-escuro font-medium ms-2 text-lg sm:text-xl">
            OUTROS PROJETOS DA UNIDADE
          </p>
          {outrosTutoriais.length > 0 ? (
            outrosTutoriais.map((outro) => (
              <Link key={outro.id} href={`/detalhesTutorial?id=${outro.id}`}>
                <Project>
                  <p className="text-verde-musgo text-xl font-medium">{outro.titulo}</p>
                  <FaArrowRightLong className="fill-verde-escuro" size={24} />
                </Project>
              </Link>
            ))
          ) : (
            <p className="text-verde-musgo text-base ms-2">
              Nenhuma outra publicação cadastrada para esta unidade.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DetalhesTutorial() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <DetalhesTutorialConteudo />
      </Suspense>
      <Footer />
    </>
  )
}
