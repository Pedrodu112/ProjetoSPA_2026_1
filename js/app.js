const app = document.querySelector('#app');
const botaoTema = document.querySelector('#trocar-tema');
const rotas = ['home', 'cursos', 'noticias', 'eventos', 'documentos', 'contato'];

const estado = {
  rotaAtual: 'home',
  acessos: 0,
  tema: 'claro',
  dados: null,
  documentosExtras: []
};

function criarElemento(tag, texto = '', classe = '') {
  const elemento = document.createElement(tag);
  elemento.textContent = texto;
  if (classe) elemento.className = classe;
  return elemento;
}

function normalizarRota(valor) {
  const rota = String(valor || 'home').replace('#', '').replace('/', '').toLowerCase();
  return rotas.includes(rota) ? rota : 'home';
}

function rotaPeloHash() {
  return normalizarRota(location.hash);
}

function rotaPeloPathname() {
  return normalizarRota(location.pathname === '/' ? 'home' : location.pathname);
}

async function carregarDados() {
  if (estado.dados) return estado.dados;

  const resposta = await fetch('dados/dados.json');
  estado.dados = await resposta.json();
  return estado.dados;
}

function atualizarLinksAtivos(rota) {
  document.querySelectorAll('a').forEach((link) => {
    const rotaDoLink = normalizarRota(link.dataset.link || link.getAttribute('href'));
    link.classList.toggle('ativo', rotaDoLink === rota);
  });
}

function criarTopoDaPagina(titulo, texto) {
  app.replaceChildren();

  const hero = criarElemento('section', '', 'hero');
  hero.append(
    criarElemento('h1', titulo),
    criarElemento('p', texto, 'muted')
  );

  const painel = criarElemento('div', '', 'painel');
  painel.append(
    criarElemento('strong', 'Estado da aplicação'),
    criarElemento('p', `Rota atual: ${estado.rotaAtual} | Acessos: ${estado.acessos} | Tema: ${estado.tema}`)
  );

  app.append(hero, painel);
}

function criarCard(titulo, linhas = []) {
  const card = criarElemento('article', '', 'card');
  card.append(criarElemento('h2', titulo));

  linhas.forEach((linha) => {
    card.append(criarElemento('p', linha, 'muted'));
  });

  return card;
}

function renderHome(dados) {
  criarTopoDaPagina(
    'Bem-vindo ao Portal Acadêmico',
    'Esta página é uma SPA: o conteúdo muda dentro do #app sem recarregar o navegador.'
  );

  const grid = criarElemento('section', '', 'grid');
  grid.append(
    criarCard('Hash routing', ['Use os links #home, #cursos e outros. O evento hashchange renderiza a rota.']),
    criarCard('History API', ['Use o menu principal. O clique é interceptado e history.pushState muda a URL.']),
    criarCard('Fetch + JSON', [`Dados carregados de um único arquivo: ${dados.cursos.length} cursos, ${dados.noticias.length} notícias e ${dados.eventos.length} eventos.`])
  );
  app.append(grid);
}

function renderCursos(dados) {
  criarTopoDaPagina('Cursos', 'Cards criados dinamicamente a partir do JSON único.');

  const grid = criarElemento('section', '', 'grid');
  dados.cursos.forEach((curso) => {
    grid.append(criarCard(curso.nome, [curso.modalidade, `Carga horária: ${curso.cargaHoraria}`]));
  });
  app.append(grid);
}

function renderNoticias(dados) {
  criarTopoDaPagina('Notícias', 'Exemplo de troca de texto e atualização de lista sem recarregar.');

  const filtro = criarElemento('input');
  filtro.placeholder = 'Filtrar notícias';
  const contador = criarElemento('p', '', 'muted');
  const grid = criarElemento('section', '', 'grid');

  function desenharNoticias() {
    grid.replaceChildren();
    const termo = filtro.value.toLowerCase();
    const noticiasFiltradas = dados.noticias.filter((noticia) => noticia.titulo.toLowerCase().includes(termo));

    contador.textContent = `${noticiasFiltradas.length} notícia(s) encontrada(s)`;
    noticiasFiltradas.forEach((noticia) => {
      grid.append(criarCard(noticia.titulo, [noticia.resumo, `Data: ${noticia.data}`]));
    });
  }

  filtro.addEventListener('input', desenharNoticias);
  app.append(filtro, contador, grid);
  desenharNoticias();
}

