export function FilterButton({ children, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`rounded-3xl py-2 px-5 font-bold text-base transition-colors cursor-pointer select-none
        ${isActive 
          ? 'bg-verde-oliva text-verde-escuro' 
          : 'bg-verde-pastel text-verde-musgo hover:bg-verde-oliva hover:text-white'
        }`}
    >
      {children}
    </button>
  )
}