'use client'
import { useState } from 'react'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
// Corrigido: Adicionado os ícones do FAQ na importação do react-icons/fa6
import { FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa6'

export default function Contato() {
  const [faqAberto, setFaqAberto] = useState(null)

  const toggleFaq = (index) => {
    setFaqAberto(faqAberto === index ? null : index)
  }

  // 2. LISTA DE PERGUNTAS E RESPOSTAS DO FIGMA
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
      pergunta: 'Como entro em contato com o suporte?',
      resposta:
        'Você pode enviar uma mensagem diretamente pelo formulário acima ou entrar em contato através do nosso e-mail oficial de suporte.'
    }
  ]

  return (
    <>
      <Header />
      <main className="w-full min-h-screen bg-background py-16 px-4 flex flex-col items-center">
        <div className="text-center mb-10">
          <span className="text-[#002A15] text-3xl md:text-[40px] font-bold leading-tight">
            ESCREVA UMA MENSAGEM{' '}
          </span>
          <span className="text-[#506600] text-3xl md:text-[40px] font-bold leading-tight">
            PARA NÓS!
          </span>
        </div>

        {/* formulario */}
        <div className="w-full max-w-[1236px] bg-white rounded-[10px] border border-[#506600] p-6 md:p-12 shadow-sm">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[#002A15] text-[23px] font-normal font-['Work_Sans']">
                  Nome
                </label>
                <input
                  type="text"
                  placeholder="Digite seu nome..."
                  className="w-full h-16 px-4 bg-[#F4FFD5] rounded-[5px] border border-[#506600] text-[#002A15] placeholder-[rgba(0,42,21,0.8)] font-['Work_Sans'] text-lg focus:outline-none focus:ring-1 focus:ring-[#506600]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#002A15] text-[23px] font-normal">Sobrenome</label>
                <input
                  type="text"
                  placeholder="Digite seu sobrenome..."
                  className="w-full h-16 px-4 bg-[#F4FFD5] rounded-[5px] border border-[#506600] text-[#002A15] placeholder-[rgba(0,42,21,0.8)] font-['Work_Sans'] text-lg focus:outline-none focus:ring-1 focus:ring-[#506600]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[#002A15] text-[23px] font-normal">Email</label>
                <input
                  type="email"
                  placeholder="exemplo@gmail.com"
                  className="w-full h-16 px-4 bg-[#F4FFD5] rounded-[5px] border border-[#506600] text-[#002A15] placeholder-[rgba(0,42,21,0.8)] font-['Work_Sans'] text-lg focus:outline-none focus:ring-1 focus:ring-[#506600]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#002A15] text-[23px] font-normal">Assunto</label>
                <input
                  type="text"
                  placeholder="Digite o assunto..."
                  className="w-full h-16 px-4 bg-[#F4FFD5] rounded-[5px] border border-[#506600] text-[#002A15] placeholder-[rgba(0,42,21,0.8)] font-['Work_Sans'] text-lg focus:outline-none focus:ring-1 focus:ring-[#506600]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-10">
              <textarea
                rows={10}
                placeholder="Escreva sua mensagem aqui....."
                className="w-full p-4 bg-[#F4FFD5] rounded-[5px] border border-[#506600] text-[#002A15] font-semibold placeholder:font-semibold placeholder-[rgba(0,42,21,0.8)] font-['Work_Sans'] text-lg focus:outline-none focus:ring-1 focus:ring-[#506600] resize-none"
              />
              <span className="text-[#002A15]/70 text-base font-normal mt-1 block font-['Montserrat']">
                Por favor, coloque o máximo de informação possível...
              </span>
            </div>

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="w-full sm:w-72 h-14 bg-verde-limao hover:opacity-90 transition-opacity rounded-[13.5px] border border-verde-escuro flex justify-center items-center gap-6 cursor-pointer"
              >
                <span className="text-center text-verde-escuro text-[21.60px] font-bold leading-[32.40px]">
                  Confirmar e enviar
                </span>
                <FaArrowRight className="text-[#002A15] text-xl" />
              </button>
            </div>
          </form>
        </div>

        <section className="w-full max-w-[1236px] mt-24 mb-40">
          <h2 className="text-center text-[#002A15] text-3xl md:text-[40px] font-bold font-['Work_Sans'] leading-tight uppercase mb-12">
            Perguntas Frequentes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
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
                    className="w-full py-12 px-10 flex justify-between items-center text-left gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="text-[#002A15] text-xl md:text-2xl font-medium font-['Work_Sans'] leading-tight">
                      {faq.pergunta}
                    </span>

                    <div className="text-[#002A15] text-xl shrink-0">
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </button>

                  {isOpen && (
                    <>
                      <div className="mx-6 border-t border-[#506600]/30" />
                      <div className="p-6 pt-4 text-[#002A15]/90 text-lg md:text-xl font-normal font-['Work_Sans'] leading-relaxed">
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
