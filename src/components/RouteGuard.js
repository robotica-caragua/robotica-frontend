'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  apiAuth,
  lerIdsUsuariosInativos,
  limparSessao,
  obterToken,
  obterUsuario
} from '@/services/api'

const ROTAS_ADMIN = [
  '/admin',
  '/dashboard',
  '/gestaoUsuarios',
  '/cadastrarUsuario',
  '/escolas',
  '/cadastrarEscola',
  '/gestaoEventos',
  '/cadastrarEvento',
  '/gestaoAvisos',
  '/gestaoDuvidas'
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
    if (usuarioSalvo?.id && lerIdsUsuariosInativos().has(Number(usuarioSalvo.id))) {
      limparSessao()
      router.replace('/login')
      return
    }

    const ehAdminSalvo =
      usuarioSalvo?.role === 'ADMIN' ||
      usuarioSalvo?.perfil === 'ADMINISTRADOR' ||
      usuarioSalvo?.permissaoAdministrador === true

    if (ehRotaAdmin && usuarioSalvo?.role && !ehAdminSalvo) {
      router.replace('/unauthorized')
      return
    }

    if (pathname === '/painelProfessor' && ehAdminSalvo) {
      router.replace('/dashboard')
      return
    }

    apiAuth
      .me({ forcar: true })
      .then((user) => {
        if (!ativo) return
        if (!user || (user.id && lerIdsUsuariosInativos().has(Number(user.id)))) {
          setBloqueadoPath(pathname)
          limparSessao()
          router.replace('/login')
          return
        }
        const ehAdmin =
          user.role === 'ADMIN' ||
          user.perfil === 'ADMINISTRADOR' ||
          user.permissaoAdministrador === true
        if (ehRotaAdmin && !ehAdmin) {
          setBloqueadoPath(pathname)
          router.replace('/unauthorized')
          return
        }
        if (pathname === '/painelProfessor' && ehAdmin) {
          router.replace('/dashboard')
        }
      })
      .catch((err) => {
        if (!ativo) return
        if (err?.status === 401 || err?.status === 403 || err?.status === 404) {
          setBloqueadoPath(pathname)
          limparSessao()
          router.replace('/login')
          return
        }
        if (ehRotaAdmin && !ehAdminSalvo) {
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
