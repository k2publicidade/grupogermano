---
name: Grupo Germano
description: Portal B2B de papelaria e catálogo da marca Mundo Encantado
colors:
  black: "oklch(0.105 0 0)"
  ink: "oklch(0.18 0 0)"
  graphite: "oklch(0.31 0 0)"
  muted: "oklch(0.46 0 0)"
  line: "oklch(0.86 0 0)"
  soft: "oklch(0.955 0 0)"
  white: "oklch(1 0 0)"
  focus: "oklch(0.56 0.16 250)"
typography:
  display:
    fontFamily: "Trebuchet MS, Arial, sans-serif"
    fontSize: "clamp(3rem, 7vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    letterSpacing: "0.13em"
rounded:
  sm: "6px"
  md: "12px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.black}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "14px 21px"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
    rounded: "{rounded.sm}"
    padding: "14px 21px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "14px 16px"
---

# Design System: Grupo Germano

## 1. Overview

**Creative North Star: "O Ateliê de Papel Preciso"**

O sistema combina a clareza de um catálogo profissional com pequenos momentos de descoberta. Preto, branco e cinzas organizam toda a experiência; fotografia, recortes, ritmo e movimento responsivo carregam o encantamento da Mundo Encantado. A cena física é um showroom B2B iluminado, onde o comprador avalia papel, impressão e embalagem com calma e confiança.

A composição é ampla e direta, com heróis divididos entre mensagem e produto, seções que alternam fundos extremos e linhas finas usadas como estrutura. A interface rejeita infantilização, excesso decorativo e a aparência de um site corporativo genérico.

**Key Characteristics:**
- Contraste alto e hierarquia tipográfica decisiva.
- Fotografia de produto como principal evidência comercial.
- Composição modular, com poucos contêineres arredondados.
- Movimento responsivo, limitado a feedback e descoberta.
- Linguagem objetiva para compradores e revendedores.

## 2. Colors

A paleta é monocromática e neutra. Preto conduz chamadas e áreas institucionais; branco preserva a qualidade fotográfica; cinzas organizam informação, separação e estado.

### Primary
- **Preto de Impressão:** base de CTAs, rodapé, painel lateral e seções de alta confiança.

### Neutral
- **Tinta:** texto corrente de alto contraste.
- **Grafite:** texto complementar e estados de interação.
- **Cinza de Legenda:** metadados e descrições secundárias.
- **Linha Técnica:** divisórias e estrutura de tabelas.
- **Branco de Estúdio:** superfície dominante e fundo de fotografia.
- **Névoa:** agrupamento de formulários, resumo e áreas administrativas.

### Named Rules

**The Monochrome Rule.** Cor saturada nunca estrutura a marca. A única exceção é o azul funcional do foco de teclado, que existe por acessibilidade.

**The Evidence Rule.** Quando uma área parecer vazia, adicionar produto, especificação ou espaço; nunca um gradiente decorativo.

## 3. Typography

**Display Font:** Trebuchet MS (com Arial como fallback)
**Body Font:** Arial (com Helvetica como fallback)
**Label Font:** Arial em peso 700

**Character:** A fonte de display tem curvas humanistas suficientes para acolher o universo infantil sem perder precisão comercial. A sans de corpo reduz ruído em tabelas, formulários, especificações e números.

### Hierarchy
- **Display** (700, `clamp(3rem, 7vw, 6rem)`, 0.98): heróis e chamadas principais, sempre balanceados e limitados a 96px.
- **Headline** (700, `clamp(2.7rem, 6vw, 5.5rem)`, 0.98): títulos de seção.
- **Title** (700, `1.4–2.2rem`, 1.05): produtos, painéis e componentes de resumo.
- **Body** (400, `1rem`, 1.55): textos corridos limitados a 70 caracteres por linha.
- **Label** (700, `0.72rem`, 0.13em): categorias curtas e identificadores, nunca frases inteiras.

### Named Rules

**The Legible Magic Rule.** O encantamento vem da forma e do ritmo, nunca de fontes manuscritas ou texto infantilizado.

## 4. Elevation

O sistema é plano por padrão. Profundidade é produzida por contraste tonal, posicionamento sticky e mudança de escala em imagens. Sombras decorativas são proibidas; modais usam apenas o escurecimento estrutural do plano de fundo.

### Named Rules

**The Flat-by-Default Rule.** Se uma superfície precisa de sombra para ser compreendida, a hierarquia ou o contraste tonal estão errados.

## 5. Components

### Buttons
- **Shape:** cantos discretos (6px), altura mínima de 48px.
- **Primary:** preto de impressão com texto branco e padding de 14px × 21px.
- **Hover / Focus:** elevação física de 2px no hover; anel azul de 3px no foco visível.
- **Secondary:** branco com contorno preto de 1px.

### Chips
- **Style:** pill monocromática, fundo névoa e texto compacto.
- **State:** filtros ativos invertem para preto e branco.

### Cards / Containers
- **Corner Style:** produtos são quadrados; resumos operacionais usam 12px.
- **Background:** branco ou névoa, nunca translucidez decorativa.
- **Shadow Strategy:** nenhuma sombra em repouso.
- **Border:** uma linha técnica apenas quando separação é necessária.
- **Internal Padding:** 24px como base, reduzido proporcionalmente no mobile.

### Inputs / Fields
- **Style:** branco, linha técnica de 1px, raio de 6px e rótulo persistente.
- **Focus:** troca da borda para preto com anel de foco externo.
- **Error / Disabled:** mensagem textual associada; cor nunca é o único indicador.

### Navigation

Cabeçalho branco sticky de 80px no desktop e 70px no mobile. Links têm sublinhado progressivo; o mobile troca a lista por um painel preto de tela inteira com alvos de toque amplos.

### Product Evidence

Imagem quadrada ou ampla, SKU, categoria, descrição objetiva, especificações e estado de preço protegido. O preço nunca aparece antes da autenticação comercial.

## 6. Do's and Don'ts

### Do:
- **Do** usar fotografia realista e especificações para provar qualidade.
- **Do** preservar contraste mínimo WCAG AA e foco visível em todos os controles.
- **Do** usar espaços amplos, linhas finas e alinhamentos firmes para comunicar precisão.
- **Do** reservar movimento para feedback, navegação e descoberta de detalhes.
- **Do** proteger preço e condições por volume atrás do cadastro empresarial.

### Don't:
- **Don't** criar sites corporativos genéricos de fornecedores, com bancos de imagens impessoais, excesso de azul institucional e blocos repetitivos.
- **Don't** criar interfaces infantilizadas, caricatas ou visualmente ruidosas que comprometam confiança comercial.
- **Don't** usar landing pages com aparência de template de IA, gradientes decorativos, glassmorphism, excesso de cartões e slogans vagos.
- **Don't** imitar catálogos de varejo com preço público ou linguagem de e-commerce B2C.
- **Don't** combinar borda de 1px com sombra ampla, usar cantos acima de 16px em cartões ou repetir etiquetas em todas as seções.

