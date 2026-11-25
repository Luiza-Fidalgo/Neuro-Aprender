import React, { useState } from 'react'

export default function Login({ onEntrar }) {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  async function entrar(evento) {
    evento.preventDefault()
    setEnviando(true)
    setErro('')
    try {
      await onEntrar(usuario.trim(), senha)
      setSenha('')
    } catch (erro) {
      setErro(erro.message)
    } finally {
      setEnviando(false)
    }
  }
  return (
    <section className="pagina-secao">
      <p className="sobrelinha">Área restrita</p>
      <h1>Acesso ao acompanhamento.</h1>
      <p className="descricao">Esta área é destinada aos profissionais autorizados. A plataforma está em fase de testes e aceita apenas dados fictícios.</p>
      <form className="formulario-cartao login-formulario" onSubmit={entrar}>
        <h2>Entrar na plataforma</h2>
        <label htmlFor="usuario-login">Usuário</label>
        <input id="usuario-login" autoComplete="username" maxLength={80} value={usuario} onChange={e => setUsuario(e.target.value)} required />
        <label htmlFor="senha-login">Senha</label>
        <input id="senha-login" type="password" autoComplete="current-password" value={senha} onChange={e => setSenha(e.target.value)} required />
        <button className="botao-principal" type="submit" disabled={enviando}>{enviando ? 'Entrando...' : 'Entrar'}</button>
        <p className="mensagem-formulario" role="alert">{erro}</p>
      </form>
    </section>
  )
}
