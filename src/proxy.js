import { NextResponse } from 'next/server'

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
  return rotas.some((rota) => pathname === rota || pathname.startsWith(`${rota}/`))
}

function decodificarPayloadJwt(token) {
  try {
    const partes = token.split('.')
    if (partes.length !== 3) return null
    const base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = atob(padded)
    return JSON.parse(json)
  } catch {
    return null
  }
}

function redirecionarNaoAutorizado(request, limparCookies = false) {
  const url = request.nextUrl.clone()
  url.pathname = '/unauthorized'
  url.search = ''
  const response = NextResponse.redirect(url)
  if (limparCookies) {
    response.cookies.delete('token')
    response.cookies.delete('role')
  }
  return response
}

export function proxy(request) {
  const { pathname } = request.nextUrl

  const ehRotaAdmin = correspondeRota(pathname, ROTAS_ADMIN)
  const ehRotaAutenticada = correspondeRota(pathname, ROTAS_AUTENTICADAS)

  if (!ehRotaAdmin && !ehRotaAutenticada) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value?.trim()
  if (!token) {
    return redirecionarNaoAutorizado(request)
  }

  const payload = decodificarPayloadJwt(token)
  if (!payload || !payload.userId) {
    return redirecionarNaoAutorizado(request, true)
  }

  if (payload.exp && payload.exp * 1000 < Date.now()) {
    // Permite que o cliente renove o accessToken via refresh token cookie (/auth/refresh)
    // sem derrubar a sessão nem causar loop de redirecionamento quando o token de 15m expira.
    if (ehRotaAdmin) {
      const role = String(payload.role || request.cookies.get('role')?.value || '').toUpperCase()
      if (role !== 'ADMIN') {
        return redirecionarNaoAutorizado(request)
      }
    }
    return NextResponse.next()
  }

  if (ehRotaAdmin) {
    const role = String(payload.role || request.cookies.get('role')?.value || '').toUpperCase()
    if (role !== 'ADMIN') {
      return redirecionarNaoAutorizado(request)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/dashboard',
    '/dashboard/:path*',
    '/gestaoUsuarios',
    '/gestaoUsuarios/:path*',
    '/cadastrarUsuario',
    '/cadastrarUsuario/:path*',
    '/escolas',
    '/escolas/:path*',
    '/cadastrarEscola',
    '/cadastrarEscola/:path*',
    '/gestaoEventos',
    '/gestaoEventos/:path*',
    '/cadastrarEvento',
    '/cadastrarEvento/:path*',
    '/gestaoAvisos',
    '/gestaoAvisos/:path*',
    '/gestaoDuvidas',
    '/gestaoDuvidas/:path*',
    '/painelProfessor',
    '/painelProfessor/:path*',
    '/gestaoProjetos',
    '/gestaoProjetos/:path*',
    '/novoProjeto',
    '/novoProjeto/:path*',
    '/editarProjeto',
    '/editarProjeto/:path*',
    '/grupos',
    '/grupos/:path*',
    '/gestaoTutoriais',
    '/gestaoTutoriais/:path*',
    '/cadastrarTutorial',
    '/cadastrarTutorial/:path*',
    '/editarTutorial',
    '/editarTutorial/:path*',
    '/perfil',
    '/perfil/:path*'
  ]
}
