import {
  MdAdd,
  MdAddCircleOutline,
  MdOutlineNotifications,
  MdOutlineSettings,
  MdPerson
} from 'react-icons/md'
import { IoSearchSharp } from 'react-icons/io5'
import { IoIosArrowDown } from 'react-icons/io'
import { AdminSidebar } from '@/components/AdminSidebar'
import { CardEscolaAdmin } from '@/components/CardEscolaAdmin'

// Dados fictícios
const escolas = [
  { id: 1, name: 'EMEF Prof. Luiz Ribeiro Muniz', region: 'Norte', teams: 12 },
  { id: 2, name: 'Colégio Municipal São José', region: 'Norte', teams: 8 },
  { id: 3, name: 'Colégio Municipal São José', region: 'Norte', teams: 8 },
  { id: 4, name: 'Colégio Municipal São José', region: 'Norte', teams: 8 }
]

const estatisticas = [
  { label: 'Total de Escolas', value: 4 },
  { label: 'Corpo Docente', value: 20 },
  { label: 'Alunos', value: 504 }
]

const atividades = ['Há 2 horas', 'Há 5 horas', 'Há 8 horas']

function Filtro({ label, children }) {
  return (
    <label className="flex flex-col border-l border-verde-musgo/20 pl-6">
      <span className="text-xs font-bold uppercase text-verde-escuro">{label}</span>
      <div className="relative">
        <select className="appearance-none bg-transparent pr-14 text-sm text-verde-musgo focus:outline-none cursor-pointer">
          {children}
        </select>
        <IoIosArrowDown className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-verde-musgo" />
      </div>
    </label>
  )
}

export default function GestaoEscolas() {
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

        <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 pt-10">
          {/* Título da página */}
          <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-verde-escuro">Gestão de Escolas</h1>
              <p className="mt-1 max-w-sm text-verde-musgo">
                Administre as unidades da rede conectadas ao sistema.
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-3 rounded-md bg-verde-musgo px-7 py-2.5 font-semibold text-white shadow-sm hover:brightness-90 cursor-pointer"
            >
              <MdAdd size={18} />
              Nova Escola
            </button>
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
                placeholder="Buscar pelo nome da escola..."
                className="w-full bg-transparent text-sm text-verde-escuro placeholder-verde-musgo focus:outline-none"
              />
            </div>
            <Filtro label="Região">
              <option>Todas as Regiões</option>
              <option>Região Norte</option>
              <option>Região Sul</option>
              <option>Região Leste</option>
            </Filtro>
            <Filtro label="Status">
              <option>Ativas</option>
              <option>Inativas</option>
            </Filtro>
          </div>

          {/* Atividade recente */}
          <section className="rounded-2xl border border-verde-musgo bg-white px-8 py-6">
            <h2 className="mb-5 text-xl font-bold text-verde-escuro">Atividade Recente</h2>
            <ul className="flex flex-col gap-4">
              {atividades.map((tempo) => (
                <li key={tempo} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-verde-musgo" />
                  <div>
                    <p className="text-sm font-bold text-verde-escuro">Novo registro: Polo Leste</p>
                    <p className="text-xs text-verde-musgo">{tempo} por Admin System</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Escolas */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {escolas.map((escola) => (
              <CardEscolaAdmin key={escola.id} {...escola} />
            ))}

            <button
              type="button"
              className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-verde-musgo bg-white/50 text-verde-musgo hover:bg-verde-pastel cursor-pointer"
            >
              <MdAddCircleOutline size={36} />
              <span className="text-sm font-bold">Registrar Nova Escola</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
