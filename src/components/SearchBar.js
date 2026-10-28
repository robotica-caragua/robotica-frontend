import { IoSearchSharp } from 'react-icons/io5'

export function SearchBar({ value, onChange, placeholder = 'Pesquisar por assunto...' }) {
  return (
    <div className="w-full">
      <div className="relative flex items-center w-full">
        <div className="absolute left-4 text-verde-musgo pointer-events-none">
          <IoSearchSharp size={20} className="text-verde-musgo" />
        </div>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full h-14 pl-12 pr-4 bg-white border border-verde-musgo rounded-lg text-verde-musgo placeholder-verde-musgo text-lg font-medium focus:outline-none"
        />
      </div>
    </div>
  )
}
