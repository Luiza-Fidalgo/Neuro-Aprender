# NeuroAprender

Plataforma experimental de atividades pedagógicas visuais, rotinas e acompanhamento com identificadores fictícios.

## Desenvolvimento

Requer Node.js compatível com Vite 8 e PHP 8.1+ com extensões PDO MySQL e mbstring na hospedagem.

```bash
npm install
npm run dev
```

Os jogos e as rotinas funcionam no frontend. O login, os perfis e o acompanhamento dependem da API PHP e do banco MySQL. No Vite local, sem servidor PHP, essas áreas não funcionarão; não use o modo de desenvolvimento como teste da integração de servidor.

## Publicação na Hostinger (hospedagem PHP + MySQL)

1. Crie um banco MySQL e importe `database/schema.sql` pelo phpMyAdmin.
2. Copie `api/config.example.php` para `api/config.php` **no servidor**, preenchendo host, banco, usuário e senha. **Nunca publique esse arquivo no Git.**
3. No terminal local, gere um hash de senha sem expor a senha no repositório. Por exemplo, execute `php -r 'echo password_hash(readline("Senha: "), PASSWORD_DEFAULT), PHP_EOL;'`. Atenção: alguns terminais exibem os caracteres digitados. Use um gerenciador de senhas e uma senha forte.
4. No phpMyAdmin, crie o usuário inicial em `users` com `INSERT INTO users (username, password_hash) VALUES ('usuario_de_teste', 'HASH_GERADO');` substituindo o hash, sem inserir a senha em texto puro.
5. Execute `npm run build`. O build inclui os arquivos publicáveis da API em `dist/api`, mas **não** inclui `config.php`. Envie o conteúdo de `dist/` para `public_html/` da Hostinger. Coloque `config.php` em `public_html/api/`.
6. Ative HTTPS no domínio e verifique `https://seu-dominio/api/health` (resposta JSON com `status: ok`). Em seguida, teste o login e a persistência de um perfil fictício, inclusive após recarregar.
7. Antes de registrar dados pessoais ou sensíveis de crianças, conclua a avaliação de segurança, privacidade e adequação à LGPD. **O sistema não está validado para dados reais.**

> Em hostings com permissões restritas, não inclua arquivos de configuração secretos em arquivos públicos ou backups compartilhados. Considere medidas adicionais de proteção, retenção e recuperação antes do uso real.

## Estrutura

- `src/`: páginas e atividades React; login e cliente de API
- `api/`: rotas PHP protegidas por sessão, validação de acesso e token CSRF
- `database/schema.sql`: esquema MySQL com perfis vinculados a usuários e registros vinculados a perfis
- `vite.config.js`: cópia dos arquivos públicos de API durante o build

As rotas de perfis e acompanhamento exigem autenticação. Não há cadastro público de usuários. O usuário inicial é inserido manualmente no banco durante a instalação.
