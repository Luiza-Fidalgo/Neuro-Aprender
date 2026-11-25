import React, { useState } from 'react'

const atividades = ['Associação de figuras', 'Sequência lógica', 'Rotina visual', 'Outra atividade']
const participacoes = [
  'Participou com autonomia',
  'Participou com apoio',
  'Fez uma pausa',
  'Não concluiu a proposta'
]

function dataLocal() {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return ano + '-' + mes + '-' + dia
}

function formatarData(data) {
  const partes = data.split('-')
  return partes.length === 3 ? partes.reverse().join('/') : data
}

export default function Acompanhamento({ perfis, selecionadoId, onSelecionar, sessoes, onAdicionar, onExcluir, onAbrirPerfis }) {
  const [data, setData] = useState(dataLocal)
  const [atividade, setAtividade] = useState(atividades[0])
  const [participacao, setParticipacao] = useState(participacoes[0])
  const [observacao, setObservacao] = useState('')
  const [mensagem, setMensagem] = useState('')

  const registros = sessoes.filter((sessao) => sessao.perfilId === selecionadoId).slice().reverse()

  function salvar(evento) {
    evento.preventDefault()
    if (!perfis.some((perfil) => perfil.id === selecionadoId)) {
      setMensagem('Selecione um perfil antes de registrar uma sessão.')
      return
    }
    if (!data) {
      setMensagem('Informe a data da sessão.')
      return
    }
    onAdicionar({ perfilId: selecionadoId, data, atividade, participacao, observacao: observacao.trim() })
    setObservacao('')
    setMensagem('Registro adicionado à demonstração. Ele será apagado ao recarregar a página.')
  }

  return (
    <section className="pagina-secao">
      <p className="sobrelinha">Acompanhamento pedagógico</p>
      <h1>Registre cada etapa do processo.</h1>
      <p className="descricao">
        Organize observações simples das atividades, sem comparações entre crianças
        e sem usar informações clínicas ou pessoais nesta demonstração.
      </p>

      <div className="alerta-privacidade" role="note">
        <strong>Registros temporários</strong>
        <p>As informações não são salvas, compartilhadas ou enviadas a um servidor. Use apenas dados fictícios até a implementação de autenticação e armazenamento seguro.</p>
      </div>

      {perfis.length === 0 ? (
        <div className="estado-vazio">
          <span aria-hidden="true" className="estado-vazio-icone">▥</span>
          <strong>Crie primeiro um perfil de exemplo</strong>
          <p>É necessário selecionar um identificador fictício antes de iniciar os registros.</p>
          <button className="botao-principal" type="button" onClick={onAbrirPerfis}>Ir para perfis</button>
        </div>
      ) : (
        <>
          <div className="formulario-cartao">
            <label htmlFor="perfil-sessao">Perfil para acompanhamento</label>
            <select id="perfil-sessao" value={selecionadoId || ''} onChange={(evento) => { onSelecionar(evento.target.value); setMensagem('') }}>
              <option value="">Selecione um perfil</option>
              {perfis.map((perfil) => (
                <option key={perfil.id} value={perfil.id}>{perfil.codigo}</option>
              ))}
            </select>
          </div>

          {selecionadoId && perfis.some((perfil) => perfil.id === selecionadoId) ? (
            <>
              <form className="formulario-cartao" onSubmit={salvar}>
                <h2>Novo registro de sessão</h2>
                <div className="grade-formulario">
                  <div className="campo-formulario">
                    <label htmlFor="data-sessao">Data</label>
                    <input id="data-sessao" type="date" value={data} onChange={(evento) => setData(evento.target.value)} required />
                  </div>
                  <div className="campo-formulario">
                    <label htmlFor="atividade-sessao">Atividade realizada</label>
                    <select id="atividade-sessao" value={atividade} onChange={(evento) => setAtividade(evento.target.value)}>
                      {atividades.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <div className="campo-formulario campo-largo">
                    <label htmlFor="participacao-sessao">Como foi a participação?</label>
                    <select id="participacao-sessao" value={participacao} onChange={(evento) => setParticipacao(evento.target.value)}>
                      {participacoes.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <div className="campo-formulario campo-largo">
                    <label htmlFor="observacao-sessao">Observação breve (opcional)</label>
                    <textarea
                      id="observacao-sessao"
                      rows={3}
                      maxLength={240}
                      value={observacao}
                      onChange={(evento) => setObservacao(evento.target.value)}
                      placeholder="Ex.: Preferiu começar pela atividade com duas figuras."
                    />
                    <small>Máximo de 240 caracteres. Não inclua nomes completos, diagnósticos ou dados pessoais.</small>
                  </div>
                </div>
                <button className="botao-principal" type="submit">Adicionar registro</button>
                <p className="mensagem-formulario" role="status" aria-live="polite">{mensagem}</p>
              </form>

              <div className="secao-lista-topo">
                <h2>Histórico nesta demonstração</h2>
                <span>{registros.length} {registros.length === 1 ? 'registro' : 'registros'}</span>
              </div>
              {registros.length === 0 ? (
                <div className="estado-vazio">
                  <strong>Nenhuma sessão registrada</strong>
                  <p>Preencha o formulário para criar o primeiro registro de exemplo.</p>
                </div>
              ) : (
                <ol className="lista-registros">
                  {registros.map((sessao) => (
                    <li className="registro-item" key={sessao.id}>
                      <div className="registro-cabecalho">
                        <div>
                          <strong>{sessao.atividade}</strong>
                          <small>{formatarData(sessao.data)}</small>
                        </div>
                        <button className="botao-texto" type="button" onClick={() => onExcluir(sessao.id)}>Excluir</button>
                      </div>
                      <span className="registro-participacao">{sessao.participacao}</span>
                      {sessao.observacao && <p>{sessao.observacao}</p>}
                    </li>
                  ))}
                </ol>
              )}
            </>
          ) : (
            <div className="estado-vazio">
              <strong>Escolha um perfil para continuar</strong>
              <p>Os registros ficam organizados por identificador fictício.</p>
            </div>
          )}
        </>
      )}
    </section>
  )
}
