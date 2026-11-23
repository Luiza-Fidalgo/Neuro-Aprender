import React, { useState } from 'react'

const situacoes = [
  {
    id: 'lanche',
    titulo: 'Antes do lanche',
    descricao: 'O que vem primeiro?',
    dica: 'Pense no que fazemos para cuidar da higiene antes de comer.',
    etapas: [
      { id: 'lavar', nome: 'Lavar as mãos', figura: 'lavar' },
      { id: 'lanchar', nome: 'Fazer o lanche', figura: 'lanchar' }
    ],
    mistura: ['lanchar', 'lavar']
  },
  {
    id: 'planta',
    titulo: 'Cuidar de uma planta',
    descricao: 'Coloque as ações na ordem em que acontecem.',
    dica: 'A semente vem antes da planta crescer.',
    etapas: [
      { id: 'semente', nome: 'Colocar a semente', figura: 'semente' },
      { id: 'regar', nome: 'Regar a terra', figura: 'regar' },
      { id: 'crescer', nome: 'A planta cresce', figura: 'crescer' }
    ],
    mistura: ['regar', 'crescer', 'semente']
  },
  {
    id: 'higiene',
    titulo: 'Lavar as mãos',
    descricao: 'Organize as etapas para lavar e secar as mãos.',
    dica: 'Primeiro molhamos as mãos. A toalha fica para o final.',
    etapas: [
      { id: 'molhar', nome: 'Molhar as mãos', figura: 'molhar' },
      { id: 'sabonete', nome: 'Passar sabonete', figura: 'sabonete' },
      { id: 'enxaguar', nome: 'Enxaguar', figura: 'enxaguar' },
      { id: 'secar', nome: 'Secar as mãos', figura: 'secar' }
    ],
    mistura: ['enxaguar', 'molhar', 'secar', 'sabonete']
  }
]

