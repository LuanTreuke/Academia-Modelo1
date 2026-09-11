# Landing page de academia — Modelo 1

Site de uma página só, em HTML, CSS e JavaScript puros. Sem build, sem
dependências, sem framework.

O conceito: a página se comporta como a recepção da academia. Ela
responde as três perguntas de quem está decidindo se matricular —
quanto custa para mim, vai estar lotado no meu horário, como é lá
dentro — em vez de repetir "matricule-se já".

## Como rodar na sua máquina

O site usa módulos ES, que o navegador não carrega por `file://`. Abra
um servidor estático na pasta do projeto:

```bash
npx --yes serve .
```

Ou, se tiver Python instalado:

```bash
py -m http.server 5173
```

Depois abra o endereço que aparecer no terminal. Em hospedagem
(Netlify, Vercel, Hostinger, qualquer uma), é só subir a pasta — não
tem passo de build.

## Como trocar de cliente

Quase tudo está em **`assets/js/dados.js`**. Abra esse arquivo e edite
o objeto `ACADEMIA`:

| Campo | O que é |
|---|---|
| `nome`, `slogan` | Aparecem no topo, no rodapé e no título da aba |
| `whatsapp` | Só números, com país e DDD: `5511999999999` |
| `telefone`, `email`, `endereco` | Rodapé |
| `mapaEmbedUrl` | Google Maps → Compartilhar → Incorporar um mapa |
| `marca.corPrincipal` e `marca.corDestaque` | As duas cores mudam o site inteiro |
| `planos` | Nome, preço, o que resolve e o que inclui |
| `aulas` | Grade da semana (`dia`: 0 = domingo, 6 = sábado) |
| `lotacao` | O mapa de movimento — veja abaixo |
| `zonas` | As áreas do tour de estrutura, mostradas num coverflow 3D |
| `depoimentos` | Prova social |

Fora daí, só existe um trecho de conteúdo escrito direto no HTML: o
bloco `<noscript>` no rodapé do `index.html`, que é o que aparece se o
visitante estiver com JavaScript desligado. Atualize os contatos dele
junto com o `dados.js`.

### Preenchendo o mapa de lotação

É a parte que nenhum concorrente tem, então vale preencher com cuidado.
`lotacao.valores` é uma linha por dia (segunda a domingo) e uma coluna
por faixa de horário:

| Valor | Significa |
|---|---|
| `-1` | Fechado |
| `0` | Tranquilo |
| `1` | Moderado |
| `2` | Cheio |
| `3` | Lotado |

O dono da academia normalmente sabe isso de cabeça. Se o sistema de
gestão exporta check-ins por hora, melhor ainda: conte os check-ins
médios de cada faixa e divida em quatro níveis.

O site usa esses números para duas coisas: o bloco "agora na academia"
no topo e a frase que aponta o horário mais vazio.

### Trocando as fotos

Coloque os arquivos em `assets/img/` com estes nomes:

| Arquivo | Onde aparece |
|---|---|
| `hero-academia.jpg` | Fundo do topo da página |
| `zona-musculacao.jpg` | Área de musculação e fundo da seção de planos |
| `zona-studio.jpg` | Área do studio |

Prefira fotos horizontais e escuras para o topo — o texto fica por
cima. Zona sem foto vira um bloco com o nome da área, então dá para
lançar o site com fotos faltando e ir completando: é só apontar o campo
`imagem` da zona em `dados.js` para o arquivo novo.

## Estrutura

```
index.html
assets/
  css/
    base.css      variáveis de cor e tipografia, reset
    layout.css    cabeçalho, botões, rodapé
    secoes.css    estilo de cada seção
  js/
    dados.js      ← o arquivo do cliente
    conteudo.js   preenche identidade, planos, depoimentos
    tour.js       coverflow 3D das zonas da estrutura
    hero-vivo.js  hora, próxima aula e movimento no topo
    quiz.js       montador de plano
    lotacao.js    mapa de movimento
    aulas.js      grade semanal
    util.js       funções compartilhadas
    principal.js  amarra tudo
  img/            as fotos
```

Cada módulo é independente e só é ligado em `principal.js`. Para tirar
uma seção do site, apague a linha dela nesse arquivo e o bloco
correspondente no `index.html`.

## Como o quiz escolhe o plano

Cada resposta soma pontos para um plano. Vence o de maior pontuação;
empatou, vence o mais barato entre os empatados.

| Resposta | Pontos |
|---|---|
| Emagrecer ou saúde e disposição | Plus +2 |
| Ganhar massa | Essencial +2 |
| Treinar para um esporte | Full +2 |
| 2 a 3 vezes por semana | Essencial +1 |
| 4 a 5 vezes por semana | Plus +1 |
| Todo dia | Full +2 |
| Nunca treinei | Full +2 |
| Já treinei antes | Plus +1 |
| Treino atualmente | Essencial +1 |

O horário não pontua: ele serve para destacar o mapa de lotação e para
montar a frase de justificativa.

Se o cliente tiver outros planos, mude os `id` em `dados.js` e ajuste a
tabela `PASSOS` e o objeto `RAZAO_DO_PLANO` no topo de
`assets/js/quiz.js`. São as duas únicas coisas que amarram o quiz aos
planos.
