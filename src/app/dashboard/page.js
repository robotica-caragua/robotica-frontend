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
  MdMoreVert,
  MdOutlineNotifications,
  MdOutlineSettings,
  MdPerson
} from 'react-icons/md'
import { AdminSidebar } from '@/components/AdminSidebar'

const dadosIniciais = {
  estatisticas: {
    polosAtivos: 12,
    professores: 34,
    equipes: 128,
    projetos: 85
  },
  movimentacoes: [
    {
      id: 1,
      tipo: 'projeto',
      textoAntes: 'Projeto ',
      destaque: '"Braço Hidráulico"',
      textoDepois: ' publicado por Prof. Carlos',
      subtitulo: '(EMEF Euclydes Ferreira)',
      tempo: 'HÁ 2 HORAS'
    },
    {
      id: 2,
      tipo: 'projeto',
      textoAntes: 'Projeto ',
      destaque: '"Braço Hidráulico"',
      textoDepois: ' publicado por Prof. Carlos',
      subtitulo: '(EMEF Euclydes Ferreira)',
      tempo: 'HÁ 2 HORAS'
    },
    {
      id: 3,
      tipo: 'equipe',
      textoAntes: 'Nova equipe ',
      destaque: '"Robôs do Tinga"',
      textoDepois: ' cadastrada com',
      subtitulo: 'sucesso na rede global.',
      tempo: 'HÁ 5 HORAS'
    },
    {
      id: 4,
      tipo: 'usuario',
      textoAntes: 'Novo usuário criado: Profª Maria (CIEF Edna Maria).',
      destaque: '',
      textoDepois: '',
      subtitulo: 'Acesso liberado ao portal.',
      tempo: 'ONTEM'
    }
  ]
}

const iconesMovimentacao = {
  projeto: MdOutlineBuild,
  equipe: MdOutlinePrecisionManufacturing,
  usuario: MdOutlinePersonAddAlt
}

export default function DashboardPage() {
  const [dados, setDados] = useState(dadosIniciais)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) return

    fetch(`${apiUrl}/dashboard`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setDados(data)
      })
      .catch(() => {})
  }, [])

  const cards = [
    {
      label: 'POLOS ATIVOS',
      value: dados.estatisticas.polosAtivos,
      icon: MdOutlineLocationOn
    },
    {
      label: 'PROFESSORES',
      value: dados.estatisticas.professores,
      icon: MdOutlineSchool
    },
    {
      label: 'EQUIPES',
      value: dados.estatisticas.equipes,
      icon: MdOutlineGroups
    },
    {
      label: 'PROJETOS',
      value: dados.estatisticas.projetos,
      icon: MdOutlineRocketLaunch
    }
  ]

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex flex-1 flex-col px-10 pb-16">
        {/* Topo */}
        <div className="flex h-16 items-center justify-end gap-4 text-verde-escuro">
          <div className="relative">
            <MdOutlineNotifications size={22} />
            <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-vermelho" />
          </div>
          <MdOutlineSettings size={22} />
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-verde-musgo bg-verde-escuro text-verde-pastel">
            <MdPerson size={24} />
          </div>
        </div>

        <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 pt-10">
          {/* Cabeçalho */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-verde-escuro">Visão Geral da Rede</h1>
              <p className="mt-1 text-verde-musgo">Acompanhe o engajamento e os números globais.</p>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                className="flex w-48 items-center justify-center gap-2 rounded-lg bg-verde-musgo px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-90 cursor-pointer"
              >
                <MdAdd size={18} />
                Novo Professor
              </button>

              <Link
                href="/escolas"
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
                <p className="mt-2 mb-4 text-4xl font-bold text-verde-escuro">{value}</p>
                <div className="h-1 w-full rounded-full bg-verde-oliva" />
              </div>
            ))}
          </div>

          {/* Últimas Movimentações */}
          <section className="rounded-2xl border border-verde-musgo/60 bg-white py-6">
            <div className="flex items-center justify-between border-b border-verde-escuro/10 px-6 pb-4">
              <h2 className="text-lg font-bold text-verde-escuro">Últimas Movimentações</h2>
              <button
                type="button"
                className="text-xs font-bold text-verde-musgo hover:underline cursor-pointer"
              >
                Ver tudo
              </button>
            </div>

            <ul className="divide-y divide-verde-escuro/5 px-6">
              {dados.movimentacoes.map((item) => {
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
                            <span className="font-semibold text-verde-musgo">{item.destaque}</span>
                          )}
                          {item.textoDepois}
                        </p>
                        <p>{item.subtitulo}</p>
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
          </section>
        </main>
      </div>
    </div>
  )
}
