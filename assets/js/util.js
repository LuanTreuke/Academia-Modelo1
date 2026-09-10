/** Helpers compartilhados pelos módulos. */

/** Cria um elemento com atributos e filhos numa linha só. */
export function criar(tag, atributos = {}, filhos = []) {
  const elemento = document.createElement(tag);
  for (const [chave, valor] of Object.entries(atributos)) {
    if (valor === null || valor === undefined || valor === false) continue;
    if (chave === 'texto') elemento.textContent = valor;
    else if (chave === 'html') elemento.innerHTML = valor;
    else if (chave === 'classe') elemento.className = valor;
    else elemento.setAttribute(chave, valor === true ? '' : valor);
  }
  for (const filho of [].concat(filhos)) {
    if (filho) elemento.append(filho);
  }
  return elemento;
}

/** 89.9 vira "R$ 89,90". */
export function moeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/** Monta o link do WhatsApp com a mensagem já escrita e escapada. */
export function linkZap(numero, mensagem) {
  const limpo = String(numero).replace(/\D/g, '');
  const base = `https://wa.me/${limpo}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

/** "5h" vira 5. Serve para comparar as faixas do mapa de lotação. */
export function horaDaFaixa(rotulo) {
  return parseInt(String(rotulo), 10) || 0;
}

/** "19:00" vira 1140 minutos. */
export function minutosDaHora(texto) {
  const [h, m] = String(texto).split(':').map(Number);
  return h * 60 + (m || 0);
}

/** Date.getDay() (0 = domingo) vira o índice das linhas de lotação (0 = segunda). */
export function indiceDaSemana(diaJs) {
  return diaJs === 0 ? 6 : diaJs - 1;
}

export const NOMES_DOS_DIAS = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

export const ROTULOS_DE_MOVIMENTO = {
  '-1': 'Fechado',
  0: 'Tranquilo',
  1: 'Moderado',
  2: 'Cheio',
  3: 'Lotado',
};

/** Faixas de hora que cada período do dia cobre. */
export const PERIODOS = {
  manha: { rotulo: 'de manhã', de: 5, ate: 11 },
  tarde: { rotulo: 'à tarde', de: 11, ate: 17 },
  noite: { rotulo: 'à noite', de: 17, ate: 23 },
  flexivel: { rotulo: 'em qualquer horário', de: 0, ate: 24 },
};

/** Período do dia a partir de uma hora cheia. */
export function periodoDaHora(hora) {
  if (hora >= 5 && hora < 12) return 'manha';
  if (hora >= 12 && hora < 18) return 'tarde';
  return 'noite';
}
