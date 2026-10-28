import { IoIosArrowDown } from 'react-icons/io'

export function Level({ value, onChange, options = ['Iniciante', 'Intermediário', 'Avançado'] }) {
  return (
    <div className="flex flex-col gap-1 w-full font-sans">
      <label htmlFor="filtro-nivel" className="block text-verde-escuro text-xl font-medium">
        Nível
      </label>

      <div className="relative">
        <select
          id="filtro-nivel"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-13 appearance-none rounded-lg border-2 border-verde-musgo bg-white px-6 text-verde-musgo text-base font-normal focus:outline-none pr-12 cursor-pointer"
        >
          <option value="">Todos os Níveis</option>
          {options.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-verde-musgo">
          <IoIosArrowDown className="text-verde-musgo text-xl" />
        </div>
      </div>
    </div>
  )
}
