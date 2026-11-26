import { Select } from '@/components/Select'

export function FilterSchool({ value, onChange, options = [] }) {
  return (
    <div className="flex flex-col gap-1.5 w-full font-sans">
      <label
        htmlFor="escola"
        className="block text-verde-escuro text-xs sm:text-sm font-bold uppercase tracking-wider"
      >
        Escola
      </label>
      <Select
        id="escola"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-11 sm:h-12 rounded-xl border border-verde-musgo bg-white px-4 text-verde-escuro text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-verde-musgo/30"
      >
        <option value="">Todas as Unidades</option>
        {options.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </Select>
    </div>
  )
}
