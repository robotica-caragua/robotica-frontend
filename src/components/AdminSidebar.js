'use client'

import { useState } from 'react'
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
  MdOutlineFolder,
  MdPersonOutline,
  MdAddCircleOutline,
  MdMenu,
  MdClose
} from 'react-icons/md'

const adminLinks = [
  { href: '/dashboard', label: 'Visão Geral', icon: MdOutlineDashboard },
  { href: '/gestaoUsuarios', label: 'Usuários', icon: MdOutlinePeopleAlt },
  { href: '/escolas', label: 'Escolas', icon: MdOutlineApartment },
  { href: '/gestaoEventos', label: 'Eventos', icon: MdOutlineCalendarToday },
  { href: '/', label: 'Portal Público', icon: MdOutlineHome }
]

const professorLinks = [
  { href: '/painelProfessor', label: 'Visão Geral', icon: MdOutlineDashboard },
  { href: '/projetos', label: 'Projetos', icon: MdOutlineFolder },
  { href: '/grupos', label: 'Equipes', icon: MdOutlinePeopleAlt },
  { href: '/gestaoTutoriais', label: 'Tutoriais', icon: MdOutlineBuild },
  { href: '/perfil', label: 'Meu Perfil', icon: MdPersonOutline },
  { href: '/', label: 'Portal Público', icon: MdOutlineHome }
]

export function AdminSidebar({ variant = 'admin' }) {
  const pathname = usePathname()
  const [menuAberto, setMenuAberto] = useState(false)
  const links = variant === 'professor' ? professorLinks : adminLinks

  return (
    <aside className="flex w-full lg:min-h-screen lg:w-60 shrink-0 flex-col border-b lg:border-b-0 border-verde-pastel bg-input-bg py-4 lg:py-6">
      <div className="flex items-center justify-between px-6">
        <Link
          href={variant === 'professor' ? '/painelProfessor' : '/dashboard'}
          className="text-2xl lg:text-3xl font-extrabold tracking-wide text-verde-musgo"
        >
          BIOBOT
        </Link>

        <button
          type="button"
          onClick={() => setMenuAberto((prev) => !prev)}
          aria-label={menuAberto ? 'Fechar menu lateral' : 'Abrir menu lateral'}
          className="lg:hidden p-2 rounded-lg text-verde-escuro hover:bg-verde-pastel transition cursor-pointer"
        >
          {menuAberto ? <MdClose size={28} /> : <MdMenu size={28} />}
        </button>
      </div>

      <div
        className={`${
          menuAberto ? 'flex mt-4' : 'hidden'
        } lg:flex flex-1 flex-col justify-between gap-4`}
      >
        <nav className="lg:mt-10 flex flex-col gap-2 lg:gap-3 px-4">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href === '/dashboard' && pathname === '/admin')

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuAberto(false)}
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

        <div className="mt-4 lg:mt-auto flex flex-col gap-4">
          {variant === 'professor' && (
            <div className="px-4">
              <Link
                href="/novoProjeto"
                onClick={() => setMenuAberto(false)}
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
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-verde-escuro hover:bg-verde-pastel"
            >
              <MdOutlineHelpOutline size={20} />
              Suporte
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
