'use client'

import {
  Children,
  Fragment,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { IoCheckmark } from 'react-icons/io5'

function textoDe(children) {
  return Children.toArray(children)
    .map((filho) => (typeof filho === 'string' || typeof filho === 'number' ? String(filho) : ''))
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}

function extrairOpcoes(children) {
  const lista = []
  Children.toArray(children).forEach((filho) => {
    if (!isValidElement(filho)) return
    if (filho.type === Fragment) {
      lista.push(...extrairOpcoes(filho.props.children))
      return
    }
    if (filho.type === 'option') {
      const label = textoDe(filho.props.children)
      const value = String(filho.props.value ?? label)
      const ehPlaceholder =
        value === '' && (Boolean(filho.props.disabled) || /^selecione\b/i.test(label))
      lista.push({
        value,
        label,
        disabled: Boolean(filho.props.disabled),
        ehPlaceholder
      })
    }
  })
  return lista
}

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * Componente Select estilizado no padrão visual solicitado,
 * adaptado à paleta verde do portal BioBot:
 * - Gatilho com seta que rotaciona ao abrir (^ / v)
 * - Painel com campo de busca ("Pesquisar") em destaque no topo
 * - Opções separadas por linhas divisórias horizontais e rolagem interna
 */
export function Select({
  value = '',
  onChange,
  children,
  id,
  name,
  disabled = false,
  required = false,
  className = '',
  placeholder = 'Selecione',
  searchPlaceholder = 'Pesquisar',
  searchable = true
}) {
  const idAuto = useId()
  const idBotao = id || idAuto
  const containerRef = useRef(null)
  const gatilhoRef = useRef(null)
  const buscaRef = useRef(null)
  const listaRef = useRef(null)

  const [aberto, setAberto] = useState(false)
  const [busca, setBusca] = useState('')
  const [ativo, setAtivo] = useState(0)

  const opcoes = useMemo(() => extrairOpcoes(children), [children])
  const valorAtual = String(value ?? '')
  const opcaoPlaceholder = opcoes.find((o) => o.ehPlaceholder)
  const textoPlaceholder = opcaoPlaceholder?.label || placeholder
  const visiveis = useMemo(() => opcoes.filter((o) => !o.ehPlaceholder), [opcoes])
  const selecionada = visiveis.find((o) => o.value === valorAtual)

  const filtradas = useMemo(() => {
    const termo = normalizar(busca.trim())
    if (!termo) return visiveis
    return visiveis.filter((o) => normalizar(o.label).includes(termo))
  }, [visiveis, busca])

  const abrir = () => {
    if (disabled) return
    const idx = visiveis.findIndex((o) => o.value === valorAtual)
    setAtivo(idx >= 0 ? idx : 0)
    setBusca('')
    setAberto(true)
  }

  const fechar = () => {
    setAberto(false)
    setBusca('')
  }

  const escolher = (opcao) => {
    if (!opcao || opcao.disabled) return
    onChange?.({
      target: { value: opcao.value, name, id: idBotao },
      currentTarget: { value: opcao.value, name, id: idBotao }
    })
    fechar()
    gatilhoRef.current?.focus()
  }

  useEffect(() => {
    if (!aberto) return undefined

    const aoClicarFora = (e) => {
      if (containerRef.current?.contains(e.target)) return
      fechar()
    }

    document.addEventListener('mousedown', aoClicarFora)
    return () => {
      document.removeEventListener('mousedown', aoClicarFora)
    }
  }, [aberto])

  useEffect(() => {
    if (aberto && searchable) buscaRef.current?.focus()
  }, [aberto, searchable])

  useEffect(() => {
    if (!aberto) return
    listaRef.current?.querySelector('[data-ativo="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [aberto, ativo, filtradas])

  const aoTeclar = (e) => {
    if (!aberto) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        abrir()
      }
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      fechar()
      gatilhoRef.current?.focus()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setAtivo((i) => Math.min(i + 1, Math.max(0, filtradas.length - 1)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setAtivo((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      escolher(filtradas[ativo])
    } else if (e.key === 'Tab') {
      fechar()
    }
  }

  const classesLimpas = className
    .replace(/\b(pr|pe)-\d+\b/g, '')
    .replace(/\bappearance-none\b/g, '')
    .trim()

  return (
    <div ref={containerRef} className={`relative w-full ${aberto ? 'z-50' : ''}`}>
      <button
        ref={gatilhoRef}
        id={idBotao}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        onClick={() => (aberto ? fechar() : abrir())}
        onKeyDown={aoTeclar}
        className={`${classesLimpas} flex items-center justify-between gap-2 text-left transition focus-visible:ring-2 focus-visible:ring-verde-musgo/40 ${
          aberto ? 'ring-2 ring-verde-musgo/30' : ''
        } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      >
        <span className={`min-w-0 flex-1 truncate ${selecionada ? '' : 'opacity-70'}`}>
          {selecionada ? selecionada.label : textoPlaceholder}
        </span>
        <IoIosArrowDown
          aria-hidden="true"
          className={`shrink-0 text-lg text-verde-musgo transition-transform duration-200 ${
            aberto ? 'rotate-180' : ''
          }`}
        />
      </button>

      {required && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          required
          name={name}
          value={valorAtual}
          onChange={() => {}}
          onFocus={() => gatilhoRef.current?.focus()}
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        />
      )}

      {aberto && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 min-w-[230px] flex flex-col overflow-hidden rounded-xl border border-verde-musgo/50 bg-white shadow-xl">
          {searchable && (
            <div className="shrink-0 border-b border-verde-musgo/20 p-2.5 bg-white">
              <input
                ref={buscaRef}
                type="text"
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value)
                  setAtivo(0)
                }}
                onKeyDown={aoTeclar}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-lg border-2 border-verde-musgo bg-white px-3.5 text-sm text-verde-escuro placeholder:text-verde-musgo/60 focus:ring-2 focus:ring-verde-musgo/25 focus:outline-none"
              />
            </div>
          )}

          <ul
            ref={listaRef}
            role="listbox"
            className="max-h-60 overflow-y-auto divide-y divide-verde-musgo/20 [scrollbar-color:var(--color-verde-musgo)_var(--color-input-bg)] [scrollbar-width:thin]"
          >
            {filtradas.length === 0 && (
              <li className="px-4 py-3.5 text-sm text-verde-musgo/70">
                Nenhum resultado encontrado
              </li>
            )}
            {filtradas.map((opcao, i) => {
              const marcada = selecionada?.value === opcao.value
              const destacada = i === ativo
              return (
                <li
                  key={`${opcao.value}-${i}`}
                  role="option"
                  aria-selected={marcada}
                  aria-disabled={opcao.disabled}
                  data-ativo={destacada}
                  onMouseEnter={() => setAtivo(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => escolher(opcao)}
                  className={`flex items-center justify-between gap-3 px-4 py-3.5 text-sm transition-colors ${
                    opcao.disabled
                      ? 'cursor-not-allowed text-stone-400'
                      : 'cursor-pointer text-verde-escuro'
                  } ${destacada && !opcao.disabled ? 'bg-verde-pastel/60 dark:bg-[#001B0D]' : ''} ${
                    marcada ? 'bg-input-bg dark:bg-[#001B0D] font-semibold text-verde-musgo' : ''
                  }`}
                >
                  <span className="min-w-0 break-words leading-snug">{opcao.label}</span>
                  {marcada && <IoCheckmark className="shrink-0 text-lg text-verde-musgo" />}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
