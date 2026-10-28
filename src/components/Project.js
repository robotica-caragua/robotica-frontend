import Link from 'next/link'

export function Project({ children, href = '/detalhesProjeto' }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between h-15 rounded-2xl px-6 bg-verde-pastel hover:opacity-90 transition w-full max-w-122"
    >
      {children}
    </Link>
  )
}
