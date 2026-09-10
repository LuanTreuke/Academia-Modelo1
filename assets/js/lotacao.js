/**
 * Mapa de movimento por faixa de horário.
 * Além do desenho, ele lê os dados por quem está olhando: aponta a faixa
 * mais vazia — da semana inteira, ou do período escolhido no quiz.
 */
import { criar, horaDaFaixa, PERIODOS, ROTULOS_DE_MOVIMENTO } from './util.js';

const NOME_COMPLETO_DO_DIA = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo',
];

/** Faixa mais vazia dentro de um período. Empate: a primeira da semana. */
function faixaMaisVazia(lotacao, periodo) {
  const { de, ate } = PERIODOS[periodo] ?? PERIODOS.flexivel;
  let melhor = null;

  lotacao.valores.forEach((linha, iDia) => {
    linha.forEach((valor, iFaixa) => {
      const hora = horaDaFaixa(lotacao.faixas[iFaixa]);
      if (valor < 0 || hora < de || hora >= ate) return;
      if (melhor === null || valor < melhor.valor) {
        melhor = { valor, iDia, iFaixa };
      }
    });
  });

  return melhor;
}

export function iniciar(dados) {
  const raiz = document.querySelector('[data-lotacao]');
  if (!raiz) return null;

  const { lotacao } = dados;
  const grade = criar('div', { classe: 'lotacao__grade' });
  grade.style.setProperty('--colunas', lotacao.faixas.length);

  // Cabeçalho: canto vazio + faixas de horário
  grade.append(criar('div', { classe: 'lotacao__rotulo' }));
  for (const faixa of lotacao.faixas) {
    grade.append(criar('div', { classe: 'lotacao__rotulo', texto: faixa }));
  }

  // Uma linha por dia
  lotacao.valores.forEach((linha, iDia) => {
    grade.append(
      criar('div', {
        classe: 'lotacao__rotulo lotacao__rotulo--dia',
        texto: lotacao.dias[iDia],
      }),
    );

    linha.forEach((valor, iFaixa) => {
      const rotulo = ROTULOS_DE_MOVIMENTO[valor] ?? 'Sem dados';
      grade.append(
        criar('div', {
          classe: 'lotacao__celula',
          'data-valor': String(valor),
          'data-faixa': String(iFaixa),
          role: 'img',
          'aria-label': `${NOME_COMPLETO_DO_DIA[iDia]} às ${lotacao.faixas[iFaixa]}: ${rotulo.toLowerCase()}`,
          title: `${NOME_COMPLETO_DO_DIA[iDia]}, ${lotacao.faixas[iFaixa]} — ${rotulo}`,
        }),
      );
    });
  });

  const legenda = criar(
    'div',
    { classe: 'lotacao__legenda' },
    [-1, 0, 1, 2, 3].map((valor) =>
      criar('span', {}, [
        criar('i', {
          classe: 'lotacao__amostra',
          'data-valor': String(valor),
        }),
        document.createTextNode(ROTULOS_DE_MOVIMENTO[valor]),
      ]),
    ),
  );

  const dica = criar('p', { classe: 'lotacao__dica' });

  raiz.append(
    criar('div', { classe: 'lotacao__rolagem' }, [grade]),
    legenda,
    dica,
  );
  raiz.hidden = false;

  /** Destaca o período escolhido e reescreve a frase-resumo. */
  function destacar(periodo = 'flexivel') {
    const { de, ate, rotulo } = PERIODOS[periodo] ?? PERIODOS.flexivel;

    grade.querySelectorAll('.lotacao__celula').forEach((celula) => {
      const hora = horaDaFaixa(lotacao.faixas[Number(celula.dataset.faixa)]);
      const dentro = periodo !== 'flexivel' && hora >= de && hora < ate;
      celula.classList.toggle('lotacao__celula--faixa-escolhida', dentro);
      celula.classList.remove('lotacao__celula--melhor');
    });

    const melhor = faixaMaisVazia(lotacao, periodo);
    if (!melhor) {
      dica.textContent = 'Sem dados de movimento para esse período.';
      return;
    }

    const celulas = grade.querySelectorAll('.lotacao__celula');
    const indice = melhor.iDia * lotacao.faixas.length + melhor.iFaixa;
    celulas[indice]?.classList.add('lotacao__celula--melhor');

    const quando = `${NOME_COMPLETO_DO_DIA[melhor.iDia].toLowerCase()} às ${lotacao.faixas[melhor.iFaixa]}`;
    const paraQuem =
      periodo === 'flexivel'
        ? 'da semana inteira'
        : `para quem treina ${rotulo}`;

    dica.replaceChildren(
      document.createTextNode('O horário mais tranquilo '),
      criar('strong', { texto: `${paraQuem} é ${quando}` }),
      document.createTextNode('. Se der para você, é onde tem mais aparelho livre.'),
    );
  }

  destacar('flexivel');
  return { destacar };
}
