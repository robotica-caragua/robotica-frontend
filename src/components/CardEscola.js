import Link from 'next/link'
import { RxExternalLink } from 'react-icons/rx'
import { FaLocationDot } from 'react-icons/fa6'

export function CardEscola({ name, location, linkUrl }) {
  return (
    <div className="flex flex-col bg-white rounded-2xl p-10 w-md border-b-5 border border-verde-musgo gap-6 justify-center items-center">
      <h1 className="font-bold text-2xl text-verde-escuro border-b-2 border-verde-escuro/5 h-18">
        {name}
      </h1>
      <p className="text-base text-verde-escuro pb-6 border-b-2 border-verde-escuro/5 flex items-center gap-5">
        {' '}
        <FaLocationDot
          size={60}
          style={{
            backgroundColor: 'var(--input-bg)',
            padding: '15px',
            borderRadius: '20%',
            color: 'var(--verde-musgo)'
          }}
        />{' '}
        {location}
      </p>

      <Link
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-[75%] rounded-xl bg-verde-limao p-3 mt-auto font-semibold text-base justify-center text-verde-escuro hover:underline flex items-center gap-5"
      >
        Ver no Google Maps <RxExternalLink size={20} />
      </Link>
    </div>
  )
}
