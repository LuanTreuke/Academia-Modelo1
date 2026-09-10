/**
 * Grade semanal de aulas, com filtro por tipo.
 * O dia de hoje fica destacado e a próxima aula de hoje é marcada.
 */
import { criar, minutosDaHora, NOMES_DOS_DIAS } from './util.js';

const ORDEM_DOS_DIAS = [1, 2, 3, 4, 5, 6, 0];

export function iniciar(dados) {
  const raiz = document.querySelector('[data-aulas]');
  if (!raiz) return;

  const tipos = [...new Set(dados.aulas.map((aula) => aula.tipo))].sort();
  const diasComAula = ORDEM_DOS_DIAS.filter((dia) =>
    dados.aulas.some((aula) => aula.dia === dia),
  );

  let filtro = 'todas';

  const filtros = criar('div', {
    classe: 'aulas__filtros',
    role: 'group',
    'aria-label': 'Filtrar aulas por tipo',
  });
  const grade = criar('div', { classe: 'aulas__grade' });

  function desenharGrade() {
    const agora = new Date();
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
    grade.replaceChildren();

    for (const dia of diasComAula) {
      const ehHoje = dia === agora.getDay();

      const doDia = dados.aulas
        .filter((aula) => aula.dia === dia)
        .filter((aula) => filtro === 'todas' || aula.tipo === filtro)
        .sort((a, b) => minutosDaHora(a.hora) - minutosDaHora(b.hora));

      const proxima = ehHoje
        ? doDia.find((aula) => minutosDaHora(aula.hora) > minutosAgora)
        : null;

      const coluna = criar('div', {
        classe: `aulas__dia${ehHoje ? ' aulas__dia--hoje' : ''}`,
      });

      coluna.append(
        criar('p', { classe: 'aulas__dia-nome' }, [
          document.createTextNode(NOMES_DOS_DIAS[dia]),
          ehHoje ? criar('span', { texto: 'hoje' }) : null,
        ]),
      );

      if (!doDia.length) {
        coluna.append(criar('p', { classe: 'aulas__vazio', texto: 'Sem aula desse tipo' }));
      }

      for (const aula of doDia) {
        coluna.append(
          criar(
            'div',
            { classe: `aula${aula === proxima ? ' aula--proxima' : ''}` },
            [
              criar('p', { classe: 'aula__hora', texto: aula.hora }),
              criar('p', { classe: 'aula__nome', texto: aula.nome }),
              criar('p', {
                classe: 'aula__meta',
                texto: `${aula.duracao} min · ${aula.professor}`,
              }),
            ],
          ),
        );
      }

      grade.append(coluna);
    }
  }

  function desenharFiltros() {
    filtros.replaceChildren();
    for (const tipo of ['todas', ...tipos]) {
      const botao = criar('button', {
        classe: 'aulas__filtro',
        type: 'button',
        'aria-pressed': String(tipo === filtro),
        texto: tipo === 'todas' ? 'Todas' : tipo,
      });
      botao.addEventListener('click', () => {
        filtro = tipo;
        desenharFiltros();
        desenharGrade();
      });
      filtros.append(botao);
    }
  }

  desenharFiltros();
  desenharGrade();
  raiz.append(filtros, grade);
  raiz.hidden = false;
}
