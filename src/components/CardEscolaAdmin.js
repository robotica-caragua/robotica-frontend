import Link from 'next/link'
import { MdOutlineSchool, MdOutlineDelete } from 'react-icons/md'

export function CardEscolaAdmin({ name, region, teams }) {
  return (
    <div className="flex flex-col rounded-2xl border border-verde-musgo bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="rounded-md bg-verde-pastel p-2 text-verde-musgo">
          <MdOutlineSchool size={24} />
        </div>
        <span className="rounded-full bg-verde-limao px-3 py-0.5 text-[10px] font-bold uppercase text-verde-escuro">
          Polo Ativo
        </span>
      </div>

      <h3 className="mt-4 max-w-[14rem] text-lg font-bold leading-snug text-verde-escuro">
        {name}
      </h3>
      <p className="mt-1 mb-6 text-xs font-medium text-verde-musgo">
        Região {region} • {teams} equipes
      </p>

      <div className="mt-auto flex items-center gap-4 border-t border-verde-escuro/10 pt-4">
        <Link
          href="#"
          className="flex-1 rounded-md border border-verde-musgo py-1.5 text-center text-sm font-bold text-verde-escuro hover:bg-verde-musgo hover:text-white"
        >
          Ver Mais
        </Link>
        <button
          type="button"
          aria-label={`Excluir ${name}`}
          className="text-verde-musgo hover:text-vermelho cursor-pointer"
        >
          <MdOutlineDelete size={18} />
        </button>
      </div>
    </div>
  )
}
