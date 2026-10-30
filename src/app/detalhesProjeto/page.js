'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

import {
  MdArrowBack,
  MdPhotoLibrary,
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
      <main className="w-full min-h-[60vh] py-16 px-4 flex items-center justify-center">
        <p className="text-verde-musgo text-base sm:text-lg font-medium">Carregando detalhes do projeto...</p>
      </main>
    )
  }

  if (!projeto) {
    return (
      <main className="w-full min-h-[60vh] py-16 px-4 flex flex-col items-center justify-center gap-4">
        <p className="text-verde-musgo text-base sm:text-lg font-medium">Projeto não encontrado.</p>
        <Link
          href="/projetos"
          className="px-5 py-2.5 bg-verde-musgo text-white text-sm font-bold rounded-xl hover:bg-verde-escuro transition"
        >
          Voltar para Projetos
        </Link>
      </main>
    )
  }

  return (
    <main className="w-full min-h-screen bg-branco-esverdeado/20 py-8 sm:py-12 px-4 flex flex-col items-center justify-start">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        {/* botão voltar */}
        <div className="self-start">
          <Link
            href="/projetos"
            className="text-verde-escuro hover:text-verde-musgo transition-colors font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer bg-white border border-stone-200 px-3.5 py-2 rounded-xl shadow-xs"
          >
            <MdArrowBack size={18} />
            <span>Voltar para Projetos</span>
          </Link>
        </div>

        {/* cabeçalho do Projeto */}
        <div className="flex flex-col gap-3">
          <h1 className="text-verde-escuro text-2xl font-extrabold font-sans leading-tight">
            {projeto.titulo}
          </h1>

          {/* tags */}
          <div className="pl-3.5 border-l-4 border-verde-limao flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1.5 text-verde-musgo font-sans text-xs sm:text-sm">
            <div>
              <strong className="text-verde-escuro">Orientador:</strong> {projeto.orientador}
            </div>
            <span className="hidden md:inline text-stone-300">|</span>
            <div>
              <strong className="text-verde-escuro">Escola:</strong> {projeto.escola}
            </div>
            <span className="hidden md:inline text-stone-300">|</span>
            <div>
              <strong className="text-verde-escuro">Data da Publicação:</strong>{' '}
              {projeto.dataPublicacao}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-6 sm:gap-8 justify-between items-start">
          {/* galeria do projeto */}
          <div className="w-full flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-[#E8F5D6] rounded-lg flex items-center justify-center">
                <MdPhotoLibrary className="text-lg text-verde-musgo" />
              </div>
              <h2 className="text-verde-escuro text-lg sm:text-xl font-bold font-sans">
                Galeria do Projeto
              </h2>
            </div>

            <div className="w-full h-64 sm:h-80 md:h-96 bg-white rounded-2xl overflow-hidden shadow-xs border border-stone-200">
              <Image
                className="w-full h-full object-cover"
                src="https://t4.ftcdn.net/jpg/01/63/58/21/360_F_163582149_7XleuAaTQJ7LYZMCCLyo2sJjiZTgv0As.jpg"
                alt={`${projeto.titulo} Protótipo`}
                width={648}
                height={384}
                priority
              />
            </div>
          </div>

          {/* tecnologias e equipe */}
          <div className="w-full lg:w-80 bg-white border border-stone-200 rounded-2xl p-6 flex flex-col gap-5 shadow-xs font-sans">
            <div className="flex flex-col gap-2">
              <h3 className="text-verde-escuro text-base font-bold uppercase tracking-wider">Categorias</h3>
              <div className="pt-1 pb-3 border-b border-stone-100 flex flex-wrap gap-1.5">
                {projeto.categorias.map((cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-1 bg-[#E8F5D6] text-verde-musgo text-xs font-semibold rounded-lg"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-verde-escuro text-base font-bold uppercase tracking-wider">Unidade Escolar</h3>

              <div className="flex flex-col gap-1">
                <span className="text-verde-musgo text-[11px] font-bold uppercase tracking-wider">
                  ESCOLA VINCULADA
                </span>
                <span className="text-verde-escuro text-sm font-bold">{projeto.escola}</span>
              </div>

              <div className="flex flex-col gap-1 pt-2 border-t border-stone-100">
                <span className="text-verde-musgo text-[11px] font-bold uppercase tracking-wider">
                  ENDEREÇO
                </span>
                <span className="text-stone-600 text-xs sm:text-sm font-medium">{projeto.enderecoEscola}</span>
              </div>
            </div>
          </div>
        </div>

        {/* sobre o projeto */}
        <div className="w-full bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 flex flex-col gap-3 font-sans shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#E8F5D6] rounded-lg flex items-center justify-center">
              <MdInsertDriveFile className="text-lg text-verde-musgo" />
            </div>
            <h2 className="text-verde-escuro text-lg sm:text-xl font-bold">Sobre o Projeto</h2>
          </div>
          <p className="text-stone-700 text-sm sm:text-base font-normal leading-relaxed text-justify">
            {projeto.descricao}
          </p>
        </div>

        {/* unidade escolar */}
        <div className="w-full bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 flex flex-col gap-4 font-sans shadow-xs">
          <div className="flex flex-col gap-2">
            <h2 className="text-verde-escuro text-lg sm:text-xl font-bold uppercase tracking-wide">
              {projeto.escola}
            </h2>
            <div className="flex items-center gap-2 text-verde-musgo text-xs sm:text-sm font-medium">
              <MdLocationOn className="text-base shrink-0" />
              <span>{projeto.enderecoEscola}</span>
            </div>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mt-1">
              Referência regional em robótica educacional inclusiva. Nossa escola desenvolve
              projetos que integram tecnologia e consciência ambiental desde os anos iniciais.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-stone-100">
            <h3 className="text-verde-escuro text-xs sm:text-sm font-bold uppercase tracking-wider">
              OUTROS PROJETOS DA UNIDADE
            </h3>

            <div className="flex flex-col gap-2">
              {outrosProjetos.length > 0 ? (
                outrosProjetos.map((outro) => (
                  <Link
                    key={outro.id}
                    href={`/detalhesProjeto?id=${outro.id}`}
                    className="w-full p-3.5 bg-input-bg rounded-xl flex justify-between items-center hover:bg-verde-pastel/50 transition-colors cursor-pointer text-xs sm:text-sm font-semibold text-verde-escuro"
                  >
                    <span>{outro.titulo}</span>
                    <MdArrowForward className="text-verde-musgo" size={18} />
                  </Link>
                ))
              ) : (
                <p className="text-stone-500 text-xs sm:text-sm">
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
