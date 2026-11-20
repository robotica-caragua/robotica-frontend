import Image from 'next/image'
import bobIdeaImage from '@/assets/bobidea.png'

export function BobIdea() {
  return (
    <div className="relative hidden lg:flex justify-center w-full -mt-12 pointer-events-none select-none">
      <Image
        src={bobIdeaImage}
        alt="Mascote BioBot com ideia"
        width={600}
        height={600}
        className="w-[480px] xl:w-[540px] max-w-none h-auto object-contain -ml-4"
        priority
      />
    </div>
  )
}
