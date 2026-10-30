import Link from 'next/link'
import { IoIosArrowUp } from 'react-icons/io'
import Image from 'next/image'
import Logo from '../assets/logo.svg'

export function Footer() {
  return (
    <footer className="w-full max-w-[100vw] mx-auto items-center justify-between mt-8 bg-verde-pastel pt-8 pb-6">
      <div className="flex items-center gap-4 justify-between px-6 max-w-7xl mx-auto">
        <div className="w-10"></div>
        <Image src={Logo} alt="Logo Conexão Robótica" width={180} height={50} className="w-36 sm:w-44 h-auto" />
        <Link
          href="#topo"
          aria-label="Voltar ao topo da página"
          className="font-bold p-2 bg-verde-escuro text-verde-pastel rounded-full hover:bg-white hover:text-verde-escuro border-2 border-verde-escuro transition-colors duration-300 flex items-center justify-center cursor-pointer shadow-xs"
        >
          <IoIosArrowUp size={22} />
        </Link>
      </div>

      <div className="w-full justify-center items-center text-center mt-3 mb-6 px-4">
        <p className="text-verde-escuro font-medium text-sm sm:text-base">
          Conectando educação, sustentabilidade e tecnologia.
        </p>
      </div>

      {/* Nav com altura estável e borda transparente para evitar que a linha abaixo pule no hover */}
      <nav className="flex items-center justify-center min-h-[54px] py-2 px-4 sm:px-6">
        <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 list-none m-0 p-0 font-medium text-verde-escuro text-sm sm:text-base">
          <li>
            <Link
              href="/"
              className="inline-block text-center px-3 py-1.5 border-b-2 border-transparent hover:border-verde-escuro hover:font-bold uppercase transition-all"
            >
              Início
            </Link>
          </li>
          <li>
            <Link
              href="/rede"
              className="inline-block text-center px-3 py-1.5 border-b-2 border-transparent hover:border-verde-escuro hover:font-bold uppercase transition-all"
            >
              Rede
            </Link>
          </li>
          <li>
            <Link
              href="/projetos"
              className="inline-block text-center px-3 py-1.5 border-b-2 border-transparent hover:border-verde-escuro hover:font-bold uppercase transition-all"
            >
              Projetos
            </Link>
          </li>
          <li>
            <Link
              href="/tutoriais"
              className="inline-block text-center px-3 py-1.5 border-b-2 border-transparent hover:border-verde-escuro hover:font-bold uppercase transition-all"
            >
              Tutoriais
            </Link>
          </li>
          <li>
            <Link
              href="/contato"
              className="inline-block text-center px-3 py-1.5 border-b-2 border-transparent hover:border-verde-escuro hover:font-bold uppercase transition-all"
            >
              Contato
            </Link>
          </li>
        </ul>
      </nav>

      {/* Linha divisória fixa e espaçada */}
      <div className="w-full flex justify-center mt-4">
        <div className="w-[85%] border-b border-verde-escuro/40" />
      </div>

      <div className="w-full justify-center items-center text-center mt-4 p-2 text-xs sm:text-sm">
        <p className="text-verde-escuro font-medium">
          &copy; 2026 BioBot. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
