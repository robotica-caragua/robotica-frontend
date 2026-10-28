'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SideBarProfessor } from '@/components/SideBarProfessor'
import { correspondeBusca } from '@/utils/filtros'
import semaforo from '@/assets/semaforo.png'
import containerImg from '@/assets/container.png'
import { IoSearchOutline, IoAddOutline, IoArrowForward, IoOpenOutline } from 'react-icons/io5'
import {
  MdOutlineLocationOn,
  MdOutlineFolder,
  MdOutlineEditNote,
  MdOutlineGroups,
  MdOutlineEdit,
  MdOutlineVisibilityOff,
  MdOutlineVisibility,
  MdOutlineDeleteOutline,
  MdOutlineCampaign
} from 'react-icons/md'

// TODO: substituir pelos dados da API quando estiver disponível
const publicacoesIniciais = [
  {
    id: 1,
    titulo: 'Semáforo Inteligente com Arduino',
    status: 'rascunho',
    infoData: 'Salvo há 2 dias',
    imagem: semaforo,
    visivel: true
  },
  {
    id: 2,
    titulo: 'Braço Robótico Hidráulico de Papelão',
    status: 'publicado',
    infoData: 'Atualizado em 15/05/2026',
    imagem: containerImg,
    visivel: true
  },
  {
    id: 3,
    titulo: 'Horta Automatizada com Sensor de Umidade',
    status: 'publicado',
    infoData: 'Atualizado em 10/05/2026',
    imagem: containerImg,
    visivel: true
  },
  {
    id: 4,
    titulo: 'Estação Meteorológica Escolar IoT',
    status: 'publicado',
    infoData: 'Atualizado em 02/05/2026',
    imagem: semaforo,
    visivel: true
  }
]

