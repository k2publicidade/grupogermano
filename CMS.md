# CMS Mundo Encantado

## Acesso

O painel fica disponível em `/admin`. As credenciais são configuradas apenas no arquivo local `.env.local`, que está ignorado pelo Git. Em produção, defina `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` e `ADMIN_SESSION_SECRET` no provedor de hospedagem.

Para trocar a senha, gere o SHA-256 da nova senha e substitua `ADMIN_PASSWORD_HASH`. Reinicie o servidor após alterar variáveis de ambiente.

## Recursos

- CRUD de textos e seções, com rascunho e publicação.
- Biblioteca de mídia com upload, edição de nome/descrição e exclusão protegida.
- Imagens em uso não podem ser apagadas.
- Caixa de entrada para contato, revenda, download, cadastro e orçamento.
- Status de atendimento e exclusão de solicitações.
- Histórico das operações administrativas.
- Sessão HTTP-only assinada, expiração em oito horas e rotas protegidas.
- Migração Supabase disponível em `supabase/migrations/002_cms.sql`.

## Persistência

No ambiente local, o CMS persiste em `data/cms.json` e os uploads em `public/uploads`. Para produção distribuída, aplique as migrações Supabase e configure as variáveis Supabase descritas em `.env.example`.

## Validação

Antes de publicar, execute:

```text
npm run typecheck
npm run build
```
