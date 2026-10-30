import Link from 'next/link'
import { MdArrowForward } from 'react-icons/md'

export function CardEvento({ title, date, location, linkUrl }) {
  return (
    <div className="flex flex-col bg-input-bg rounded-xl p-4 w-full sm:w-[19rem] max-w-full border-l-4 border-verde-musgo shadow-2xs">
      <p className="text-xs text-verde-musgo font-medium mb-1">{date}</p>
      <h3 className="font-bold text-base text-verde-escuro line-clamp-1 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-stone-600 mb-3 line-clamp-1">{location}</p>
      <Link
        href={linkUrl}
        className="mt-auto font-semibold text-xs sm:text-sm text-verde-musgo hover:underline flex items-center gap-1"
      >
        <span>Ver Detalhes</span>
        <MdArrowForward size={16} />
      </Link>
    </div>
  )
}
