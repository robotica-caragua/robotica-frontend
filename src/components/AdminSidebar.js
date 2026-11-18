'use client'

import { SideBarAdmin } from './SideBarAdmin'
import { SideBarProfessor } from './SideBarProfessor'

export function AdminSidebar({ variant = 'admin' }) {
  if (variant === 'professor') {
    return <SideBarProfessor />
  }

  return <SideBarAdmin />
}