export default function PainelProfessor() {
  const router = useRouter()
  const [busca, setBusca] = useState('')
  const [publicacoes, setPublicacoes] = useState(publicacoesIniciais)

  const totalPublicados = publicacoes.filter((p) => p.status === 'publicado').length
  const totalRascunhos = publicacoes.filter((p) => p.status === 'rascunho').length

  const publicacoesFiltradas = useMemo(
    () =>
      publicacoes.filter((pub) => correspondeBusca(busca, pub.titulo, pub.status, pub.infoData)),
    [busca, publicacoes]
  )

  const alternarVisibilidade = (id) => {
    // TODO: integrar com a API
    setPublicacoes((prev) => prev.map((p) => (p.id === id ? { ...p, visivel: !p.visivel } : p)))
  }

  const excluirPublicacao = (pub) => {
    if (window.confirm(`Deseja realmente excluir "${pub.titulo}"?`)) {
      // TODO: integrar com a API
      setPublicacoes((prev) => prev.filter((p) => p.id !== pub.id))
    }
  }

  return (
    <div className="flex min-h-screen bg-background relative">
      <SideBarProfessor />

      <main className="flex-1 flex flex-col">
        <div className="w-[85%] max-w-[900px] mx-auto py-10 px-4 flex flex-col gap-10">
          {/* Busca superior */}
          <div className="relative w-full max-w-[350px]">
            <IoSearchOutline
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-verde-escuro pointer-events-none"
            />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar projetos..."
              aria-label="Pesquisar projetos"
              className="w-full h-9 pl-11 pr-4 bg-input-bg border border-verde-musgo rounded-full text-sm font-semibold text-verde-escuro placeholder:text-verde-escuro/80 focus:outline-none focus:ring-1 focus:ring-verde-musgo"
            />
          </div>

          {/* Saudação e botão Nova Publicação */}
          <section className="flex flex-col gap-3">
            <h1 className="text-verde-escuro text-5xl font-bold leading-tight">
              Olá, Prof. Robson Nascimento!
            </h1>
            <div className="flex items-center gap-2 text-verde-musgo font-bold text-xl">
              <MdOutlineLocationOn size={22} />
              <span>EMEF Prof. Luiz Ribeiro Muniz</span>
            </div>
            <div className="flex justify-end pt-1">
              <Link
                href="/cadastrarTutorial"
                className="px-6 py-3 bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo text-white text-lg font-bold rounded-lg shadow-sm flex items-center gap-3 transition"
              >
                <IoAddOutline size={22} />
                Nova Publicação
              </Link>
            </div>
          </section>

          {/* Cards de métricas */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-verde-musgo shadow-sm flex flex-col gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-verde-pastel text-verde-musgo">
                <MdOutlineFolder size={20} />
              </div>
              <span className="pt-2 text-verde-escuro text-2xl font-semibold">
                {String(totalPublicados).padStart(2, '0')}
              </span>
              <span className="text-verde-musgo text-lg">Projetos Publicados</span>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-verde-musgo shadow-sm flex flex-col gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-verde-pastel text-verde-musgo">
                <MdOutlineEditNote size={22} />
              </div>
              <span className="pt-2 text-verde-escuro text-2xl font-semibold">
                {String(totalRascunhos).padStart(2, '0')}
              </span>
              <span className="text-verde-musgo text-lg">Rascunhos em Edição</span>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-verde-musgo shadow-sm flex flex-col gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-verde-pastel text-verde-musgo">
                <MdOutlineGroups size={20} />
              </div>
              <span className="pt-2 text-verde-escuro text-2xl font-semibold">145</span>
              <span className="text-verde-musgo text-lg">Visualizações na Rede</span>
            </div>
          </section>

          {/* Publicações Recentes */}
          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-verde-musgo text-3xl font-semibold">Publicações Recentes</h2>
              <Link
                href="/projetos"
                className="flex items-center gap-1.5 text-verde-musgo hover:text-verde-escuro text-lg font-bold transition"
              >
                Ver todos os projetos
                <IoArrowForward size={18} />
              </Link>
            </div>

            <div className="flex flex-col gap-5">
              {publicacoesFiltradas.length > 0 ? (
                publicacoesFiltradas.map((pub) => {
                  const ehRascunho = pub.status === 'rascunho'
                  return (
                    <article
                      key={pub.id}
                      className={`p-5 bg-white/80 rounded-3xl border border-verde-musgo shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition ${
                        !pub.visivel ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className="relative w-32 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                          <Image src={pub.imagem} alt={pub.titulo} fill className="object-cover" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            {ehRascunho ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-200 text-verde-escuro text-[10px] font-black uppercase">
                                <span className="size-2 rounded-full bg-verde-escuro/70" />
                                Rascunho
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-verde-limao text-verde-musgo text-[10px] font-black uppercase">
                                <span className="size-2 rounded-full bg-verde-musgo" />
                                Publicado
                              </span>
                            )}
                            <span className="text-xs font-medium text-verde-escuro/70">
                              {pub.infoData}
                            </span>
                          </div>

                          <h3 className="text-verde-escuro text-xl font-normal leading-snug max-w-md">
                            {pub.titulo}
                          </h3>
                        </div>
                      </div>

                      {ehRascunho ? (
                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => router.push(`/editarTutorial?id=${pub.id}`)}
                            className="px-5 py-2 bg-white hover:bg-input-bg border border-verde-musgo rounded-xl text-verde-musgo text-sm font-bold transition cursor-pointer"
                          >
                            Continuar Editando
                          </button>
                          <button
                            type="button"
                            onClick={() => excluirPublicacao(pub)}
                            title="Excluir rascunho"
                            aria-label={`Excluir ${pub.titulo}`}
                            className="p-2 text-vermelho hover:opacity-70 transition cursor-pointer"
                          >
                            <MdOutlineDeleteOutline size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => router.push(`/editarTutorial?id=${pub.id}`)}
                            title="Editar"
                            aria-label={`Editar ${pub.titulo}`}
                            className="p-2 text-verde-musgo hover:text-verde-escuro transition cursor-pointer"
                          >
                            <MdOutlineEdit size={20} />
                          </button>
                          <button
                            type="button"
                            onClick={() => alternarVisibilidade(pub.id)}
                            title={pub.visivel ? 'Ocultar publicação' : 'Mostrar publicação'}
                            aria-label={
                              pub.visivel ? `Ocultar ${pub.titulo}` : `Mostrar ${pub.titulo}`
                            }
                            className="p-2 text-verde-musgo hover:text-verde-escuro transition cursor-pointer"
                          >
                            {pub.visivel ? (
                              <MdOutlineVisibilityOff size={20} />
                            ) : (
                              <MdOutlineVisibility size={20} />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => excluirPublicacao(pub)}
                            title="Excluir"
                            aria-label={`Excluir ${pub.titulo}`}
                            className="p-2 text-vermelho hover:opacity-70 transition cursor-pointer"
                          >
                            <MdOutlineDeleteOutline size={20} />
                          </button>
                        </div>
                      )}
                    </article>
                  )
                })
              ) : (
                <p className="py-8 text-center text-verde-musgo font-medium">
                  Nenhuma publicação encontrada para &ldquo;{busca}&rdquo;.
                </p>
              )}
            </div>
          </section>

          {/* Avisos da Administração */}
          <section className="p-6 bg-white rounded-3xl border border-verde-musgo shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-2.5 text-verde-musgo">
              <MdOutlineCampaign size={28} />
              <h2 className="text-2xl font-semibold">Avisos da Administração</h2>
            </div>

            <div className="p-6 bg-input-bg rounded-xl border border-verde-musgo flex flex-col gap-2">
              <p className="text-verde-escuro text-base font-bold leading-relaxed">
                Atenção, professores!
                <br />O regulamento para a Mostra Maker de Inverno já está disponível na aba de
                Documentação.
              </p>
              <Link
                href="/rede"
                className="inline-flex items-center gap-1 text-verde-musgo hover:underline text-xs font-bold w-fit"
              >
                Acessar Documentos
                <IoOpenOutline size={14} />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
