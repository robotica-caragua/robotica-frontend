export function FilterButton({ children, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`rounded-full py-1 px-6 font-semibold text-base text-verde-escuro transition-colors cursor-pointer select-none ${
        isActive ? 'bg-verde-limao' : 'bg-verde-pastel hover:bg-verde-oliva'
      }`}
    >
      {children}
    </button>
  )
}
