import React, { useState } from 'react'

const etapas = [
  { id: 'chegar', titulo: 'Chegar', detalhe: 'Início da rotina' },
  { id: 'mochila', titulo: 'Guardar a mochila', detalhe: 'Organizar os materiais' },
  { id: 'maos', titulo: 'Lavar as mãos', detalhe: 'Cuidar da higiene' },
  { id: 'atividade', titulo: 'Começar a atividade', detalhe: 'Preparar para aprender' }
]

export default function RotinaVisual() {
  const [concluidas, setConcluidas] = useState([])
  const [emPausa, setEmPausa] = useState(false)
  const todasConcluidas = concluidas.length === etapas.length

  function alternarEtapa(id) {
    if (emPausa) return
    setConcluidas((anteriores) =>
      anteriores.includes(id)
        ? anteriores.filter((atual) => atual !== id)
        : [...anteriores, id]
    )
  }

  function reiniciar() {
    setConcluidas([])
    setEmPausa(false)
  }

  return (
    <section className="rotina-container" aria-labelledby="titulo-rotina">
      <div className="rotina-topo">
        <div>
          <p className="sobrelinha">Exemplo de rotina</p>
          <h2 id="titulo-rotina">Minha chegada</h2>
          <p>Toque em cada etapa ao concluí-la. É possível fazer uma pausa ou desmarcar qualquer etapa.</p>
        </div>
        <div className="contador-rotina">{concluidas.length} de {etapas.length} etapas</div>
      </div>

      <progress className="rotina-progresso" value={concluidas.length} max={etapas.length} aria-label="Etapas concluídas da rotina" />

      <ol className="etapas-rotina">
        {etapas.map((etapa, indice) => {
          const concluida = concluidas.includes(etapa.id)
          return (
            <li key={etapa.id}>
              <button
                type="button"
                className={'etapa-botao' + (concluida ? ' etapa-concluida' : '')}
                onClick={() => alternarEtapa(etapa.id)}
                aria-pressed={concluida}
                disabled={emPausa}
              >
                <span className="etapa-numero" aria-hidden="true">{concluida ? '✓' : indice + 1}</span>
                <span className="etapa-texto">
                  <strong>{etapa.titulo}</strong>
                  <small>{etapa.detalhe}</small>
                </span>
                <span className="etapa-estado">{concluida ? 'Concluída' : 'Marcar como feita'}</span>
              </button>
            </li>
          )
        })}
      </ol>

      <div className="rotina-rodape">
        <div className="rotina-acoes">
          <button className="botao-secundario" type="button" onClick={() => setEmPausa((atual) => !atual)}>
            {emPausa ? 'Retomar atividade' : 'Fazer uma pausa'}
          </button>
          <button className="botao-texto" type="button" onClick={reiniciar}>Reiniciar rotina</button>
        </div>
        <p className="mensagem-rotina" role="status" aria-live="polite">
          {emPausa
            ? 'Pausa iniciada. As etapas ficam disponíveis novamente ao retomar.'
            : todasConcluidas
              ? 'Todas as etapas foram concluídas.'
              : 'Siga as etapas no seu ritmo.'}
        </p>
      </div>
      <p className="nota-demonstracao">Esta é uma rotina de exemplo. As marcações não são guardadas após sair da página.</p>
    </section>
  )
}
