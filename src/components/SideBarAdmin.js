'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MdOutlineGridView,
  MdOutlinePeopleAlt,
  MdOutlineCalendarToday,
  MdMenu,
  MdClose
} from 'react-icons/md'
import { FaRegBuilding } from 'react-icons/fa'
import { IoHomeOutline } from 'react-icons/io5'
import Logo from '../assets/logo.svg'

export function SideBarAdmin() {
  const pathname = usePathname()
  const [menuAberto, setMenuAberto] = useState(false)

  const isVisaoGeral = pathname === '/admin' || pathname === '/dashboard'
  const isUsuarios = pathname.includes('Usuario')
  const isEscolas = pathname.includes('Escola') || pathname === '/escolas'
  const isEventos = pathname.includes('Evento')

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-verde-pastel bg-bg-page px-4 sm:px-6 py-4 lg:py-8">
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
          <Link
            href="/dashboard"
            onClick={() => setMenuAberto(false)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${isVisaoGeral ? 'bg-verde-limao' : 'hover:bg-verde-pastel'}`}
          >
            <MdOutlineGridView size={28} className="text-verde-escuro" />
            <span className="text-verde-escuro text-lg font-semibold tracking-wide">
              Visão Geral
            </span>
            {isVisaoGeral && (
              <div className="w-1 h-7 absolute left-0 top-1/2 -translate-y-1/2 bg-verde-escuro rounded-tr-sm rounded-br-sm"></div>
            )}
          </Link>

          <Link
            href="/gestaoUsuarios"
            onClick={() => setMenuAberto(false)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${isUsuarios ? 'bg-verde-limao' : 'hover:bg-verde-pastel'}`}
          >
            <MdOutlinePeopleAlt size={28} className="text-verde-escuro" />
            <span className="text-verde-escuro text-lg font-semibold tracking-wide">Usuários</span>
            {isUsuarios && (
              <div className="w-1 h-7 absolute left-0 top-1/2 -translate-y-1/2 bg-verde-escuro rounded-tr-sm rounded-br-sm"></div>
            )}
          </Link>

          <Link
            href="/escolas"
            onClick={() => setMenuAberto(false)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${isEscolas ? 'bg-verde-limao' : 'hover:bg-verde-pastel'}`}
          >
            <FaRegBuilding size={28} className="text-verde-escuro" />
            <span className="text-verde-escuro text-lg font-semibold tracking-wide">Escolas</span>
            {isEscolas && (
              <div className="w-1 h-7 absolute left-0 top-1/2 -translate-y-1/2 bg-verde-escuro rounded-tr-sm rounded-br-sm"></div>
            )}
          </Link>

          <Link
            href="/gestaoEventos"
            onClick={() => setMenuAberto(false)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${isEventos ? 'bg-verde-limao' : 'hover:bg-verde-pastel'}`}
          >
            <MdOutlineCalendarToday size={28} className="text-verde-escuro" />
            <span className="text-verde-escuro text-lg font-semibold tracking-wide">Eventos</span>
            {isEventos && (
              <div className="w-1 h-7 absolute left-0 top-1/2 -translate-y-1/2 bg-verde-escuro rounded-tr-sm rounded-br-sm"></div>
            )}
          </Link>

          <Link
            href="/"
            onClick={() => setMenuAberto(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-verde-pastel transition-colors"
          >
            <IoHomeOutline size={28} className="text-verde-escuro" />
            <span className="text-verde-escuro text-lg font-semibold tracking-wide">
              Portal Público
            </span>
          </Link>
        </nav>

        <div className="pt-4 lg:pt-6 lg:mt-6 border-t border-verde-musgo border-opacity-30">
          <Link
            href="/contato"
            onClick={() => setMenuAberto(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-verde-pastel transition-colors"
          >
            <div className="w-5 h-5 bg-verde-escuro rounded-full opacity-80"></div>
            <span className="text-verde-escuro text-sm font-semibold tracking-wide">Suporte</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
