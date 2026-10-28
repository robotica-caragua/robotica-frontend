'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import containerImage from '@/assets/container.png'
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io'
import { MdArrowForward } from 'react-icons/md'

export function Card({
  children,
  imageUrl = containerImage,
  level = 'Iniciante',
  author = 'Profª Edna Maria Nogueira Ferraz',
  title = 'Braço Robótico de Papelão',
  description = 'Um braço robótico funcional construído inteiramente com materiais recicláveis e…',
  likes = 124,
  linkUrl = '/detalhesTutorial'
}) {
  const [curtido, setCurtido] = useState(false)
  const [totalCurtidas, setTotalCurtidas] = useState(likes)

  const alternarCurtida = () => {
    setTotalCurtidas((atual) => (curtido ? atual - 1 : atual + 1))
    setCurtido((atual) => !atual)
  }

  return (
    <article className="w-full max-w-[312px] rounded-[10px] border border-[#C4C9AC] bg-white flex flex-col overflow-hidden">
      <div className="relative h-[180px] w-full overflow-hidden">
        <div className="absolute top-3 left-3 bg-verde-musgo text-white text-[10px] font-medium px-2.5 py-1 rounded-full z-10">
          {level}
        </div>
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>

      <div className="p-[19px] flex flex-col gap-[11px] flex-1">
        {children}
        <p className="text-xs text-verde-musgo font-medium uppercase truncate">{author}</p>
        <h3 className="text-lg font-semibold text-verde-escuro uppercase leading-tight truncate">
          {title}
        </h3>
        <p className="text-sm text-verde-escuro font-normal line-clamp-2">{description}</p>

        <div className="mt-auto pt-2.5 border-t border-[#C3CAAD] flex items-center justify-between">
          <button
            type="button"
            onClick={alternarCurtida}
            className="flex items-center gap-1 text-[#434933] hover:opacity-80 transition cursor-pointer"
          >
            {curtido ? (
              <IoIosHeart className="text-verde-musgo text-base" />
            ) : (
              <IoIosHeartEmpty className="text-[#434933] text-base" />
            )}
            <span className="text-xs font-normal">{totalCurtidas} curtidas</span>
          </button>

          <Link
            href={linkUrl}
            className="flex items-center gap-1 text-sm text-[#4C6700] font-bold hover:underline"
          >
            Ver Detalhes
            <MdArrowForward size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}
