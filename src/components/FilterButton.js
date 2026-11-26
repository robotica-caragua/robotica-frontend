export function FilterButton({ children, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`rounded-full py-1.5 px-5 font-semibold text-xs sm:text-sm text-verde-escuro transition-colors cursor-pointer select-none ${
        isActive
          ? 'bg-verde-limao dark:border dark:border-verde-oliva'
          : 'bg-verde-pastel dark:border dark:border-verde-oliva dark:text-verde-limao hover:bg-verde-oliva'
      }`}
    >
      {children}
    </button>
  )
}
