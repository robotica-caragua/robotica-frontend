import Link from 'next/link'

export function Project({ children, href = '/detalhesProjeto' }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between min-h-15 py-3 gap-3 rounded-2xl px-4 sm:px-6 bg-verde-pastel hover:opacity-90 transition w-full max-w-122"
    >
      {children}
    </Link>
  )
}
