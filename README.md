# Portal Acadêmico - SPA simples

Projeto de estudo feito sem frameworks, usando apenas HTML, CSS e JavaScript puro.

## Como rodar

```bash
python3 -m http.server 4173
```

Acesse `http://127.0.0.1:4173/`.

## O que o projeto mostra

- Um único `index.html`, usado apenas como casca da SPA.
- Conteúdo renderizado dinamicamente dentro de `#app`.
- 6 rotas: Home, Cursos, Notícias, Eventos, Documentos e Contato.
- Rotas com hash, por exemplo `#cursos`, usando `location.hash` e `hashchange`.
- Rotas com History API, por exemplo `/cursos`, usando `history.pushState`, `location.pathname` e `popstate`.
- Estado simples da aplicação: rota atual, contador de acessos, tema e documentos adicionados.
- Manipulação do DOM: criar, inserir, remover, trocar texto e mostrar/esconder elementos.
- Um único JSON em `dados/dados.json`, carregado com `fetch`.

> Observação: se atualizar uma URL como `/cursos` em um servidor estático simples, pode aparecer 404 porque o servidor não redireciona tudo para `index.html`. Em uma hospedagem real, configure fallback de SPA para `index.html`.
