import React, { useEffect, useState } from 'react'
import Associacao from './Associacao'
import SequenciaLogica from './SequenciaLogica'
import RotinaVisual from './RotinaVisual'
import Perfis from './Perfis'
import Acompanhamento from './Acompanhamento'
import Login from './Login'
import * as api from './api'

const paginas = [
  { nome: 'Início', simbolo: '⌂' },
  { nome: 'Atividades', simbolo: '✦' },
  { nome: 'Rotinas visuais', simbolo: '▦' },
  { nome: 'Perfis', simbolo: '♙' },
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
    titulo: 'Perfis de acompanhamento',
    texto: 'Organize perfis fictícios para testes com acesso restrito.',
    pagina: 'Perfis',
    simbolo: '♙',
    classe: 'verde'
  },
  {
    titulo: 'Acompanhamento',
    texto: 'Registre atividades, participação e observações sem guardar dados pessoais.',
    pagina: 'Acompanhamento',
    simbolo: '▥',
    classe: 'lilas'
  }
]

function App() {
  const [paginaAtual, setPaginaAtual] = useState('Início')
  const [atividadeAtual, setAtividadeAtual] = useState('associacao')
  const [perfis, setPerfis] = useState([])
  const [sessoes, setSessoes] = useState([])
  const [selecionadoId, setSelecionadoId] = useState('')
  const [autenticado, setAutenticado] = useState(false)
  const [verificando, setVerificando] = useState(true)
  const [erroServidor, setErroServidor] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    let ativo = true
    api.setUnauthorizedHandler(() => {
      setAutenticado(false)
      setPerfis([])
      setSessoes([])
      setSelecionadoId('')
    })
    async function iniciar() {
      try {
        const sessao = await api.getSession()
        if (ativo && sessao.authenticated) {
          const resposta = await api.listProfiles()
          if (!ativo) return
          setPerfis(resposta.profiles.map(normalizarPerfil))
          setAutenticado(true)
        }
      } catch (erro) {
        if (ativo) setErroServidor(erro.message)
      } finally {
        if (ativo) setVerificando(false)
      }
    }
    iniciar()
    return () => { ativo = false; api.setUnauthorizedHandler(null) }
  }, [])

  function normalizarPerfil(item) {
    return { id: String(item.id), codigo: item.code, quantidade: Number(item.records_count || 0) }
  }

  function abrirPagina(nome) {
    setPaginaAtual(nome)
    setErroServidor('')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  async function entrar(usuario, senha) {
    await api.login(usuario, senha)
    try {
      const resposta = await api.listProfiles()
      setPerfis(resposta.profiles.map(normalizarPerfil))
      setAutenticado(true)
      setErroServidor('')
    } catch (erro) {
      api.resetSession()
      setAutenticado(false)
      throw erro
    }
  }

  async function sair() {
    try { await api.logout() }
    catch (erro) {
      setErroServidor(erro.message)
      return
    }
    api.resetSession()
    setAutenticado(false)
    setPerfis([])
    setSessoes([])
    setSelecionadoId('')
    abrirPagina('Início')
  }

  async function adicionarPerfil(codigo) {
    const novo = await api.createProfile(codigo)
    const perfil = normalizarPerfil(novo)
    setPerfis(anteriores => [perfil, ...anteriores])
    await selecionarPerfil(perfil.id)
  }

  async function removerPerfil(id) {
    await api.deleteProfile(id)
    setPerfis(anteriores => anteriores.filter(perfil => perfil.id !== id))
    setSessoes(anteriores => anteriores.filter(sessao => sessao.perfilId !== id))
    if (selecionadoId === id) setSelecionadoId('')
  }

  async function selecionarPerfil(id) {
    setSelecionadoId(id)
    setSessoes([])
    if (!id) return
    setCarregando(true)
    setErroServidor('')
    try {
      const resposta = await api.listRecords(id)
      setSessoes(resposta.records.map(item => ({
        id: String(item.id), perfilId: String(item.profile_id),
        data: item.session_date, atividade: item.activity,
        participacao: item.participation, observacao: item.notes
      })))
    } catch (erro) {
      setErroServidor(erro.message)
    } finally {
      setCarregando(false)
    }
  }

  async function adicionarSessao(registro) {
    const resposta = await api.createRecord({
      profileId: Number(registro.perfilId),
      date: registro.data,
      activity: registro.atividade,
      participation: registro.participacao,
      notes: registro.observacao
    })
    setSessoes(anteriores => [{
      ...registro, id: String(resposta.id)
    }, ...anteriores])
    setPerfis(anteriores => anteriores.map(perfil =>
      perfil.id === registro.perfilId ? { ...perfil, quantidade: perfil.quantidade + 1 } : perfil))
  }

  async function excluirSessao(id) {
    await api.deleteRecord(id)
    const sessao = sessoes.find(item => item.id === id)
    setSessoes(anteriores => anteriores.filter(item => item.id !== id))
    if (sessao) {
      setPerfis(anteriores => anteriores.map(perfil =>
        perfil.id === sessao.perfilId ? { ...perfil, quantidade: Math.max(0, perfil.quantidade - 1) } : perfil))
    }
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
              className={'menu-item ' + (paginaAtual === pagina.nome ? 'selecionado' : '')}
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
          <span className="topo-info">{autenticado ? <button type="button" className="botao-texto" onClick={sair}>Sair da conta</button> : 'Versão de desenvolvimento'}</span>
        </header>

        <main className="conteudo">
          {erroServidor && <div className="alerta-privacidade" role="alert">{erroServidor}</div>}
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
                    <span className={'recurso-icone ' + recurso.classe} aria-hidden="true">{recurso.simbolo}</span>
                    <h3>{recurso.titulo}</h3>
                    <p>{recurso.texto}</p>
                    <button className="link-acao" onClick={() => abrirPagina(recurso.pagina)} type="button">
                      Ver área <span aria-hidden="true">→</span>
                    </button>
                  </article>
                ))}
              </section>
              <p className="nota-inicio">O acompanhamento exige login e configuração do servidor. Durante os testes, utilize somente dados fictícios.</p>
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

          {paginaAtual === 'Perfis' && (verificando ? <div className="estado-vazio">Verificando acesso...</div> : !autenticado ? <Login onEntrar={entrar} /> : (
            <Perfis
              perfis={perfis}
              selecionadoId={selecionadoId}
              sessoes={sessoes}
              onAdicionar={adicionarPerfil}
              onSelecionar={selecionarPerfil}
              onRemover={removerPerfil}
            />
          ))}

          {paginaAtual === 'Acompanhamento' && (verificando ? <div className="estado-vazio">Verificando acesso...</div> : !autenticado ? <Login onEntrar={entrar} /> : (
            <Acompanhamento
              perfis={perfis}
              selecionadoId={selecionadoId}
              sessoes={sessoes}
              onSelecionar={selecionarPerfil}
              carregando={carregando}
              onAdicionar={adicionarSessao}
              onExcluir={excluirSessao}
              onAbrirPerfis={() => abrirPagina('Perfis')}
            />
          ))}
        </main>
      </div>
    </div>
  )
}

export default App
