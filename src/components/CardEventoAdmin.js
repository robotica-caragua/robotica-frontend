import { MdOutlineEdit, MdClose, MdOutlineCalendarToday, MdOutlineGroups } from 'react-icons/md'
import { Label } from './Label'

export function CardEventoAdmin({ icone: Icone, title, date, info, status, onEdit, onDelete }) {
  return (
    <div className="flex flex-col gap-4 bg-white rounded-2xl p-5 border-2 border-verde-oliva shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-full bg-verde-pastel text-verde-escuro">
          {Icone && <Icone size={20} />}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            title="Editar"
            aria-label={`Editar ${title}`}
            className="flex size-7 items-center justify-center rounded-full bg-verde-pastel text-verde-escuro hover:bg-verde-oliva transition cursor-pointer"
          >
            <MdOutlineEdit size={14} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Excluir"
            aria-label={`Excluir ${title}`}
            className="flex size-7 items-center justify-center rounded-full bg-verde-pastel text-verde-escuro hover:bg-vermelho hover:text-white transition cursor-pointer"
          >
            <MdClose size={14} />
          </button>
        </div>
      </div>

      <h3 className="text-verde-escuro text-lg font-medium leading-snug">{title}</h3>

      <div className="flex flex-col gap-1.5 text-verde-escuro text-xs">
        <span className="flex items-center gap-2">
          <MdOutlineCalendarToday size={14} /> {date}
        </span>
        <span className="flex items-center gap-2">
          <MdOutlineGroups size={14} /> {info}
        </span>
      </div>

      <hr className="border-verde-musgo/20" />

      <Label>
        <span className="text-[10px] font-bold uppercase tracking-wide text-verde-escuro">
          {status}
        </span>
      </Label>
    </div>
  )
}
