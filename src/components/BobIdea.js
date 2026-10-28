import Image from 'next/image'
import bobIdeaImage from '@/assets/bobidea.png'

export function BobIdea() {
  return (
    <div className="relative w-full h-112 mt-4">
      <Image src={bobIdeaImage} alt="Mascote BioBot com ideia" fill className="object-contain" />
    </div>
  )
}
