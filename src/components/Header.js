'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MdArrowForward, MdClose, MdMenu } from 'react-icons/md'
import Image from 'next/image'
import Logo from '../assets/logo.svg'

export function Header() {
  const [menuAberto, setMenuAberto] = useState(false)

  // Bloquear rolagem do corpo quando o drawer mobile estiver aberto
  useEffect(() => {
    if (menuAberto) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuAberto])

  return (
    <header id="topo" className="w-full md:w-[85%] lg:w-[75%] mx-auto my-3 sm:my-4 lg:my-6 px-4 sm:px-6">
      <div className="h-16 flex items-center justify-between flex-row-reverse lg:flex-row">
        {/* Logo (à direita no mobile conforme Figma, à esquerda no desktop) */}
        <Link href="/" className="block w-fit shrink-0">
          <Image
            src={Logo}
            alt="Logo Conexão Robótica"
            width={180}
            height={50}
            className="w-32 sm:w-40 lg:w-[180px] h-auto"
            priority
          />
        </Link>

        {/* Botão Hamburger (à esquerda no mobile conforme Figma) */}
        <button
          type="button"
          onClick={() => setMenuAberto(true)}
          aria-label="Abrir menu de navegação"
          aria-expanded={menuAberto}
          className="lg:hidden p-2 -ml-2 rounded-lg text-verde-musgo hover:bg-verde-pastel/50 transition cursor-pointer"
        >
          <MdMenu size={32} />
        </button>

        {/* Menu Desktop */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex items-center gap-6 list-none m-0 p-0 font-medium text-verde-musgo text-xl">
            <li>
              <Link
                href="/"
                className="inline-block text-center w-[4.75rem] p-1 hover:font-bold hover:border-b-2 border-verde-musgo uppercase"
              >
                Início
              </Link>
            </li>
            <li>
              <Link
                href="/rede"
                className="inline-block text-center w-[4.75rem] p-1 hover:font-bold hover:border-b-2 border-verde-musgo uppercase"
              >
                Rede
              </Link>
            </li>
            <li>
              <Link
                href="/projetos"
                className="inline-block text-center w-[7.25rem] p-1 hover:font-bold hover:border-b-2 border-verde-musgo uppercase"
              >
                Projetos
              </Link>
            </li>
            <li>
              <Link
                href="/tutoriais"
                className="inline-block text-center w-[7.25rem] p-1 hover:font-bold hover:border-b-2 border-verde-musgo uppercase"
              >
                Tutoriais
              </Link>
            </li>
            <li>
              <Link
                href="/contato"
                className="inline-block text-center w-[6.5rem] p-1 hover:font-bold hover:border-b-2 border-verde-musgo uppercase"
              >
                Contato
              </Link>
            </li>

            <li>
              <Link
                href="/login"
                className="font-bold px-4 py-2 bg-white border-2 border-verde-musgo rounded-lg hover:bg-verde-musgo hover:text-white transition-colors duration-300 flex items-center gap-4"
              >
                Sou Professor
                <MdArrowForward size={28} />
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Drawer Mobile (conforme Figma: menu lateral com close X e links verticais) */}
      {menuAberto && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop escurecido */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMenuAberto(false)}
            aria-hidden="true"
          />

          {/* Painel do menu lateral */}
          <div className="relative z-50 w-72 max-w-[85vw] h-full bg-[#FAF8F5] shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              {/* Botão de Fechar no topo direito do drawer */}
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={() => setMenuAberto(false)}
                  aria-label="Fechar menu"
                  className="p-2 text-verde-escuro hover:bg-verde-pastel/60 rounded-full transition cursor-pointer"
                >
                  <MdClose size={30} />
                </button>
              </div>

              {/* Links de Navegação */}
              <nav>
                <ul className="flex flex-col gap-4 list-none m-0 p-0 font-bold text-verde-musgo text-lg uppercase tracking-wider">
                  <li>
                    <Link
                      href="/"
                      onClick={() => setMenuAberto(false)}
                      className="block py-2 px-3 rounded-lg hover:bg-verde-pastel/60 hover:text-verde-escuro transition"
                    >
                      Início
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/rede"
                      onClick={() => setMenuAberto(false)}
                      className="block py-2 px-3 rounded-lg hover:bg-verde-pastel/60 hover:text-verde-escuro transition"
                    >
                      Rede
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/projetos"
                      onClick={() => setMenuAberto(false)}
                      className="block py-2 px-3 rounded-lg hover:bg-verde-pastel/60 hover:text-verde-escuro transition"
                    >
                      Projetos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tutoriais"
                      onClick={() => setMenuAberto(false)}
                      className="block py-2 px-3 rounded-lg hover:bg-verde-pastel/60 hover:text-verde-escuro transition"
                    >
                      Tutoriais
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contato"
                      onClick={() => setMenuAberto(false)}
                      className="block py-2 px-3 rounded-lg hover:bg-verde-pastel/60 hover:text-verde-escuro transition"
                    >
                      Contato
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Botão Sou Professor no rodapé do drawer */}
            <div className="pt-6 border-t border-verde-musgo/20 mt-6">
              <Link
                href="/login"
                onClick={() => setMenuAberto(false)}
                className="w-full font-bold py-3 px-4 bg-white border-2 border-verde-musgo text-verde-musgo rounded-xl hover:bg-verde-musgo hover:text-white transition-colors duration-300 flex items-center justify-center gap-3 text-base shadow-xs"
              >
                Sou Professor
                <MdArrowForward size={22} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
