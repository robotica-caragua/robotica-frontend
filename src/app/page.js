import { MdArrowForward } from 'react-icons/md'
import { FaRobot } from 'react-icons/fa6'
import { ImBooks } from 'react-icons/im'
import { PiPlant } from 'react-icons/pi'
import { RiCommunityLine } from 'react-icons/ri'
import Image from 'next/image'
import homeBot from '../assets/home.png'
import ligacoes from '../assets/fundo.png'
import { Header } from '@/components/Header'

export default function HomePage() {
  return (
    <>
      <Header />

      {/*Hero*/}

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
            hover:bg-[#e6f5bc]
            hover:bg-[#506600]
          "
          >
            Explorar Projetos
            <MdArrowForward size={23} />
          </button>
        </div>

        {/* Imagem */}
        <div className="relative w-175 h-225 -top-26 pointer-events-none">
          {/* Imagem de fundo */}
          <div className="absolute inset-0 z-0 w-200 h-225">
            <Image
              src={ligacoes}
              alt="Fundo decorativo"
              fill
              className="object-contain opacity-13"
            />
          </div>

          <div className="relative w-206 h-205 overflow-hidden flex justify-end -left-25">
            <Image
              src={homeBot}
              alt="Ilustração principal de robótica"
              fill
              className="object-cover object-[85%_center]"
            />
          </div>
        </div>
      </main>

      {/*Barra de tarefas*/}

      <div className="w-full bg-[#97E100]  py-2 -mt-55">
        <div className="flex justify-center gap-40">
          <div className="flex flex-col items-center">
            <FaRobot color="#FFFFF3" size={89} />
            <h3 className="mt-4 text-[#FFFFF3] text-[22px] font-semibold text-center drop-shadow-md">
              ROBÓTICA ACESSÍVEL
            </h3>
          </div>

          <div className="flex flex-col items-center">
            <ImBooks color="#FFFFF3" size={89} />
            <h3 className="mt-4 text-[#FFFFF3] text-[22px] font-semibold text-center drop-shadow-md">
              APRENDIZADO PRÁTICO
            </h3>
          </div>

          <div className="flex flex-col items-center">
            <PiPlant color="#FFFFF3" size={89} />
            <h3 className="mt-4 text-[#FFFFF3] text-[22px] font-semibold text-center drop-shadow-md">
              SUSTENTABILIDADE
            </h3>
          </div>

          <div className="flex flex-col items-center">
            <RiCommunityLine color="#FFFFF3" size={89} />
            <h3 className="mt-4 text-[#FFFFF3] text-[22px] font-semibold text-center drop-shadow-md">
              COMUNIDADE
            </h3>
          </div>
        </div>
      </div>

      {/*Cards de Eventos*/}

      <section className="w-full flex flex-col items-center mt-[6rem]">
        {/* Titulo */}
        <h2 className="max-w-[45rem] text-center text-[2.25rem] font-bold uppercase">
          <span className="text-[#506600]">Acompanhe os </span>

          <span className="text-[#002A15]">hackathons, eventos e mostras das escolas!</span>
        </h2>

        {/*CARD 1*/}
        <div className="flex justify-center gap-5 mt-14">
          <div
  className="
    w-[350]
    h-[190]
    bg-white
    rounded-[20]
    border
    border-[#506600]
    border-l-5
    p-6
    relative
  "
>
  <span className="text-sm font-medium text-[#506600]">
  PRÓXIMO EVENTO • 04 AGO
</span>
<h3
  className="
    mt-
    text-[24px]
    font-semibold
    text-[#002A15]
    leading-tight
    max-w-[280px]
  "
>
  Torneio Regional FLL 
</h3>
<p
  className="
    absolute
    left-6
    bottom-16
    text-base
    text-[#002A15]
    opacity-70
  "
>
  Ginásio do Tinga, Caraguatatuba
</p> 
<button
  className="
    absolute
    left-6
    bottom-5
    w-[150]
    h-[32]
    border
    border-[#506600]
    rounded-lg
    text-[#506600]
    text-xs
    font-semibold
    flex
    items-center
    justify-center
    gap-1
  "
>
  Ver Detalhes
  <MdArrowForward size={20}/>
</button>
</div>
        </div>

        

      </section>
    </>
  )
}
