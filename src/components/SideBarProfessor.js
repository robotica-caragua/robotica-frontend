'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MdOutlineGridView,
  MdOutlinePeopleAlt,
  MdOutlineBuild,
  MdOutlineFolder,
  MdMenu,
  MdClose
} from 'react-icons/md'
import {
  IoHomeOutline,
  IoPersonOutline,
  IoAddCircleOutline,
  IoHelpCircleOutline
} from 'react-icons/io5'
import Logo from '../assets/logo.svg'

const itensMenu = [
  {
    href: '/painelProfessor',
    label: 'Visão Geral',
    icone: MdOutlineGridView,
    match: (p) => p === '/painelProfessor'
  },
  {
    href: '/projetos',
    label: 'Projetos',
    icone: MdOutlineFolder,
    match: (p) => p.includes('projeto') || p.includes('Projeto')
  },
  {
    href: '/grupos',
    label: 'Equipes',
    icone: MdOutlinePeopleAlt,
    match: (p) => p.includes('grupo') || p.includes('Grupo') || p.includes('Equipe')
  },
  {
    href: '/gestaoTutoriais',
    label: 'Tutoriais',
    icone: MdOutlineBuild,
    match: (p) => p.includes('Tutoria')
  },
  {
    href: '/perfil',
    label: 'Meu Perfil',
    icone: IoPersonOutline,
    match: (p) => p.includes('perfil') || p.includes('Perfil')
  },
  { href: '/', label: 'Portal Público', icone: IoHomeOutline, match: () => false }
]

export function SideBarProfessor() {
  const pathname = usePathname()
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-verde-pastel bg-input-bg px-4 sm:px-6 py-4 lg:py-8">
      <div className="flex items-center justify-between lg:mb-12">
        <Link href="/" className="px-2 block w-fit">
          <Image
            src={Logo}
            alt="Logo Conexão Robótica"
            width={180}
            height={50}
            style={{ width: 'auto', height: 'auto' }}
            className="max-h-10 lg:max-h-none"
          />
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
        <nav className="flex-1 flex flex-col gap-2">
          {itensMenu.map(({ href, label, icone: Icone, match }) => {
            const ativo = match(pathname)
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuAberto(false)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${
                  ativo ? 'bg-verde-oliva' : 'hover:bg-verde-pastel'
                }`}
              >
                <Icone size={24} className="text-verde-escuro" />
                <span className="text-verde-escuro text-lg font-semibold tracking-wide">
                  {label}
                </span>
                {ativo && (
                  <div className="w-1 h-7 absolute left-0 top-1/2 -translate-y-1/2 bg-verde-escuro rounded-tr-sm rounded-br-sm" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex flex-col gap-4 pt-4 lg:pt-6 lg:mt-6">
          <Link
            href="/novoProjeto"
            onClick={() => setMenuAberto(false)}
            className="flex items-center justify-center gap-2 py-3 px-6 bg-verde-musgo hover:opacity-90 text-branco-esverdeado text-base font-bold rounded-lg transition"
          >
            <IoAddCircleOutline size={22} />
            <span>Novo Projeto</span>
          </Link>

          <div className="pt-3 border-t border-verde-musgo/30">
            <Link
              href="/contato"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-verde-pastel transition-colors"
            >
              <IoHelpCircleOutline size={22} className="text-verde-escuro" />
              <span className="text-verde-escuro text-sm font-semibold tracking-wide">Suporte</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
