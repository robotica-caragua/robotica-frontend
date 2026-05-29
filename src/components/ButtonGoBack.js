'use client'

import { FaArrowLeft } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'

export function ButtonGoBack() {
  const router = useRouter()

  function handleGoBack() {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push('/')
  }

  return (
    <button
      type="button"
      onClick={handleGoBack}
      className="flex row self-end items-center justify-center bg-verde-limao py-2.5 px-6 rounded-xl hover:brightness-75"
    >
      <FaArrowLeft />
      <span className="ml-5 font-semibold">Voltar para a Página Anterior</span>
    </button>
  )
}
