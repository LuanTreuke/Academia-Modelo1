/**
 * Único lugar que amarra os módulos.
 * Para remover uma seção do template, apague a linha dela aqui e o
 * bloco correspondente no index.html.
 */
import { ACADEMIA } from './dados.js';
import * as conteudo from './conteudo.js';
import * as heroVivo from './hero-vivo.js';
import * as quiz from './quiz.js';
import * as lotacao from './lotacao.js';
import * as aulas from './aulas.js';

const paginaDeConteudo = conteudo.iniciar(ACADEMIA);
const mapaDeLotacao = lotacao.iniciar(ACADEMIA);

heroVivo.iniciar(ACADEMIA);
aulas.iniciar(ACADEMIA);

quiz.iniciar(ACADEMIA, (respostas, plano) => {
  mapaDeLotacao?.destacar(respostas.horario);
  paginaDeConteudo.marcarPlano(plano.id);
});
