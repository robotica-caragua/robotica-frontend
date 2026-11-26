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
import {
  apiContatos,
  apiEscolas,
  apiProjetos,
  apiTutoriais,
  apiUsuarios,
  lerIdsEscolasInativas
} from '@/services/api'

const iconesMovimentacao = {
  projeto: MdOutlineBuild,
  equipe: MdOutlinePrecisionManufacturing,
  usuario: MdOutlinePersonAddAlt,
  escola: MdOutlineApartment
}

function formatarDataHoraMovimentacao(valorData) {
  const data = new Date(valorData || Date.now())
  if (Number.isNaN(data.getTime())) return ''
  const dia = data.toLocaleDateString('pt-BR')
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${dia} às ${hora}`
}

export default function DashboardPage() {
  const [estatisticas, setEstatisticas] = useState({
    polosAtivos: 0,
    professores: 0,
    equipes: 0,
    projetos: 0
  })
  const [movimentacoes, setMovimentacoes] = useState([])
  const [duvidasRecentes, setDuvidasRecentes] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDuvidasRecentes(apiContatos.listar().slice(0, 4))

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

        const escolasInativas = lerIdsEscolasInativas()
        const escolasAtivas = listaEscolas.filter((e) => !escolasInativas.has(Number(e.id)))
        const apenasProfessores = listaUsuarios.filter(
          (u) =>
            u.role !== 'ADMIN' && u.perfil !== 'ADMINISTRADOR' && u.permissaoAdministrador !== true
        )

        const gruposUnicos = new Set(listaUsuarios.map((u) => u.roboticsGroupId).filter(Boolean))

        setEstatisticas({
          polosAtivos: escolasAtivas.length,
          professores: apenasProfessores.length,
          equipes: gruposUnicos.size || listaProjetos.length,
          projetos: listaProjetos.length + listaTutoriais.length
        })

        const itensMovimentacao = [
          ...listaEscolas.map((e) => ({
            id: `esc-${e.id}`,
            ordemId: Number(e.id) || 0,
            tipo: 'escola',
            textoAntes: 'Escola ',
            destaque: `"${e.name}"`,
            textoDepois: ' cadastrada na rede',
            subtitulo: e.address || 'Caraguatatuba - SP',
            dataIso: e.updatedAt || e.createdAt || new Date().toISOString(),
            tempo: formatarDataHoraMovimentacao(e.updatedAt || e.createdAt)
          })),
          ...listaTutoriais.map((t) => ({
            id: `tut-${t.id}`,
            ordemId: Number(t.id) || 0,
            tipo: 'projeto',
            textoAntes: 'Tutorial ',
            destaque: `"${t.title}"`,
            textoDepois: ' publicado na plataforma',
            subtitulo: t.school?.name ? `(${t.school.name})` : '',
            dataIso: t.updatedAt || t.createdAt || new Date().toISOString(),
            tempo: formatarDataHoraMovimentacao(t.updatedAt || t.createdAt)
          })),
          ...listaProjetos.map((p) => ({
            id: `proj-${p.id}`,
            ordemId: Number(p.id) || 0,
            tipo: 'projeto',
            textoAntes: 'Projeto ',
            destaque: `"${p.name}"`,
            textoDepois: ' registrado na rede',
            subtitulo: p.school?.name ? `(${p.school.name})` : '',
            dataIso: p.updatedAt || p.createdAt || new Date().toISOString(),
            tempo: formatarDataHoraMovimentacao(p.updatedAt || p.createdAt)
          })),
          ...listaUsuarios.map((u) => ({
            id: `user-${u.id}`,
            ordemId: Number(u.id) || 0,
            tipo: 'usuario',
            textoAntes: `${u.role === 'ADMIN' || u.perfil === 'ADMINISTRADOR' ? 'Administrador' : 'Professor'} cadastrado: ${u.name}`,
            destaque: '',
            textoDepois: '',
            subtitulo: u.email || 'Acesso liberado ao portal.',
            dataIso: u.updatedAt || u.createdAt || new Date().toISOString(),
            tempo: formatarDataHoraMovimentacao(u.updatedAt || u.createdAt)
          }))
        ]
          .sort(
            (a, b) =>
              new Date(b.dataIso) - new Date(a.dataIso) || (b.ordemId || 0) - (a.ordemId || 0)
          )
          .slice(0, 8)

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
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background relative">
      <AdminSidebar />

      <div className="flex flex-1 flex-col pb-16">
        <main className="w-full max-w-[1040px] mx-auto flex flex-col gap-6 sm:gap-8 py-8 lg:py-10 px-6 sm:px-10 lg:px-14">
          {/* Cabeçalho */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-[600px]">
              <h1 className="text-3xl sm:text-4xl font-bold text-verde-escuro leading-tight">
                Visão Geral da Rede
              </h1>
              <p className="mt-2 text-sm sm:text-base text-verde-musgo">
                Acompanhe o engajamento e os números globais.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                href="/cadastrarUsuario"
                className="flex w-52 items-center justify-center gap-2 rounded-lg bg-verde-musgo hover:bg-white hover:text-verde-musgo border border-verde-musgo px-5 py-3 text-sm font-bold text-white shadow-sm transition cursor-pointer"
              >
                <MdAdd size={18} />
                Novo Usuário
              </Link>

              <Link
                href="/cadastrarEscola"
                className="flex w-52 items-center justify-center gap-2 rounded-lg border border-b-3 border-verde-musgo bg-white hover:bg-verde-pastel px-5 py-2.5 text-sm font-bold text-verde-musgo transition"
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
                className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-verde-musgo bg-white p-6 shadow-md"
              >
                <Icon
                  size={52}
                  className="pointer-events-none absolute top-3 right-3 text-verde-escuro/10"
                />
                <p className="text-[11px] font-bold uppercase tracking-wider text-verde-musgo">
                  {label}
                </p>
                <p className="mt-2 mb-4 text-3xl sm:text-4xl font-extrabold text-verde-escuro">
                  {value}
                </p>
                <div className="h-1 w-full rounded-full bg-verde-limao" />
              </div>
            ))}
          </div>

          {/* Últimas Movimentações */}
          <section className="rounded-2xl border border-verde-musgo bg-white py-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-verde-escuro/10 px-6 pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-verde-escuro">
                Últimas Movimentações
              </h2>
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
              <ul className="divide-y divide-verde-escuro/10 px-6">
                {movimentacoes.map((item) => {
                  const Icone = iconesMovimentacao[item.tipo] || MdOutlineBuild

                  return (
                    <li key={item.id} className="flex items-center justify-between gap-4 py-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-verde-limao text-verde-escuro">
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

          {/* Dúvidas Recebidas pelo Formulário de Contato */}
          <section className="rounded-2xl border border-verde-musgo bg-white py-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-verde-escuro/10 px-6 pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-verde-escuro">
                Dúvidas Recebidas (Contato)
              </h2>
              <Link
                href="/gestaoDuvidas"
                className="text-xs font-bold text-verde-musgo hover:underline cursor-pointer"
              >
                Gerenciar todas
              </Link>
            </div>

            {duvidasRecentes.length > 0 ? (
              <ul className="divide-y divide-verde-escuro/10 px-6">
                {duvidasRecentes.map((duvida) => (
                  <li
                    key={duvida.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-verde-escuro">
                          {duvida.assunto || 'Sem assunto'}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            duvida.lida
                              ? 'bg-verde-pastel text-verde-musgo'
                              : 'bg-verde-limao text-verde-escuro'
                          }`}
                        >
                          {duvida.lida ? 'Lida' : 'Nova'}
                        </span>
                      </div>
                      <p className="text-xs text-verde-musgo">
                        {duvida.nomeCompleto} ({duvida.email}) •{' '}
                        {formatarDataHoraMovimentacao(duvida.createdAt)}
                      </p>
                      <p className="text-xs sm:text-sm text-verde-escuro line-clamp-2">
                        {duvida.mensagem}
                      </p>
                    </div>

                    <Link
                      href="/gestaoDuvidas"
                      className="shrink-0 self-start sm:self-center rounded-xl border border-verde-musgo px-3.5 py-1.5 text-xs font-bold text-verde-musgo hover:bg-verde-musgo hover:text-white transition"
                    >
                      Visualizar
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-6 py-8 text-center text-sm text-verde-musgo">
                Nenhuma dúvida recebida pelo formulário de contato até o momento.
              </p>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
