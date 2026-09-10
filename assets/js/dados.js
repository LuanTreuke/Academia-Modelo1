/**
 * ÚNICO ARQUIVO QUE PRECISA SER EDITADO PARA TROCAR DE CLIENTE.
 * Nome, contato, cores, planos, aulas, lotação e depoimentos saem daqui.
 * Não é preciso mexer no HTML nem no CSS.
 */
export const ACADEMIA = {
  nome: 'Forja',
  slogan: 'Disciplina é o que te leva mais longe.',

  // Só números, com código do país e DDD. Ex.: 55 11 99999-9999
  whatsapp: '5511999999999',
  telefone: '(11) 3333-4444',
  email: 'contato@academiaforja.com.br',
  endereco: 'Rua das Oficinas, 480 — Vila Industrial, São Paulo',
  mapaEmbedUrl:
    'https://www.google.com/maps?q=Avenida+Paulista,+São+Paulo&output=embed',

  horarioFuncionamento: {
    semana: 'Segunda a sexta, 5h às 23h',
    sabado: 'Sábado, 8h às 17h',
    domingo: 'Domingo, 9h às 13h',
  },

  // As duas cores da marca. Todo o resto do site se ajusta a elas.
  marca: {
    corPrincipal: '#C98B3C',
    corDestaque: '#E4A94F',
  },

  planos: [
    {
      id: 'essencial',
      nome: 'Essencial',
      preco: 89.9,
      periodo: 'por mês',
      resolve: 'Você já sabe o que fazer e só quer o equipamento livre.',
      inclui: [
        'Musculação e cardio, horário livre',
        'Ficha de treino no aplicativo',
        'Avaliação física na matrícula',
        'Sem taxa de adesão',
      ],
    },
    {
      id: 'plus',
      nome: 'Plus',
      preco: 129.9,
      periodo: 'por mês',
      resolve: 'Você quer variedade e alguém ditando o ritmo.',
      inclui: [
        'Tudo do Essencial',
        'Todas as aulas coletivas',
        'Avaliação física a cada 3 meses',
        'Reavaliação de treino mensal',
      ],
    },
    {
      id: 'full',
      nome: 'Full',
      preco: 189.9,
      periodo: 'por mês',
      resolve: 'Você quer acompanhamento de perto e não quer pensar no resto.',
      inclui: [
        'Tudo do Plus',
        'Studio de pilates e funcional',
        '4 sessões de personal por mês',
        'Consulta com nutricionista parceira',
        'Um convidado por mês',
      ],
    },
  ],

  // dia: 0 = domingo, 1 = segunda ... 6 = sábado
  aulas: [
    { nome: 'Funcional', tipo: 'Funcional', dia: 1, hora: '06:00', duracao: 45, professor: 'Bia' },
    { nome: 'Pilates solo', tipo: 'Corpo e mente', dia: 1, hora: '08:00', duracao: 50, professor: 'Rafa' },
    { nome: 'Spinning', tipo: 'Cardio', dia: 1, hora: '19:00', duracao: 45, professor: 'Duda' },
    { nome: 'Muay thai', tipo: 'Luta', dia: 1, hora: '20:00', duracao: 60, professor: 'Léo' },

    { nome: 'Funcional', tipo: 'Funcional', dia: 2, hora: '06:00', duracao: 45, professor: 'Bia' },
    { nome: 'Yoga', tipo: 'Corpo e mente', dia: 2, hora: '07:30', duracao: 60, professor: 'Rafa' },
    { nome: 'Ritmos', tipo: 'Dança', dia: 2, hora: '19:00', duracao: 50, professor: 'Kel' },
    { nome: 'HIIT', tipo: 'Cardio', dia: 2, hora: '20:00', duracao: 30, professor: 'Duda' },

    { nome: 'Funcional', tipo: 'Funcional', dia: 3, hora: '06:00', duracao: 45, professor: 'Bia' },
    { nome: 'Pilates solo', tipo: 'Corpo e mente', dia: 3, hora: '08:00', duracao: 50, professor: 'Rafa' },
    { nome: 'Spinning', tipo: 'Cardio', dia: 3, hora: '19:00', duracao: 45, professor: 'Duda' },
    { nome: 'Muay thai', tipo: 'Luta', dia: 3, hora: '20:00', duracao: 60, professor: 'Léo' },

    { nome: 'Funcional', tipo: 'Funcional', dia: 4, hora: '06:00', duracao: 45, professor: 'Bia' },
    { nome: 'Yoga', tipo: 'Corpo e mente', dia: 4, hora: '07:30', duracao: 60, professor: 'Rafa' },
    { nome: 'Ritmos', tipo: 'Dança', dia: 4, hora: '19:00', duracao: 50, professor: 'Kel' },
    { nome: 'HIIT', tipo: 'Cardio', dia: 4, hora: '20:00', duracao: 30, professor: 'Duda' },

    { nome: 'Funcional', tipo: 'Funcional', dia: 5, hora: '06:00', duracao: 45, professor: 'Bia' },
    { nome: 'Alongamento', tipo: 'Corpo e mente', dia: 5, hora: '12:00', duracao: 30, professor: 'Rafa' },
    { nome: 'Ritmos', tipo: 'Dança', dia: 5, hora: '19:00', duracao: 50, professor: 'Kel' },

    { nome: 'Funcional', tipo: 'Funcional', dia: 6, hora: '09:00', duracao: 45, professor: 'Bia' },
    { nome: 'Ritmos', tipo: 'Dança', dia: 6, hora: '10:00', duracao: 50, professor: 'Kel' },
  ],

  /**
   * Movimento por faixa de horário.
   * -1 fechado · 0 tranquilo · 1 moderado · 2 cheio · 3 lotado
   * Uma linha por dia, na mesma ordem de `dias`.
   */
  lotacao: {
    faixas: ['5h', '7h', '9h', '11h', '13h', '15h', '17h', '19h', '21h'],
    dias: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    valores: [
      [1, 3, 2, 1, 2, 1, 3, 3, 1],
      [1, 3, 2, 1, 1, 1, 3, 3, 1],
      [1, 3, 2, 1, 2, 1, 3, 3, 1],
      [1, 2, 2, 1, 1, 1, 3, 3, 1],
      [1, 2, 2, 1, 1, 1, 2, 2, 0],
      [-1, 1, 2, 2, 1, 0, -1, -1, -1],
      [-1, -1, 1, 1, -1, -1, -1, -1, -1],
    ],
  },

  // `imagem` vazia mostra um bloco com o nome da zona até a foto chegar.
  zonas: [
    {
      nome: 'Musculação',
      descricao: 'Peso livre e máquinas, com espelho e espaço para levantar sem pedir licença.',
      imagem: 'assets/img/zona-musculacao.jpg',
      alt: 'Aluno fazendo remada com halter na área de peso livre',
    },
    {
      nome: 'Cardio',
      descricao: 'Esteiras e bikes de frente para a janela. Ninguém treina olhando para a parede.',
      imagem: 'assets/img/zona-cardio.jpg',
      alt: 'Fileira de esteiras e bicicletas voltadas para a janela com vista da cidade',
    },
    {
      nome: 'Studio',
      descricao: 'Pilates, yoga e alongamento em sala fechada, com aparelhos e turmas pequenas.',
      imagem: 'assets/img/zona-studio.jpg',
      alt: 'Aluna em aparelho de pilates no studio',
    },
    {
      nome: 'Funcional',
      descricao: 'Área aberta com cordas, caixas e kettlebells para treino em circuito.',
      imagem: 'assets/img/zona-funcional.jpg',
      alt: 'Área de treino funcional com rack de argolas, kettlebells e cordas navais',
    },
    {
      nome: 'Vestiário',
      descricao: 'Armário com chave, chuveiro quente e secador. Dá para treinar antes do trabalho.',
      imagem: 'assets/img/zona-vestiario.jpg',
      alt: 'Vestiário com armários de madeira escura, banco central e toalhas',
    },
  ],

  depoimentos: [
    {
      nome: 'Camila Ferraz',
      tempoDeCasa: '2 anos de casa',
      objetivo: 'Perdeu 14 kg',
      texto:
        'Comecei sem saber usar nada. Montaram meu treino no primeiro dia e refizeram a cada três meses. Foi isso que me fez continuar.',
    },
    {
      nome: 'Rodrigo Alves',
      tempoDeCasa: '8 meses de casa',
      objetivo: 'Voltou a correr 10 km',
      texto:
        'Treino às 6h porque é o horário vazio. Nunca precisei esperar por aparelho, e isso já resolveu metade da minha preguiça.',
    },
    {
      nome: 'Juliana Mattos',
      tempoDeCasa: '3 anos de casa',
      objetivo: 'Saiu da dor lombar',
      texto:
        'Entrei pelo pilates por recomendação médica e acabei ficando na musculação também. As turmas são pequenas, dá para corrigir postura.',
    },
  ],
};
