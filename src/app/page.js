import { MdArrowForward } from 'react-icons/md'
import Image from 'next/image'
import homeBot from '../assets/home.png'
import ligacoes from '../assets/fundo.png'
import { Header } from '@/components/Header'

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex flex-row justify-between">
        <div className="max-w-2xl ml-55 mt-28">
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
        <div className="relative w-175 h-225 ">
          {/* Imagem de fundo */}
          <div className="absolute inset-0 z-0 w-200 h-225">
            <Image
              src={ligacoes}
              alt="Fundo decorativo"
              fill
              className="object-contain opacity-13"
            />
          </div>

          <div className="relative w-205 h-205 overflow-hidden flex justify-end -left-10">
            <Image
              src={homeBot}
              alt="Ilustração principal de robótica"
              fill
              className="object-cover object-[85%_center]"
            />
          </div>
        </div>
      </main>
    </>
  )
}
