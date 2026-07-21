# Grupo Germano

Portal B2B e catálogo da marca Mundo Encantado, desenvolvido com Next.js 16, React 19, TypeScript e Supabase.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Configuração

Copie `.env.example` para `.env.local` e informe as credenciais do Supabase e do serviço de e-mail. Sem credenciais, o catálogo e o painel usam os dados demonstrativos locais para permitir revisão da experiência.

Execute `supabase/migrations/001_initial_schema.sql` e `supabase/migrations/002_cms.sql` em um projeto Supabase novo.

## Validação

```bash
npm run typecheck
npm run build
npm audit --omit=dev
```

## Deploy no Netlify

O projeto está configurado em `netlify.toml` para Next.js com:

- comando de build: `npm run build`;
- diretório publicado: `.next`;
- Node.js 22;
- proteção contra inconsistências durante novos deploys.

Conecte este repositório a um projeto no Netlify e cadastre, em **Project configuration > Environment variables**, todas as variáveis de `.env.example`. Não grave segredos no `netlify.toml` ou no repositório.

As credenciais do Supabase são obrigatórias em produção. Sem elas, as rotas que alteram o CMS tentariam escrever no sistema de arquivos efêmero do Netlify. As credenciais do Resend e os endereços de e-mail são necessários para o envio de formulários e orçamentos.

### Domínio

No Netlify, adicione `grupogermano.app.br` em **Domain management > Add a domain** e defina-o como domínio principal. O Netlify também adicionará `www.grupogermano.app.br`.

Se o DNS continuar no provedor atual:

- aponte o registro `A` de `@` para `75.2.60.5` (ou use `ALIAS`/`ANAME` para `apex-loadbalancer.netlify.com` quando o provedor oferecer esse recurso);
- aponte o `CNAME` de `www` para o endereço `*.netlify.app` informado pelo projeto;
- remova registros conflitantes somente depois que o primeiro deploy estiver acessível pelo endereço do Netlify.

O Netlify emitirá o certificado HTTPS automaticamente após validar o DNS. Use `https://grupogermano.app.br` como endereço público.
