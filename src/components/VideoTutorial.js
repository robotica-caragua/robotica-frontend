'use client'

import { useState } from 'react'
import { interpretarVideo } from '@/utils/video'

export function VideoTutorial({ url, titulo }) {
  const video = interpretarVideo(url)
  const [falhou, setFalhou] = useState(false)

  if (!video || falhou) {
    return (
      <div className="w-full aspect-video rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center px-6 text-center">
        <p className="text-stone-500 text-sm">
          {video
            ? 'Não foi possível carregar o vídeo deste tutorial.'
            : 'Este tutorial ainda não possui vídeo.'}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
      {video.tipo === 'embed' ? (
        <iframe
          src={video.src}
          title={titulo || 'Vídeo do tutorial'}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          key={video.src}
          src={video.src}
          className="w-full h-full object-contain"
          controls
          playsInline
          preload="metadata"
          onError={() => setFalhou(true)}
        >
          Seu navegador não suporta a tag de vídeo.
        </video>
      )}
    </div>
  )
}