function Ilustracao({ tipo }) {
  const desenhos = {
    lavar: (
      <>
        <path d="M17 29V17a4 4 0 0 1 8 0v8-12a4 4 0 0 1 8 0v12-9a4 4 0 0 1 8 0v11-7a4 4 0 0 1 8 0v21c0 10-7 17-17 17h-6c-8 0-15-7-16-15l-1-8a5 5 0 0 1 8-4Z" fill="#ffcfb5" stroke="#a97664" strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M12 8l-3 8M50 9l4 9M5 30l-3 7" stroke="#58b3e5" strokeWidth="4" strokeLinecap="round" />
      </>
    ),
    lanchar: (
      <>
        <ellipse cx="32" cy="47" rx="25" ry="8" fill="#e3d8fb" stroke="#8d75b5" strokeWidth="2" />
        <path d="M15 35l11-15 13 4 9 16Z" fill="#ffcf79" stroke="#b68c42" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M28 21 39 24M18 34l16 4" stroke="#ffeab5" strokeWidth="3" strokeLinecap="round" />
        <circle cx="48" cy="24" r="9" fill="#f28784" stroke="#b64c51" strokeWidth="2" />
        <path d="M48 15c0-4 3-6 5-6" stroke="#508f60" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
    semente: (
      <>
        <path d="M8 47q24-11 48 0v12H8Z" fill="#aa8266" stroke="#815c46" strokeWidth="2" />
        <ellipse cx="33" cy="36" rx="8" ry="5" transform="rotate(-25 33 36)" fill="#e9ca88" stroke="#a07c42" strokeWidth="2" />
        <path d="M32 12v12m-5-6 5 6 5-6" fill="none" stroke="#8c5dc0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    regar: (
      <>
        <path d="M8 46q24-10 48 0v13H8Z" fill="#af866a" stroke="#836044" strokeWidth="2" />
        <path d="M24 36h24l-4-17H28Z" fill="#b8a1e2" stroke="#6f51a2" strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M24 25h-9q-9 0-8 8l11 5" fill="none" stroke="#6f51a2" strokeWidth="3" strokeLinecap="round" />
        <path d="m38 14 3-7m7 8 3-7" stroke="#5cabd6" strokeWidth="3" strokeLinecap="round" />
        <path d="M15 43l-2 5m9-2-2 5m8-7-2 5" stroke="#67b9e3" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
    crescer: (
      <>
        <path d="M8 49q24-10 48 0v11H8Z" fill="#ab8269" stroke="#815c46" strokeWidth="2" />
        <path d="M32 49V18" stroke="#408a5c" strokeWidth="4" strokeLinecap="round" />
        <path d="M32 34q-16-2-19-16 16-2 19 16Zm0-11q14-2 19-14-16-1-19 14Z" fill="#98d8a7" stroke="#4c9868" strokeWidth="2.3" strokeLinejoin="round" />
        <circle cx="32" cy="12" r="5" fill="#f6cf83" />
      </>
    ),
    molhar: (
      <>
        <path d="M17 26v-8a4 4 0 0 1 8 0v8-12a4 4 0 0 1 8 0v12-9a4 4 0 0 1 8 0v11-6a4 4 0 0 1 8 0v19c0 10-8 17-18 17h-5c-8 0-14-7-15-14l-1-7a5 5 0 0 1 7-5Z" fill="#ffcfb5" stroke="#a97664" strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M8 7v9M54 8v9M4 27v6" stroke="#58b3e5" strokeWidth="4" strokeLinecap="round" />
      </>
    ),
    sabonete: (
      <>
        <path d="M16 31q16-9 32 0l-3 21H19Z" fill="#ffcdb3" stroke="#a97664" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="23" y="18" width="23" height="17" rx="7" fill="#bfa5ee" stroke="#805bb5" strokeWidth="2.5" />
        <circle cx="15" cy="16" r="5" fill="#bde7f5" stroke="#79b5d6" strokeWidth="2" />
        <circle cx="32" cy="9" r="4" fill="#bde7f5" stroke="#79b5d6" strokeWidth="2" />
        <circle cx="49" cy="13" r="6" fill="#bde7f5" stroke="#79b5d6" strokeWidth="2" />
      </>
    ),
    enxaguar: (
      <>
        <path d="M22 34V17h26v10H36" fill="none" stroke="#8587a4" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38 29v7m-8-5v7m16-7v7" stroke="#58b3e5" strokeWidth="4" strokeLinecap="round" />
        <path d="M13 52q17-17 39-2" fill="none" stroke="#d0a086" strokeWidth="9" strokeLinecap="round" />
        <path d="M25 48q12-8 21 0" fill="none" stroke="#ffdac3" strokeWidth="7" strokeLinecap="round" />
      </>
    ),
    secar: (
      <>
        <rect x="13" y="10" width="40" height="45" rx="7" fill="#d9cef5" stroke="#8873b8" strokeWidth="2.5" />
        <path d="M20 19h26M20 47h26" stroke="#b6a2df" strokeWidth="3" strokeLinecap="round" />
        <path d="M20 34q11-9 23 1" fill="none" stroke="#a4d4e6" strokeWidth="5" strokeLinecap="round" />
      </>
    )
  }

  return (
    <svg className="sequencia-ilustracao" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      {desenhos[tipo]}
    </svg>
  )
}

export default function SequenciaLogica() {
  const [situacaoId, setSituacaoId] = useState('lanche')
  const [ordem, setOrdem] = useState([...situacoes[0].mistura])
  const [mensagem, setMensagem] = useState('Organize os cartões e depois confira a sequência.')
  const [concluida, setConcluida] = useState(false)
  const [mostrarDica, setMostrarDica] = useState(false)

  const situacao = situacoes.find((item) => item.id === situacaoId)

  function carregarSituacao(id) {
    const nova = situacoes.find((item) => item.id === id)
    setSituacaoId(id)
    setOrdem([...nova.mistura])
    setMensagem('Organize os cartões e depois confira a sequência.')
    setConcluida(false)
    setMostrarDica(false)
  }

  function mover(indice, direcao) {
    const destino = indice + direcao
    if (destino < 0 || destino >= ordem.length) return

    setOrdem((anterior) => {
      const proxima = [...anterior]
      ;[proxima[indice], proxima[destino]] = [proxima[destino], proxima[indice]]
      return proxima
    })
    setConcluida(false)
    setMensagem('Sequência alterada. Quando quiser, confira novamente.')
  }

  function conferir() {
    const correta = ordem.every((id, indice) => id === situacao.etapas[indice].id)
    setConcluida(correta)
    setMensagem(
      correta
        ? 'Muito bem! As etapas estão na ordem esperada.'
        : 'Ainda não está na ordem esperada. Você pode reorganizar e tentar de novo.'
    )
  }

  const ordemAtual = ordem.map((id) => situacao.etapas.find((item) => item.id === id))

  return (
    <section className="sequencia-container" aria-labelledby="titulo-sequencia">
      <div className="sequencia-cabecalho">
        <div>
          <p className="sobrelinha">Atividade 02</p>
          <h2 id="titulo-sequencia">Organize a sequência</h2>
          <p>Use as setas para colocar os cartões na ordem. Não há limite de tempo.</p>
        </div>
        <div className="seletor-sequencia">
          <label htmlFor="situacao-sequencia">Escolher atividade</label>
          <select
            id="situacao-sequencia"
            value={situacaoId}
            onChange={(evento) => carregarSituacao(evento.target.value)}
          >
            {situacoes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.titulo} ({item.etapas.length} etapas)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="sequencia-contexto">
        <h3>{situacao.titulo}</h3>
        <p>{situacao.descricao}</p>
      </div>

      <ol className="sequencia-lista">
        {ordemAtual.map((etapa, indice) => (
          <li className="sequencia-item" key={etapa.id}>
            <span className="sequencia-posicao" aria-label={'Posição ' + (indice + 1)}>{indice + 1}</span>
            <Ilustracao tipo={etapa.figura} />
            <strong>{etapa.nome}</strong>
            <div className="sequencia-controles">
              <button
                type="button"
                className="sequencia-seta"
                onClick={() => mover(indice, -1)}
                disabled={indice === 0}
                aria-label={'Mover ' + etapa.nome + ' para cima'}
                title="Mover para cima"
              >↑</button>
              <button
                type="button"
                className="sequencia-seta"
                onClick={() => mover(indice, 1)}
                disabled={indice === ordem.length - 1}
                aria-label={'Mover ' + etapa.nome + ' para baixo'}
                title="Mover para baixo"
              >↓</button>
            </div>
          </li>
        ))}
      </ol>

      <div className="sequencia-acoes">
        <button className="botao-principal" type="button" onClick={conferir}>Conferir sequência</button>
        <button className="botao-secundario" type="button" onClick={() => carregarSituacao(situacaoId)}>Recomeçar</button>
        <button className="botao-texto" type="button" onClick={() => setMostrarDica((visivel) => !visivel)}>
          {mostrarDica ? 'Ocultar dica' : 'Ver dica'}
        </button>
      </div>

      {mostrarDica && <p className="sequencia-dica">{situacao.dica}</p>}
      <p className={'sequencia-mensagem' + (concluida ? ' completa' : '')} role="status" aria-live="polite">{mensagem}</p>
      <p className="nota-demonstracao">Atividade demonstrativa: a sequência não fica guardada ao sair da página.</p>
    </section>
  )
}
