'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { apiAuth, limparSessao, obterToken, obterUsuario } from '@/services/api'

const ROTAS_ADMIN = [
  '/admin',
  '/dashboard',
  '/gestaoUsuarios',
  '/cadastrarUsuario',
  '/escolas',
  '/cadastrarEscola',
  '/gestaoEventos',
  '/cadastrarEvento',
  '/gestaoAvisos'
]

const ROTAS_AUTENTICADAS = [
  '/painelProfessor',
  '/gestaoProjetos',
  '/novoProjeto',
  '/editarProjeto',
  '/grupos',
  '/gestaoTutoriais',
  '/cadastrarTutorial',
  '/editarTutorial',
  '/perfil'
]

function correspondeRota(pathname, rotas) {
  if (!pathname) return false
  return rotas.some((rota) => pathname === rota || pathname.startsWith(`${rota}/`))
}

export function RouteGuard({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  const ehRotaAdmin = correspondeRota(pathname, ROTAS_ADMIN)
  const ehRotaAutenticada = correspondeRota(pathname, ROTAS_AUTENTICADAS)
  const rotaProtegida = ehRotaAdmin || ehRotaAutenticada

  const [bloqueadoPath, setBloqueadoPath] = useState(null)

  useEffect(() => {
    if (!rotaProtegida) return

    let ativo = true
    const token = obterToken()

    if (!token) {
      limparSessao()
      router.replace('/unauthorized')
      return
    }

    const usuarioSalvo = obterUsuario()
    if (ehRotaAdmin && usuarioSalvo?.role && usuarioSalvo.role !== 'ADMIN') {
      router.replace('/unauthorized')
      return
    }

    apiAuth
      .me()
      .then((user) => {
        if (!ativo) return
        if (!user || (ehRotaAdmin && user.role !== 'ADMIN')) {
          setBloqueadoPath(pathname)
          router.replace('/unauthorized')
        }
      })
      .catch((err) => {
        if (!ativo) return
        if (err?.status === 401 || err?.status === 403) {
          setBloqueadoPath(pathname)
          limparSessao()
          router.replace('/unauthorized')
          return
        }
        // Se houver falha temporária de rede mas houver token/usuário válidos localmente,
        // ainda bloqueia rotas ADMIN para quem não é ADMIN
        if (ehRotaAdmin && usuarioSalvo?.role !== 'ADMIN') {
          setBloqueadoPath(pathname)
          router.replace('/unauthorized')
        }
      })

    return () => {
      ativo = false
    }
  }, [pathname, rotaProtegida, ehRotaAdmin, router])

  if (rotaProtegida && bloqueadoPath === pathname) {
    return null
  }

  return children
}
