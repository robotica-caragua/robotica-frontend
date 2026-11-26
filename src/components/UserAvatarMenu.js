'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MdLogout, MdPersonOutline } from 'react-icons/md'
import { apiAuth, obterToken, obterUsuario } from '@/services/api'

function obterIniciais(nome) {
  const limpo = String(nome || '')
    .replace(/^(prof\.?|profª\.?|professor|professora)\s+/i, '')
    .trim()

  if (!limpo) return 'US'

  const ignorar = new Set(['da', 'de', 'do', 'das', 'dos', 'e'])
  const palavras = limpo.split(/\s+/).filter((p) => p && !ignorar.has(p.toLowerCase()))

  if (palavras.length >= 2) {
    return `${palavras[0][0]}${palavras[palavras.length - 1][0]}`.toUpperCase()
  }

  return limpo.slice(0, 2).toUpperCase()
}

export function UserAvatarMenu({ className = '' }) {
  const router = useRouter()
  const containerRef = useRef(null)
  const [aberto, setAberto] = useState(false)
  const [saindo, setSaindo] = useState(false)
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    let ativo = true
    const salvo = obterUsuario()
    if (salvo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsuario(salvo)
    }
    if (obterToken()) {
      apiAuth
        .me()
        .then((user) => {
          if (ativo && user) setUsuario(user)
        })
        .catch(() => {})
    }
    return () => {
      ativo = false
    }
  }, [])

  useEffect(() => {
    if (!aberto) return undefined

    const handleCliqueFora = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setAberto(false)
      }
    }

    const handleTecla = (e) => {
      if (e.key === 'Escape') setAberto(false)
    }

    document.addEventListener('mousedown', handleCliqueFora)
    document.addEventListener('keydown', handleTecla)
    return () => {
      document.removeEventListener('mousedown', handleCliqueFora)
      document.removeEventListener('keydown', handleTecla)
    }
  }, [aberto])

  const handleSair = async () => {
    if (saindo) return
    setSaindo(true)
    try {
      await apiAuth.logout()
    } finally {
      setAberto(false)
      setSaindo(false)
      router.replace('/login')
    }
  }

  const iniciais = obterIniciais(usuario?.name)
  const nomeExibicao = usuario?.name || 'Minha Conta'
  const emailExibicao = usuario?.email || ''

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setAberto((prev) => !prev)}
        aria-label="Menu do perfil"
        aria-expanded={aberto}
        aria-haspopup="menu"
        title={nomeExibicao}
        className="size-10 rounded-full border-2 border-verde-musgo bg-verde-pastel flex items-center justify-center text-verde-escuro text-sm font-bold tracking-wide hover:brightness-95 transition cursor-pointer shadow-xs select-none"
      >
        {iniciais}
      </button>

      {aberto && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-2xl border border-verde-musgo bg-white shadow-xl py-2 z-50"
        >
          <div className="px-4 py-2.5 border-b border-verde-escuro/10">
            <p className="text-sm font-bold text-verde-escuro truncate">{nomeExibicao}</p>
            {emailExibicao && (
              <p className="text-xs text-verde-musgo truncate mt-0.5">{emailExibicao}</p>
            )}
          </div>

          <div className="py-1 flex flex-col">
            <Link
              href="/perfil"
              role="menuitem"
              onClick={() => setAberto(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-verde-escuro hover:bg-input-bg transition"
            >
              <MdPersonOutline size={18} className="text-verde-musgo shrink-0" />
              <span>Ver Perfil</span>
            </Link>

            <button
              type="button"
              role="menuitem"
              disabled={saindo}
              onClick={handleSair}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-vermelho hover:bg-input-bg transition cursor-pointer disabled:opacity-60 text-left"
            >
              <MdLogout size={18} className="shrink-0" />
              <span>{saindo ? 'Saindo...' : 'Sair da Conta'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
