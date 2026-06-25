export function Button({ children }) {
  return (
    <button
      type="submit"
      className="mt-10 mx-auto flex w-35 h-10 items-center justify-center gap-2 rounded-xl bg-verde-limao border-b-6 border-verde-escuro font-bold text-verde-escuro text-base hover:brightness-50 duration-75 cursor-pointer"
    >
      <span>{children}</span>
    </button>
  )
}
