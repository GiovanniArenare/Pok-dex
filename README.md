# Pokédex React

Uma Pokédex interativa desenvolvida com **React e Vite**, que permite explorar Pokémon, consultar seus atributos, filtrar por tipo e visualizar informações de treinadores.

O projeto possui uma interface escura com detalhes em verde, cards de Pokémon e layout responsivo para diferentes tamanhos de tela.

## Funcionalidades

- **Listagem de Pokémon:** exibe nome, número de identificação, tipos e atributos.
- **Busca:** pesquisa Pokémon pelo nome ou pelo ID enquanto o usuário digita.
- **Filtro por tipo:** permite encontrar Pokémon de um tipo específico.
- **Filtro por treinador:** consulta os Pokémon associados a cada treinador.
- **Detalhes do Pokémon:** abre uma janela com informações e atributos completos.
- **Painel de treinador:** apresenta o nome, a quantidade de insígnias e os Pokémon relacionados.
- **Interface responsiva:** adapta a disposição dos cards para diferentes resoluções.
- **Filtros na URL:** mantém os critérios de busca na barra de endereço, permitindo compartilhar uma pesquisa.

## Tecnologias utilizadas

- React 19
- JavaScript
- Vite 8
- CSS3
- npm
- JSON para armazenamento dos dados dos Pokémon, tipos e treinadores

## Como executar o projeto

### Pré-requisitos

- Node.js instalado.
- npm instalado, normalmente incluído com o Node.js.

### 1. Clonar o repositório

```bash
[git clone URL_DO_REPOSITORIO](https://github.com/GiovanniArenare/Pok-dex.git)
```

Substitua `[URL_DO_REPOSITORIO](https://github.com/GiovanniArenare/Pok-dex.git)` pelo endereço do repositório no GitHub.

### 2. Entrar na pasta do projeto

```bash
cd Frontend
```

Se o repositório já estiver organizado com o frontend na raiz, basta entrar na pasta clonada que contém o `package.json`.

### 3. Instalar as dependências

```bash
npm install
```

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Abra no navegador o endereço apresentado pelo Vite. Por padrão, costuma ser:

http://localhost:5173

### 5. Gerar a versão de produção

```bash
npm run build
```

Os arquivos gerados serão colocados na pasta `dist`.

Para testar essa versão localmente, execute:

```bash
npm run preview
```

## Estrutura do projeto

```text
Frontend/
├── public/
│   └── data/
│       └── pokedex-data.json
├── src/
│   ├── components/
│   │   ├── CardPokemon/
│   │   ├── DetalhesPokemon/
│   │   ├── PainelFiltros/
│   │   └── PainelTreinador/
│   ├── hooks/
│   │   ├── useFiltrosDaUrl.js
│   │   └── usePokemon.js
│   ├── model/
│   │   └── Pokemon.js
│   ├── services/
│   │   └── pokedexService.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
└── README.md
```

### Organização do código

- **`components/`**: reúne os componentes visuais reutilizáveis da aplicação.
- **`hooks/`**: contém hooks personalizados para carregamento de dados e gerenciamento dos filtros.
- **`model/`**: contém a representação de um Pokémon.
- **`services/`**: concentra o carregamento, a organização e a filtragem dos dados.
- **`public/data/`**: armazena o arquivo JSON utilizado pela aplicação.
- **`App.jsx`**: integra os componentes e controla a apresentação dos resultados.

## Dados e imagens

Os dados utilizados pela aplicação estão no arquivo:

`public/data/pokedex-data.json`

Esse arquivo contém as informações dos Pokémon, os tipos disponíveis e os treinadores com seus Pokémon associados.

As ilustrações dos Pokémon são carregadas externamente do repositório de sprites da PokéAPI:

https://github.com/PokeAPI/sprites

Por serem imagens externas, sua exibição depende da disponibilidade do serviço e de uma conexão com a internet.

## Objetivo acadêmico

O projeto tem como objetivo praticar conceitos de desenvolvimento de interfaces com React, incluindo componentes funcionais, props, hooks, eventos, renderização de listas, filtragem de dados e organização de código.

---

Desenvolvido como projeto acadêmico.
