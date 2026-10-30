import Link from 'next/link'
import { RxExternalLink } from 'react-icons/rx'
import { FaLocationDot } from 'react-icons/fa6'

export function CardEscola({ name, location, linkUrl }) {
  return (
    <div className="flex flex-col bg-white rounded-2xl p-6 sm:p-10 w-full max-w-md border-b-5 border border-verde-musgo gap-6 justify-center items-center shadow-xs">
      <h1 className="font-bold text-xl sm:text-2xl text-verde-escuro border-b-2 border-verde-escuro/5 min-h-18 flex items-center text-center">
        {name}
      </h1>
      <p className="text-sm sm:text-base text-verde-escuro pb-6 border-b-2 border-verde-escuro/5 flex items-center gap-4 sm:gap-5 w-full">
        <FaLocationDot
          size={50}
          className="shrink-0"
          style={{
            backgroundColor: 'var(--input-bg)',
            padding: '12px',
            borderRadius: '20%',
            color: 'var(--verde-musgo)'
          }}
        />
        <span className="leading-snug">{location}</span>
      </p>

      <Link
        href={linkUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="w-[85%] sm:w-[75%] rounded-xl bg-verde-limao p-3 mt-auto font-semibold text-sm sm:text-base justify-center text-verde-escuro hover:underline flex items-center gap-3 sm:gap-4 transition"
      >
        <span>Ver no Google Maps</span>
        <RxExternalLink size={20} />
      </Link>
    </div>
  )
}
