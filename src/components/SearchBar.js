import { IoSearchSharp } from 'react-icons/io5'

export function SearchBar() {
  return (
    <div className="w-full">
      <div className="relative flex items-center w-full">
        <div className="absolute left-4 text-verde-musgo pointer-events-none">
          <IoSearchSharp className="text-verde-musgo text-2xl" />
        </div>
        <input
          type="text"
          placeholder="Pesquisar por assunto..."
          className="w-full py-3 pl-12 pr-16 bg-white border-2 border-verde-musgo rounded-md text-verde-musgo placeholder-verde-musgo/95  text-base font-medium focus:outline-none "
        />
      </div>
    </div>
  )
}
