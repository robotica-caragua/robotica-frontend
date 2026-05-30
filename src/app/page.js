import { MdArrowForward } from 'react-icons/md'
import Image from 'next/image'
import homeBot from '../assets/home.png'
import ligacoes from '../assets/fundo.png'
import { Header } from '@/components/Header'

export default function HomePage() {
  return (
    <>
      <Header />
      <section className="relative flex items-center justify-between px-20 py-16 overflow-hidden -mt-45">
        {/* Conteúdo */}

        {/*Div texto seção HERO*/}
        <div className="max-w-2xl -mt-15 ml-20">
          <h1 className="text-[64px] font-bold uppercase leading-tight">
            <span className="text-lime-500">
              Descubra,
              <br />
            </span>

            <span className="text-[#002A15]">
              construa e
              <br />
              compartilhe.
            </span>
          </h1>

          <p className="mt-8 text-2xl text-black max-w">
            Conectando escolas, estudantes e a comunidade de Caraguatatuba através da tecnologia.
          </p>

          <button
            className="
            mt-10
            flex
            items-center
            gap-8
            px-5
            py-3
            rounded-xl
            border
            border-[#506600]
            bg-white
            text-[#506600]
            font-bold
            text-xl
            transition
            hover:bg-[#506600]
            hover:text-white
          "
          >
            Explorar Projetos
            <MdArrowForward size={23} />
          </button>
        </div>

        {/* Imagem */}
        <div className="relative w-[700px] h-[900px]">
          {/* Imagem de fundo */}
          <div className="absolute inset-0 z-0 w-[800] h-[850]">
            <Image
              src={ligacoes}
              alt="Fundo decorativo"
              fill
              className="
        object-contain
        opacity-18
        
      "
            />
          </div>

          <div className="relative w-[800] h-[800] overflow-hidden flex justify-end">
            <Image
              src={homeBot}
              alt="Ilustração principal de robótica"
              fill
              className="object-cover object-[85%_center]"
            />
          </div>
        </div>
      </section>
    </>
  )
}
