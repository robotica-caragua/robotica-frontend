import Link from 'next/link'
import { MdArrowForward } from 'react-icons/md'
import Image from 'next/image'
import Logo from '../assets/logo.svg'

export function Header() {
  return (
    <div className="w-full h-16 flex items-center justify-between mt-8 m-10">
      <Image src={Logo} alt="Logo Conexão Robótica" />

      <nav className="p-4 flex items-center mr-20">
        <ul className="flex items-center gap-6 list-none m-0 p-0 font-medium text-verde-musgo text-xl">
          <li>
            {' '}
            <Link
              href="/cadastro"
              className="inline-block text-center w-[4.75rem] p-1 hover:font-bold hover:border-b-2 border-verde-musgo uppercase"
            >
              Início
            </Link>{' '}
          </li>
          <li>
            {' '}
            <Link
              href="/rede"
              className="inline-block text-center w-[4rem] p-1 hover:font-bold hover:border-b-2 border-verde-musgo uppercase"
            >
              Rede
            </Link>{' '}
          </li>
          <li>
            {' '}
            <Link
              href="/tutoriais"
              className="inline-block text-center w-[7.25rem] p-1 hover:font-bold hover:border-b-2 border-verde-musgo uppercase"
            >
              Tutoriais
            </Link>{' '}
          </li>
          <li>
            {' '}
            <Link
              href="/contato"
              className="inline-block text-center w-[6.5rem] p-1 hover:font-bold hover:border-b-2 border-verde-musgo uppercase"
            >
              Contato
            </Link>{' '}
          </li>

          <Link
            href="/login"
            className="font-bold ml-6 px-10 py-2 bg-white border-2 border-verde-musgo rounded-lg hover:bg-input transition-colors duration-300 flex items-center gap-5"
          >
            Sou Professor
            <MdArrowForward size={30} />
          </Link>
        </ul>
      </nav>
    </div>
  )
}
