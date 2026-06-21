'use client'
import { useState } from 'react'
import Link from 'next/link'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

import { 
  MdArrowBack, 
  MdPhotoLibrary, 
  MdChevronLeft, 
  MdChevronRight,
  MdInsertDriveFile,
  MdLocationOn,
  MdArrowForward
} from 'react-icons/md'

export default function detalhesProjeto() {
  return (
    <>
      <Header />
      
      <main className="w-full min-h-screen bg-[#FFFDF5] py-16 px-4 flex flex-col items-center justify-start">
        <div className="w-full max-w-[1200px] flex flex-col gap-10">
          
          {/* botão voltar */}
          <div className="self-start mt-4 md:-ml-12">
            <Link 
              href="/tutoriais" 
              className="text-[#002A15] hover:opacity-80 transition-opacity text-4xl md:text-5xl flex items-center cursor-pointer"
            >
              <MdArrowBack />
            </Link>
          </div>

          {/* cabeçalho do Projeto */}
          <div className="flex flex-col gap-3">
            <h1 className="text-[#002A15] text-5xl font-bold font-sans leading-[56px]">
              Semáforo Inteligente
            </h1>
            
            {/* tags */}
            <div className="pl-6 border-l-4 border-lime-400 flex flex-wrap items-center gap-x-6 gap-y-2 text-[#506600] font-sans text-base">
              <div>
                <strong className="text-[#002A15]">Orientador:</strong> Prof. Robson Nascimento
              </div>
              <span className="hidden md:inline text-[#506600]">|</span>
              <div>
                <strong className="text-[#002A15]">Escola:</strong> EMEF Prof. Luiz Ribeiro Muniz
              </div>
              <span className="hidden md:inline text-[#506600]">|</span>
              <div>
                <strong className="text-[#002A15]">Data da Publicação:</strong> 15 de Outubro de 2024
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-8 justify-between items-start">
            
            {/* galeria do projeto */}
            <div className="w-full max-w-[800px] flex flex-col gap-6">
              
              <div className="flex items-center gap-3">
                <div className="p-1 bg-[#E8F5D6] rounded-lg flex items-center justify-center">
                  <MdPhotoLibrary className="text-xl text-[#506600]" />
                </div>
                <h2 className="text-[#002A15] text-2xl font-semibold font-sans leading-8">
                  Galeria do Projeto
                </h2>
              </div>

              {/* carrossel */}
              <div className="w-full flex flex-col items-center gap-4 relative">
                
                {/* Container que segura a Imagem e as Setas nas pontas extremas */}
                <div className="w-full relative flex items-center justify-center px-14">
                  
                  {/* seta esquerda */}
                  <button
                    type="button"
                    className="w-10 h-10 absolute left-0 top-[50%] -translate-y-1/2 bg-[#E8F5D6] hover:opacity-90 text-[#506600] rounded-full flex justify-center items-center cursor-pointer transition-opacity text-xl focus:outline-none z-10"
                  >
                    <MdChevronLeft />
                  </button>

                  {/* imagem */}
                  <div className="w-full max-w-[650px] h-96 bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex-1">
                    <img
                      className="w-full h-full object-cover"
                      src="https://t4.ftcdn.net/jpg/01/63/58/21/360_F_163582149_7XleuAaTQJ7LYZMCCLyo2sJjiZTgv0As.jpg"
                      alt="Semáforo Inteligente Protótipo"
                    />
                  </div>

                  {/* seta direita */}
                  <button
                    type="button"
                    className="w-10 h-10 absolute right-0 top-[50%] -translate-y-1/2 bg-[#E8F5D6] hover:opacity-90 text-[#506600] rounded-full flex justify-center items-center cursor-pointer transition-opacity text-xl focus:outline-none z-10"
                  >
                    <MdChevronRight />
                  </button>
                  
                </div>

                {/* bolinhas */}
                <div className="flex justify-center items-center gap-1 mt-2 w-full max-w-[650px]">
                  <div className="w-2 h-2 bg-lime-400 rounded-full" />
                  <div className="w-2 h-2 bg-stone-300/30 rounded-full" />
                  <div className="w-2 h-2 bg-stone-300/30 rounded-full" />
                  <div className="w-2 h-2 bg-stone-300/30 rounded-full" />
                </div>

              </div>
            </div>

            {/* tecnologias e equipe */}
            <div className="w-full lg:w-96 bg-white border border-stone-300 rounded-lg p-6 flex flex-col gap-5 shadow-sm font-sans">
              
              {/* bloco tecnologias */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[#002A15] text-2xl font-semibold leading-8">Tecnologias</h3>
                <div className="py-5 border-b border-[#506600] flex flex-col">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#E8F5D6] text-[#506600] text-xs font-normal rounded-xl">Python</span>
                    <span className="px-3 py-1 bg-[#E8F5D6] text-[#506600] text-xs font-normal rounded-xl">OpenCV</span>
                    <span className="px-3 py-1 bg-[#E8F5D6] text-[#506600] text-xs font-normal rounded-xl">MQTT</span>
                    <span className="px-3 py-1 bg-[#E8F5D6] text-[#506600] text-xs font-normal rounded-xl">Raspberry Pi</span>
                  </div>
                </div>
              </div>

              {/* bloco equipe */}
              <div className="flex flex-col gap-5">
                <h3 className="text-[#002A15] text-2xl font-semibold leading-8 py-[5px]">Equipe</h3>
                
                <div className="flex flex-col gap-[5px]">
                  <span className="text-[#506600] text-base font-medium uppercase tracking-wide">ORIENTADOR</span>
                  <span className="text-[#002A15] text-base font-bold">Prof. Robson Nascimento</span>
                </div>

                <div className="flex flex-col gap-4 pt-2">
                  <span className="text-[#506600] text-base font-medium uppercase tracking-wide">ESTUDANTES</span>
                  <div className="flex flex-col gap-3">
                    <span className="text-[#002A15] text-base font-bold">Beatriz Santos</span>
                    <span className="text-[#002A15] text-base font-bold">Lucas Oliveira</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* sobre o projeto */}
          <div className="w-full bg-white rounded-3xl border border-[#506600] p-10 flex flex-col gap-6 font-sans">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-[#E8F5D6] rounded-lg flex items-center justify-center">
                <MdInsertDriveFile className="text-xl text-[#506600]" />
              </div>
              <h2 className="text-[#002A15] text-2xl font-semibold leading-8">
                Sobre o Projeto
              </h2>
            </div>
            <p className="text-[#506600] text-xl font-normal leading-7 text-justify pb-6">
              Este projeto foi desenvolvido para simular o controle de tráfego de um cruzamento real. Utilizamos sensores e temporizadores para garantir a segurança dos pedestres e a fluidez dos carros. O foco principal é a automação urbana e a acessibilidade tecnológica aplicada a problemas do cotidiano.
            </p>
          </div>

          {/* unidade escolar */}
          <div className="w-full bg-white rounded-3xl border border-[#506600] p-8 flex flex-col gap-6 font-sans">
            <div className="flex flex-col gap-4">
              <h2 className="text-[#506600] text-3xl font-medium leading-9">
                EMEF MARIA DE LOURDES
              </h2>
              <div className="flex items-center gap-2 text-[#506600] text-lg font-normal leading-6">
                <MdLocationOn className="text-xl" />
                <span>Caraguatatuba, SP - Bairro Perequê-Mirim</span>
              </div>
              <p className="text-[#002A15] text-2xl font-normal leading-6 mt-2">
                Referência regional em robótica educacional inclusiva. Nossa escola desenvolve projetos que integram tecnologia e consciência ambiental desde os anos iniciais.
              </p>
            </div>

            {/* projetos da unidade */}
            <div className="flex flex-col gap-4 pt-4 border-t border-stone-100">
              <h3 className="text-[#002A15] text-base font-semibold uppercase tracking-wider">
                OUTROS PROJETOS DA UNIDADE
              </h3>
              
              <div className="flex flex-col gap-4">
                <div className="w-full p-4 bg-[#E8F5D6] rounded-xl flex justify-between items-center hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="text-[#506600] text-lg font-medium">Horta Automatizada v2</span>
                  <MdArrowForward className="text-[#002A15]" />
                </div>

                <div className="w-full p-4 bg-[#E8F5D6] rounded-xl flex justify-between items-center hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="text-[#506600] text-lg font-medium">Sensor de Chuva IOT</span>
                  <MdArrowForward className="text-[#002A15]" />
                </div>

                <div className="w-full p-4 bg-[#E8F5D6] rounded-xl flex justify-between items-center hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="text-[#506600] text-lg font-medium">Lixeira Inteligente</span>
                  <MdArrowForward className="text-[#002A15]" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}