'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

import {
  MdArrowBack,
  MdPhotoLibrary,
  MdChevronLeft,
  MdChevronRight,
  MdInsertDriveFile,
  MdLocationOn,
  MdArrowForward
} from 'react-icons/md'
import Image from 'next/image'
import { apiProjetos, mapearProjetoDaApi } from '@/services/api'

function DetalhesProjetoConteudo() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [projeto, setProjeto] = useState(null)
  const [outrosProjetos, setOutrosProjetos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true

    Promise.all([
      id ? apiProjetos.buscarPorId(id).catch(() => null) : Promise.resolve(null),
      apiProjetos.listar().catch(() => [])
    ])
      .then(([detalheApi, listaApi]) => {
        if (!ativo) return
        const lista = Array.isArray(listaApi) ? listaApi : []
        const selecionado = detalheApi || lista[0] || null

        if (selecionado) {
          const mapeado = mapearProjetoDaApi(selecionado)
          setProjeto({
            id: mapeado.id,
            titulo: mapeado.titulo,
            orientador: selecionado.author || mapeado.escola,
            escola: mapeado.escola,
            enderecoEscola: selecionado.school?.address || mapeado.enderecoEscola,
            dataPublicacao: new Date(
              selecionado.updatedAt || selecionado.createdAt || Date.now()
            ).toLocaleDateString('pt-BR'),
            descricao: mapeado.descricao,
            categorias: mapeado.categorias,
            equipe: mapeado.equipe
          })

          const relacionados = lista
            .filter((item) => item.id !== selecionado.id)
            .sort((a, _b) => (a.schoolId === selecionado.schoolId ? -1 : 1))
            .slice(0, 3)
            .map((item) => mapearProjetoDaApi(item))

          setOutrosProjetos(relacionados)
        } else {
          setProjeto(null)
          setOutrosProjetos([])
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
      <main className="w-full min-h-screen bg-[#FFFDF5] py-16 px-4 flex items-center justify-center">
        <p className="text-verde-musgo text-xl font-medium">Carregando detalhes do projeto...</p>
      </main>
    )
  }

  if (!projeto) {
    return (
      <main className="w-full min-h-screen bg-[#FFFDF5] py-16 px-4 flex flex-col items-center justify-center gap-6">
        <p className="text-verde-musgo text-xl font-medium">Projeto não encontrado.</p>
        <Link
          href="/projetos"
          className="px-6 py-3 bg-verde-musgo text-white font-bold rounded-lg hover:opacity-90 transition"
        >
          Voltar para Projetos
        </Link>
      </main>
    )
  }

  return (
    <main className="w-full min-h-screen bg-[#FFFDF5] py-16 px-4 flex flex-col items-center justify-start">
      <div className="w-full max-w-300 flex flex-col gap-10">
        {/* botão voltar */}
        <div className="self-start mt-4 md:-ml-12">
          <Link
            href="/projetos"
            className="text-[#002A15] hover:opacity-80 transition-opacity text-4xl md:text-5xl flex items-center cursor-pointer"
          >
            <MdArrowBack />
          </Link>
        </div>

        {/* cabeçalho do Projeto */}
        <div className="flex flex-col gap-3">
          <h1 className="text-[#002A15] text-2xl sm:text-4xl lg:text-5xl font-bold font-sans leading-tight">
            {projeto.titulo}
          </h1>

          {/* tags */}
          <div className="pl-4 sm:pl-6 border-l-4 border-lime-400 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-verde-musgo font-sans text-sm sm:text-base">
            <div>
              <strong className="text-[#002A15]">Orientador:</strong> {projeto.orientador}
            </div>
            <span className="hidden md:inline text-verde-musgo">|</span>
            <div>
              <strong className="text-[#002A15]">Escola:</strong> {projeto.escola}
            </div>
            <span className="hidden md:inline text-verde-musgo">|</span>
            <div>
              <strong className="text-[#002A15]">Data da Publicação:</strong>{' '}
              {projeto.dataPublicacao}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-8 justify-between items-start">
          {/* galeria do projeto */}
          <div className="w-full max-w-200 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-[#E8F5D6] rounded-lg flex items-center justify-center">
                <MdPhotoLibrary className="text-xl text-verde-musgo" />
              </div>
              <h2 className="text-[#002A15] text-2xl font-semibold font-sans leading-8">
                Galeria do Projeto
              </h2>
            </div>

            {/* carrossel */}
            <div className="w-full flex flex-col items-center gap-4 relative">
              <div className="w-full relative flex items-center justify-center px-10 sm:px-14">
                <button
                  type="button"
                  className="w-10 h-10 absolute left-0 top-[50%] -translate-y-1/2 bg-[#E8F5D6] hover:opacity-90 text-verde-musgo rounded-full flex justify-center items-center cursor-pointer transition-opacity text-xl focus:outline-none z-10"
                >
                  <MdChevronLeft />
                </button>

                <div className="w-full max-w-162 h-56 sm:h-80 md:h-96 bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex-1">
                  <Image
                    className="w-full h-full object-cover"
                    src="https://t4.ftcdn.net/jpg/01/63/58/21/360_F_163582149_7XleuAaTQJ7LYZMCCLyo2sJjiZTgv0As.jpg"
                    alt={`${projeto.titulo} Protótipo`}
                    width={648}
                    height={384}
                  />
                </div>

                <button
                  type="button"
                  className="w-10 h-10 absolute right-0 top-[50%] -translate-y-1/2 bg-[#E8F5D6] hover:opacity-90 text-verde-musgo rounded-full flex justify-center items-center cursor-pointer transition-opacity text-xl focus:outline-none z-10"
                >
                  <MdChevronRight />
                </button>
              </div>

              <div className="flex justify-center items-center gap-1 mt-2 w-full max-w-162">
                <div className="w-2 h-2 bg-lime-400 rounded-full" />
                <div className="w-2 h-2 bg-stone-300/30 rounded-full" />
                <div className="w-2 h-2 bg-stone-300/30 rounded-full" />
                <div className="w-2 h-2 bg-stone-300/30 rounded-full" />
              </div>
            </div>
          </div>

          {/* tecnologias e equipe */}
          <div className="w-full lg:w-96 bg-white border border-stone-300 rounded-lg p-6 flex flex-col gap-5 shadow-sm font-sans">
            <div className="flex flex-col gap-2.5">
              <h3 className="text-[#002A15] text-2xl font-semibold leading-8">Categorias</h3>
              <div className="py-5 border-b border-verde-musgo flex flex-col">
                <div className="flex flex-wrap gap-2">
                  {projeto.categorias.map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 bg-[#E8F5D6] text-verde-musgo text-xs font-normal rounded-xl"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <h3 className="text-[#002A15] text-2xl font-semibold leading-8 py-1.25">Unidade</h3>

              <div className="flex flex-col gap-1.25">
                <span className="text-verde-musgo text-base font-medium uppercase tracking-wide">
                  ESCOLA VINCULADA
                </span>
                <span className="text-[#002A15] text-base font-bold">{projeto.escola}</span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <span className="text-verde-musgo text-base font-medium uppercase tracking-wide">
                  ENDEREÇO
                </span>
                <span className="text-[#002A15] text-sm font-medium">{projeto.enderecoEscola}</span>
              </div>
            </div>
          </div>
        </div>

        {/* sobre o projeto */}
        <div className="w-full bg-white rounded-3xl border border-verde-musgo p-6 sm:p-8 md:p-10 flex flex-col gap-6 font-sans">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-[#E8F5D6] rounded-lg flex items-center justify-center">
              <MdInsertDriveFile className="text-xl text-verde-musgo" />
            </div>
            <h2 className="text-[#002A15] text-2xl font-semibold leading-8">Sobre o Projeto</h2>
          </div>
          <p className="text-verde-musgo text-base sm:text-lg md:text-xl font-normal leading-relaxed text-justify pb-4">
            {projeto.descricao}
          </p>
        </div>

        {/* unidade escolar */}
        <div className="w-full bg-white rounded-3xl border border-verde-musgo p-6 sm:p-8 flex flex-col gap-6 font-sans">
          <div className="flex flex-col gap-4">
            <h2 className="text-verde-musgo text-2xl sm:text-3xl font-medium leading-9 uppercase">
              {projeto.escola}
            </h2>
            <div className="flex items-center gap-2 text-verde-musgo text-base sm:text-lg font-normal leading-6">
              <MdLocationOn className="text-xl" />
              <span>{projeto.enderecoEscola}</span>
            </div>
            <p className="text-[#002A15] text-lg sm:text-2xl font-normal leading-relaxed mt-2">
              Referência regional em robótica educacional inclusiva. Nossa escola desenvolve
              projetos que integram tecnologia e consciência ambiental desde os anos iniciais.
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-stone-100">
            <h3 className="text-[#002A15] text-base font-semibold uppercase tracking-wider">
              OUTROS PROJETOS DA UNIDADE
            </h3>

            <div className="flex flex-col gap-4">
              {outrosProjetos.length > 0 ? (
                outrosProjetos.map((outro) => (
                  <Link
                    key={outro.id}
                    href={`/detalhesProjeto?id=${outro.id}`}
                    className="w-full p-4 bg-[#E8F5D6] rounded-xl flex justify-between items-center hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <span className="text-verde-musgo text-lg font-medium">{outro.titulo}</span>
                    <MdArrowForward className="text-[#002A15]" />
                  </Link>
                ))
              ) : (
                <p className="text-verde-musgo text-base">
                  Nenhum outro projeto cadastrado para esta unidade.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function DetalhesProjeto() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <DetalhesProjetoConteudo />
      </Suspense>
      <Footer />
    </>
  )
}
