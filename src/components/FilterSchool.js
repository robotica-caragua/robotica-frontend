import { Select } from '@/components/Select'

export function FilterSchool({ value, onChange, options = [] }) {
  return (
    <div className="flex flex-col gap-1 w-full font-sans">
      <label htmlFor="escola" className="block text-verde-escuro text-xl font-medium">
        Escola
      </label>
      <Select
        id="escola"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-13 rounded-lg border-2 border-verde-musgo bg-white px-5 text-verde-musgo text-base font-normal focus:outline-none"
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
