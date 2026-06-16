import Link from 'next/link'
import { MdArrowForward } from 'react-icons/md'

export function CardEvento({ title, date, location }) {
  return (
    <div className="flex flex-col bg-input-bg rounded-lg p-4 w-[20rem] border-l-4 border-verde-musgo">
      <p className="text-sm text-verde-musgo mb-1">{date}</p>
      <h2 className="font-bold text-lg text-verde-escuro">{title}</h2>
      <p className="text-base text-verde-escuro mb-3">{location}</p>
      <Link
        href="#"
        className="mt-auto font-semibold text-base text-verde-musgo hover:underline flex items-center gap-1"
      >
        Ver Detalhes <MdArrowForward size={20} />
      </Link>
    </div>
  )
}
