'use client'

import Image from 'next/image'
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io'
import { MdArrowForwardIos } from 'react-icons/md'
import Link from 'next/link'
import { useState } from 'react'

export function CardProjeto({
  imageUrl,
  isHighlight,
  title,
  Category1,
  Category2,
  school,
  team,
  description,
  likes,
  linkUrl
}) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(likes)

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(likesCount - 1)
      setIsLiked(false)
    } else {
      setLikesCount(likesCount + 1)
      setIsLiked(true)
    }
  }

  return (
    <article className="w-full max-w-[400px] bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-verde-musgo inline-flex flex-col justify-start items-start overflow-hidden">
      <div className="self-stretch h-48 relative flex flex-col justify-center items-start overflow-hidden">
        {imageUrl && (
          <Image src={imageUrl} alt={`Foto do projeto ${title}`} fill className="object-cover" />
        )}

        {isHighlight && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-verde-limao rounded-xl backdrop-blur-[2px] flex flex-col justify-center items-center z-10">
            <div className="justify-center text-verde-musgo text-base font-normal">Em Destaque</div>
          </div>
        )}
      </div>

      <div className="self-stretch p-6 flex flex-col justify-start items-start gap-3">
        <div className="self-stretch inline-flex justify-start items-start gap-1">
          <div className="self-stretch px-3 py-0.5 bg-input-bg rounded-xl inline-flex flex-col justify-start items-start">
            <div className="justify-center text-verde-musgo text-xs font-normal">{Category1}</div>
          </div>
          <div className="self-stretch px-3 py-0.5 bg-input-bg rounded-xl inline-flex flex-col justify-start items-start">
            <div className="justify-center text-verde-musgo text-xs font-normal">{Category2}</div>
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-start items-start gap-1">
          <div className="self-stretch flex flex-col justify-start items-start">
            <div className="self-stretch justify-center text-verde-escuro text-2xl font-semibold">
              {title}
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start">
            <div className="self-stretch justify-center text-verde-escuro text-sm font-semibold">
              {school} • {team}
            </div>
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-start items-start overflow-hidden">
          <div className="self-stretch line-clamp-2 justify-center text-verde-escuro text-base font-normal">
            {description}
          </div>
        </div>

        <div className="self-stretch pt-6 border-t border-stone-300 inline-flex justify-between items-center w-full">
          <div className="flex justify-start items-center gap-1">
            <button
              className="inline-flex flex-col justify-start items-start cursor-pointer hover:scale-110 transition-transform"
              onClick={handleLike}
            >
              {isLiked ? (
                <IoIosHeart className="text-verde-musgo text-2xl" />
              ) : (
                <IoIosHeartEmpty className="text-verde-musgo text-2xl" />
              )}
            </button>

            <div className="inline-flex flex-col justify-start items-start">
              <div className="justify-center text-verde-musgo text-base font-normal">
                {likesCount}
              </div>
            </div>
          </div>

          <div className="flex justify-start items-center gap-1 hover:opacity-80 transition-opacity">
            <Link
              href={linkUrl}
              className="text-center justify-center text-verde-musgo text-base font-bold"
            >
              Ver Detalhes
            </Link>

            <div className="inline-flex flex-col justify-start items-center">
              <MdArrowForwardIos className="text-verde-musgo text-lg ml-1" />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
