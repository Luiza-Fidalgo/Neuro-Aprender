import React, { useState } from 'react'

export default function Perfis({ perfis, selecionadoId, onAdicionar, onSelecionar, onRemover, sessoes }) {
  const [codigo, setCodigo] = useState('')
  const [aviso, setAviso] = useState('')
  const [confirmando, setConfirmando] = useState(null)

  async function adicionar(evento) {
    evento.preventDefault()
    const valor = codigo.trim().replace(/\s+/g, ' ')
    if (valor.length < 2 || valor.length > 30) {
      setAviso('Use um identificador entre 2 e 30 caracteres.')
      return
    }
    if (perfis.some((perfil) => perfil.codigo.toLowerCase() === valor.toLowerCase())) {
      setAviso('Já existe um perfil com esse identificador.')
      return
    }
    try {
      await onAdicionar(valor)
      setCodigo('')
      setAviso('Perfil cadastrado com sucesso.')
    } catch (erro) {
      setAviso(erro.message)
    }
  }

  async function excluir(id) {
    try {
      await onRemover(id)
      setConfirmando(null)
      setAviso('Perfil e registros relacionados foram excluídos.')
    } catch (erro) {
      setAviso(erro.message)
    }
  }

  return (
    <section className="pagina-secao">
      <p className="sobrelinha">Perfis de acompanhamento</p>
      <h1>Organize os perfis da atividade.</h1>
      <p className="descricao">
        Cadastre apenas identificadores fictícios para testar o acompanhamento. Não utilize nomes completos,
        diagnósticos, endereços ou informações pessoais de crianças nesta fase.
      </p>

      <div className="alerta-privacidade" role="note">
        <strong>Acesso restrito — testes</strong>
        <p>Os perfis ficam armazenados no banco de dados configurado no servidor. Utilize apenas dados fictícios até a validação da implantação e segurança.</p>
      </div>

      <form className="formulario-cartao" onSubmit={adicionar}>
        <h2>Novo perfil</h2>
        <label htmlFor="codigo-perfil">Identificador fictício</label>
        <div className="formulario-linha">
          <input
            id="codigo-perfil"
            value={codigo}
            onChange={(evento) => setCodigo(evento.target.value)}
            placeholder="Ex.: Perfil A"
            maxLength={30}
            autoComplete="off"
            required
          />
          <button className="botao-principal" type="submit">Adicionar perfil</button>
        </div>
        <p className="formulario-ajuda">Use apenas um código ou apelido inventado, sem informações pessoais.</p>
        <p className="mensagem-formulario" role="status" aria-live="polite">{aviso}</p>
      </form>

      <div className="secao-lista-topo">
        <h2>Perfis cadastrados</h2>
        <span>{perfis.length} {perfis.length === 1 ? 'perfil' : 'perfis'}</span>
      </div>

      {perfis.length === 0 ? (
        <div className="estado-vazio">
          <span aria-hidden="true" className="estado-vazio-icone">▥</span>
          <strong>Nenhum perfil cadastrado</strong>
          <p>Adicione um identificador fictício para experimentar os registros de sessão.</p>
        </div>
      ) : (
        <ul className="lista-perfis">
          {perfis.map((perfil) => {
            const quantidade = perfil.quantidade ?? 0
            return (
              <li className="perfil-item" key={perfil.id}>
                <span className="perfil-avatar" aria-hidden="true">{perfil.codigo.charAt(0).toUpperCase()}</span>
                <div className="perfil-dados">
                  <strong>{perfil.codigo}</strong>
                  <small>{quantidade} {quantidade === 1 ? 'registro' : 'registros'} de sessão</small>
                </div>
                <div className="perfil-acoes">
                  <button
                    className="botao-secundario"
                    type="button"
                    onClick={() => { onSelecionar(perfil.id); setAviso('Perfil selecionado para acompanhamento.') }}
                    aria-pressed={selecionadoId === perfil.id}
                  >
                    {selecionadoId === perfil.id ? 'Selecionado' : 'Selecionar'}
                  </button>
                  {confirmando === perfil.id ? (
                    <div className="excluir-confirmacao">
                      <span>Excluir também os registros?</span>
                      <button type="button" onClick={() => excluir(perfil.id)}>Sim, excluir</button>
                      <button type="button" onClick={() => setConfirmando(null)}>Cancelar</button>
                    </div>
                  ) : (
                    <button type="button" className="botao-texto" onClick={() => setConfirmando(perfil.id)}>Excluir</button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
