import Link from 'next/link'
import { MdArrowForward } from 'react-icons/md'

export function CardEvento({ title, date, location, linkUrl }) {
  return (
    <div className="flex flex-col bg-input-bg rounded-xl dark:rounded-2xl p-4 sm:p-5 w-full sm:w-[19rem] max-w-full border-l-4 dark:border dark:border-l border-verde-musgo dark:border-verde-oliva shadow-2xs">
      <p className="text-xs text-verde-musgo dark:text-verde-oliva font-semibold uppercase tracking-wide mb-1">
        {date}
      </p>
      <h3 className="font-bold text-base text-verde-escuro line-clamp-2 mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-stone-600 dark:text-verde-oliva mb-3.5 line-clamp-1">
        {location}
      </p>
      <Link
        href={linkUrl}
        className="mt-auto font-semibold text-xs sm:text-sm text-verde-musgo hover:underline dark:no-underline dark:border dark:border-verde-oliva dark:rounded-lg dark:px-3.5 dark:py-1.5 dark:w-fit dark:hover:bg-verde-limao dark:hover:text-[#001B0D] transition flex items-center gap-1.5"
      >
        <span>Ver Detalhes</span>
        <MdArrowForward size={16} />
      </Link>
    </div>
  )
}
