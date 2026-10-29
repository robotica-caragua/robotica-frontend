import Link from 'next/link'
import { IoIosArrowUp } from 'react-icons/io'
import Image from 'next/image'
import Logo from '../assets/logo.svg'

export function Footer() {
  return (
    <section className="w-full max-w-[100vw] mx-auto items-center justify-between mt-6 bg-verde-pastel">
      <div className="flex items-center gap-4 justify-between px-6">
        <div></div>
        <Image src={Logo} alt="Logo Conexão Robótica" width={180} height={50} />
        <Link
          href="#topo"
          className="font-bold px-1 py-1 bg-verde-escuro text-verde-pastel rounded-4xl hover:bg-white hover:text-verde-escuro border-2 border-verde-escuro transition-colors duration-300 flex items-center gap-4"
        >
          <IoIosArrowUp size={24} />{' '}
        </Link>
      </div>

      <div className="w-full justify-center items-center text-center mb-8 md:mb-14 px-4">
        <p className="text-verde-escuro font-medium text-base sm:text-lg">
          Conectando educação, sustentabilidade e tecnologia.
        </p>
      </div>

      <nav className="flex items-center justify-center mt-4 min-h-10 py-2 px-4 sm:px-6">
        <ul className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 list-none m-0 p-0 font-medium text-verde-escuro text-base sm:text-lg">
          <li>
            {' '}
            <Link
              href="/"
              className="inline-block text-center w-16 p-1 hover:font-bold hover:border-b-2 border-verde-escuro uppercase"
            >
              Início
            </Link>{' '}
          </li>
          <li>
            {' '}
            <Link
              href="/rede"
              className="inline-block text-center w-16 p-1 hover:font-bold hover:border-b-2 border-verde-escuro uppercase"
            >
              Rede
            </Link>{' '}
          </li>
          <li>
            {' '}
            <Link
              href="/projetos"
              className="inline-block text-center w-24 p-1 hover:font-bold hover:border-b-2 border-verde-escuro uppercase"
            >
              Projetos
            </Link>{' '}
          </li>
          <li>
            {' '}
            <Link
              href="/tutoriais"
              className="inline-block text-center w-28 p-1 hover:font-bold hover:border-b-2 border-verde-escuro uppercase"
            >
              Tutoriais
            </Link>{' '}
          </li>
          <li>
            {' '}
            <Link
              href="/contato"
              className="inline-block text-center w-24 p-1 hover:font-bold hover:border-b-2 border-verde-escuro uppercase"
            >
              Contato
            </Link>{' '}
          </li>
        </ul>
      </nav>

      <div className="w-full border-b border-verde-escuro mt-4 mb-10"></div>

      <div className="w-full justify-center items-center text-center pb-2">
        <p className="text-verde-escuro font-medium text-base">
          © 2026 BioBot. Todos os direitos reservados.
        </p>
      </div>
    </section>
  )
}
