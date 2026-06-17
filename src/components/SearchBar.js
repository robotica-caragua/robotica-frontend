import { IoSearchSharp } from "react-icons/io5";

export function SearchBar() {
  return (
    <div className="w-full max-w-md px-10">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-verde-musgo">
          <IoSearchSharp className="text-verde-musgo text-2xl" />
        </div>
        <input
          type="text"
          placeholder="Pesquisar por assunto..."
          className="w-full py-3 pl-12 pr-5 border-1 bg-white border border-verde-musgo rounded-md text-verde-musgo placeholder-verde-musgo/95  text-base font-medium"
        />
      </div>
    </div>
  );
}