/**
 * Tour pela estrutura em coverflow 3D: a zona do centro fica de frente e as
 * outras recuam em profundidade, giradas para os lados.
 *
 * Troca arrastando (mouse ou dedo), clicando numa zona lateral, pelas
 * setas, pelos pontos ou pelas setas do teclado com o tour em foco.
 * Também passa sozinho enquanto está na tela, e para quando a pessoa põe o
 * mouse, o dedo ou o foco nele.
 */
import { criar } from './util.js';

const INTERVALO_AUTOMATICO = 3800;
// Quanto o dedo precisa andar para contar como arrasto, e não clique.
const TOLERANCIA_DO_CLIQUE = 6;

function seta(caminho) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const traco = document.createElementNS(NS, 'path');
  traco.setAttribute('d', caminho);
  svg.append(traco);
  return svg;
}

function criarCartao(zona) {
  const cartao = criar('article', {
    classe: `zona${zona.imagem ? '' : ' zona--sem-imagem'}`,
    'data-nome': zona.nome,
  });

  if (zona.imagem) {
    // O cartão começa mostrando o nome da zona e só troca pela foto
    // quando ela carrega. Se a foto não estiver na pasta, fica o nome —
    // nunca o ícone de imagem quebrada.
    cartao.classList.add('zona--sem-imagem');

    const foto = criar('img', {
      classe: 'zona__imagem',
      src: zona.imagem,
      alt: zona.alt || `Área de ${zona.nome}`,
      loading: 'lazy',
      decoding: 'async',
      draggable: 'false',
    });

    foto.addEventListener('load', () => {
      cartao.classList.remove('zona--sem-imagem');
    });
    foto.addEventListener('error', () => {
      foto.hidden = true;
    });

    cartao.append(foto);
  }

  cartao.append(
    criar('div', { classe: 'zona__texto' }, [
      criar('h3', { classe: 'zona__nome', texto: zona.nome }),
      criar('p', { classe: 'zona__descricao', texto: zona.descricao }),
    ]),
  );

  return cartao;
}

