import React, { useState } from 'react'

const paginas = [
  { nome: 'Início', simbolo: '⌂' },
  { nome: 'Atividades', simbolo: '✦' },
  { nome: 'Rotinas visuais', simbolo: '▦' },
  { nome: 'Acompanhamento', simbolo: '▥' }
]

const recursos = [
  {
    titulo: 'Atividades pedagógicas',
    texto: 'Propostas de associação e sequência para explorar diferentes habilidades.',
    pagina: 'Atividades',
    simbolo: '✦',
    classe: 'lilas'
  },
  {
    titulo: 'Rotinas visuais',
    texto: 'Etapas do cotidiano organizadas com imagens e instruções simples.',
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

const rotinaExemplo = ['Chegar', 'Guardar a mochila', 'Lavar as mãos', 'Começar a atividade']

function App() {
  const [paginaAtual, setPaginaAtual] = useState('Início')

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
          <span className="topo-info">Protótipo inicial</span>
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
              <h1>Atividades para explorar e aprender.</h1>
              <p className="descricao">Os primeiros jogos planejados são associação de imagens e sequência lógica. Nesta etapa, a área apresenta apenas a organização inicial.</p>
              <div className="grade-dupla">
                <article className="recurso"><span className="recurso-icone lilas" aria-hidden="true">✦</span><h2>Associação de imagens</h2><p>Relacionar figuras iguais e elementos do cotidiano.</p><span className="etiqueta">Em planejamento</span></article>
                <article className="recurso"><span className="recurso-icone azul" aria-hidden="true">↔</span><h2>Sequência lógica</h2><p>Organizar acontecimentos e imagens na ordem correta.</p><span className="etiqueta">Em planejamento</span></article>
              </div>
            </section>
          )}

          {paginaAtual === 'Rotinas visuais' && (
            <section className="pagina-secao">
              <p className="sobrelinha">Rotinas visuais</p>
              <h1>Pequenas etapas, mais previsibilidade.</h1>
              <p className="descricao">Exemplo de uma sequência de chegada. A criação e edição das rotinas serão desenvolvidas nas próximas etapas.</p>
              <ol className="lista-rotina">
                {rotinaExemplo.map((etapa, indice) => <li key={etapa}><span>{indice + 1}</span>{etapa}</li>)}
              </ol>
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
