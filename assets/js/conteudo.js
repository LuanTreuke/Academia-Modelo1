/**
 * Preenche tudo que vem direto de dados.js: identidade, contato, planos,
 * zonas da estrutura, depoimentos e rodapé.
 */
import { criar, linkZap, moeda } from './util.js';

const MENSAGEM_PADRAO = 'Oi! Vim pelo site e quero saber mais sobre os planos.';

function aplicarIdentidade(dados) {
  const raiz = document.documentElement;
  raiz.style.setProperty('--cor-marca', dados.marca.corPrincipal);
  raiz.style.setProperty('--cor-destaque', dados.marca.corDestaque);

  document.title = `${dados.nome} — Academia`;

  for (const el of document.querySelectorAll('[data-campo="nome"]')) {
    el.textContent = dados.nome;
  }
  for (const el of document.querySelectorAll('[data-campo="slogan"]')) {
    el.textContent = dados.slogan;
  }
  for (const el of document.querySelectorAll('[data-campo="endereco"]')) {
    el.textContent = dados.endereco;
  }

  const telefone = document.querySelector('[data-campo="telefone-link"]');
  if (telefone) {
    telefone.textContent = dados.telefone;
    telefone.href = `tel:+${String(dados.telefone).replace(/\D/g, '')}`;
  }

  const email = document.querySelector('[data-campo="email-link"]');
  if (email) {
    email.textContent = dados.email;
    email.href = `mailto:${dados.email}`;
  }

  for (const link of document.querySelectorAll('[data-zap-simples]')) {
    link.href = linkZap(dados.whatsapp, MENSAGEM_PADRAO);
    link.target = '_blank';
    link.rel = 'noopener';
  }
}

function desenharRodape(dados) {
  const lista = document.querySelector('[data-funcionamento]');
  if (lista) {
    lista.replaceChildren(
      ...Object.values(dados.horarioFuncionamento).map((linha) =>
        criar('li', { texto: linha }),
      ),
    );
  }

  const mapa = document.querySelector('[data-mapa]');
  if (mapa && dados.mapaEmbedUrl) mapa.src = dados.mapaEmbedUrl;
}

function desenharPlanos(dados) {
  const raiz = document.querySelector('[data-planos]');
  if (!raiz) return;

  for (const plano of dados.planos) {
    const cartao = criar('article', {
      classe: 'plano',
      'data-plano': plano.id,
    });

    cartao.append(
      criar('p', { classe: 'plano__selo', hidden: true, texto: 'Recomendado para você' }),
      criar('h3', { classe: 'plano__nome', texto: plano.nome }),
      criar('p', { classe: 'plano__preco', texto: moeda(plano.preco) }),
      criar('p', { classe: 'plano__periodo', texto: plano.periodo }),
      criar('p', { classe: 'plano__resolve', texto: plano.resolve }),
      criar(
        'ul',
        { classe: 'plano__inclui' },
        plano.inclui.map((item) => criar('li', { texto: item })),
      ),
      criar('a', {
        classe: 'botao botao--vazado plano__botao',
        href: linkZap(
          dados.whatsapp,
          `Oi! Quero saber mais sobre o plano ${plano.nome}.`,
        ),
        target: '_blank',
        rel: 'noopener',
        texto: `Quero o ${plano.nome}`,
      }),
    );

    raiz.append(cartao);
  }
  raiz.hidden = false;
}

function desenharZonas(dados) {
  const raiz = document.querySelector('[data-tour]');
  if (!raiz) return;

  for (const zona of dados.zonas) {
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

    raiz.append(cartao);
  }
}

function desenharDepoimentos(dados) {
  const raiz = document.querySelector('[data-depoimentos]');
  if (!raiz) return;

  for (const item of dados.depoimentos) {
    raiz.append(
      criar('article', { classe: 'depoimento' }, [
        criar('p', { classe: 'depoimento__objetivo', texto: item.objetivo }),
        criar('blockquote', { classe: 'depoimento__texto', texto: `“${item.texto}”` }),
        criar('p', { classe: 'depoimento__quem' }, [
          criar('span', { classe: 'depoimento__nome', texto: item.nome }),
          document.createTextNode(item.tempoDeCasa),
        ]),
      ]),
    );
  }
  raiz.hidden = false;
}

export function iniciar(dados) {
  aplicarIdentidade(dados);
  desenharRodape(dados);
  desenharPlanos(dados);
  desenharZonas(dados);
  desenharDepoimentos(dados);

  /** Marca na tabela de planos o que o quiz recomendou. */
  return {
    marcarPlano(id) {
      for (const cartao of document.querySelectorAll('[data-plano]')) {
        const escolhido = cartao.dataset.plano === id;
        cartao.classList.toggle('plano--recomendado', escolhido);
        cartao.querySelector('.plano__selo').hidden = !escolhido;
      }
    },
  };
}
