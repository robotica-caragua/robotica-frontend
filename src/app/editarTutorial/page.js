'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FormularioTutorial } from '@/components/FormularioTutorial'
import { apiTutoriais, mapearTutorialDaApi } from '@/services/api'

function EditarTutorialConteudo() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [tutorial, setTutorial] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true

    const promessa = id
      ? apiTutoriais.buscarPorId(id)
      : apiTutoriais.listar().then((lista) => lista?.[0] || null)

    promessa
      .then((dadosApi) => {
        if (!ativo) return
        setTutorial(dadosApi ? mapearTutorialDaApi(dadosApi) : {})
      })
      .catch(() => {
        if (ativo) setTutorial({})
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [id])

  if (carregando || !tutorial) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-verde-musgo text-lg font-medium">Carregando dados do tutorial...</p>
      </div>
    )
  }

  const chave = `${tutorial.id || 'novo'}-${tutorial.titulo || ''}-${tutorial.categoria || ''}-${tutorial.escola || ''}`

  return <FormularioTutorial key={chave} modo="editar" dadosIniciais={tutorial} />
}

export default function EditarTutorial() {
  return (
    <Suspense fallback={null}>
      <EditarTutorialConteudo />
    </Suspense>
  )
}
