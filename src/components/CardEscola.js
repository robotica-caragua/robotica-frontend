import Link from 'next/link'
import { RxExternalLink } from 'react-icons/rx'
import { FaLocationDot } from 'react-icons/fa6'
import { MdArrowForward } from 'react-icons/md'

export function CardEscola({ name, location, linkUrl }) {
  const urlMapa =
    linkUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${name} ${location || 'Caraguatatuba SP'}`
    )}`

  return (
    <div className="flex flex-col bg-white rounded-2xl p-6 sm:p-10 w-full max-w-md border-b-5 dark:border-b border border-verde-musgo gap-6 justify-center items-center shadow-xs">
      <h3 className="font-bold text-xl sm:text-2xl text-verde-escuro border-b-2 border-verde-escuro/5 dark:border-verde-oliva/25 min-h-18 flex items-center text-center">
        {name}
      </h3>

      <a
        href={urlMapa}
        target="_blank"
        rel="noopener noreferrer"
        title="Abrir endereço no Google Maps"
        className="group text-sm sm:text-base text-verde-escuro dark:text-verde-oliva pb-6 border-b-2 border-verde-escuro/5 dark:border-verde-oliva/25 flex items-center gap-4 sm:gap-5 w-full cursor-pointer"
      >
        <FaLocationDot
          size={50}
          className="shrink-0 transition-transform group-hover:scale-105 bg-input-bg dark:bg-[#001B0D] dark:border dark:border-verde-oliva text-verde-musgo p-3 rounded-[20%]"
        />
        <span className="leading-snug group-hover:text-verde-musgo group-hover:underline transition-colors flex-1">
          {location}
        </span>
        <RxExternalLink
          size={18}
          className="shrink-0 text-verde-musgo/70 group-hover:text-verde-musgo transition-colors"
        />
      </a>

      <Link
        href={`/projetos?escola=${encodeURIComponent(name)}`}
        className="btn-card-escola group w-[85%] sm:w-[75%] rounded-xl bg-verde-limao dark:bg-[#001B0D] border-2 dark:border border-verde-limao dark:border-verde-oliva hover:bg-white dark:hover:bg-verde-limao hover:border-verde-musgo hover:text-verde-musgo dark:hover:text-[#001B0D] text-verde-escuro dark:text-verde-limao p-3 mt-auto font-bold text-sm sm:text-base justify-center flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md shadow-2xs"
      >
        <span>Conheça os Projetos</span>
        <MdArrowForward
          size={20}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </Link>
    </div>
  )
}
