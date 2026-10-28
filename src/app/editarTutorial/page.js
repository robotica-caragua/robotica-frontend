'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FormularioTutorial } from '@/components/FormularioTutorial'
import { buscarTutorialPorId } from '@/utils/tutoriaisProfessor'

function EditarTutorialConteudo() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const tutorial = buscarTutorialPorId(id)

  return <FormularioTutorial key={tutorial.id} modo="editar" dadosIniciais={tutorial} />
}

export default function EditarTutorial() {
  return (
    <Suspense fallback={null}>
      <EditarTutorialConteudo />
    </Suspense>
  )
}
