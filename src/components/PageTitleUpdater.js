'use client'

import { useEffect, useInsertionEffect } from 'react'
import { usePathname } from 'next/navigation'

const STORAGE_KEY = 'biobot_theme'

function sincronizarTemaGlobal() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const salvo = window.localStorage.getItem(STORAGE_KEY)
  const ehEscuro =
    salvo === 'dark' || (salvo !== 'light' && document.documentElement.classList.contains('dark'))
  document.documentElement.classList.toggle('dark', ehEscuro)
  document.documentElement.style.colorScheme = ehEscuro ? 'dark' : 'light'
  document.cookie = `biobot_theme=${ehEscuro ? 'dark' : 'light'}; path=/; max-age=31536000; SameSite=Lax`
}

const titulosPorRota = {
  '/': 'BioBot | Página Inicial',
  '/rede': 'BioBot | Rede',
  '/projetos': 'BioBot | Projetos',
  '/detalhesProjeto': 'BioBot | Detalhes do Projeto',
  '/tutoriais': 'BioBot | Tutoriais',
  '/detalhesTutorial': 'BioBot | Detalhes do Tutorial',
  '/detalhesEvento': 'BioBot | Detalhes do Evento',
  '/contato': 'BioBot | Contato',
  '/login': 'BioBot | Login',
  '/forgot-password': 'BioBot | Recuperar Senha',
  '/senhapt1': 'BioBot | Redefinir Senha',
  '/senhapt2': 'BioBot | Criar Nova Senha',
  '/painelProfessor': 'BioBot | Painel do Professor',
  '/gestaoProjetos': 'BioBot | Meus Projetos',
  '/novoProjeto': 'BioBot | Novo Projeto',
  '/editarProjeto': 'BioBot | Editar Projeto',
  '/gestaoTutoriais': 'BioBot | Meus Tutoriais',
  '/cadastrarTutorial': 'BioBot | Novo Tutorial',
  '/editarTutorial': 'BioBot | Editar Tutorial',
  '/grupos': 'BioBot | Gestão de Equipes',
  '/perfil': 'BioBot | Meu Perfil',
  '/dashboard': 'BioBot | Painel do Administrador',
  '/admin': 'BioBot | Painel do Administrador',
  '/gestaoUsuarios': 'BioBot | Gestão de Usuários',
  '/cadastrarUsuario': 'BioBot | Cadastrar Novo Usuário',
  '/escolas': 'BioBot | Gestão de Escolas',
  '/cadastrarEscola': 'BioBot | Cadastrar Escola',
  '/gestaoEventos': 'BioBot | Gestão de Eventos',
  '/cadastrarEvento': 'BioBot | Cadastrar Evento',
  '/gestaoAvisos': 'BioBot | Avisos da Administração',
  '/gestaoDuvidas': 'BioBot | Dúvidas e Contato',
  '/unauthorized': 'BioBot | Acesso Restrito'
}

export function PageTitleUpdater() {
  const pathname = usePathname()

  useInsertionEffect(() => {
    sincronizarTemaGlobal()
  }, [pathname])

  useEffect(() => {
    sincronizarTemaGlobal()
    window.addEventListener('biobot-theme-change', sincronizarTemaGlobal)
    window.addEventListener('storage', sincronizarTemaGlobal)
    return () => {
      window.removeEventListener('biobot-theme-change', sincronizarTemaGlobal)
      window.removeEventListener('storage', sincronizarTemaGlobal)
    }
  }, [])

  useEffect(() => {
    const rotaNormalizada =
      pathname && pathname !== '/' ? pathname.replace(/\/+$/, '') : pathname || '/'
    const titulo =
      titulosPorRota[rotaNormalizada] ||
      (rotaNormalizada.startsWith('/admin/escolas/')
        ? 'BioBot | Detalhes da Escola'
        : 'BioBot | Página Não Encontrada')
    document.title = titulo
  }, [pathname])

  return null
}
