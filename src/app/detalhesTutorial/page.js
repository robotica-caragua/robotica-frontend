'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BsArchive } from 'react-icons/bs'
import {
  MdArrowBack,
  MdOutlineRecycling,
  MdCable,
  MdOutlinePrecisionManufacturing,
  MdArrowForward
} from 'react-icons/md'
import { IoMdBatteryFull } from 'react-icons/io'
import { BiRuler } from 'react-icons/bi'
import { GoLocation } from 'react-icons/go'
import Link from 'next/link'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Material } from '@/components/Material'
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
      <div className="flex min-h-[60vh] w-full items-center justify-center px-4">
        <p className="text-verde-musgo text-base sm:text-lg font-medium">Carregando detalhes do tutorial...</p>
      </div>
    )
  }

  if (!tutorial) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-4">
        <p className="text-verde-musgo text-base sm:text-lg font-medium">Tutorial não encontrado.</p>
        <Link
          href="/tutoriais"
          className="px-5 py-2.5 bg-verde-musgo text-white text-sm font-bold rounded-xl hover:bg-verde-escuro transition"
        >
          Voltar para Tutoriais
        </Link>
      </div>
    )
  }

  return (
    <main className="w-full min-h-screen bg-branco-esverdeado/20 py-8 sm:py-12 px-4 flex flex-col items-center justify-start">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <div className="self-start">
          <Link
            href="/tutoriais"
            className="text-verde-escuro hover:text-verde-musgo transition-colors font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer bg-white border border-stone-200 px-3.5 py-2 rounded-xl shadow-xs"
          >
            <MdArrowBack size={18} />
            <span>Voltar para Tutoriais</span>
          </Link>
        </div>

        {/* Video e Descrição */}
        <div className="border border-stone-200 flex flex-col gap-5 rounded-2xl p-6 sm:p-8 w-full bg-white shadow-xs">
          <h1 className="text-verde-escuro font-extrabold text-2xl uppercase tracking-tight">
            {tutorial.titulo}
          </h1>

          <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
            <video
              key={tutorial.tutorialUrl}
              className="w-full h-full object-cover"
              controls
            >
              <source src={tutorial.tutorialUrl} type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>

          <p className="text-stone-700 text-sm sm:text-base leading-relaxed text-justify">
            {tutorial.descricao}
          </p>
        </div>

        {/* Materiais Necessários */}
        <div className="border border-stone-200 flex flex-col gap-4 rounded-2xl p-6 sm:p-8 w-full bg-white shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#E8F5D6] rounded-lg flex items-center justify-center">
              <BsArchive className="fill-verde-musgo text-lg" />
            </div>
            <h2 className="text-verde-escuro font-bold text-xl sm:text-2xl">
              Materiais Necessários
            </h2>
          </div>

          <div className="flex flex-col gap-2.5 w-full">
            {tutorial.materiaisTexto.length > 0 ? (
              tutorial.materiaisTexto.map((item, idx) => {
                const Icone = iconesMateriais[idx % iconesMateriais.length]
                return (
                  <Material key={`${item}-${idx}`}>
                    <Icone className="fill-verde-musgo shrink-0" size={20} />
                    <p className="text-xs sm:text-sm text-verde-escuro font-medium ms-3">{item}</p>
                  </Material>
                )
              })
            ) : (
              <p className="text-stone-500 text-sm">
                Nenhum material listado para este tutorial.
              </p>
            )}
          </div>
        </div>

        {/* Unidade Escolar e Outros Tutoriais */}
        <div className="border border-stone-200 rounded-2xl flex flex-col md:flex-row justify-between gap-6 p-6 sm:p-8 w-full bg-white shadow-xs">
          <div className="flex flex-col gap-3 w-full md:w-1/2">
            <h3 className="text-verde-escuro font-bold text-lg sm:text-xl uppercase tracking-wide">
              {tutorial.escola}
            </h3>
            <div className="flex items-center text-verde-musgo text-xs sm:text-sm">
              <GoLocation className="fill-verde-musgo shrink-0 mr-1.5" size={16} />
              <span>{tutorial.enderecoEscola}</span>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed mt-1">
              Referência regional em robótica educacional inclusiva. Nossa escola desenvolve projetos
              que integram tecnologia e consciência ambiental desde os anos iniciais.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-1/2 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-stone-100 md:pl-6">
            <h4 className="text-verde-escuro font-bold text-xs sm:text-sm uppercase tracking-wider">
              OUTROS PROJETOS DA UNIDADE
            </h4>
            <div className="flex flex-col gap-2">
              {outrosTutoriais.length > 0 ? (
                outrosTutoriais.map((outro) => (
                  <Link
                    key={outro.id}
                    href={`/detalhesTutorial?id=${outro.id}`}
                    className="w-full p-3.5 bg-input-bg rounded-xl flex justify-between items-center hover:bg-verde-pastel/50 transition-colors text-xs sm:text-sm font-semibold text-verde-escuro"
                  >
                    <span>{outro.titulo}</span>
                    <MdArrowForward className="text-verde-musgo" size={16} />
                  </Link>
                ))
              ) : (
                <p className="text-stone-500 text-xs sm:text-sm">
                  Nenhuma outra publicação cadastrada para esta unidade.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
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
