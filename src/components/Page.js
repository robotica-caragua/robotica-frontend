'use client'

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

export function Page({ currentPage = 1, totalPages = 1, onPageChange }) {
  const total = Math.max(totalPages, 1)
  const paginas = Array.from({ length: total }, (_, i) => i + 1)

  const irPara = (pagina) => onPageChange?.(Math.min(Math.max(pagina, 1), total))

  return (
    <div className="flex items-center justify-center gap-3 my-16 font-sans select-none">
      <button
        type="button"
        onClick={() => irPara(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
        className="text-verde-musgo hover:text-verde-escuro p-1 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <IoIosArrowBack size={18} />
      </button>

      {paginas.map((pagina) => (
        <button
          key={pagina}
          type="button"
          onClick={() => irPara(pagina)}
          aria-current={currentPage === pagina ? 'page' : undefined}
          className={`w-10 h-10 flex items-center justify-center text-base rounded-full transition-colors cursor-pointer ${
            currentPage === pagina
              ? 'bg-verde-oliva font-bold text-verde-escuro'
              : 'border border-verde-musgo font-normal text-verde-escuro hover:bg-verde-pastel/50'
          }`}
        >
          {pagina}
        </button>
      ))}

      <button
        type="button"
        onClick={() => irPara(currentPage + 1)}
        disabled={currentPage === total}
        aria-label="Próxima página"
        className="text-verde-escuro hover:text-verde-musgo p-1 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <IoIosArrowForward size={18} />
      </button>
    </div>
  )
}
