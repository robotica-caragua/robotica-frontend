'use client'

import Link from 'next/link'

export function ModalConfirmacao({
  aberto,
  tipo = 'sucesso',
  titulo,
  tituloPrincipal,
  destaque,
  tituloDestaque,
  mensagem,
  textoBotaoSucesso,
  textoBotaoVoltar = 'Voltar',
  textoConfirmar,
  textoCancelar = 'Cancelar',
  hrefVoltar = '/',
  onConfirmar,
  onCancelar,
  onTentarNovamente
}) {
  if (aberto === false) return null
  if (aberto === undefined && !tipo) return null

  const ehSucesso = tipo === 'sucesso'
  const ehConfirmacao = tipo === 'confirmacao' || tipo === 'excluir'
  const ehErro = tipo === 'erro' || tipo === 'negativa'

  const tituloFormatado =
    titulo ||
    (tituloPrincipal && (tituloDestaque || destaque)
      ? `${tituloPrincipal} ${tituloDestaque || destaque}`
      : tituloPrincipal) ||
    (ehSucesso
      ? 'Operação realizada com sucesso!'
      : ehConfirmacao
        ? 'Confirmar ação'
        : 'Não foi possível concluir')

  const textoBotaoPrincipal =
    textoConfirmar || textoBotaoSucesso || textoBotaoVoltar || (ehSucesso ? 'Continuar' : 'Entendido')

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div className="w-full max-w-lg rounded-3xl bg-white p-7 sm:p-10 shadow-2xl flex flex-col items-center gap-4 text-center border border-stone-100">
        {/* Ícone no topo conforme protótipo */}
        {ehSucesso ? (
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl border-4 border-black text-black mb-1">
            <svg
              className="w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        ) : ehConfirmacao ? (
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl border-4 border-verde-musgo text-verde-musgo mb-1">
            <svg
              className="w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        ) : (
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl border-4 border-vermelho text-vermelho mb-1">
            <svg
              className="w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        )}

        {/* Título Principal */}
        <h2 className="text-verde-escuro text-2xl sm:text-3xl font-extrabold tracking-tight">
          {tituloFormatado}
        </h2>

        {/* Mensagem descritiva */}
        {mensagem && (
          <p className="text-stone-700 text-sm sm:text-base font-medium max-w-md leading-relaxed">
            {mensagem}
          </p>
        )}

        {/* Botões de Ação */}
        {ehConfirmacao ? (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm">
            <button
              type="button"
              onClick={onCancelar}
              className="w-full sm:flex-1 py-3 px-6 bg-white hover:bg-stone-50 border-2 border-stone-300 text-stone-700 text-base font-bold rounded-xl transition cursor-pointer"
            >
              {textoCancelar}
            </button>
            <button
              type="button"
              onClick={onConfirmar}
              className="w-full sm:flex-1 py-3 px-6 bg-verde-musgo hover:bg-white hover:text-verde-musgo border-2 border-verde-musgo text-white text-base font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              {textoBotaoPrincipal}
            </button>
          </div>
        ) : ehSucesso ? (
          onConfirmar ? (
            <button
              type="button"
              onClick={onConfirmar}
              className="mt-4 w-full sm:w-auto sm:min-w-[220px] px-8 py-3.5 bg-verde-musgo hover:bg-white hover:text-verde-musgo border-2 border-verde-musgo text-white text-base sm:text-lg font-bold rounded-xl shadow-xs cursor-pointer transition"
            >
              {textoBotaoPrincipal}
            </button>
          ) : (
            <Link
              href={hrefVoltar}
              className="mt-4 w-full sm:w-auto sm:min-w-[220px] px-8 py-3.5 bg-verde-musgo hover:bg-white hover:text-verde-musgo border-2 border-verde-musgo text-white text-base sm:text-lg font-bold rounded-xl shadow-xs transition text-center"
            >
              {textoBotaoPrincipal}
            </Link>
          )
        ) : (
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3 w-full max-w-sm">
            {onCancelar && (
              <button
                type="button"
                onClick={onCancelar}
                className="w-full sm:flex-1 py-3 px-6 bg-white hover:bg-stone-50 border-2 border-stone-300 text-stone-700 text-base font-bold rounded-xl cursor-pointer transition"
              >
                Fechar
              </button>
            )}
            {onTentarNovamente && (
              <button
                type="button"
                onClick={onTentarNovamente}
                className="w-full sm:flex-1 py-3 px-6 bg-verde-musgo hover:bg-white hover:text-verde-musgo border-2 border-verde-musgo text-white text-base font-bold rounded-xl shadow-xs cursor-pointer transition"
              >
                Tentar Novamente
              </button>
            )}
            {!onTentarNovamente && !onCancelar && (
              <button
                type="button"
                onClick={onConfirmar}
                className="w-full sm:w-auto sm:min-w-[200px] py-3 px-6 bg-verde-musgo hover:bg-white hover:text-verde-musgo border-2 border-verde-musgo text-white text-base font-bold rounded-xl shadow-xs cursor-pointer transition"
              >
                Entendido
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
