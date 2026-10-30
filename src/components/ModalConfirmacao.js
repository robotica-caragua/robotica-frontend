'use client'

import Link from 'next/link'
import { IoCheckboxOutline, IoAlertCircleOutline } from 'react-icons/io5'

export function ModalConfirmacao({
  aberto,
  tipo,
  titulo,
  tituloPrincipal,
  destaque,
  tituloDestaque,
  mensagem,
  textoBotaoSucesso,
  textoBotaoVoltar = 'Voltar',
  hrefVoltar = '/',
  onConfirmar,
  onCancelar,
  onTentarNovamente
}) {
  if (aberto === false) return null
  if (aberto === undefined && !tipo) return null

  const tipoFinal = tipo || 'sucesso'
  const ehSucesso = tipoFinal === 'sucesso'
  const principal =
    tituloPrincipal ||
    titulo ||
    (ehSucesso ? 'Operação realizada com' : 'Não foi possível concluir')
  const textoDestaque = tituloDestaque || destaque || (ehSucesso ? 'sucesso!' : 'a ação!')
  const textoSucesso = textoBotaoSucesso || textoBotaoVoltar

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-verde-escuro/40 p-4"
    >
      <div className="w-full max-w-[676px] rounded-3xl sm:rounded-[40px] border border-verde-musgo bg-white p-6 sm:px-8 sm:py-12 shadow-xl flex flex-col items-center gap-4 text-center">
        {ehSucesso ? (
          <IoCheckboxOutline size={80} className="text-black sm:size-24" />
        ) : (
          <IoAlertCircleOutline size={80} className="text-black sm:size-24" />
        )}

        <h2 className="text-verde-escuro text-2xl sm:text-3xl font-bold">
          {principal} <span className="text-verde-musgo">{textoDestaque}</span>
        </h2>

        <p className="text-verde-musgo text-base sm:text-xl font-medium max-w-lg">{mensagem}</p>

        {ehSucesso ? (
          onConfirmar ? (
            <button
              type="button"
              onClick={onConfirmar}
              className="mt-4 w-full sm:w-auto sm:min-w-[250px] px-8 py-3 bg-verde-musgo hover:opacity-90 text-branco-esverdeado text-lg sm:text-xl font-bold rounded-[10px] shadow-xs cursor-pointer transition"
            >
              {textoSucesso}
            </button>
          ) : (
            <Link
              href={hrefVoltar}
              className="mt-4 w-full sm:w-auto sm:min-w-[250px] px-8 py-3 bg-verde-musgo hover:opacity-90 text-branco-esverdeado text-lg sm:text-xl font-bold rounded-[10px] shadow-xs transition"
            >
              {textoSucesso}
            </Link>
          )
        ) : (
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 w-full max-w-[520px]">
            {onCancelar ? (
              <button
                type="button"
                onClick={onCancelar}
                className="flex-1 py-3 bg-white hover:bg-input-bg border border-verde-musgo border-b-4 text-verde-musgo text-lg sm:text-xl font-bold rounded-[10px] cursor-pointer transition"
              >
                Cancelar
              </button>
            ) : (
              <Link
                href={hrefVoltar}
                className="flex-1 py-3 bg-white hover:bg-input-bg border border-verde-musgo border-b-4 text-verde-musgo text-lg sm:text-xl font-bold rounded-[10px] transition text-center"
              >
                Cancelar
              </Link>
            )}
            <button
              type="button"
              onClick={onTentarNovamente}
              className="flex-1 py-3 bg-verde-musgo hover:opacity-90 text-branco-esverdeado text-lg sm:text-xl font-bold rounded-[10px] shadow-xs cursor-pointer transition"
            >
              Tentar Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
