# Pokédex Full Stack — React, Spring Boot e MongoDB

Uma Pokédex interativa desenvolvida com **React, Vite, Spring Boot e MongoDB Atlas**, permitindo explorar Pokémon, consultar atributos, pesquisar, filtrar por tipo e treinador, além de cadastrar, editar e excluir Pokémon.

O projeto foi desenvolvido como continuação da **Atividade 03 — Pokédex com React + Vite**, para a **Atividade 04 — Pokédex com Spring Boot + MongoDB**.

Nesta versão, os dados deixam de ser obtidos diretamente de um arquivo JSON e passam a ser consultados por uma **API REST desenvolvida com Spring Boot**, integrada ao MongoDB Atlas.

A aplicação mantém uma interface escura com detalhes em verde, cards de Pokémon, janelas de detalhes e formulários responsivos.

## Funcionalidades

- **Listagem de Pokémon:** apresenta os Pokémon cadastrados no MongoDB, incluindo nome, número e tipos.
- **Busca:** pesquisa Pokémon pelo nome ou ID enquanto o usuário digita.
- **Filtro por tipo:** permite visualizar Pokémon de um tipo específico.
- **Filtro por treinador:** exibe os Pokémon associados ao treinador selecionado.
- **Detalhes do Pokémon:** apresenta imagem, tipos, atributos e total de status básicos.
- **Painel de treinador:** apresenta nome, quantidade de insígnias e Pokémon relacionados.
- **Cadastro de Pokémon:** permite adicionar novos Pokémon ao MongoDB.
- **Geração automática de ID:** atribui um identificador numérico aos novos Pokémon.
- **Edição de Pokémon:** permite modificar nome, tipos e atributos.
- **Exclusão de Pokémon:** permite remover um Pokémon após confirmação.
- **Interface responsiva:** adapta a aplicação para computadores e dispositivos móveis.
- **Filtros na URL:** mantém os critérios de pesquisa na barra de endereço.

## Tecnologias utilizadas

### Frontend

- React 19
- Vite 8
- JavaScript
- CSS3
- npm

### Backend

- Java 25
- Spring Boot 4.1.2
- Spring Web
- Spring Data MongoDB
- Maven
- API REST

### Banco de dados

- MongoDB Atlas
- MongoDB com armazenamento orientado a documentos

## Arquitetura

A aplicação utiliza uma arquitetura Full Stack, separando frontend, backend e banco de dados.

```text
React + Vite
     |
     | Requisições HTTP
     v
Spring Boot REST API
     |
     | Spring Data MongoDB
     v
MongoDB Atlas
```

O React é responsável pela interface e interação com o usuário.

O Spring Boot recebe as requisições HTTP, processa as operações e utiliza o Spring Data MongoDB para acessar o banco.

O MongoDB Atlas armazena os Pokémon, tipos, treinadores e o contador utilizado para gerar IDs automaticamente.

## Banco de dados

O banco utilizado pela aplicação é denominado `pokedex`.

As coleções utilizadas são:

| Coleção | Descrição |
|---|---|
| `pokemons` | Armazena Pokémon, tipos e atributos |
| `types` | Armazena os tipos disponíveis |
| `trainers` | Armazena treinadores e seus Pokémon associados |
| `counters` | Controla a geração automática de IDs |

Os dados iniciais foram adaptados do arquivo `Script_Pokedex.sql`, disponibilizado pelo professor.

A base inicial contém 151 Pokémon, 18 tipos e 12 treinadores.

### Exemplo de documento Pokémon

```json
{
  "_id": 153,
  "name": "Bayleef",
  "types": [
    {
      "id": 4,
      "name": "Grass"
    }
  ],
  "stats": {
    "hp": 70,
    "attack": 62,
    "defense": 80,
    "specialAttack": 63,
    "specialDefense": 80,
    "speed": 60
  }
}
```

O MongoDB utiliza o campo `_id` como identificador do documento, enquanto a API retorna esse identificador como `id`.

## API REST

O backend disponibiliza endpoints para realizar operações CRUD.

### Pokémon

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/pokemons` | Lista todos os Pokémon |
| GET | `/api/pokemons/{id}` | Busca um Pokémon pelo ID |
| POST | `/api/pokemons` | Cadastra um Pokémon |
| PUT | `/api/pokemons/{id}` | Atualiza um Pokémon |
| DELETE | `/api/pokemons/{id}` | Exclui um Pokémon |

### Tipos

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/types` | Lista os tipos |
| GET | `/api/types/{id}` | Busca um tipo pelo ID |
| POST | `/api/types` | Cadastra um tipo |
| PUT | `/api/types/{id}` | Atualiza um tipo |
| DELETE | `/api/types/{id}` | Exclui um tipo |

