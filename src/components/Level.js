import { Select } from '@/components/Select'

export function Level({ value, onChange, options = ['Iniciante', 'Intermediário', 'Avançado'] }) {
  return (
    <div className="flex flex-col gap-1 w-full font-sans">
      <label htmlFor="filtro-nivel" className="block text-verde-escuro text-xl font-medium">
        Nível
      </label>

      <Select
        id="filtro-nivel"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-13 rounded-lg border-2 border-verde-musgo bg-white px-5 text-verde-musgo text-base font-normal focus:outline-none"
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
