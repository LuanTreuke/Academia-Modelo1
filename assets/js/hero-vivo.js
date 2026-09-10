/**
 * Painel "agora na academia": hora, próxima aula e movimento atual.
 * Também define o período do dia no <html>, que troca o tema.
 */
import {
  criar,
  horaDaFaixa,
  indiceDaSemana,
  minutosDaHora,
  NOMES_DOS_DIAS,
  periodoDaHora,
  ROTULOS_DE_MOVIMENTO,
} from './util.js';

/** Próxima aula a partir de agora, olhando até 7 dias à frente. */
function proximaAula(aulas, agora) {
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

  for (let adiante = 0; adiante < 7; adiante += 1) {
    const dia = (agora.getDay() + adiante) % 7;
    const doDia = aulas
      .filter((aula) => aula.dia === dia)
      .filter((aula) => adiante > 0 || minutosDaHora(aula.hora) > minutosAgora)
      .sort((a, b) => minutosDaHora(a.hora) - minutosDaHora(b.hora));

    if (doDia.length) return { aula: doDia[0], adiante, dia };
  }
  return null;
}

/** Texto curto do tipo "Funcional, 6h · amanhã". */
function descreverProxima(resultado) {
  if (!resultado) return 'Sem aulas na grade';

  const { aula, adiante, dia } = resultado;
  if (adiante === 0) return `${aula.nome}, ${aula.hora}`;
  if (adiante === 1) return `${aula.nome}, amanhã ${aula.hora}`;
  return `${aula.nome}, ${NOMES_DOS_DIAS[dia].toLowerCase()} ${aula.hora}`;
}

/** Valor de movimento da faixa que contém a hora atual. */
function movimentoAgora(lotacao, agora) {
  const linha = lotacao.valores[indiceDaSemana(agora.getDay())];
  if (!linha) return -1;

  const hora = agora.getHours();
  let indice = -1;
  lotacao.faixas.forEach((faixa, i) => {
    if (hora >= horaDaFaixa(faixa)) indice = i;
  });

  return indice === -1 ? -1 : linha[indice];
}

function textoDeFuncionamento(horarios, agora) {
  const dia = agora.getDay();
  if (dia === 0) return horarios.domingo;
  if (dia === 6) return horarios.sabado;
  return horarios.semana;
}

export function iniciar(dados) {
  const painel = document.querySelector('[data-painel]');
  if (!painel) return;

  const saudacaoEl = document.querySelector('[data-saudacao]');
  const horaEl = painel.querySelector('[data-painel-hora]');
  const aulaEl = painel.querySelector('[data-painel-aula]');
  const movimentoEl = painel.querySelector('[data-painel-movimento]');
  const medidorEl = painel.querySelector('[data-painel-medidor]');
  const funcionamentoEl = painel.querySelector('[data-painel-funcionamento]');

  const saudacoes = {
    manha: 'Bom dia',
    tarde: 'Boa tarde',
    noite: 'Boa noite',
  };

  for (let i = 0; i < 4; i += 1) medidorEl.append(criar('i'));

  function atualizar() {
    const agora = new Date();
    const periodo = periodoDaHora(agora.getHours());

    document.documentElement.dataset.periodo = periodo;
    if (saudacaoEl) saudacaoEl.textContent = `${saudacoes[periodo]} — bem-vindo à`;

    horaEl.textContent = agora.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    aulaEl.textContent = descreverProxima(proximaAula(dados.aulas, agora));

    const movimento = movimentoAgora(dados.lotacao, agora);
    movimentoEl.textContent = ROTULOS_DE_MOVIMENTO[movimento] ?? '—';

    const acesas = movimento < 0 ? 0 : movimento + 1;
    [...medidorEl.children].forEach((barra, i) => {
      barra.classList.toggle('aceso', i < acesas);
    });

    funcionamentoEl.textContent = textoDeFuncionamento(
      dados.horarioFuncionamento,
      agora,
    );
  }

  atualizar();
  painel.hidden = false;
  setInterval(atualizar, 30000);
}
