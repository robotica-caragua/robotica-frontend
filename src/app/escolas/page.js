'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { MdAdd, MdAddCircleOutline } from 'react-icons/md'
import { IoSearchSharp } from 'react-icons/io5'
import { IoIosArrowDown } from 'react-icons/io'
import { AdminSidebar } from '@/components/AdminSidebar'
import { CardEscolaAdmin } from '@/components/CardEscolaAdmin'
import { apiEscolas, apiProjetos, apiUsuarios } from '@/services/api'
import { correspondeBusca } from '@/utils/filtros'

function Filtro({ label, value, onChange, children }) {
  return (
    <label className="flex flex-col border-l border-verde-musgo/20 pl-6">
      <span className="text-xs font-bold uppercase text-verde-escuro">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="appearance-none bg-transparent pr-14 text-sm text-verde-musgo focus:outline-none cursor-pointer"
        >
          {children}
        </select>
        <IoIosArrowDown className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-verde-musgo" />
      </div>
    </label>
  )
}

export default function GestaoEscolas() {
  const [escolas, setEscolas] = useState([])
  const [totalDocentes, setTotalDocentes] = useState(0)
  const [totalProjetos, setTotalProjetos] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')
  const [regiaoSelecionada, setRegiaoSelecionada] = useState('')
  const [statusSelecionado, setStatusSelecionado] = useState('Ativas')

  useEffect(() => {
    let ativo = true

    Promise.all([
      apiEscolas.listar().catch(() => []),
      apiUsuarios.listar().catch(() => []),
      apiProjetos.listar().catch(() => [])
    ])
      .then(([listaEscolas, listaUsuarios, listaProjetos]) => {
        if (!ativo) return

        const projsPorEscola = new Map()
        for (const p of Array.isArray(listaProjetos) ? listaProjetos : []) {
          const sid = p.schoolId || p.school?.id
          if (sid) projsPorEscola.set(sid, (projsPorEscola.get(sid) || 0) + 1)
        }

        setEscolas(
          (Array.isArray(listaEscolas) ? listaEscolas : []).map((item) => ({
            id: item.id,
            name: item.name,
            address: item.address || '',
            createdAt: item.createdAt,
            region: item.address?.toUpperCase().includes('SUL')
              ? 'Sul'
              : item.address?.toUpperCase().includes('CENTRO')
                ? 'Centro'
                : 'Norte',
            teams: projsPorEscola.get(item.id) || 0
          }))
        )

        setTotalDocentes(Array.isArray(listaUsuarios) ? listaUsuarios.length : 0)
        setTotalProjetos(Array.isArray(listaProjetos) ? listaProjetos.length : 0)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  const escolasFiltradas = useMemo(
    () =>
      escolas.filter((escola) => {
        const matchBusca = correspondeBusca(busca, escola.name, escola.region, escola.address)
        const matchRegiao = !regiaoSelecionada || `Região ${escola.region}` === regiaoSelecionada
        return matchBusca && matchRegiao
      }),
    [busca, escolas, regiaoSelecionada]
  )

  const handleExcluirEscola = async (id, nome) => {
    if (!window.confirm(`Deseja realmente excluir a escola "${nome}"?`)) return
    try {
      await apiEscolas.excluir(id)
      setEscolas((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      window.alert(err?.message || 'Não foi possível excluir a escola.')
    }
  }

  const estatisticas = [
    { label: 'Total de Escolas', value: escolas.length },
    { label: 'Corpo Docente', value: totalDocentes },
    { label: 'Projetos na Rede', value: totalProjetos }
  ]

  const atividadesRecentes = escolas.slice(0, 3)

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <AdminSidebar />

      <div className="flex flex-1 flex-col px-4 sm:px-6 lg:px-10 pb-16">
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 pt-6 sm:pt-12">
          {/* Título da página */}
          <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-verde-escuro">
                Gestão de Escolas
              </h1>
              <p className="mt-1 max-w-sm text-sm sm:text-base text-verde-musgo">
                Administre as unidades da rede conectadas ao sistema.
              </p>
            </div>
            <Link
              href="/cadastrarEscola"
              className="flex items-center gap-3 rounded-md bg-verde-musgo px-7 py-2.5 font-semibold text-white shadow-sm hover:brightness-90 cursor-pointer"
            >
              <MdAdd size={18} />
              Nova Escola
            </Link>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {estatisticas.map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-verde-musgo bg-white px-5 py-5">
                <p className="text-sm font-medium text-verde-musgo">{label}</p>
                <p className="mt-2 text-3xl font-bold text-verde-escuro">{value}</p>
              </div>
            ))}
          </div>

          {/* Busca e filtros */}
          <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-b-4 border-verde-musgo bg-white px-5 py-4">
            <div className="flex flex-1 items-center gap-3">
              <IoSearchSharp className="text-xl text-verde-musgo" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar pelo nome da escola..."
                className="w-full bg-transparent text-sm text-verde-escuro placeholder-verde-musgo focus:outline-none"
              />
            </div>
            <Filtro
              label="Região"
              value={regiaoSelecionada}
              onChange={(e) => setRegiaoSelecionada(e.target.value)}
            >
              <option value="">Todas as Regiões</option>
              <option value="Região Norte">Região Norte</option>
              <option value="Região Sul">Região Sul</option>
              <option value="Região Centro">Região Centro</option>
            </Filtro>
            <Filtro
              label="Status"
              value={statusSelecionado}
              onChange={(e) => setStatusSelecionado(e.target.value)}
            >
              <option value="Ativas">Ativas</option>
              <option value="Inativas">Inativas</option>
            </Filtro>
          </div>

          {/* Atividade recente */}
          <section className="rounded-2xl border border-verde-musgo bg-white px-8 py-6">
            <h2 className="mb-5 text-xl font-bold text-verde-escuro">Atividade Recente</h2>
            {atividadesRecentes.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {atividadesRecentes.map((esc) => (
                  <li key={esc.id} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-verde-musgo" />
                    <div>
                      <p className="text-sm font-bold text-verde-escuro">
                        Unidade registrada: {esc.name}
                      </p>
                      <p className="text-xs text-verde-musgo">
                        {esc.createdAt
                          ? new Date(esc.createdAt).toLocaleDateString('pt-BR')
                          : 'Recente'}{' '}
                        • {esc.address || `Região ${esc.region}`}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-verde-musgo">Nenhuma atividade recente encontrada.</p>
            )}
          </section>

          {/* Escolas */}
          {carregando ? (
            <p className="py-10 text-center text-verde-musgo font-medium">Carregando escolas...</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {escolasFiltradas.map((escola) => (
                <CardEscolaAdmin key={escola.id} {...escola} onExcluir={handleExcluirEscola} />
              ))}

              <Link
                href="/cadastrarEscola"
                className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-verde-musgo bg-white/50 text-verde-musgo hover:bg-verde-pastel cursor-pointer transition"
              >
                <MdAddCircleOutline size={36} />
                <span className="text-sm font-bold">Registrar Nova Escola</span>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
