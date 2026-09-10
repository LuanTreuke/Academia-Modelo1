/**
 * Montador de plano: quatro perguntas, uma recomendação com justificativa
 * e um botão de WhatsApp com a mensagem já escrita.
 *
 * A recomendação é determinística: cada resposta soma pontos para um plano,
 * vence o de maior pontuação e, em empate, o mais barato entre os empatados.
 */
import { criar, linkZap, moeda } from './util.js';

const PASSOS = [
  {
    id: 'objetivo',
    pergunta: 'O que você quer do treino?',
    opcoes: [
      { id: 'emagrecer', rotulo: 'Emagrecer', frase: 'emagrecer', pontos: { plus: 2 } },
      { id: 'massa', rotulo: 'Ganhar massa', frase: 'ganhar massa', pontos: { essencial: 2 } },
      { id: 'saude', rotulo: 'Saúde e disposição', frase: 'ganhar saúde e disposição', pontos: { plus: 2 } },
      { id: 'esporte', rotulo: 'Treinar para um esporte', frase: 'treinar para um esporte', pontos: { full: 2 } },
    ],
  },
  {
    id: 'frequencia',
    pergunta: 'Quantas vezes por semana dá para vir?',
    opcoes: [
      { id: '2-3', rotulo: '2 a 3 vezes', frase: '2 a 3 vezes por semana', pontos: { essencial: 1 } },
      { id: '4-5', rotulo: '4 a 5 vezes', frase: '4 a 5 vezes por semana', pontos: { plus: 1 } },
      { id: 'todo-dia', rotulo: 'Todo dia', frase: 'todo dia', pontos: { full: 2 } },
    ],
  },
  {
    id: 'horario',
    pergunta: 'Qual horário combina com a sua rotina?',
    opcoes: [
      { id: 'manha', rotulo: 'De manhã', frase: 'de manhã', pontos: {} },
      { id: 'tarde', rotulo: 'À tarde', frase: 'à tarde', pontos: {} },
      { id: 'noite', rotulo: 'À noite', frase: 'à noite', pontos: {} },
      { id: 'flexivel', rotulo: 'Tanto faz', frase: 'em qualquer horário', pontos: {} },
    ],
  },
  {
    id: 'experiencia',
    pergunta: 'Como está a sua relação com treino hoje?',
    opcoes: [
      { id: 'nunca', rotulo: 'Nunca treinei', frase: 'nunca treinou antes', pontos: { full: 2 } },
      { id: 'ja-treinei', rotulo: 'Já treinei antes', frase: 'já treinou antes', pontos: { plus: 1 } },
      { id: 'treino-hoje', rotulo: 'Treino atualmente', frase: 'já treina atualmente', pontos: { essencial: 1 } },
    ],
  },
];

const RAZAO_DO_PLANO = {
  essencial:
    'o Essencial entrega o equipamento livre sem cobrar por serviço que você não vai usar.',
  plus:
    'o Plus inclui as aulas coletivas, que é onde se acha ritmo e variedade sem ter que montar treino sozinho.',
  full:
    'o Full traz acompanhamento de perto — personal, studio e nutricionista — que é o que segura quem está começando ou treinando pesado.',
};

/** Soma os pontos das respostas e devolve o plano vencedor. */
function recomendar(respostas, planos) {
  const pontos = {};
  for (const plano of planos) pontos[plano.id] = 0;

  for (const [passoId, opcaoId] of Object.entries(respostas)) {
    const passo = PASSOS.find((p) => p.id === passoId);
    const opcao = passo?.opcoes.find((o) => o.id === opcaoId);
    for (const [planoId, valor] of Object.entries(opcao?.pontos ?? {})) {
      if (planoId in pontos) pontos[planoId] += valor;
    }
  }

  const maior = Math.max(...Object.values(pontos));
  const empatados = planos.filter((plano) => pontos[plano.id] === maior);
  return empatados.reduce((a, b) => (a.preco <= b.preco ? a : b));
}

/** Frase que explica a escolha usando as respostas da pessoa. */
function justificar(respostas, plano) {
  const frase = (passoId) => {
    const passo = PASSOS.find((p) => p.id === passoId);
    return passo.opcoes.find((o) => o.id === respostas[passoId]).frase;
  };

  return (
    `Você quer ${frase('objetivo')}, pode vir ${frase('frequencia')} ` +
    `${frase('horario')}, e ${frase('experiencia')}. Por isso ` +
    `${RAZAO_DO_PLANO[plano.id] ?? 'esse é o plano que melhor se encaixa.'}`
  );
}

