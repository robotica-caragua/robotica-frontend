import { IoIosArrowDown } from "react-icons/io";

export function Level() {
  return (
    <div className="w-full max-w-xs ms-13 mt-4 font-sans">
      <label className="block text-verde-escuro text-xl ms-1 font-bold mb-2">
        Nível
      </label>
      
      <div className="relative">
        <select className="w-full appearance-none rounded-2xl border-2 border-verde-musgo bg-white px-5 py-3 text-verde-musgo text-base focus:outline-none pr-12 cursor-pointer">
          <option>Todos os Níveis</option>
          <option>Iniciante</option>
          <option>Intermediário</option>
          <option>Avançado</option>
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-verde-musgo">
          <IoIosArrowDown className="text-verde-musgo text-2xl" />
        </div>
      </div>
    </div>
  )
}