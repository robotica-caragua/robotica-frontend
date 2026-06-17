import Image from 'next/image'
import containerImage from '../app/img/Container (1).png'
import { CiHeart } from "react-icons/ci";
import { MdArrowForwardIos } from "react-icons/md";

export function Card({ children }) {
  return (
    <div className="w-full max-w-xs rounded-3xl border border-verde-musgo bg-white shadow-sm">
       
      <div className="relative  rounded-t-3xl overflow-hidden">
        <div className="absolute top-3 left-3 bg-verde-musgo text-white text-xs font-medium px-3 py-1 rounded-full z-10">
            <p>Iniciante</p>
        </div>
        <Image
          src={containerImage}
          alt="Container"
          className="h-full w-full"
        />
      </div>

      <div className="px-4 py-4">
        {children}
        <p className="text-xs text-verde-musgo font-medium">Profª Edna Maria Nogueira Ferraz</p>
        <p className="text-lg font-semibold mt-1 text-verde-escuro">Braço Robótico de Papelão</p>
        <p className="text-sm text-gray-600 mt-2">Um braço robótico funcional construído
inteiramente com materiais recicláveis...</p>
        <hr className="border-t-1 border-verde-musgo my-3" />
        <div className="flex items-center ">
        <CiHeart className="text-verde-musgo text-2xl" />
        <p className="text-sm text-verde-musgo font-medium ml-1">128 Curtidas</p>
        <p className="text-sm text-verde-musgo font-medium ml-16">Ver tutorial</p>
        <MdArrowForwardIos className="text-verde-musgo text-2xl ml-1" />
        </div>
      </div>
    </div>
  )
}
