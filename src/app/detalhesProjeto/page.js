'use client'
import { useState } from 'react'
import Link from 'next/link'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

import {
  MdArrowBack,
  MdPhotoLibrary,
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/md'

export default function detalhesProjeto() {
  return (
    <>
      <Header />

      <main className="w-full min-h-screen bg-background py-16 px-4 flex flex-col items-start justify-start md:pl-20">
        <div className="w-full max-w-[1236px] flex flex-col gap-10">

          {/* botão voltar */}
          <div className="self-start mt-4">
            <Link
              href="/tutoriais"
              className="text-[#002A15] hover:opacity-80 transition-opacity text-4xl md:text-5xl flex items-center cursor-pointer"
            >
              <MdArrowBack />
            </Link>
          </div>

          {/* cabeçalho */}
          <div className="flex flex-col gap-3">
            <h1 className="text-[#002A15] text-4xl md:text-5xl font-bold font-['Work_Sans'] leading-tight">
              Semáforo Inteligente
            </h1>

            {/* Metadados / Badges */}
            <div className="pl-6 border-l-4 border-lime-400 flex flex-wrap items-center gap-x-6 gap-y-2 text-[#506600] font-['Work_Sans'] text-base">
              <div>
                <strong className="text-[#002A15]">Orientador:</strong> Prof. Robson Nascimento
              </div>
              <span className="hidden md:inline">|</span>
              <div>
                <strong className="text-[#002A15]">Escola:</strong> EMEF Prof. Luiz Ribeiro Muniz
              </div>
              <span className="hidden md:inline">|</span>
              <div>
                <strong className="text-[#002A15]">Data da Publicação:</strong> 15 de Outubro de 2024
              </div>
            </div>
          </div>

          {/* seção da galeria */}
          <div className="flex flex-col gap-6 items-start w-full">

            <div className="flex items-center gap-2 text-[#002A15] text-2xl font-bold font-['Work_Sans'] md:pl-16">
              <MdPhotoLibrary className="text-3xl text-[#506600]" />
              <h2>Galeria do Projeto</h2>
            </div>

            {/* carrossel */}
            <div className="w-full max-w-[800px] flex items-center justify-between gap-6 relative md:ml-12">

              {/* seta esquerda */}
              <button
                type="button"
                className="w-10 h-10 bg-[#E8F5D6] hover:opacity-90 text-[#506600] rounded-full flex justify-center items-center cursor-pointer transition-opacity text-xl focus:outline-none shrink-0"
              >
                <MdChevronLeft />
              </button>

              {/* imagem */}
              <div className="w-full max-w-[600px] h-[200px] md:h-[400px] max-h-[437px] bg-[#F4FFD5]/30 rounded-3xl overflow-hidden relative shadow-sm flex-1">
                <img
                  className="w-full h-full object-cover"
                  src="https://t4.ftcdn.net/jpg/01/63/58/21/360_F_163582149_7XleuAaTQJ7LYZMCCLyo2sJjiZTgv0As.jpg"
                  alt="Semáforo Inteligente Protótipo"
                />
              </div>

              {/* seta direita */}
              <button
                type="button"
                className="w-10 h-10 bg-[#E8F5D6] hover:opacity-90 text-[#506600] rounded-full flex justify-center items-center cursor-pointer transition-opacity text-xl focus:outline-none shrink-0"
              >
                <MdChevronRight />
              </button>

            </div>

            {/* Bolinhas embaixo da imagem */}
            <div className="flex justify-center items-center gap-1 w-full max-w-[600px] md:pl-[260px]">
              <div className="w-2 h-2 bg-lime-400 rounded-full" />
              <div className="w-2 h-2 bg-stone-300/40 rounded-full" />
              <div className="w-2 h-2 bg-stone-300/40 rounded-full" />
              <div className="w-2 h-2 bg-stone-300/40 rounded-full" />
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}