// Interpreta o link de vídeo salvo no tutorial (YouTube, Vimeo ou arquivo direto).
export function interpretarVideo(url) {
  const bruto = (url || '').trim()
  if (!bruto) return null

  const youtube = bruto.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i
  )
  if (youtube) return { tipo: 'embed', src: `https://www.youtube.com/embed/${youtube[1]}` }

  const vimeo = bruto.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  if (vimeo) return { tipo: 'embed', src: `https://player.vimeo.com/video/${vimeo[1]}` }

  if (/^https?:\/\//i.test(bruto) || bruto.startsWith('/')) return { tipo: 'arquivo', src: bruto }

  return null
}
