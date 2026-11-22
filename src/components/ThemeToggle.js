'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5'

const STORAGE_KEY = 'biobot_theme'

function aplicarTemaNoDocumento(tema) {
  if (typeof document === 'undefined') return
  const ehEscuro = tema === 'dark'
  document.documentElement.classList.toggle('dark', ehEscuro)
  document.documentElement.style.colorScheme = ehEscuro ? 'dark' : 'light'
}

function lerTemaAtual() {
  if (typeof window === 'undefined') return 'light'
  return window.localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
}

function assinarTema(callback) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('biobot-theme-change', callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener('biobot-theme-change', callback)
    window.removeEventListener('storage', callback)
  }
}

export function ThemeToggle({ variant = 'icon', className = '' }) {
  const tema = useSyncExternalStore(assinarTema, lerTemaAtual, () => 'light')

  useEffect(() => {
    aplicarTemaNoDocumento(tema)
  }, [tema])

  const alternarTema = () => {
    const novoTema = tema === 'dark' ? 'light' : 'dark'
    window.localStorage.setItem(STORAGE_KEY, novoTema)
    aplicarTemaNoDocumento(novoTema)
    window.dispatchEvent(new CustomEvent('biobot-theme-change'))
  }

  const ehEscuro = tema === 'dark'

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={alternarTema}
        aria-label={ehEscuro ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
        title={ehEscuro ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
        className={`theme-toggle-btn inline-flex items-center gap-2 rounded-full border border-verde-musgo/30 bg-white px-3.5 py-2 text-xs font-semibold text-verde-musgo hover:bg-verde-pastel/60 hover:text-verde-escuro transition-all duration-200 cursor-pointer shadow-xs ${className}`}
      >
        {ehEscuro ? (
          <>
            <IoSunnyOutline size={16} className="shrink-0" />
            <span>Modo Claro</span>
          </>
        ) : (
          <>
            <IoMoonOutline size={16} className="shrink-0" />
            <span>Modo Escuro</span>
          </>
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={ehEscuro ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      title={ehEscuro ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      className={`theme-toggle-btn size-10 shrink-0 rounded-full border border-verde-musgo/30 bg-white text-verde-musgo hover:bg-verde-pastel/60 hover:text-verde-escuro transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs ${className}`}
    >
      {ehEscuro ? <IoSunnyOutline size={19} /> : <IoMoonOutline size={19} />}
    </button>
  )
}
