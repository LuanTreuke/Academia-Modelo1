# Landing page de academia — Modelo 1

Data: 2026-09-10

## Contexto

Template genérico de landing page para academias, feito para ser
demonstrado em portfólio e revendido a vários clientes. O conteúdo é
fictício, mas a troca por dados reais precisa ser trivial.

## Conceito

A página se comporta como a recepção da academia, não como um folder.
Ela responde as três perguntas de quem está decidindo se matricular —
quanto custa para mim, vai estar lotado no meu horário, como é lá
dentro — em vez de repetir "matricule-se já".

Isso é o argumento de venda do template: as concorrentes têm as mesmas
seções, mas nenhuma tem utilidade real na própria página.

## Escopo

Inclui: uma página única estática, com quiz de recomendação de plano,
mapa de lotação por horário, grade de aulas, tour de estrutura, tabela
de planos, prova social e contato. Todo o conteúdo vem de um arquivo de
dados editável.

Não inclui: back-end, formulário com envio por servidor, área do aluno,
pagamento, CMS, blog, múltiplas páginas, integração com sistema de
gestão de academia.

Fora de escopo por decisão de design: contador regressivo de promoção,
popup de saída, aviso de escassez ("restam 3 vagas"), vídeo em autoplay.
São os tiques que fazem toda landing de academia parecer igual e
desconfiável.

## Stack e restrições

HTML, CSS e JavaScript puros. Sem build, sem dependências, sem
framework. O site sobe em qualquer hospedagem estática.

JavaScript em módulos ES (`<script type="module">`), sem bundler. Como
módulos ES não carregam pelo protocolo `file://`, a demonstração local
roda por um servidor estático simples; o `LEIA-ME.md` traz o comando.

Fontes do Google Fonts via `<link>`, com pilha de fallback do sistema.

## Estrutura de arquivos

```
Academia-Modelo1/
├── index.html
├── LEIA-ME.md
├── docs/superpowers/specs/
└── assets/
    ├── css/
    │   ├── base.css      reset, variáveis de tema, tipografia
    │   ├── layout.css    grid, containers, cabeçalho, rodapé
    │   └── secoes.css    estilos por seção
    ├── js/
    │   ├── dados.js      objeto ACADEMIA — único arquivo do cliente
    │   ├── hero-vivo.js  período do dia, próxima aula, movimento agora
    │   ├── quiz.js       fluxo de 4 passos e recomendação
    │   ├── lotacao.js    render do heatmap
    │   ├── aulas.js      grade semanal e filtro
    │   └── principal.js  inicializa os módulos
    └── img/
        ├── hero-academia.jpg
        ├── zona-musculacao.jpg
        └── zona-studio.jpg
```

Cada módulo JS exporta uma função `iniciar(raiz)` e não conhece os
outros. `principal.js` é o único lugar que os amarra. Isso permite
remover uma seção inteira do template apagando uma linha.

## Modelo de dados

`assets/js/dados.js` exporta um único objeto `ACADEMIA`. É o único
arquivo que o cliente final precisa editar.

```js
export const ACADEMIA = {
  nome, slogan, whatsapp, endereco, mapaEmbedUrl,
  horarioFuncionamento: { semana, sabado, domingo },
  marca: { corPrincipal, corDestaque },
  planos: [ { id, nome, preco, periodo, resolve, inclui[] } ],
  aulas:  [ { nome, tipo, dia, hora, duracao, professor } ],
  lotacao: { faixas[], dias[], valores[][] },  // 0..3
  zonas:  [ { nome, descricao, imagem } ],
  depoimentos: [ { nome, tempoDeCasa, objetivo, texto } ],
};
```

`lotacao.valores` é uma matriz dia × faixa com inteiros de 0 a 3:
0 tranquilo, 1 moderado, 2 cheio, 3 lotado. O `LEIA-ME.md` explica
como o dono da academia preenche isso a partir da percepção dele ou
dos check-ins do sistema de gestão.

Os três planos do conteúdo fictício são Essencial, Plus e Full, nessa
ordem de preço.

## Seções da página

### 1. Hero — "agora na academia"

Nome da academia em tipografia de display grande sobre a imagem de
fundo escurecida. Ao lado, um bloco vivo com hora atual, próxima aula
e nível de movimento agora. Dois CTAs: "Montar meu plano" (rola até o
quiz) e "Falar no WhatsApp".

O período do dia (manhã 5h–11h, tarde 12h–17h, noite 18h–4h) define o
atributo `data-periodo` no `<html>`, que troca o conjunto de cores e a
saudação.

### 2. Quiz — "monte seu plano em 60s"

Na segunda dobra. Quatro passos, um por vez, com barra de progresso:

1. Objetivo: emagrecer, ganhar massa, saúde e disposição, treinar para um esporte
2. Frequência: 2–3x por semana, 4–5x, todo dia
3. Horário preferido: manhã, tarde, noite, flexível
4. Experiência: nunca treinei, já treinei antes, treino hoje

O resultado mostra o plano recomendado com preço, o que inclui, e uma
frase explicando por que aquele plano — montada a partir das respostas,
não genérica. Abaixo, um botão de WhatsApp com a mensagem já escrita.

**Regra de recomendação** (determinística, por pontos):

