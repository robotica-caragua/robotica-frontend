import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CiCalendar } from 'react-icons/ci'
import { CiClock2 } from 'react-icons/ci'
import { CiLocationOn } from 'react-icons/ci'
import { MdOutlineFileDownload } from 'react-icons/md'
import { IoDocumentTextOutline } from 'react-icons/io5'

export default function Projetos() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="grow flex flex-col items-center ">
        <div className="w-[75%] h-70 p-16 relative bg-linear-57 from-input-bg to-input-bg rounded-[20px] border-b-10 border-verde-musgo inline-flex flex-col justify-end items-start overflow-hidden mt-10">
          <div className="w-[75%] h-80 left-0 top-0 absolute opacity-10 bg-radial from-verde-limao to-verde-limao/0 to 70%" />

          <div className="self-stretch flex flex-col justify-start items-start gap-10">
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-verde-escuro text-5xl font-bold">
                Torneio Regional FLL
              </div>
            </div>

            <div className="self-stretch h-16 relative">
              <div className="left-0 top-0 absolute inline-flex justify-start items-center gap-10">
                <div className="h-8 flex justify-start items-center gap-1.5">
                  <div className="inline-flex flex-col justify-center items-center text-verde-musgo">
                    <CiCalendar size={28} />
                  </div>

                  <div className="inline-flex flex-col justify-start items-start">
                    <div className="justify-center text-verde-musgo text-xl font-medium">
                      04 de Agosto de 2026
                    </div>
                  </div>
                </div>

                <div className="h-6 flex justify-start items-center gap-1">
                  <div className="inline-flex flex-col justify-center items-center text-verde-musgo">
                    <CiClock2 size={28} />
                  </div>

                  <div className="inline-flex flex-col justify-start items-start">
                    <div className="justify-center text-verde-musgo text-xl font-medium">
                      09:00 AM - 04:00 PM
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-6 left-0 top-12 absolute inline-flex justify-start items-center gap-1">
                <div className="inline-flex flex-col justify-center items-center text-verde-musgo">
                  <CiLocationOn size={28} />
                </div>

                <div className="inline-flex flex-col justify-start items-start">
                  <div className="justify-center text-verde-musgo text-xl font-normal">
                    Ginásio do Tinga, Caraguatatuba
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[75%] h-80 inline-flex flex-col justify-start items-start my-15">
          <div className="w-56 h-9 justify-center text-verde-musgo text-4xl font-semibold">
            Descrição
          </div>

          <div className="self-stretch h-7 pb-2.5 border-b border-verde-musgo" />

          <div className="self-stretch h-64 py-2.5 flex flex-col justify-start items-start">
            <div className="self-stretch flex flex-col justify-start items-start text-xl">
              <div className="self-stretch justify-center text-verde-escuro text-2xl">
                O Torneio Regional FLL (FIRST LEGO League) chega a Caraguatatuba para reunir as
                mentes mais brilhantes das nossas escolas parceiras. <br />
                <br />
                Nesta temporada, estudantes de diversas escolas vão projetar, construir e programar
                robôs para solucionar missões complexas na arena, além de apresentarem um Projeto de
                Inovação voltado para a nossa comunidade. <br />
                <br />
                Venha prestigiar, torcer pelas equipes locais e ver a tecnologia ganhar vida no
                Ginásio do Tinga!
              </div>
            </div>
          </div>
        </div>

        <div className="w-[75%] flex justify-between items-start gap-10 mb-20">
          <div className="w-[60%] flex flex-col items-start gap-6">
            <div className="self-stretch h-14 pb-1 border-b border-verde-musgo flex flex-col justify-start items-start">
              <div className="justify-center text-verde-musgo text-4xl font-semibold">Agenda</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
              <div className="self-stretch h-16 p-5 bg-white rounded-xl border-l-5 border-r border-t border-b border-verde-musgo inline-flex justify-start items-start gap-10">
                <div className="w-12 h-6 inline-flex flex-col justify-start items-start">
                  <div className="justify-center text-verde-musgo text-2xl font-bold">09:00</div>
                </div>
                <div className="self-stretch inline-flex flex-col justify-start items-start">
                  <div className="flex flex-col justify-start items-start">
                    <div className="justify-center text-verde-escuro text-xl font-bold">
                      Abertura dos Portões e Credenciamento das Equipes
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch p-5 bg-white rounded-xl border-l-5 border-r border-t border-b border-verde-musgo inline-flex justify-start items-start gap-10">
                <div className="w-12 h-6 inline-flex flex-col justify-start items-start">
                  <div className="justify-center text-verde-musgo text-2xl font-bold">09:30</div>
                </div>
                <div className="self-stretch inline-flex flex-col justify-start items-start">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-verde-escuro text-xl font-bold">
                      Cerimônia de Abertura Oficial
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch h-16 p-5 bg-white rounded-xl border-l-5 border-r border-t border-b border-verde-musgo inline-flex justify-start items-start gap-10">
                <div className="w-12 h-6 inline-flex flex-col justify-start items-start">
                  <div className="justify-center text-verde-musgo text-2xl font-bold">10:15</div>
                </div>
                <div className="inline-flex flex-col justify-start items-start">
                  <div className="flex flex-col justify-start items-start">
                    <div className="justify-center text-verde-escuro text-xl font-bold">
                      Início dos Rounds de Avaliação
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch p-5 bg-white rounded-xl border-l-5 border-r border-t border-b border-verde-musgo inline-flex justify-start items-start gap-10">
                <div className="w-12 h-6 inline-flex flex-col justify-start items-start">
                  <div className="justify-center text-verde-musgo text-2xl font-bold">12:00</div>
                </div>
                <div className="self-stretch inline-flex flex-col justify-start items-start">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-verde-escuro text-xl font-bold">
                      Intervalo para Almoço
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch p-5 bg-white rounded-xl border-l-5 border-r border-t border-b border-verde-musgo inline-flex justify-start items-start gap-10">
                <div className="w-12 h-6 inline-flex flex-col justify-start items-start">
                  <div className="justify-center text-verde-musgo text-2xl font-bold">13:30</div>
                </div>
                <div className="self-stretch inline-flex flex-col justify-start items-start">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-verde-escuro text-xl font-bold">
                      Desafios na Arena de Robôs
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch h-16 p-5 bg-white rounded-xl border-l-5 border-r border-t border-b border-verde-musgo inline-flex justify-start items-start gap-10">
                <div className="w-12 h-6 inline-flex flex-col justify-start items-start">
                  <div className="justify-center text-verde-musgo text-2xl font-bold">15:30</div>
                </div>
                <div className=" self-stretch inline-flex flex-col justify-start items-start">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-verde-escuro text-xl font-bold">
                      Solenidade de Premiação e Entrega de Medalhas
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch p-5 bg-white rounded-xl border-l-5 border-r border-t border-b border-verde-musgo inline-flex justify-start items-start gap-10">
                <div className="w-12 h-6 inline-flex flex-col justify-start items-start">
                  <div className="justify-center text-verde-musgo text-2xl font-bold">16:00</div>
                </div>
                <div className=" self-stretch inline-flex flex-col justify-start items-start">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="w-72 justify-center text-verde-escuro text-xl font-bold">
                      Encerramento do Evento
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[35%] px-5 py-10 bg-white rounded-xl outline -outline-offset-1 outline-verde-musgo flex flex-col items-start gap-6 mt-20">
            <div className="w-full flex flex-col items-start border-b border-verde-musgo pb-2">
              <h2 className="text-verde-musgo text-3xl font-semibold">Documentação</h2>
            </div>

            <div className="w-full flex flex-col gap-4">
              <button className="w-full px-4 py-3 bg-input-bg rounded-lg flex items-center justify-between hover:bg-verde-limao/20 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <IoDocumentTextOutline size={26} className="text-verde-escuro shrink-0" />
                  <span className="text-verde-escuro text-lg font-medium truncate">
                    Guia_de_Missões.pdf
                  </span>
                </div>
                <MdOutlineFileDownload size={26} className="text-verde-escuro shrink-0" />
              </button>

              <button className="w-full px-4 py-3 bg-input-bg rounded-lg flex items-center justify-between hover:bg-verde-limao/20 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <IoDocumentTextOutline size={26} className="text-verde-escuro shrink-0" />
                  <span className="text-verde-escuro text-lg font-medium truncate">
                    Manual_das_Equipes.pdf
                  </span>
                </div>
                <MdOutlineFileDownload size={26} className="text-verde-escuro shrink-0" />
              </button>

              <button className="w-full px-4 py-3 bg-input-bg rounded-lg flex items-center justify-between hover:bg-verde-limao/20 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <IoDocumentTextOutline size={26} className="text-verde-escuro shrink-0" />
                  <span className="text-verde-escuro text-lg font-medium truncate">
                    Regulamento.pdf
                  </span>
                </div>
                <MdOutlineFileDownload size={26} className="text-verde-escuro shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
