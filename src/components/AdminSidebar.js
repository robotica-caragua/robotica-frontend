'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MdOutlineGridView,
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
import Logo from '../assets/logo.svg'

const adminLinks = [
  { href: '/dashboard', label: 'Visão Geral', icon: MdOutlineGridView },
  { href: '/gestaoUsuarios', label: 'Usuários', icon: MdOutlinePeopleAlt },
  { href: '/escolas', label: 'Escolas', icon: MdOutlineApartment },
  { href: '/gestaoEventos', label: 'Eventos', icon: MdOutlineCalendarToday },
  { href: '/', label: 'Portal Público', icon: MdOutlineHome }
]

const professorLinks = [
  { href: '/painelProfessor', label: 'Visão Geral', icon: MdOutlineGridView },
  { href: '/gestaoProjetos', label: 'Projetos', icon: MdOutlineFolder },
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
    <aside className="w-full lg:w-60 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-verde-pastel bg-input-bg px-4 sm:px-5 py-4 lg:py-6">
      {/* Topo com Logo padrão Conexão Robótica */}
      <div className="flex items-center justify-between lg:mb-8">
        <Link href="/" className="block w-fit px-1">
          <Image
            src={Logo}
            alt="Logo Conexão Robótica"
            width={140}
            height={40}
            className="w-28 sm:w-32 lg:w-36 h-auto"
            priority
          />
        </Link>

        <button
          type="button"
          onClick={() => setMenuAberto((prev) => !prev)}
          aria-label={menuAberto ? 'Fechar menu lateral' : 'Abrir menu lateral'}
          className="lg:hidden p-2 rounded-lg text-verde-escuro hover:bg-verde-pastel transition cursor-pointer"
        >
          {menuAberto ? <MdClose size={26} /> : <MdMenu size={26} />}
        </button>
      </div>

      <div
        className={`${
          menuAberto ? 'flex mt-3' : 'hidden'
        } lg:flex flex-1 flex-col justify-between gap-4`}
      >
        <nav className="flex-1 flex flex-col gap-1.5">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href === '/dashboard' && pathname === '/admin') ||
              (href === '/gestaoProjetos' && (pathname.includes('projeto') || pathname.includes('Projeto'))) ||
              (href === '/gestaoTutoriais' && pathname.includes('Tutorial')) ||
              (href === '/grupos' && (pathname.includes('grupo') || pathname.includes('Equipe'))) ||
              (href === '/gestaoUsuarios' && pathname.includes('Usuario')) ||
              (href === '/escolas' && (pathname.includes('Escola') || pathname === '/escolas')) ||
              (href === '/gestaoEventos' && pathname.includes('Evento'))

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuAberto(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                  isActive
                    ? 'bg-verde-limao text-verde-escuro shadow-xs'
                    : 'text-verde-escuro hover:bg-verde-pastel/60'
                }`}
              >
                <Icon size={20} className="shrink-0 text-verde-escuro" />
                <span className="truncate">{label}</span>
                {isActive && (
                  <span className="w-1 h-5 absolute left-0 top-1/2 -translate-y-1/2 bg-verde-escuro rounded-r-sm" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="mt-4 pt-3 border-t border-verde-musgo/20 flex flex-col gap-3">
          {variant === 'professor' && (
            <Link
              href="/novoProjeto"
              onClick={() => setMenuAberto(false)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-verde-musgo py-2 px-3 text-xs font-bold text-white shadow-xs hover:bg-white hover:text-verde-musgo border border-verde-musgo transition cursor-pointer"
            >
              <MdAddCircleOutline size={16} />
              Novo Projeto
            </Link>
          )}

          <Link
            href="/contato"
            onClick={() => setMenuAberto(false)}
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold text-verde-escuro hover:bg-verde-pastel/60 rounded-lg transition"
          >
            <MdOutlineHelpOutline size={18} />
            Suporte
          </Link>
        </div>
      </div>
    </aside>
  )
}
