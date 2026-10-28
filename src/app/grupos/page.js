'use client'

import { useEffect, useState } from 'react'
import {
  MdAdd,
  MdAddCircleOutline,
  MdArrowForward,
  MdClose,
  MdFilterList,
  MdInfoOutline,
  MdOutlineNotifications,
  MdOutlineSettings,
  MdPerson
} from 'react-icons/md'
import { IoSearchSharp } from 'react-icons/io5'
import { IoIosArrowDown } from 'react-icons/io'
import { AdminSidebar } from '@/components/AdminSidebar'

const equipesIniciais = [
  {
    id: 1,
    name: 'Cibernéticos A',
    school: 'EMEF Prof. Luiz Ribeiro Muniz',
    students: 'Ana, Bruno, Carlos',
    grade: '8º Ano',
    active: true
  },
  {
    id: 2,
    name: 'Cibernéticos A',
    school: 'EMEF Prof. Luiz Ribeiro Muniz',
    students: 'Daniela, Eduardo, Fernanda',
    grade: '9º Ano',
    active: true
  },
  {
    id: 3,
    name: 'Cibernéticos A',
    school: 'EMEF Prof. Luiz Ribeiro Muniz',
    students: 'Gabriel, Helena, Igor',
    grade: '7º Ano',
    active: true
  },
  {
    id: 4,
    name: 'Cibernéticos A',
    school: 'EMEF Prof. Luiz Ribeiro Muniz',
    students: 'Julia, Lucas, Mariana',
    grade: '8º Ano',
    active: true
  }
]

