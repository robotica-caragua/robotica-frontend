import Link from 'next/link'
import {
  MdOutlineSchool,
  MdOutlineDelete,
  MdOutlineBlock,
  MdOutlineCheckCircle
} from 'react-icons/md'

export function CardEscolaAdmin({
  id,
  name,
  region,
  teams,
  ativo = true,
  hrefDetalhes,
  onExcluir,
  onAlternarStatus,
  onVerMais
}) {
  const linkDestino = hrefDetalhes || (id ? `/admin/escolas/${id}` : null)

  return (
    <div
      className={`flex flex-col rounded-2xl border border-verde-musgo bg-white p-5 transition ${
        !ativo ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="rounded-md bg-verde-pastel p-2 text-verde-musgo">
          <MdOutlineSchool size={24} />
        </div>
        <span
          className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase ${
            ativo ? 'bg-verde-limao text-verde-escuro' : 'bg-vermelho text-white'
          }`}
        >
          {ativo ? 'Polo Ativo' : 'Polo Inativo'}
        </span>
      </div>

      <h3 className="mt-4 max-w-[14rem] text-lg font-bold leading-snug text-verde-escuro">
        {name}
      </h3>
      <p className="mt-1 mb-6 text-xs font-medium text-verde-musgo">
        Região {region} • {teams} equipes
      </p>

      <div className="mt-auto flex items-center gap-3 border-t border-verde-escuro/10 pt-4">
        {linkDestino && !onVerMais ? (
          <Link
            href={linkDestino}
            className="flex-1 rounded-md border border-verde-musgo py-1.5 text-center text-sm font-bold text-verde-escuro hover:bg-verde-musgo hover:text-white transition cursor-pointer"
          >
            Ver Mais
          </Link>
        ) : (
          <button
            type="button"
            onClick={onVerMais}
            className="flex-1 rounded-md border border-verde-musgo py-1.5 text-center text-sm font-bold text-verde-escuro hover:bg-verde-musgo hover:text-white transition cursor-pointer"
          >
            Ver Mais
          </button>
        )}
        {onAlternarStatus && (
          <button
            type="button"
            onClick={() => onAlternarStatus(id, name, ativo)}
            title={ativo ? 'Inativar escola' : 'Reativar escola'}
            aria-label={ativo ? `Inativar ${name}` : `Reativar ${name}`}
            className={`p-1 transition cursor-pointer ${
              ativo ? 'text-vermelho hover:opacity-75' : 'text-verde-musgo hover:text-verde-escuro'
            }`}
          >
            {ativo ? <MdOutlineBlock size={19} /> : <MdOutlineCheckCircle size={19} />}
          </button>
        )}
        <button
          type="button"
          onClick={() => onExcluir?.(id, name)}
          title="Excluir escola"
          aria-label={`Excluir ${name}`}
          className="p-1 text-verde-musgo hover:text-vermelho transition cursor-pointer"
        >
          <MdOutlineDelete size={19} />
        </button>
      </div>
    </div>
  )
}
