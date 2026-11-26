'use client'

import { FaArrowLeft } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'

export function ButtonGoBack({ fallbackHref = '/' }) {
  const router = useRouter()

  function handleGoBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }

    router.push(fallbackHref)
  }

  return (
    <button
      type="button"
      onClick={handleGoBack}
      className="flex flex-row self-center lg:self-end items-center justify-center bg-verde-limao py-2.5 px-5 sm:px-6 rounded-xl hover:brightness-75 text-sm sm:text-base cursor-pointer"
    >
      <FaArrowLeft className="shrink-0" />
      <span className="ml-3 font-semibold">Voltar</span>
    </button>
  )
}