| Resposta | Pontos |
|---|---|
| objetivo: emagrecer ou saúde | Plus +2 |
| objetivo: ganhar massa | Essencial +2 |
| objetivo: esporte | Full +2 |
| frequência: 2–3x | Essencial +1 |
| frequência: 4–5x | Plus +1 |
| frequência: todo dia | Full +2 |
| experiência: nunca treinei | Full +2 |
| experiência: já treinei antes | Plus +1 |
| experiência: treino hoje | Essencial +1 |

O horário não pontua: alimenta o destaque no mapa de lotação e a
justificativa. Vence a maior pontuação; em empate, vence o plano mais
barato entre os empatados.

**Mensagem de WhatsApp**: montada por template e passada por
`encodeURIComponent` em `https://wa.me/<numero>?text=<msg>`. Formato:
"Oi! Fiz o quiz no site e caí no plano <nome>. Meu objetivo é
<objetivo> e pretendo treinar <frequência>, de preferência <horário>."

### 3. Mapa de lotação

Grade de dias × faixas de horário, intensidade de cor por valor. Se a
pessoa já respondeu o quiz, a coluna do horário escolhido fica
destacada. Uma frase abaixo lê os dados por ela — por exemplo, "terça
às 6h é o horário mais tranquilo para quem treina de manhã" — apontando
a faixa de menor valor dentro do período escolhido. Sem resposta do
quiz, a frase aponta a faixa mais vazia da semana inteira.

A intensidade nunca é comunicada só por cor: cada célula tem rótulo
textual acessível.

### 4. Aulas

Grade semanal com filtro por tipo. As aulas de hoje aparecem em
destaque, e a próxima aula do dia é marcada.

### 5. Estrutura

Tour em rolagem horizontal por 4 a 5 zonas, cada uma com imagem grande
e uma linha de texto. Rola com toque, roda do mouse e teclado, e no
celular vira empilhamento vertical.

### 6. Planos

A tabela completa, para quem pulou o quiz. Cada plano diz o que resolve,
não só o que inclui. Sem selo de "mais popular" inventado.

### 7. Prova social

Depoimentos curtos com nome, tempo de casa e objetivo alcançado.

### 8. Rodapé

Endereço, mapa incorporado, horário de funcionamento e contatos.
Botão de WhatsApp flutuante fixo em toda a página.

## Sistema visual

Tokens em `:root` como variáveis CSS: `--cor-marca`, `--cor-destaque`,
`--cor-fundo`, `--cor-superficie`, `--cor-texto`, mais escalas de
espaçamento e tipografia. Trocar a identidade do cliente é trocar duas
variáveis.

O tema por período redefine apenas as variáveis de fundo e destaque
sob `[data-periodo="manha"]`, `[data-periodo="tarde"]` e
`[data-periodo="noite"]`. Nenhuma cor tem sua única definição dentro
de um desses blocos.

Direção: base escura, tipografia de display grande e condensada nos
títulos, texto corrido em fonte neutra legível, muito respiro, e um
único tom de destaque quente vindo das imagens.

## Imagens

Três imagens fornecidas em `assets/img/`:

| Arquivo | Conteúdo | Onde |
|---|---|---|
| `hero-academia.jpg` | salão amplo, escuro, frase na parede | fundo do hero |
| `zona-musculacao.jpg` | remada com halter | zona Musculação no tour; fundo da seção de planos |
| `zona-studio.jpg` | pilates no reformer | zona Studio no tour; card de aula em destaque |

Regras: toda imagem de fundo leva uma camada de escurecimento por cima
e texto nunca fica direto sobre o pixel; `loading="lazy"` em tudo abaixo
da primeira dobra; sem `background-attachment: fixed` no celular; todo
`<img>` com `alt` descritivo e proporção reservada para não deslocar o
layout ao carregar.

As zonas do tour sem imagem própria usam um bloco de cor sólida com o
nome da zona, para o layout não quebrar enquanto as imagens não chegam.
Outras imagens entram depois nas mesmas pastas e contêineres nomeados
por zona, sem mexer no CSS existente.

## Acessibilidade e resiliência

Contraste mínimo AA para todo texto, inclusive sobre imagem. Quiz
navegável por teclado, com foco visível e mudança de passo anunciada.
`prefers-reduced-motion` desliga as transições de rolagem e do quiz.
Estados de lotação com rótulo textual além da cor.

Sem JavaScript, a página ainda mostra o essencial: identidade, planos,
aulas, endereço e WhatsApp. Quiz, heatmap e hero vivo ficam ocultos por
padrão e são revelados pelos módulos ao iniciarem.

## Verificação

A entrega só é considerada pronta com estes itens conferidos no
navegador:

1. Os quatro caminhos principais do quiz chegam a um plano coerente com a tabela de pontos.
2. O botão de WhatsApp gera um link válido com a mensagem correta e escapada.
3. O mapa de lotação destaca o horário escolhido no quiz e a frase-resumo aponta a faixa mais vazia daquele período.
4. Forçar manhã, tarde e noite muda tema e saudação, e a próxima aula exibida bate com a grade.
5. Layout íntegro a 375px, 768px e 1440px de largura.
6. Console sem erros e sem requisições quebradas.
7. Com JavaScript desativado, planos, aulas, endereço e WhatsApp continuam visíveis.
8. Trocar `nome`, `whatsapp` e as duas cores de marca em `dados.js` muda a página inteira, sem editar HTML ou CSS.
