'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MdOutlineGridView,
  MdOutlinePeopleAlt,
  MdOutlineApartment,
  MdOutlineCalendarToday,
  MdOutlineCampaign,
  MdOutlineHome,
  MdOutlineHelpOutline,
  MdOutlineBuild,
  MdOutlineFolder,
  MdPersonOutline,
  MdMenu,
  MdClose
} from 'react-icons/md'
import Logo from '../assets/logo.svg'
import IconLogo from '../app/icon.svg'
import { ThemeToggle } from './ThemeToggle'
import { UserAvatarMenu } from './UserAvatarMenu'
import { apiAuth, obterToken, obterUsuario } from '@/services/api'

const adminLinks = [
  { href: '/dashboard', label: 'Visão Geral', icon: MdOutlineGridView },
  { href: '/gestaoUsuarios', label: 'Usuários', icon: MdOutlinePeopleAlt },
  { href: '/escolas', label: 'Escolas', icon: MdOutlineApartment },
  { href: '/gestaoEventos', label: 'Eventos', icon: MdOutlineCalendarToday },
  { href: '/gestaoAvisos', label: 'Avisos', icon: MdOutlineCampaign },
  { href: '/gestaoDuvidas', label: 'Dúvidas', icon: MdOutlineHelpOutline },
  { href: '/perfil', label: 'Meu Perfil', icon: MdPersonOutline },
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
  const [ehUsuarioAdmin, setEhUsuarioAdmin] = useState(variant === 'admin')

  useEffect(() => {
    let ativo = true
    const verificarPerfil = (u) => {
      if (!u) return
      const admin =
        u.role === 'ADMIN' || u.perfil === 'ADMINISTRADOR' || u.permissaoAdministrador === true
      setEhUsuarioAdmin(admin)
    }

    const salvo = obterUsuario()
    if (salvo) {
      verificarPerfil(salvo)
    }

    if (obterToken()) {
      apiAuth
        .me()
        .then((u) => {
          if (ativo && u) verificarPerfil(u)
        })
        .catch(() => {})
    }

    return () => {
      ativo = false
    }
  }, [variant])

  const links = ehUsuarioAdmin ? adminLinks : variant === 'professor' ? professorLinks : adminLinks

  return (
    <>
      <aside className="panel-sidebar w-full lg:w-64 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-verde-pastel bg-input-bg px-4 sm:px-5 py-4 lg:py-6">
        {/* Topo com Logo padrão Conexão Robótica */}
        <div className="flex items-center justify-between lg:mb-8">
          <Link href="/" className="block w-fit px-1">
            <Image
              src={Logo}
              alt="Logo Conexão Robótica"
              width={140}
              height={40}
              className="dark:hidden w-28 sm:w-32 lg:w-36 h-auto"
              priority
            />
            <span className="hidden dark:inline-flex items-center gap-2">
              <Image
                src={IconLogo}
                alt=""
                width={34}
                height={34}
                className="w-8 h-8 object-contain"
                priority
              />
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-verde-escuro">
                BIOBOT
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <UserAvatarMenu />

            <button
              type="button"
              onClick={() => setMenuAberto((prev) => !prev)}
              aria-label={menuAberto ? 'Fechar menu lateral' : 'Abrir menu lateral'}
              className="p-2 rounded-lg text-verde-escuro hover:bg-verde-pastel transition cursor-pointer"
            >
              {menuAberto ? <MdClose size={26} /> : <MdMenu size={26} />}
            </button>
          </div>
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
                (href === '/gestaoProjetos' &&
                  (pathname.includes('projeto') || pathname.includes('Projeto'))) ||
                (href === '/gestaoTutoriais' && pathname.includes('Tutorial')) ||
                (href === '/grupos' &&
                  (pathname.includes('grupo') || pathname.includes('Equipe'))) ||
                (href === '/gestaoUsuarios' && pathname.includes('Usuario')) ||
                (href === '/escolas' &&
                  (pathname.includes('Escola') ||
                    pathname === '/escolas' ||
                    pathname.startsWith('/admin/escolas'))) ||
                (href === '/gestaoEventos' && pathname.includes('Evento')) ||
                (href === '/gestaoAvisos' && pathname.includes('Aviso')) ||
                (href === '/gestaoDuvidas' && pathname.includes('Duvida'))

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuAberto(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'sidebar-active-item bg-verde-limao text-verde-escuro shadow-xs'
                      : 'text-verde-escuro hover:bg-verde-pastel/60 dark:hover:bg-[#001B0D] dark:hover:text-verde-limao'
                  }`}
                >
                  <Icon
                    size={20}
                    className={`shrink-0 ${
                      isActive ? 'text-verde-escuro' : 'text-verde-escuro dark:text-verde-limao'
                    }`}
                  />
                  <span className="truncate">{label}</span>
                  {isActive && (
                    <span className="dark:hidden w-1 h-5 absolute left-0 top-1/2 -translate-y-1/2 bg-verde-escuro rounded-r-sm" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="mt-4 pt-3 border-t border-verde-musgo/20 dark:border-verde-oliva/40 flex flex-col gap-2">
            <Link
              href="/contato"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold text-verde-escuro hover:bg-verde-pastel/60 dark:hover:bg-[#001B0D] dark:hover:text-verde-limao rounded-lg transition"
            >
              <MdOutlineHelpOutline size={18} />
              Suporte
            </Link>
          </div>
        </div>
      </aside>

      {/* Botão de tema e avatar com iniciais no canto superior direito (desktop) */}
      <div className="hidden lg:flex items-center gap-2.5 fixed top-6 right-8 xl:right-12 z-40">
        <ThemeToggle />
        <UserAvatarMenu />
      </div>
    </>
  )
}
