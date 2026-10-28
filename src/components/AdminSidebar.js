'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MdOutlineDashboard,
  MdOutlinePeopleAlt,
  MdOutlineApartment,
  MdOutlineCalendarToday,
  MdOutlineHome,
  MdOutlineHelpOutline,
  MdOutlineBuild,
  MdPersonOutline,
  MdAddCircleOutline
} from 'react-icons/md'

const adminLinks = [
  { href: '/dashboard', label: 'Visão Geral', icon: MdOutlineDashboard },
  { href: '/admin/usuarios', label: 'Usuários', icon: MdOutlinePeopleAlt },
  { href: '/escolas', label: 'Escolas', icon: MdOutlineApartment },
  { href: '/admin/eventos', label: 'Eventos', icon: MdOutlineCalendarToday },
  { href: '/', label: 'Portal Público', icon: MdOutlineHome }
]

const professorLinks = [
  { href: '/dashboard', label: 'Visão Geral', icon: MdOutlineDashboard },
  { href: '/grupos', label: 'Equipes', icon: MdOutlinePeopleAlt },
  { href: '/tutorial', label: 'Tutoriais', icon: MdOutlineBuild },
  { href: '/perfil', label: 'Meu Perfil', icon: MdPersonOutline },
  { href: '/', label: 'Portal Público', icon: MdOutlineHome }
]

export function AdminSidebar({ variant = 'admin' }) {
  const pathname = usePathname()
  const links = variant === 'professor' ? professorLinks : adminLinks

  return (
    <aside className="flex min-h-screen w-60 shrink-0 flex-col bg-input-bg py-6">
      <Link
        href="/dashboard"
        className="px-6 text-3xl font-extrabold tracking-wide text-verde-musgo"
      >
        BIOBOT
      </Link>

      <nav className="mt-10 flex flex-col gap-3 px-4">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href === '/dashboard' && pathname === '/admin')

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-semibold transition-colors
                ${
                  isActive
                    ? 'bg-verde-oliva text-verde-escuro border-l-4 border-verde-escuro shadow-sm'
                    : 'text-verde-escuro hover:bg-verde-pastel'
                }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        {variant === 'professor' && (
          <div className="px-4">
            <Link
              href="/novoProjeto"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-verde-musgo py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-90 cursor-pointer"
            >
              <MdAddCircleOutline size={18} />
              Novo Projeto
            </Link>
          </div>
        )}

        <div className="border-t border-verde-musgo/20 px-4 pt-4">
          <Link
            href="/contato"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-verde-escuro hover:bg-verde-pastel"
          >
            <MdOutlineHelpOutline size={20} />
            Suporte
          </Link>
        </div>
      </div>
    </aside>
  )
}
