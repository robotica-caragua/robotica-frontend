import { Select } from '@/components/Select'

export function Category({ value, onChange, options = [] }) {
  return (
    <div className="flex flex-col gap-1.5 w-full font-sans">
      <label
        htmlFor="filtro-categoria"
        className="block text-verde-escuro text-xs sm:text-sm font-bold uppercase tracking-wider"
      >
        Categoria
      </label>

      <Select
        id="filtro-categoria"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-11 sm:h-12 rounded-xl border border-verde-musgo bg-white px-4 text-verde-escuro text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-verde-musgo/30"
      >
        <option value="">Todas as Categorias</option>
        {options.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </Select>
    </div>
  )
}