function mensagemDeZap(respostas, plano) {
  const frase = (passoId) => {
    const passo = PASSOS.find((p) => p.id === passoId);
    return passo.opcoes.find((o) => o.id === respostas[passoId]).frase;
  };

  return (
    `Oi! Fiz o quiz no site e caí no plano ${plano.nome}. ` +
    `Meu objetivo é ${frase('objetivo')} e pretendo treinar ` +
    `${frase('frequencia')}, de preferência ${frase('horario')}.`
  );
}

export function iniciar(dados, aoConcluir = () => {}) {
  const raiz = document.querySelector('[data-quiz]');
  if (!raiz) return;

  const respostas = {};
  let passoAtual = 0;

  function desenharPasso() {
    const passo = PASSOS[passoAtual];
    raiz.replaceChildren();

    const barra = criar('div', { classe: 'quiz__barra' }, [
      criar('span', {
        style: `width:${((passoAtual + 1) / PASSOS.length) * 100}%`,
      }),
    ]);

    raiz.append(
      criar('div', { classe: 'quiz__topo' }, [
        criar('p', {
          classe: 'quiz__contador',
          texto: `Passo ${passoAtual + 1} de ${PASSOS.length}`,
        }),
        barra,
      ]),
    );

    const pergunta = criar('h3', {
      classe: 'quiz__pergunta',
      texto: passo.pergunta,
      tabindex: '-1',
    });
    raiz.append(pergunta);

    const opcoes = criar('div', { classe: 'quiz__opcoes' });
    for (const opcao of passo.opcoes) {
      const botao = criar('button', {
        classe: 'quiz__opcao',
        type: 'button',
        texto: opcao.rotulo,
      });
      botao.addEventListener('click', () => {
        respostas[passo.id] = opcao.id;
        if (passoAtual < PASSOS.length - 1) {
          passoAtual += 1;
          desenharPasso();
        } else {
          desenharResultado();
        }
      });
      opcoes.append(botao);
    }
    raiz.append(opcoes);

    if (passoAtual > 0) {
      const voltar = criar('button', {
        classe: 'quiz__voltar',
        type: 'button',
        texto: 'Voltar',
      });
      voltar.addEventListener('click', () => {
        passoAtual -= 1;
        desenharPasso();
      });
      raiz.append(voltar);
    }

    // Só move o foco depois da primeira interação, para não roubar a rolagem.
    if (passoAtual > 0) pergunta.focus();
  }

  function desenharResultado() {
    const plano = recomendar(respostas, dados.planos);
    raiz.replaceChildren();

    const caixa = criar('div', { classe: 'resultado' });

    caixa.append(
      criar('div', { classe: 'resultado__topo' }, [
        criar('div', {}, [
          criar('p', { classe: 'olho', texto: 'Seu plano' }),
          criar('h3', {
            classe: 'resultado__nome',
            texto: plano.nome,
            tabindex: '-1',
          }),
        ]),
        criar('p', { classe: 'resultado__preco', texto: moeda(plano.preco) }, [
          criar('small', { texto: plano.periodo }),
        ]),
      ]),
      criar('p', {
        classe: 'resultado__porque',
        texto: justificar(respostas, plano),
      }),
      criar(
        'ul',
        { classe: 'resultado__inclui' },
        plano.inclui.map((item) => criar('li', { texto: item })),
      ),
    );

    const refazer = criar('button', {
      classe: 'resultado__refazer',
      type: 'button',
      texto: 'Refazer o teste',
    });
    refazer.addEventListener('click', () => {
      passoAtual = 0;
      desenharPasso();
    });

    caixa.append(
      criar('div', { classe: 'resultado__acoes' }, [
        criar('a', {
          classe: 'botao botao--destaque',
          href: linkZap(dados.whatsapp, mensagemDeZap(respostas, plano)),
          target: '_blank',
          rel: 'noopener',
          texto: `Falar sobre o ${plano.nome}`,
        }),
        criar('a', {
          classe: 'botao botao--vazado',
          href: '#planos',
          texto: 'Comparar com os outros',
        }),
        refazer,
      ]),
    );

    raiz.append(caixa);
    caixa.querySelector('.resultado__nome').focus();

    aoConcluir({ ...respostas }, plano);
  }

  desenharPasso();
  raiz.hidden = false;
}
