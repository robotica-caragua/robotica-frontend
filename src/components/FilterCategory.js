import { IoIosArrowDown } from 'react-icons/io'

export function FilterCategory() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor="categoria"
        className="text-verde-escuro text-xl font-medium tracking-wide ml-1"
      >
        Categoria
      </label>
      <div className="relative">
        <select
          id="categoria"
          className="w-full appearance-none bg-white text-verde-musgo text-base font-normal px-4 py-3 rounded-lg outline outline-2 outline-offset-[-2px] outline-verde-musgo cursor-pointer"
        >
          <option value="todas">Todas as Categorias</option>
          <option value="arduino">Arduino</option>
          <option value="smart-city">Smart City</option>
          <option value="iot">IoT</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-verde-musgo">
          <IoIosArrowDown size={24} />
        </div>
      </div>
    </div>
  )
}
