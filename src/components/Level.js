import { Select } from '@/components/Select'

export function Level({ value, onChange, options = ['Iniciante', 'Intermediário', 'Avançado'] }) {
  return (
    <div className="flex flex-col gap-1.5 w-full font-sans">
      <label
        htmlFor="filtro-nivel"
        className="block text-verde-escuro text-xs sm:text-sm font-bold uppercase tracking-wider"
      >
        Nível
      </label>

      <Select
        id="filtro-nivel"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-11 sm:h-12 rounded-xl border border-verde-musgo bg-white px-4 text-verde-escuro text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-verde-musgo/30"
      >
        <option value="">Todos os Níveis</option>
        {options.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </Select>
    </div>
  )
}
