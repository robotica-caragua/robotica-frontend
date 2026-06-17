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
        <main className="w-full min-h-screen bg-background py-16 px-4 flex flex-col items-center">
            <div className="w-full max-w-[1236px] flex flex-col gap-10">
<div className="self-start mt-4 md:-ml-4">
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
            </div>
        </main>
        <Footer />
        </>
    )

}