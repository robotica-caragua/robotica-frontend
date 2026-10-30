'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io'
import { MdArrowForward } from 'react-icons/md'
import containerImage from '@/assets/container.png'

export function CardProjeto({
  imageUrl = containerImage,
  isHighlight = false,
  title = 'Projeto de Robótica',
  Category1,
  Category2,
  school,
  team,
  description = 'Descrição do projeto desenvolvido pelos alunos.',
  likes = 0,
  linkUrl = '/detalhesProjeto'
}) {
  const [curtido, setCurtido] = useState(false)
  const [totalCurtidas, setTotalCurtidas] = useState(likes)

  const alternarCurtida = () => {
    setTotalCurtidas((prev) => (curtido ? prev - 1 : prev + 1))
    setCurtido((prev) => !prev)
  }

  const autorOuEquipe = school || team || 'Escola Municipal BioBot'
  const categoriaBadge = Category1 || Category2 || (isHighlight ? 'Destaque' : 'Robótica')

  return (
    <article className="w-full rounded-2xl border border-stone-200 bg-white flex flex-col overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-[180px] w-full overflow-hidden bg-stone-100">
        <div className="absolute top-3 left-3 bg-verde-musgo text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 uppercase tracking-wider">
          {categoriaBadge}
        </div>
        <Image
          src={imageUrl || containerImage}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 sm:p-5 flex flex-col gap-2 flex-1">
        <p className="text-xs text-verde-musgo font-bold uppercase tracking-wider truncate">
          {autorOuEquipe}
        </p>
        <h3 className="text-base sm:text-lg font-bold text-verde-escuro uppercase leading-tight truncate">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 font-normal line-clamp-2">
          {description}
        </p>

        <div className="mt-auto pt-3 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={alternarCurtida}
            className="flex items-center gap-1.5 text-stone-500 hover:text-verde-musgo transition cursor-pointer"
          >
            {curtido ? (
              <IoIosHeart className="text-verde-musgo text-base" />
            ) : (
              <IoIosHeartEmpty className="text-stone-500 text-base" />
            )}
            <span className="text-xs font-normal">{totalCurtidas} curtidas</span>
          </button>

          <Link
            href={linkUrl}
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-verde-musgo hover:text-verde-escuro transition cursor-pointer"
          >
            <span>Ver Detalhes</span>
            <MdArrowForward size={14} />
          </Link>
        </div>
      </div>
    </article>
  )
}