function renderEventos(dados) {
  criarTopoDaPagina('Eventos', 'Exemplo de mostrar e esconder uma seção usando classe CSS.');

  const botao = criarElemento('button', 'Mostrar explicação');
  const explicacao = criarElemento('p', 'Esta seção foi exibida sem recarregar a página.', 'painel escondido');
  const grid = criarElemento('section', '', 'grid');

  botao.addEventListener('click', () => {
    explicacao.classList.toggle('escondido');
    botao.textContent = explicacao.classList.contains('escondido') ? 'Mostrar explicação' : 'Esconder explicação';
  });

  dados.eventos.forEach((evento) => {
    grid.append(criarCard(evento.nome, [`Data: ${evento.data}`, `Local: ${evento.local}`]));
  });

  app.append(botao, explicacao, grid);
}

function renderDocumentos(dados) {
  criarTopoDaPagina('Documentos', 'Exemplo de inserção e remoção de elementos no DOM.');

  const input = criarElemento('input');
  input.placeholder = 'Novo documento';
  const botaoAdicionar = criarElemento('button', 'Adicionar documento');
  const lista = criarElemento('ul', '', 'lista');

  function desenharDocumentos() {
    lista.replaceChildren();
    const documentos = [...dados.documentos, ...estado.documentosExtras];

    documentos.forEach((documento, indice) => {
      const item = criarElemento('li');
      const texto = criarElemento('span', documento);
      const botaoRemover = criarElemento('button', 'Remover');

      botaoRemover.addEventListener('click', () => {
        if (indice >= dados.documentos.length) {
          estado.documentosExtras.splice(indice - dados.documentos.length, 1);
        }
        desenharDocumentos();
      });

      item.append(texto, botaoRemover);
      lista.append(item);
    });
  }

  botaoAdicionar.addEventListener('click', () => {
    const nome = input.value.trim();
    if (!nome) return;

    estado.documentosExtras.push(nome);
    input.value = '';
    desenharDocumentos();
  });

  app.append(input, botaoAdicionar, lista);
  desenharDocumentos();
}

function renderContato() {
  criarTopoDaPagina('Contato', 'Formulário visual sem backend, apenas para manipular o DOM.');

  const formulario = criarElemento('form', '', 'formulario');
  const nome = criarElemento('input');
  const mensagem = criarElemento('textarea');
  const botao = criarElemento('button', 'Enviar');
  const resposta = criarElemento('p', '', 'painel escondido');

  nome.placeholder = 'Seu nome';
  mensagem.placeholder = 'Mensagem';
  botao.type = 'submit';

  formulario.append(nome, mensagem, botao, resposta);
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    resposta.textContent = `Obrigado, ${nome.value || 'estudante'}! Mensagem registrada apenas na tela.`;
    resposta.classList.remove('escondido');
    botao.textContent = 'Enviado';
  });

  app.append(formulario);
}

async function renderizar(rota) {
  const dados = await carregarDados();
  estado.rotaAtual = normalizarRota(rota);
  estado.acessos += 1;
  atualizarLinksAtivos(estado.rotaAtual);

  if (estado.rotaAtual === 'home') renderHome(dados);
  if (estado.rotaAtual === 'cursos') renderCursos(dados);
  if (estado.rotaAtual === 'noticias') renderNoticias(dados);
  if (estado.rotaAtual === 'eventos') renderEventos(dados);
  if (estado.rotaAtual === 'documentos') renderDocumentos(dados);
  if (estado.rotaAtual === 'contato') renderContato();
}

function navegarComHistory(rota) {
  const rotaNormalizada = normalizarRota(rota);
  history.pushState({ rota: rotaNormalizada }, '', `/${rotaNormalizada}`);
  renderizar(rotaNormalizada);
}

document.querySelectorAll('[data-link]').forEach((link) => {
  link.addEventListener('click', (evento) => {
    evento.preventDefault();
    navegarComHistory(link.dataset.link);
  });
});

window.addEventListener('hashchange', () => {
  renderizar(rotaPeloHash());
});

window.addEventListener('popstate', () => {
  renderizar(rotaPeloPathname());
});

botaoTema.addEventListener('click', () => {
  document.body.classList.toggle('escuro');
  estado.tema = document.body.classList.contains('escuro') ? 'escuro' : 'claro';
  botaoTema.textContent = estado.tema === 'escuro' ? 'Tema claro' : 'Tema escuro';
  renderizar(estado.rotaAtual);
});

renderizar(location.hash ? rotaPeloHash() : rotaPeloPathname());
