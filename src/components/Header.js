'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MdArrowForward, MdClose, MdMenu } from 'react-icons/md'
import Image from 'next/image'
import Logo from '../assets/logo.svg'

export function Header() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <header id="topo" className="w-full max-w-[100vw] mx-auto my-4 lg:my-6 px-4 sm:px-6">
      <div className="h-16 flex items-center justify-between">
        <Link href="/" className="block w-fit shrink-0">
          <Image
            src={Logo}
            alt="Logo Conexão Robótica"
            width={180}
            height={50}
            className="w-36 sm:w-[180px] h-auto"
          />
        </Link>

        <button
          type="button"
          onClick={() => setMenuAberto((prev) => !prev)}
          aria-label={menuAberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          aria-expanded={menuAberto}
          className="lg:hidden p-2 rounded-lg text-verde-musgo hover:bg-verde-pastel/50 transition cursor-pointer"
        >
          {menuAberto ? <MdClose size={30} /> : <MdMenu size={30} />}
        </button>

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

      {menuAberto && (
        <nav className="lg:hidden mt-3 p-4 rounded-2xl bg-white border border-verde-musgo shadow-md">
          <ul className="flex flex-col gap-2 list-none m-0 p-0 font-medium text-verde-musgo text-lg">
            <li>
              <Link
                href="/"
                onClick={() => setMenuAberto(false)}
                className="block py-2 px-3 rounded-lg hover:bg-verde-pastel/60 hover:font-bold uppercase"
              >
                Início
              </Link>
            </li>
            <li>
              <Link
                href="/rede"
                onClick={() => setMenuAberto(false)}
                className="block py-2 px-3 rounded-lg hover:bg-verde-pastel/60 hover:font-bold uppercase"
              >
                Rede
              </Link>
            </li>
            <li>
              <Link
                href="/projetos"
                onClick={() => setMenuAberto(false)}
                className="block py-2 px-3 rounded-lg hover:bg-verde-pastel/60 hover:font-bold uppercase"
              >
                Projetos
              </Link>
            </li>
            <li>
              <Link
                href="/tutoriais"
                onClick={() => setMenuAberto(false)}
                className="block py-2 px-3 rounded-lg hover:bg-verde-pastel/60 hover:font-bold uppercase"
              >
                Tutoriais
              </Link>
            </li>
            <li>
              <Link
                href="/contato"
                onClick={() => setMenuAberto(false)}
                className="block py-2 px-3 rounded-lg hover:bg-verde-pastel/60 hover:font-bold uppercase"
              >
                Contato
              </Link>
            </li>
            <li className="pt-2">
              <Link
                href="/login"
                onClick={() => setMenuAberto(false)}
                className="font-bold px-4 py-2.5 bg-white border-2 border-verde-musgo rounded-lg hover:bg-verde-musgo hover:text-white transition-colors duration-300 flex items-center justify-center gap-3"
              >
                Sou Professor
                <MdArrowForward size={24} />
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
