import { IoSearchSharp } from 'react-icons/io5'

export function SearchBar({ value, onChange, placeholder = 'Pesquisar por assunto...' }) {
  return (
    <div className="w-full">
      <div className="relative flex items-center w-full">
        <div className="absolute left-3.5 text-verde-musgo pointer-events-none">
          <IoSearchSharp size={18} className="text-verde-musgo" />
        </div>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full h-11 sm:h-12 pl-10 pr-4 bg-white border border-verde-musgo rounded-xl text-verde-escuro placeholder:text-verde-musgo/80 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-verde-musgo/30"
        />
      </div>
    </div>
  )
}