### Treinadores

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/trainers` | Lista os treinadores |
| GET | `/api/trainers/{id}` | Busca um treinador pelo ID |
| POST | `/api/trainers` | Cadastra um treinador |
| PUT | `/api/trainers/{id}` | Atualiza um treinador |
| DELETE | `/api/trainers/{id}` | Exclui um treinador |

A API é executada localmente em:

`http://localhost:8080`

## Como executar o projeto

### Pré-requisitos

É necessário possuir:

- Java 25
- Maven
- Node.js e npm
- Acesso a uma instância do MongoDB Atlas
- Git

### 1. Clonar o repositório

```bash
git clone https://github.com/GiovanniArenare/Pok-dex.git
```

Entrar na pasta:

```bash
cd Pok-dex
```

### 2. Configurar o MongoDB Atlas

Crie um cluster no MongoDB Atlas, configure o usuário do banco e permita o acesso de rede necessário.

O backend utiliza o arquivo:

`Backend/src/main/resources/application.properties`

Com as seguintes configurações:

```properties
spring.application.name=backend
spring.mongodb.uri=${MONGODB_URI}
spring.mongodb.database=pokedex
```

A conexão deve ser informada por meio da variável de ambiente `MONGODB_URI`.

No PowerShell:

```powershell
$env:MONGODB_URI="SUA_STRING_DE_CONEXAO"
```

Substitua o valor pela string de conexão fornecida pelo MongoDB Atlas.

**Não publique a string de conexão, usuário ou senha no GitHub.**

A variável definida dessa forma fica disponível na sessão atual do PowerShell.

### 3. Preparar os dados

A aplicação utiliza as coleções `pokemons`, `types` e `trainers` do MongoDB.

Os dados iniciais foram adaptados do arquivo `Script_Pokedex.sql`, incluído na raiz do repositório.

O arquivo SQL serve como referência para a importação dos dados, não sendo necessário instalar MySQL.

Para utilizar a aplicação com os dados iniciais, as coleções devem estar previamente populadas no MongoDB Atlas.

A coleção `counters` deve conter um documento para controlar a sequência dos IDs:

```json
{
  "_id": "pokemon",
  "sequencia": 153
}
```

O valor de `sequencia` deve corresponder ao maior ID já utilizado na coleção `pokemons`, para evitar conflitos ao cadastrar novos Pokémon.

### 4. Executar o backend

Abra um terminal na pasta `Backend`:

```bash
cd Backend
```

Execute:

```bash
mvn spring-boot:run
```

O servidor será iniciado em:

`http://localhost:8080`

Para verificar a API, acesse:

`http://localhost:8080/api/pokemons`

Se a conexão estiver funcionando e a coleção estiver populada, a API retornará a lista de Pokémon em formato JSON.

### 5. Executar o frontend

Abra outro terminal na pasta principal do projeto.

Entre na pasta `Frontend`:

```bash
cd Frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse:

`http://localhost:5173`

**Importante:** o backend deve estar em execução para que o frontend consiga carregar e modificar os dados.

### 6. Gerar a versão de produção do frontend

```bash
npm run build
```

Para visualizar a versão gerada:

```bash
npm run preview
```

## Estrutura do projeto

```text
Pok-dex/
├── Backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/pokedex/backend/
│   │       │       ├── controller/
│   │       │       ├── model/
│   │       │       ├── repository/
│   │       │       └── service/
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   └── .gitignore
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CardPokemon/
│   │   │   ├── DetalhesPokemon/
│   │   │   ├── FormularioPokemon/
│   │   │   ├── PainelFiltros/
│   │   │   └── PainelTreinador/
│   │   ├── hooks/
│   │   ├── model/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── .gitignore
│
├── Script_Pokedex.sql
├── .gitignore
└── README.md
```

## Organização do backend

O backend segue uma estrutura em camadas:

- **Model:** representa os documentos armazenados no MongoDB.
- **Repository:** realiza operações de persistência utilizando Spring Data MongoDB.
- **Service:** concentra as operações e regras utilizadas pela aplicação.
- **Controller:** disponibiliza os endpoints REST consumidos pelo frontend.

## Organização do frontend

- **components/:** componentes visuais reutilizáveis.
- **hooks/:** gerenciamento do carregamento de dados e dos filtros.
- **model/:** representação dos dados dos Pokémon.
- **services/:** comunicação com a API REST e filtragem dos resultados.
- **App.jsx:** integração dos componentes, formulários e operações CRUD.

## Dados e imagens

Os dados dos Pokémon, tipos e treinadores são consultados no Mongo