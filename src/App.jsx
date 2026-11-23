import React, { useState } from 'react'
import Associacao from './Associacao'
import SequenciaLogica from './SequenciaLogica'
import RotinaVisual from './RotinaVisual'

const paginas = [
  { nome: 'Início', simbolo: '⌂' },
  { nome: 'Atividades', simbolo: '✦' },
  { nome: 'Rotinas visuais', simbolo: '▦' },
  { nome: 'Acompanhamento', simbolo: '▥' }
]

const recursos = [
  {
    titulo: 'Atividades pedagógicas',
    texto: 'Jogos de associação de figuras e sequência lógica, com níveis ajustáveis.',
    pagina: 'Atividades',
    simbolo: '✦',
    classe: 'lilas'
  },
  {
    titulo: 'Rotinas visuais',
    texto: 'Rotina de chegada interativa, com pausa e acompanhamento das etapas.',
    pagina: 'Rotinas visuais',
    simbolo: '▦',
    classe: 'azul'
  },
  {
    titulo: 'Acompanhamento',
    texto: 'Um espaço para organizar futuramente os registros das sessões.',
    pagina: 'Acompanhamento',
    simbolo: '▥',
    classe: 'verde'
  }
]

function App() {
  const [paginaAtual, setPaginaAtual] = useState('Início')
  const [atividadeAtual, setAtividadeAtual] = useState('associacao')

  function abrirPagina(nome) {
    setPaginaAtual(nome)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <div className="app">
      <aside className="menu-lateral">
        <div className="marca">
          <span className="marca-simbolo" aria-hidden="true">N</span>
          <span>Neuro<span>Aprender</span></span>
        </div>

        <nav aria-label="Menu principal">
          {paginas.map((pagina) => (
            <button
              key={pagina.nome}
              className={`menu-item ${paginaAtual === pagina.nome ? 'selecionado' : ''}`}
              onClick={() => abrirPagina(pagina.nome)}
              aria-current={paginaAtual === pagina.nome ? 'page' : undefined}
              type="button"
            >
              <span className="menu-icone" aria-hidden="true">{pagina.simbolo}</span>
              {pagina.nome}
            </button>
          ))}
        </nav>
        <p className="menu-rodape">Um passo de cada vez.</p>
      </aside>

      <div className="area-principal">
        <header className="topo">
          <span className="topo-titulo">NeuroAprender</span>
          <span className="topo-info">Versão de desenvolvimento</span>
        </header>

        <main className="conteudo">
          {paginaAtual === 'Início' && (
            <>
              <section className="destaque">
                <div>
                  <p className="sobrelinha">Bem-vinda ao NeuroAprender</p>
                  <h1>Aprender no próprio ritmo faz toda a diferença.</h1>
                  <p className="descricao">Um espaço para apoiar a organização de atividades pedagógicas e rotinas visuais, respeitando as necessidades de cada criança.</p>
                  <button className="botao-principal" onClick={() => abrirPagina('Atividades')} type="button">
                    Conhecer atividades <span aria-hidden="true">→</span>
                  </button>
                </div>
                <div className="arte-destaque" aria-hidden="true">
                  <div className="arte-circulo circulo-um"></div>
                  <div className="arte-circulo circulo-dois"></div>
                  <div className="arte-cartao cartao-um">✦</div>
                  <div className="arte-cartao cartao-dois">✓</div>
                  <div className="arte-cartao cartao-tres">▦</div>
                </div>
              </section>

              <div className="titulo-bloco">
                <h2>Por onde começar?</h2>
                <p>Escolha uma área para conhecer o projeto.</p>
              </div>
              <section className="grade-recursos" aria-label="Áreas do projeto">
                {recursos.map((recurso) => (
                  <article className="recurso" key={recurso.pagina}>
                    <span className={`recurso-icone ${recurso.classe}`} aria-hidden="true">{recurso.simbolo}</span>
                    <h3>{recurso.titulo}</h3>
                    <p>{recurso.texto}</p>
                    <button className="link-acao" onClick={() => abrirPagina(recurso.pagina)} type="button">
                      Ver área <span aria-hidden="true">→</span>
                    </button>
                  </article>
                ))}
              </section>
            </>
          )}

          {paginaAtual === 'Atividades' && (
            <section className="pagina-secao">
              <p className="sobrelinha">Atividades pedagógicas</p>
              <h1>Aprender com atividades visuais.</h1>
              <p className="descricao">Explore dois jogos visuais com dificuldade ajustável, sem cronômetro ou penalidades. Cada atividade pode ser mediada por um profissional.</p>
              <div className="seletor-atividades" role="group" aria-label="Escolha a atividade pedagógica">
                <button type="button" aria-pressed={atividadeAtual === 'associacao'} onClick={() => setAtividadeAtual('associacao')}>
                  Associação de figuras
                </button>
                <button type="button" aria-pressed={atividadeAtual === 'sequencia'} onClick={() => setAtividadeAtual('sequencia')}>
                  Sequência lógica
                </button>
              </div>
              {atividadeAtual === 'associacao' ? <Associacao /> : <SequenciaLogica />}
            </section>
          )}

          {paginaAtual === 'Rotinas visuais' && (
            <section className="pagina-secao">
              <p className="sobrelinha">Rotinas visuais</p>
              <h1>Uma etapa de cada vez.</h1>
              <p className="descricao">Use esta rotina de chegada como exemplo. As marcações são temporárias e não identificam nenhuma criança.</p>
              <RotinaVisual />
            </section>
          )}

          {paginaAtual === 'Acompanhamento' && (
            <section className="pagina-secao">
              <p className="sobrelinha">Acompanhamento</p>
              <h1>Um lugar para registrar cada avanço.</h1>
              <div className="aviso"><span aria-hidden="true">▥</span><p>O registro das sessões e das observações pedagógicas será desenvolvido em uma próxima etapa.</p></div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
