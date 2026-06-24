import Image from 'next/image'
import bobIdeaImage from '../app/img/bobidea.png'

export function BobIdea() {
  return (
    <div className="relative w-full h-140 mt-4 overflow-hidden">
      <Image
        src={bobIdeaImage}
        alt="Imagem bob"
        fill
        className="object-cover rounded-2xl"
      />
    </div>
  )
}