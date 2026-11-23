import React, { useState } from 'react'

const figuras = [
  { id: 'sol', nome: 'Sol' },
  { id: 'casa', nome: 'Casa' },
  { id: 'maca', nome: 'Maçã' },
  { id: 'flor', nome: 'Flor' }
]

function Figura({ tipo }) {
  const desenhos = {
    sol: (
      <>
        <circle cx="32" cy="32" r="13" fill="#ffd778" stroke="#9b6b12" strokeWidth="2.5" />
        <path d="M32 5v9M32 50v9M5 32h9M50 32h9M13 13l7 7M44 44l7 7M51 13l-7 7M20 44l-7 7" stroke="#e3a128" strokeWidth="4" strokeLinecap="round" />
      </>
    ),
    casa: (
      <>
        <path d="M10 29 32 10l22 19" fill="none" stroke="#8650be" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 27v27h32V27" fill="#e6d3fa" stroke="#8650be" strokeWidth="3" strokeLinejoin="round" />
        <path d="M27 54V39h10v15" fill="#fff" stroke="#8650be" strokeWidth="3" strokeLinejoin="round" />
        <rect x="39" y="33" width="6" height="7" rx="1" fill="#9ddbe8" />
      </>
    ),
    maca: (
      <>
        <path d="M33 20c-7-7-20-3-22 9-3 15 6 28 16 26 4-1 6-1 10 0 11 2 19-12 16-25-3-12-15-16-20-10Z" fill="#f28b87" stroke="#ac454d" strokeWidth="3" />
        <path d="M32 21c0-7 2-11 6-15" fill="none" stroke="#70502f" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M35 16c3-7 11-7 16-4-3 6-10 9-16 4Z" fill="#83c69c" stroke="#4a9060" strokeWidth="2" />
      </>
    ),
    flor: (
      <>
        <path d="M32 36v23M32 48c-10-1-13-6-13-10 8-1 12 2 13 10ZM32 52c8-2 11-6 12-11-7-1-11 3-12 11Z" fill="#9ad4ab" stroke="#3c956f" strokeWidth="2.5" strokeLinecap="round" />
        <g fill="#e6b6f5" stroke="#9856b7" strokeWidth="2">
          <circle cx="32" cy="16" r="10" /><circle cx="18" cy="26" r="10" />
          <circle cx="46" cy="26" r="10" /><circle cx="23" cy="42" r="10" />
          <circle cx="41" cy="42" r="10" />
        </g>
        <circle cx="32" cy="29" r="9" fill="#ffdb81" stroke="#b58426" strokeWidth="2.5" />
      </>
    )
  }

  return <svg className="figura-jogo" viewBox="0 0 64 64" aria-hidden="true" focusable="false">{desenhos[tipo]}</svg>
}

export default function Associacao() {
  const [quantidade, setQuantidade] = useState(2)
  const [selecionada, setSelecionada] = useState(null)
  const [encontrados, setEncontrados] = useState([])
  const [mensagem, setMensagem] = useState('Escolha uma figura na primeira coluna.')

  const disponiveis = figuras.slice(0, quantidade)
  const opcoes = [...disponiveis].reverse()
  const terminou = encontrados.length === quantidade

  function reiniciar(novaQuantidade = quantidade) {
    setQuantidade(novaQuantidade)
    setSelecionada(null)
    setEncontrados([])
    setMensagem('Escolha uma figura na primeira coluna.')
  }

  function escolherFigura(id) {
    if (encontrados.includes(id)) return
    setSelecionada(id)
    setMensagem('Agora encontre a mesma figura na segunda coluna.')
  }

  function conferirPar(id) {
    if (encontrados.includes(id)) return

    if (!selecionada) {
      setMensagem('Primeiro escolha uma figura na primeira coluna.')
      return
    }

    if (selecionada === id) {
      const atualizados = [...encontrados, id]
      setEncontrados(atualizados)
      setSelecionada(null)
      setMensagem(
        atualizados.length === quantidade
          ? 'Você encontrou todos os pares! Se quiser, pode jogar novamente.'
          : 'Par encontrado! Escolha outra figura.'
      )
    } else {
      setMensagem('Ainda não é esse par. Observe as figuras e tente outra vez.')
    }
  }

  return (
    <section className="jogo-container" aria-labelledby="titulo-associacao">
      <div className="jogo-cabecalho">
        <div>
          <p className="sobrelinha">Atividade 01</p>
          <h2 id="titulo-associacao">Encontre os pares</h2>
          <p>Toque em uma figura da esquerda e encontre a mesma imagem à direita. Não há limite de tempo.</p>
        </div>
        <div className="dificuldade">
          <label htmlFor="quantidade-pares">Quantidade de pares</label>
          <select
            id="quantidade-pares"
            value={quantidade}
            onChange={(e) => reiniciar(Number(e.target.value))}
          >
            <option value="2">2 pares</option>
            <option value="3">3 pares</option>
            <option value="4">4 pares</option>
          </select>
        </div>
      </div>

      <div className="jogo-progresso">
        <span>{encontrados.length} de {quantidade} pares encontrados</span>
        <progress value={encontrados.length} max={quantidade} aria-label="Progresso do jogo" />
      </div>

      <div className="jogo-colunas">
        <div className="jogo-coluna" role="group" aria-label="Primeira coluna: escolha uma figura">
          <h3>1. Escolha uma figura</h3>
          <div className="jogo-opcoes">
            {disponiveis.map((figura) => {
              const resolvida = encontrados.includes(figura.id)
              return (
                <button
                  className={'cartao-jogo' + (selecionada === figura.id ? ' escolhido' : '') + (resolvida ? ' resolvido' : '')}
                  type="button"
                  key={figura.id}
                  onClick={() => escolherFigura(figura.id)}
                  aria-pressed={selecionada === figura.id}
                  disabled={resolvida}
                >
                  <Figura tipo={figura.id} />
                  <span>{figura.nome}</span>
                  {resolvida && <span className="selo-par">Par encontrado</span>}
                </button>
              )
            })}
          </div>
        </div>
        <div className="jogo-coluna" role="group" aria-label="Segunda coluna: encontre o par">
          <h3>2. Encontre o par</h3>
          <div className="jogo-opcoes">
            {opcoes.map((figura) => {
              const resolvida = encontrados.includes(figura.id)
              return (
                <button
                  className={'cartao-jogo' + (resolvida ? ' resolvido' : '')}
                  type="button"
                  key={figura.id}
                  onClick={() => conferirPar(figura.id)}
                  disabled={resolvida}
                >
                  <Figura tipo={figura.id} />
                  <span>{figura.nome}</span>
                  {resolvida && <span className="selo-par">Par encontrado</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="jogo-rodape">
        <p className={'mensagem-jogo' + (terminou ? ' concluido' : '')} role="status" aria-live="polite">{mensagem}</p>
        <button className="botao-secundario" type="button" onClick={() => reiniciar()}>
          Jogar novamente
        </button>
      </div>
    </section>
  )
}
