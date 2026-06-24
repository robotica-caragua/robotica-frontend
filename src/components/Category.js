import { IoIosArrowDown } from 'react-icons/io'

export function Category() {
  return (
    <div className="w-full max-w-xs ms-13 mt-10 font-sans">
      <label className="block text-verde-escuro text-xl ms-1 font-bold mb-2">Categoria</label>

      <div className="relative">
        <select className="w-full appearance-none rounded-2xl border-2 border-verde-musgo bg-white px-5 py-3 text-verde-musgo text-base focus:outline-none pr-12 cursor-pointer">
          <option>Todas as Categorias</option>
          <option>Eletrônica Básica</option>
          <option>Programação em Blocos(Scratch)</option>
          <option>Arduino e Automação(C++)</option>
          <option>Maker / Reciclagem(Sucata)</option>
        </select>

        <div className="pointer-events-none absolute inset-y-0  right-4 flex items-center text-verde-musgo">
          <IoIosArrowDown className="text-verde-musgo text-2xl" />
        </div>
      </div>
    </div>
  )
}
