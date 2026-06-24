'use client'

import { useState } from 'react'
import { IoIosArrowBack } from "react-icons/io"
import { MdArrowForwardIos } from "react-icons/md"

export function Page() {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="flex items-center justify-center gap-3 mb-35  mt-20  font-sans my-8 select-none">

      <button 
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="text-verde-musgo hover:opacity-80 p-1 transition-opacity  bled:opacity-30 disabled:cursor-not-allowed"
      >
        <IoIosArrowBack className="w-5 h-5" />
      </button>

    
      <button 
        onClick={() => setCurrentPage(1)}
        className={`w-10 h-10 flex items-center justify-center font-bold rounded-full transition-colors
          ${currentPage === 1 
            ? 'bg-verde-oliva text-black' 
            : 'border-2 border-verde-musgo text-black hover:bg-gray-50'
          }`}
      >
        1
      </button>

      <button 
        onClick={() => setCurrentPage(2)}
        className={`w-10 h-10 flex items-center justify-center font-bold rounded-full transition-colors
          ${currentPage === 2 
            ? 'bg-verde-oliva text-black' 
            : 'border-2 border-verde-musgo text-black hover:bg-gray-50'
          }`}
      >
        2
      </button>

      <button 
        onClick={() => setCurrentPage(3)}
        className={`w-10 h-10 flex items-center justify-center font-bold rounded-full transition-colors
          ${currentPage === 3 
            ? 'bg-verde-oliva text-black' 
            : 'border-2 border-verde-musgo text-black hover:bg-gray-50'
          }`}
      >
        3
      </button>

     
      <span className="text-verde-musgo font-bold px-1">...</span>

      <button 
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, 3))}
        disabled={currentPage === 3}
        className="text-verde-musgo hover:opacity-80 p-1 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <MdArrowForwardIos className="w-5 h-5" />
      </button>
    </div>
  )
}