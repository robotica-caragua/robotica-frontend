'use client'

import Link from 'next/link'
import { IoCheckboxOutline, IoAlertCircleOutline } from 'react-icons/io5'

export function ModalConfirmacao({
  tipo,
  tituloPrincipal,
  tituloDestaque,
  mensagem,
  textoBotaoVoltar = 'Voltar',
  hrefVoltar = '/',
  onTentarNovamente
}) {
  if (!tipo) return null

  const ehSucesso = tipo === 'sucesso'

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-verde-escuro/40 px-4"
    >
      <div className="w-full max-w-[676px] rounded-[40px] border border-verde-musgo bg-white px-8 py-12 shadow-xl flex flex-col items-center gap-4 text-center">
        {ehSucesso ? (
          <IoCheckboxOutline size={96} className="text-black" />
        ) : (
          <IoAlertCircleOutline size={96} className="text-black" />
        )}

        <h2 className="text-verde-escuro text-3xl font-bold">
          {tituloPrincipal} <span className="text-verde-musgo">{tituloDestaque}</span>
        </h2>

        <p className="text-verde-musgo text-xl font-medium max-w-lg">{mensagem}</p>

        {ehSucesso ? (
          <Link
            href={hrefVoltar}
            className="mt-4 min-w-[250px] px-8 py-3 bg-verde-musgo hover:opacity-90 text-branco-esverdeado text-xl font-bold rounded-[10px] shadow-xs transition"
          >
            {textoBotaoVoltar}
          </Link>
        ) : (
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-5 w-full max-w-[520px]">
            <Link
              href={hrefVoltar}
              className="flex-1 py-3 bg-white hover:bg-input-bg border border-verde-musgo border-b-4 text-verde-musgo text-xl font-bold rounded-[10px] transition"
            >
              Cancelar
            </Link>
            <button
              type="button"
              onClick={onTentarNovamente}
              className="flex-1 py-3 bg-verde-musgo hover:opacity-90 text-branco-esverdeado text-xl font-bold rounded-[10px] shadow-xs cursor-pointer transition"
            >
              Tentar Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
