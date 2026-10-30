'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  MdAdd,
  MdOutlineApartment,
  MdOutlineLocationOn,
  MdOutlineSchool,
  MdOutlineGroups,
  MdOutlineRocketLaunch,
  MdOutlineBuild,
  MdOutlinePrecisionManufacturing,
  MdOutlinePersonAddAlt,
  MdMoreVert
} from 'react-icons/md'
import { AdminSidebar } from '@/components/AdminSidebar'
import { apiEscolas, apiProjetos, apiTutoriais, apiUsuarios } from '@/services/api'

const iconesMovimentacao = {
  projeto: MdOutlineBuild,
  equipe: MdOutlinePrecisionManufacturing,
  usuario: MdOutlinePersonAddAlt
}

export default function DashboardPage() {
  const [estatisticas, setEstatisticas] = useState({
    polosAtivos: 0,
    professores: 0,
    equipes: 0,
    projetos: 0
  })
  const [movimentacoes, setMovimentacoes] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true

    Promise.all([
      apiEscolas.listar().catch(() => []),
      apiUsuarios.listar().catch(() => []),
      apiProjetos.listar().catch(() => []),
      apiTutoriais.listar().catch(() => [])
    ])
      .then(([escolas, usuarios, projetos, tutoriais]) => {
        if (!ativo) return
        const listaEscolas = Array.isArray(escolas) ? escolas : []
        const listaUsuarios = Array.isArray(usuarios) ? usuarios : []
        const listaProjetos = Array.isArray(projetos) ? projetos : []
        const listaTutoriais = Array.isArray(tutoriais) ? tutoriais : []

        const gruposUnicos = new Set(listaUsuarios.map((u) => u.roboticsGroupId).filter(Boolean))

        setEstatisticas({
          polosAtivos: listaEscolas.length,
          professores: listaUsuarios.length,
          equipes: gruposUnicos.size || listaProjetos.length,
          projetos: listaProjetos.length + listaTutoriais.length
        })

        const itensMovimentacao = [
          ...listaTutoriais.map((t) => ({
            id: `tut-${t.id}`,
            tipo: 'projeto',
            textoAntes: 'Tutorial ',
            destaque: `"${t.title}"`,
            textoDepois: ' publicado na plataforma',
            subtitulo: t.school?.name ? `(${t.school.name})` : '',
            dataIso: t.updatedAt || t.createdAt || new Date().toISOString(),
            tempo: new Date(t.updatedAt || t.createdAt || Date.now()).toLocaleDateString('pt-BR')
          })),
          ...listaProjetos.map((p) => ({
            id: `proj-${p.id}`,
            tipo: 'projeto',
            textoAntes: 'Projeto ',
            destaque: `"${p.name}"`,
            textoDepois: ' registrado na rede',
            subtitulo: p.school?.name ? `(${p.school.name})` : '',
            dataIso: p.updatedAt || p.createdAt || new Date().toISOString(),
            tempo: new Date(p.updatedAt || p.createdAt || Date.now()).toLocaleDateString('pt-BR')
          })),
          ...listaUsuarios.map((u) => ({
            id: `user-${u.id}`,
            tipo: 'usuario',
            textoAntes: `Usuário cadastrado: ${u.name}`,
            destaque: '',
            textoDepois: '',
            subtitulo: u.email || 'Acesso liberado ao portal.',
            dataIso: u.updatedAt || u.createdAt || new Date().toISOString(),
            tempo: new Date(u.updatedAt || u.createdAt || Date.now()).toLocaleDateString('pt-BR')
          }))
        ]
          .sort((a, b) => new Date(b.dataIso) - new Date(a.dataIso))
          .slice(0, 6)

        setMovimentacoes(itensMovimentacao)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  const cards = [
    {
      label: 'POLOS ATIVOS',
      value: estatisticas.polosAtivos,
      icon: MdOutlineLocationOn
    },
    {
      label: 'PROFESSORES',
      value: estatisticas.professores,
      icon: MdOutlineSchool
    },
    {
      label: 'EQUIPES',
      value: estatisticas.equipes,
      icon: MdOutlineGroups
    },
    {
      label: 'PROJETOS',
      value: estatisticas.projetos,
      icon: MdOutlineRocketLaunch
    }
  ]

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <AdminSidebar />

      <div className="flex flex-1 flex-col px-4 sm:px-6 lg:px-10 pb-16">
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 pt-6 sm:pt-12">
          {/* Cabeçalho */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-verde-escuro">
                Visão Geral da Rede
              </h1>
              <p className="mt-1 text-sm sm:text-base text-verde-musgo">
                Acompanhe o engajamento e os números globais.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                href="/cadastrarUsuario"
                className="flex w-48 items-center justify-center gap-2 rounded-lg bg-verde-musgo px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-90 cursor-pointer"
              >
                <MdAdd size={18} />
                Novo Professor
              </Link>

              <Link
                href="/cadastrarEscola"
                className="flex w-48 items-center justify-center gap-2 rounded-lg border border-b-3 border-verde-musgo bg-white px-5 py-2 text-sm font-semibold text-verde-musgo hover:bg-verde-pastel"
              >
                <MdOutlineApartment size={18} />
                Nova Escola
              </Link>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-5 shadow-sm"
              >
                <Icon
                  size={44}
                  className="pointer-events-none absolute top-3 right-3 text-verde-escuro/10"
                />
                <p className="text-[11px] font-bold uppercase tracking-wide text-verde-musgo">
                  {label}
                </p>
                <p className="mt-2 mb-4 text-2xl font-bold text-verde-escuro">{value}</p>
                <div className="h-1 w-full rounded-full bg-verde-oliva" />
              </div>
            ))}
          </div>

          {/* Últimas Movimentações */}
          <section className="rounded-2xl border border-verde-musgo/60 bg-white py-6">
            <div className="flex items-center justify-between border-b border-verde-escuro/10 px-6 pb-4">
              <h2 className="text-lg font-bold text-verde-escuro">Últimas Movimentações</h2>
              <Link
                href="/projetos"
                className="text-xs font-bold text-verde-musgo hover:underline cursor-pointer"
              >
                Ver tudo
              </Link>
            </div>

            {carregando ? (
              <p className="px-6 py-8 text-center text-sm text-verde-musgo">
                Carregando movimentações da rede...
              </p>
            ) : movimentacoes.length > 0 ? (
              <ul className="divide-y divide-verde-escuro/5 px-6">
                {movimentacoes.map((item) => {
                  const Icone = iconesMovimentacao[item.tipo] || MdOutlineBuild

                  return (
                    <li key={item.id} className="flex items-center justify-between gap-4 py-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-verde-oliva text-verde-escuro">
                          <Icone size={20} />
                        </div>
                        <div className="text-sm text-verde-escuro">
                          <p>
                            {item.textoAntes}
                            {item.destaque && (
                              <span className="font-semibold text-verde-musgo">
                                {item.destaque}
                              </span>
                            )}
                            {item.textoDepois}
                          </p>
                          {item.subtitulo && <p>{item.subtitulo}</p>}
                          <p className="mt-1 text-[10px] font-bold uppercase text-verde-musgo">
                            {item.tempo}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        aria-label="Mais opções"
                        className="text-verde-musgo hover:text-verde-escuro cursor-pointer"
                      >
                        <MdMoreVert size={20} />
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="px-6 py-8 text-center text-sm text-verde-musgo">
                Nenhuma movimentação registrada ainda.
              </p>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