export default function GestaoGruposPage() {
  const [equipes, setEquipes] = useState(equipesIniciais)
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [nomeEquipe, setNomeEquipe] = useState('')
  const [alunos, setAlunos] = useState('')
  const [serie, setSerie] = useState('')

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) return

    fetch(`${apiUrl}/equipes`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) setEquipes(data)
      })
      .catch(() => {})
  }, [])

  const equipesFiltradas = equipes.filter(
    (equipe) =>
      equipe.name.toLowerCase().includes(busca.toLowerCase()) ||
      equipe.students?.toLowerCase().includes(busca.toLowerCase())
  )

  function handleCriarEquipe(e) {
    e.preventDefault()
    if (!nomeEquipe.trim()) return

    const novaEquipe = {
      id: Date.now(),
      name: nomeEquipe,
      school: 'EMEF Prof. Luiz Ribeiro Muniz',
      students: alunos,
      grade: serie,
      active: true
    }

    setEquipes((prev) => [...prev, novaEquipe])
    setNomeEquipe('')
    setAlunos('')
    setSerie('')
    setModalAberto(false)
  }

  const totalFormatado = String(equipes.length).padStart(2, '0')

  return (
    <div className="flex min-h-screen">
      <AdminSidebar variant="professor" />

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

        <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 pt-10">
          {/* Cabeçalho */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xl font-bold text-verde-musgo">{totalFormatado}</p>
              <h1 className="text-4xl font-bold text-verde-escuro">Equipes Ativas</h1>
            </div>

            <button
              type="button"
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-3 rounded-lg bg-verde-musgo px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-90 cursor-pointer"
            >
              <MdAdd size={18} />
              Nova Equipe
            </button>
          </div>

          {/* Barra de busca e ordenação */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-verde-musgo bg-white px-4 py-3">
            <div className="flex flex-1 items-center gap-3">
              <IoSearchSharp className="text-xl text-verde-musgo" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar equipe ou aluno..."
                className="w-full bg-transparent text-sm text-verde-escuro placeholder-verde-musgo focus:outline-none"
              />
            </div>

            <button
              type="button"
              className="flex items-center gap-2 border-l border-verde-musgo/30 pl-5 text-xs font-bold uppercase text-verde-musgo hover:text-verde-escuro cursor-pointer"
            >
              <MdFilterList size={18} />
              Ordenar por mais recente
            </button>
          </div>

          {/* Grade de Equipes */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {equipesFiltradas.map((equipe) => (
              <div
                key={equipe.id}
                className="flex flex-col rounded-2xl border border-verde-musgo bg-white p-5"
              >
                <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-verde-oliva px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  Equipe Ativa
                </span>

                <div className="mt-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-verde-escuro">{equipe.name}</h3>
                  <MdInfoOutline size={20} className="text-verde-escuro" />
                </div>

                <div className="mt-3 mb-6 border-l-2 border-verde-musgo pl-3">
                  <p className="max-w-[11rem] text-xs leading-relaxed text-verde-musgo">
                    {equipe.school}
                  </p>
                </div>

                <button
                  type="button"
                  className="mx-auto mt-auto flex items-center justify-center gap-2 rounded-lg border border-b-3 border-verde-musgo bg-white px-5 py-2 text-xs font-bold text-verde-escuro hover:bg-verde-pastel cursor-pointer"
                >
                  Editar Equipe
                  <MdArrowForward size={15} />
                </button>
              </div>
            ))}

            {/* Card tracejado Criar Nova Equipe */}
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-verde-musgo bg-white/40 p-5 text-center">
              <MdAddCircleOutline size={36} className="text-verde-escuro" />
              <h3 className="mt-2 text-base font-bold text-verde-escuro">Criar Nova Equipe</h3>
              <p className="mt-1 mb-4 max-w-[13rem] text-xs leading-relaxed text-verde-musgo">
                Organize seus alunos em times de trabalho para desenvolver novos projetos.
              </p>
              <button
                type="button"
                onClick={() => setModalAberto(true)}
                className="rounded-lg border-b-3 border-verde-escuro bg-verde-limao px-5 py-2 text-xs font-bold text-verde-escuro hover:brightness-95 cursor-pointer"
              >
                Adicionar Equipe
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Nova Equipe */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-xl rounded-[36px] border border-verde-musgo bg-white p-10 shadow-xl">
            <button
              type="button"
              onClick={() => setModalAberto(false)}
              aria-label="Fechar modal"
              className="absolute top-8 right-8 text-verde-musgo hover:text-verde-escuro cursor-pointer"
            >
              <MdClose size={24} />
            </button>

            <h2 className="text-3xl font-bold text-verde-escuro">
              Nova <span className="text-verde-musgo">Equipe!</span>
            </h2>

            <form onSubmit={handleCriarEquipe} className="mt-6 flex flex-col gap-5">
              <div>
                <label className="mb-1.5 block text-base font-medium text-verde-escuro">
                  Nome da equipe
                </label>
                <input
                  type="text"
                  value={nomeEquipe}
                  onChange={(e) => setNomeEquipe(e.target.value)}
                  placeholder="Ex: Robôs do 8º Ano"
                  required
                  className="w-full rounded-lg border border-verde-musgo bg-input-bg px-4 py-3 text-sm text-verde-escuro placeholder-verde-musgo/70 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-base font-medium text-verde-escuro">
                  Alunos integrantes
                </label>
                <input
                  type="text"
                  value={alunos}
                  onChange={(e) => setAlunos(e.target.value)}
                  placeholder="Digite o nome dos alunos integrantes..."
                  className="w-full rounded-lg border border-verde-musgo bg-input-bg px-4 py-3 text-sm text-verde-escuro placeholder-verde-musgo/70 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-base font-medium text-verde-escuro">
                  Série
                </label>
                <div className="relative">
                  <select
                    value={serie}
                    onChange={(e) => setSerie(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-verde-musgo bg-input-bg px-4 py-3 pr-10 text-sm text-verde-musgo focus:outline-none cursor-pointer"
                  >
                    <option value="">Selecione a série...</option>
                    <option value="6º Ano">6º Ano</option>
                    <option value="7º Ano">7º Ano</option>
                    <option value="8º Ano">8º Ano</option>
                    <option value="9º Ano">9º Ano</option>
                  </select>
                  <IoIosArrowDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xl text-verde-musgo" />
                </div>
              </div>

              <button
                type="submit"
                className="mx-auto mt-3 rounded-xl border-b-4 border-verde-escuro bg-verde-limao px-6 py-2.5 text-sm font-bold text-verde-escuro hover:brightness-95 cursor-pointer"
              >
                Adicionar Equipe
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
