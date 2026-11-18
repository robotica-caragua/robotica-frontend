'use client'
import { useState } from 'react'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa6'

export default function Contato() {
  const [faqAberto, setFaqAberto] = useState(null)

  const toggleFaq = (index) => {
    setFaqAberto(faqAberto === index ? null : index)
  }

  //perguntas frequentes...
  const faqs = [
    {
      pergunta: 'É necessário comprar kits de robótica caros para replicar os projetos do portal?',
      resposta:
        'De jeito nenhum! A grande maioria dos tutoriais disponíveis na nossa vitrine ensina como substituir peças comerciais complexas por materiais recicláveis!'
    },

    {
      pergunta: 'Vocês aceitam doação de peças e eletrônicos velhos?',
      resposta:
        'Com certeza! Nós aceitamos doações de componentes eletrônicos (como motores, LEDs, fios), mouses, teclados velhos e até placas de circuito. Esses materiais são limpos, triados e usados pelos alunos para construir os robôs e projetos dos nossos tutoriais.'
    },

    {
      pergunta: 'Como entro em contato com o suporte?',
      resposta:
        'Você pode enviar uma mensagem diretamente pelo formulário acima ou entrar em contato através do nosso e-mail oficial de suporte.'
    },

    {
      pergunta: 'Quem pode utilizar o portal?',
      resposta:
        'O portal é aberto para estudantes, professores, escolas e qualquer pessoa interessada em aprender sobre robótica, tecnologia e reutilização de materiais eletrônicos.'
    }
  ]

  return (
    <>
      <Header />
      <main className="w-full min-h-screen bg-background py-8 sm:py-16 px-4 flex flex-col items-center">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-[#002A15] text-2xl sm:text-3xl md:text-[40px] font-bold leading-tight">
            ESCREVA UMA MENSAGEM{' '}
          </span>
          <span className="text-[#506600] text-2xl sm:text-3xl md:text-[40px] font-bold leading-tight">
            PARA NÓS!
          </span>
        </div>

        {/* formulario */}

        <div className="w-full max-w-[1236px] bg-white rounded-[10px] border border-[#506600] p-5 sm:p-8 md:p-12 shadow-sm">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[#002A15] text-lg sm:text-[23px] font-normal font-['Work_Sans']">
                  Nome
                </label>
                <input
                  type="text"
                  placeholder="Digite seu nome..."
                  className="w-full h-12 sm:h-16 px-4 bg-[#F4FFD5] rounded-[5px] border border-[#506600] text-[#002A15] placeholder-[rgba(0,42,21,0.8)] font-['Work_Sans'] text-base sm:text-lg focus:outline-none focus:ring-1 focus:ring-[#506600]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#002A15] text-lg sm:text-[23px] font-normal">
                  Sobrenome
                </label>
                <input
                  type="text"
                  placeholder="Digite seu sobrenome..."
                  className="w-full h-12 sm:h-16 px-4 bg-[#F4FFD5] rounded-[5px] border border-[#506600] text-[#002A15] placeholder-[rgba(0,42,21,0.8)] font-['Work_Sans'] text-base sm:text-lg focus:outline-none focus:ring-1 focus:ring-[#506600]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[#002A15] text-lg sm:text-[23px] font-normal">Email</label>
                <input
                  type="email"
                  placeholder="exemplo@gmail.com"
                  className="w-full h-12 sm:h-16 px-4 bg-[#F4FFD5] rounded-[5px] border border-[#506600] text-[#002A15] placeholder-[rgba(0,42,21,0.8)] font-['Work_Sans'] text-base sm:text-lg focus:outline-none focus:ring-1 focus:ring-[#506600]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#002A15] text-lg sm:text-[23px] font-normal">Assunto</label>
                <input
                  type="text"
                  placeholder="Digite o assunto..."
                  className="w-full h-12 sm:h-16 px-4 bg-[#F4FFD5] rounded-[5px] border border-[#506600] text-[#002A15] placeholder-[rgba(0,42,21,0.8)] font-['Work_Sans'] text-base sm:text-lg focus:outline-none focus:ring-1 focus:ring-[#506600]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6 sm:mt-10">
              <textarea
                rows={8}
                placeholder="Escreva sua mensagem aqui....."
                className="w-full p-4 bg-[#F4FFD5] rounded-[5px] border border-[#506600] text-[#002A15] font-semibold placeholder:font-semibold placeholder-[rgba(0,42,21,0.8)] font-['Work_Sans'] text-base sm:text-lg focus:outline-none focus:ring-1 focus:ring-[#506600] resize-none"
              />
              <span className="text-[#002A15]/70 text-sm sm:text-base font-normal mt-1 block font">
                Por favor, coloque o máximo de informação possível...
              </span>
            </div>

            <div className="flex justify-center pt-4 sm:pt-6">
              <button
                type="submit"
                className="w-full sm:w-72 h-13 sm:h-14 bg-verde-limao hover:opacity-90 transition-opacity rounded-[13.5px] border border-verde-escuro flex justify-center items-center gap-4 sm:gap-6 cursor-pointer"
              >
                <span className="text-center text-verde-escuro text-lg sm:text-[21.60px] font-bold leading-[32.40px]">
                  Confirmar e enviar
                </span>
                <FaArrowRight className="text-[#002A15] text-lg sm:text-xl" />
              </button>
            </div>
          </form>
        </div>

        <section className="w-full max-w-[1236px] mt-14 sm:mt-24 mb-12 sm:mb-20">
          <h2 className="text-center text-[#002A15] text-2xl sm:text-3xl md:text-[40px] font-bold font-['Work_Sans'] leading-tight uppercase mb-8 sm:mb-12">
            Perguntas Frequentes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 items-start">
            {faqs.map((faq, index) => {
              const isOpen = faqAberto === index
              return (
                <div
                  key={index}
                  className="w-full bg-white rounded-lg border border-[#506600] transition-all duration-300 flex flex-col h-fit"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full py-5 px-5 sm:py-8 sm:px-8 flex justify-between items-center text-left gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="text-[#002A15] text-lg sm:text-xl md:text-2xl font-medium leading-tight">
                      {faq.pergunta}
                    </span>

                    <div className="text-[#002A15] text-xl shrink-0">
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </button>

                  {isOpen && (
                    <>
                      <div className="mx-5 sm:mx-6 border-t border-[#506600]/30" />
                      <div className="p-5 sm:p-6 pt-4 text-[#002A15]/90 text-base sm:text-lg md:text-xl font-normal leading-relaxed">
                        {faq.resposta}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
