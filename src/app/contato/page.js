'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ModalConfirmacao } from '@/components/ModalConfirmacao'
import { apiContatos } from '@/services/api'
import { FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa'

export default function Contato() {
  const [faqsAbertos, setFaqsAbertos] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    assunto: '',
    mensagem: ''
  })

  const atualizarCampo = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }))
  }

  const handleEnviar = (e) => {
    e.preventDefault()
    apiContatos.criar(form)
    setForm({
      nome: '',
      sobrenome: '',
      email: '',
      assunto: '',
      mensagem: ''
    })
    setModalAberto(true)
  }

  const toggleFaq = (index) => {
    setFaqsAbertos((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const faqs = [
    {
      pergunta: 'Como funciona o processo de envio de projetos?',
      resposta:
        'Os professores cadastrados na plataforma podem submeter seus projetos diretamente pelo painel. A equipe pedagógica revisa o material para garantir que siga as diretrizes e, uma vez aprovado, ele fica disponível publicamente no catálogo.'
    },
    {
      pergunta: 'Posso cadastrar projetos com vídeo do YouTube?',
      resposta:
        'Sim! Recomendamos que os tutoriais e demonstrações em vídeo sejam hospedados em plataformas como o YouTube para garantir melhor velocidade e facilidade de reprodução aos alunos.'
    },
    {
      pergunta: 'Quais tipos de materiais posso utilizar nos projetos?',
      resposta:
        'Nosso foco principal é a robótica sustentável e de baixo custo. Portanto, incentivamos o uso de materiais recicláveis (sucatas, papelão) combinados com componentes eletrônicos acessíveis (como Arduino, sensores básicos e motores simples).'
    },
    {
      pergunta: 'Como entro em contato para agendar uma capacitação?',
      resposta:
        'Você pode utilizar o formulário acima selecionando o assunto "Capacitação" ou enviar uma mensagem detalhando sua escola e demanda para alinharmos uma data com a coordenação.'
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-branco-esverdeado/20">
      <Header />
      <main className="grow flex flex-col items-center py-8 sm:py-12 px-4">
        <section className="flex flex-col items-center text-center gap-2 mb-3 px-4">
          <h1 className="font-extrabold text-3xl sm:text-4xl text-verde-escuro uppercase tracking-tight">
            Envie sua mensagem <span className="text-verde-musgo">para nós!</span>
          </h1>
          <p className="text-sm sm:text-base text-verde-musgo font-medium max-w-2xl mx-auto leading-relaxed">
            Dúvidas, sugestões ou parcerias? Entre em contato com a equipe do Conexão Robótica.
          </p>
        </section>

        {/* formulário */}
        <div className="w-full max-w-4xl bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs mt-6 sm:mt-8">
          <form className="flex flex-col gap-6" onSubmit={handleEnviar}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-verde-escuro uppercase tracking-wider">
                  Nome
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={atualizarCampo('nome')}
                  placeholder="Digite seu nome..."
                  className="w-full h-11 px-3.5 bg-input-bg rounded-xl border border-stone-300 text-verde-escuro text-sm sm:text-base focus:border-verde-musgo focus:outline-none transition"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-verde-escuro uppercase tracking-wider">
                  Sobrenome
                </label>
                <input
                  type="text"
                  value={form.sobrenome}
                  onChange={atualizarCampo('sobrenome')}
                  placeholder="Digite seu sobrenome..."
                  className="w-full h-11 px-3.5 bg-input-bg rounded-xl border border-stone-300 text-verde-escuro text-sm sm:text-base focus:border-verde-musgo focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-verde-escuro uppercase tracking-wider">
                  E-mail
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={atualizarCampo('email')}
                  placeholder="exemplo@gmail.com"
                  className="w-full h-11 px-3.5 bg-input-bg rounded-xl border border-stone-300 text-verde-escuro text-sm sm:text-base focus:border-verde-musgo focus:outline-none transition"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-verde-escuro uppercase tracking-wider">
                  Assunto
                </label>
                <input
                  type="text"
                  value={form.assunto}
                  onChange={atualizarCampo('assunto')}
                  placeholder="Digite o assunto..."
                  className="w-full h-11 px-3.5 bg-input-bg rounded-xl border border-stone-300 text-verde-escuro text-sm sm:text-base focus:border-verde-musgo focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-bold text-verde-escuro uppercase tracking-wider">
                Mensagem
              </label>
              <textarea
                rows={5}
                value={form.mensagem}
                onChange={atualizarCampo('mensagem')}
                placeholder="Escreva sua mensagem aqui..."
                className="w-full p-3.5 bg-input-bg rounded-xl border border-stone-300 text-verde-escuro text-sm sm:text-base focus:border-verde-musgo focus:outline-none transition resize-none"
                required
              />
              <span className="text-stone-400 text-xs">
                Por favor, forneça o máximo de detalhes possível.
              </span>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-10 h-11 bg-verde-musgo hover:bg-white hover:text-verde-musgo border-2 border-verde-musgo text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Confirmar e enviar</span>
                <FaArrowRight size={14} />
              </button>
            </div>
          </form>
        </div>

        {/* FAQ */}
        <section className="w-full max-w-4xl mt-16 sm:mt-20 mb-8">
          <h2 className="text-center text-verde-escuro text-xl sm:text-2xl font-extrabold uppercase tracking-tight mb-8">
            Perguntas <span className="text-verde-musgo">Frequentes</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {faqs.map((faq, index) => {
              const isOpen = faqsAbertos.includes(index)
              return (
                <div
                  key={index}
                  className="w-full bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs transition"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 flex justify-between items-center text-left gap-3 cursor-pointer focus:outline-none hover:bg-stone-50 transition"
                  >
                    <span className="text-verde-escuro text-sm sm:text-base font-bold leading-snug">
                      {faq.pergunta}
                    </span>

                    <div className="text-verde-musgo text-xs shrink-0">
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-stone-100">
                      {faq.resposta}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
      <ModalConfirmacao
        aberto={modalAberto}
        tipo="sucesso"
        titulo="Mensagem enviada!"
        mensagem="Recebemos a sua mensagem. Em breve a nossa equipe entrará em contato."
        textoConfirmar="Entendido"
        onConfirmar={() => setModalAberto(false)}
      />
    </div>
  )
}
