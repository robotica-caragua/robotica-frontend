import Link from 'next/link'

export function Button({ children, goTo }) {
  const buttonClasses =
    'mt-10 mx-auto flex w-35 h-10 items-center justify-center gap-2 rounded-xl bg-verde-limao border-b-6 border-verde-escuro font-bold text-verde-escuro hover:brightness-50 duration-75 cursor-pointer'

  if (goTo) {
    return (
      <Link href={goTo} className={buttonClasses}>
        <span>{children}</span>
      </Link>
    )
  }

  return (
    <button type="submit" className={buttonClasses}>
      <span>{children}</span>
    </button>
  )
}
