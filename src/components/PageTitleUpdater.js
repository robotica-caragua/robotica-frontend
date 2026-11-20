'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

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
  '/cadastrarUsuario': 'BioBot | Cadastrar Professor',
  '/escolas': 'BioBot | Gestão de Escolas',
  '/cadastrarEscola': 'BioBot | Cadastrar Escola',
  '/gestaoEventos': 'BioBot | Gestão de Eventos',
  '/cadastrarEvento': 'BioBot | Cadastrar Evento',
  '/unauthorized': 'BioBot | Acesso Restrito'
}

export function PageTitleUpdater() {
  const pathname = usePathname()

  useEffect(() => {
    const rotaNormalizada =
      pathname && pathname !== '/' ? pathname.replace(/\/+$/, '') : pathname || '/'
    const titulo = titulosPorRota[rotaNormalizada] || 'BioBot | Página Não Encontrada'
    document.title = titulo
  }, [pathname])

  return null
}