export function iniciar(dados) {
  const raiz = document.querySelector('[data-tour]');
  const zonas = dados.zonas || [];
  if (!raiz || !zonas.length) return;

  const total = zonas.length;
  const cartoes = zonas.map(criarCartao);
  const deck = criar('div', { classe: 'tour__deck' }, cartoes);
  const palco = criar('div', { classe: 'tour__palco' }, [deck]);
  const status = criar('p', { classe: 'tour__status', 'aria-live': 'polite' });
  raiz.append(palco, status);

  let indice = 0;

  /** Distância com sinal até a zona atual, dando a volta no anel. */
  const distancia = (i) => {
    const d = i - indice;
    return d - Math.round(d / total) * total;
  };

  const pontos = zonas.map((zona, i) => {
    const ponto = criar('button', {
      classe: 'tour__ponto',
      type: 'button',
      'aria-label': `Ver ${zona.nome}`,
    });
    ponto.addEventListener('click', () => ir(i, true));
    return ponto;
  });

  /** `arrasto` é o quanto a roda está deslocada, em cartões, durante o arrasto. */
  function desenhar(arrasto = 0) {
    cartoes.forEach((cartao, i) => {
      const posicao = distancia(i) + arrasto;
      const longe = Math.abs(posicao);

      const x = posicao * 58;
      const z = -Math.min(longe, 3.2) * 160;
      const giro = Math.max(-1, Math.min(1, posicao)) * -42;
      const escala = Math.max(0.62, 1 - longe * 0.12);

      cartao.style.transform = `translate(-50%, -50%) translateX(${x}%) translateZ(${z}px) rotateY(${giro}deg) scale(${escala})`;
      cartao.style.opacity = longe > 3.4 ? 0 : Math.max(0.12, 1 - longe * 0.26);
      cartao.style.zIndex = String(100 - Math.round(longe * 10));
      cartao.classList.toggle('zona--ativa', i === indice && !arrasto);
      cartao.setAttribute('aria-hidden', String(i !== indice));
    });

    pontos.forEach((ponto, i) => {
      ponto.setAttribute('aria-current', String(i === indice));
    });
  }

  /** Só anuncia para leitor de tela quando foi a pessoa que trocou. */
  function ir(novo, anunciar = false) {
    indice = ((novo % total) + total) % total;
    desenhar();
    if (anunciar) {
      status.textContent = `${zonas[indice].nome}, área ${indice + 1} de ${total}`;
    }
  }

  desenhar();
  if (total < 2) return;

  // Controles ------------------------------------------------------------
  const anterior = criar(
    'button',
    { classe: 'tour__seta', type: 'button', 'aria-label': 'Área anterior' },
    [seta('m15 18-6-6 6-6')],
  );
  const proxima = criar(
    'button',
    { classe: 'tour__seta', type: 'button', 'aria-label': 'Próxima área' },
    [seta('m9 18 6-6-6-6')],
  );
  anterior.addEventListener('click', () => ir(indice - 1, true));
  proxima.addEventListener('click', () => ir(indice + 1, true));

  raiz.append(
    criar('div', { classe: 'tour__controles' }, [
      anterior,
      criar('div', { classe: 'tour__pontos' }, pontos),
      proxima,
    ]),
  );

  raiz.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowLeft') ir(indice - 1, true);
    else if (evento.key === 'ArrowRight') ir(indice + 1, true);
    else return;
    evento.preventDefault();
  });

  // Arrasto -------------------------------------------------------------
  const larguraDoPasso = () => Math.max(160, palco.clientWidth * 0.32);
  let arrasto = null;

  // Os eventos ficam no palco, e não no deck: o deck está no plano da
  // frente do 3D e, se recebesse clique, taparia as zonas que recuam.
  palco.addEventListener('pointerdown', (evento) => {
    if (evento.button !== 0) return;
    arrasto = { inicio: evento.clientX, deslocamento: 0, moveu: false };
    palco.setPointerCapture(evento.pointerId);
  });

  palco.addEventListener('pointermove', (evento) => {
    if (!arrasto) return;
    arrasto.deslocamento = evento.clientX - arrasto.inicio;
    if (!arrasto.moveu && Math.abs(arrasto.deslocamento) > TOLERANCIA_DO_CLIQUE) {
      arrasto.moveu = true;
      raiz.classList.add('tour--arrastando');
    }
    if (arrasto.moveu) desenhar(-arrasto.deslocamento / larguraDoPasso());
  });

  palco.addEventListener('pointerup', (evento) => {
    if (!arrasto) return;
    // Mede de novo na soltura: num arrasto rápido o navegador pode não ter
    // mandado nenhum pointermove no caminho.
    const deslocamento = evento.clientX - arrasto.inicio;
    const moveu = arrasto.moveu || Math.abs(deslocamento) > TOLERANCIA_DO_CLIQUE;
    arrasto = null;
    raiz.classList.remove('tour--arrastando');

    if (moveu) {
      const passos = Math.round(-deslocamento / larguraDoPasso());
      if (passos) ir(indice + passos, true);
      else desenhar();
      return;
    }

    // Clique numa zona lateral traz ela para o centro. Com o ponteiro
    // capturado pelo palco, o clique não chega no cartão: acha pelo ponto.
    const alvo = document
      .elementFromPoint(evento.clientX, evento.clientY)
      ?.closest('.zona');
    const i = cartoes.indexOf(alvo);
    if (i >= 0 && i !== indice) ir(i, true);
  });

  palco.addEventListener('pointercancel', () => {
    arrasto = null;
    raiz.classList.remove('tour--arrastando');
    desenhar();
  });

  // Passagem automática -------------------------------------------------
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let relogio = 0;
  let naTela = false;
  let emUso = false;
  let comFoco = false;

  const atualizarAutomatico = () => {
    clearInterval(relogio);
    relogio = 0;
    if (naTela && !emUso && !comFoco) {
      relogio = setInterval(() => ir(indice + 1), INTERVALO_AUTOMATICO);
    }
  };

  new IntersectionObserver(
    ([entrada]) => {
      naTela = entrada.isIntersecting;
      atualizarAutomatico();
    },
    { threshold: 0.5 },
  ).observe(palco);

  raiz.addEventListener('pointerenter', () => {
    emUso = true;
    atualizarAutomatico();
  });
  raiz.addEventListener('pointerleave', () => {
    emUso = false;
    atualizarAutomatico();
  });
  raiz.addEventListener('focusin', () => {
    comFoco = true;
    atualizarAutomatico();
  });
  raiz.addEventListener('focusout', (evento) => {
    if (raiz.contains(evento.relatedTarget)) return;
    comFoco = false;
    atualizarAutomatico();
  });
}
