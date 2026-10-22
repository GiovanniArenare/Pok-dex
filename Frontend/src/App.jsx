
import { useEffect, useMemo, useState } from "react";
import {
  carregarCsv,
  listarTodos,
  listarTipos,
  listarTreinadores,
} from "./services/pokedexService.js";
import "./App.css";

const CORES_TIPOS = {
  normal: "#A8A77A",
  fogo: "#EE8130",
  fire: "#EE8130",
  agua: "#6390F0",
  water: "#6390F0",
  eletrico: "#F7D02C",
  electric: "#F7D02C",
  grama: "#7AC74C",
  grass: "#7AC74C",
  planta: "#7AC74C",
  gelo: "#96D9D6",
  ice: "#96D9D6",
  lutador: "#C22E28",
  fighting: "#C22E28",
  veneno: "#A33EA1",
  poison: "#A33EA1",
  terra: "#E2BF65",
  ground: "#E2BF65",
  pedra: "#B6A136",
  rock: "#B6A136",
  voador: "#A98FF3",
  flying: "#A98FF3",
  psiquico: "#F95587",
  psychic: "#F95587",
  inseto: "#A6B91A",
  bug: "#A6B91A",
  fantasma: "#735797",
  ghost: "#735797",
  dragao: "#6F35FC",
  dragon: "#6F35FC",
  sombrio: "#705746",
  dark: "#705746",
  metal: "#B7B7CE",
  steel: "#B7B7CE",
  fada: "#D685AD",
  fairy: "#D685AD",
};

function normalizar(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function obterTipos(pokemon) {
  if (Array.isArray(pokemon.nomesTipos)) {
    return pokemon.nomesTipos.filter(Boolean);
  }

  if (Array.isArray(pokemon.types)) {
    return pokemon.types
      .map((tipo) =>
        typeof tipo === "object" ? tipo.name : tipo
      )
      .filter(Boolean);
  }

  return [];
}

function corDoTipo(tipo) {
  const chave = normalizar(tipo);
  return CORES_TIPOS[chave] ?? "#8b91a7";
}

function imagemDoPokemon(pokemon) {
  const id = Number(pokemon.id);

  if (!Number.isFinite(id) || id <= 0) {
    return "";
  }

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [treinadores, setTreinadores] = useState([]);

  const [busca, setBusca] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState("Todos");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        await carregarCsv();

        if (!ativo) return;

        setPokemon([...listarTodos()]);
        setTipos([...listarTipos()]);
        setTreinadores([...listarTreinadores()]);
      } catch (error) {
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar a Pokédex."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  const pokemonFiltrados = useMemo(() => {
    const termo = normalizar(busca);

    return pokemon.filter((p) => {
      const tiposPokemon = obterTipos(p);

      const correspondeBusca =
        normalizar(p.name).includes(termo) ||
        String(p.id).includes(termo) ||
        tiposPokemon.some((tipo) =>
          normalizar(tipo).includes(termo)
        );

      const correspondeTipo =
        tipoSelecionado === "Todos" ||
        tiposPokemon.some(
          (tipo) =>
            normalizar(tipo) === normalizar(tipoSelecionado)
        );

      return correspondeBusca && correspondeTipo;
    });
  }, [pokemon, busca, tipoSelecionado]);

  if (carregando) {
    return (
      <main className="estado">
        <div className="pokebola-loading">
          <span />
        </div>
        <h2>Carregando Pokédex...</h2>
        <p>Preparando os dados da sua aventura.</p>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="estado">
        <div className="erro-icone">!</div>
        <h2>Não foi possível carregar a Pokédex</h2>
        <p>{erro}</p>
        <p>
          Confira se o arquivo está em{" "}
          <code>public/data/pokedex-data.csv</code>.
        </p>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="topbar">
        <a href="#inicio" className="marca">
          <span className="marca-icone">
            <span />
          </span>
          <span>
            Poké<span className="marca-vermelho">Dex</span>
          </span>
        </a>

        <nav>
          <a href="#inicio">Início</a>
          <a href="#pokedex">Pokédex</a>
          <a href="#tipos">Tipos</a>
          <a href="#treinadores">Treinadores</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-texto">
          <span className="etiqueta">
            SUA AVENTURA COMEÇA AQUI
          </span>

          <h1>
            Descubra seu próximo{" "}
            <span>Pokémon.</span>
          </h1>

          <p>
            Explore o universo Pokémon, conheça cada espécie,
            descubra seus tipos e encontre o parceiro perfeito
            para sua próxima aventura.
          </p>

          <a className="botao-hero" href="#pokedex">
            Explorar Pokédex <span>↗</span>
          </a>

          <div className="hero-numeros">
            <div>
              <strong>{pokemon.length}</strong>
              <span>Pokémon</span>
            </div>
            <div>
              <strong>{tipos.length}</strong>
              <span>Tipos</span>
            </div>
            <div>
              <strong>{treinadores.length}</strong>
              <span>Treinadores</span>
            </div>
          </div>
        </div>

        <div className="hero-arte">
          <span className="hero-etiqueta">POKÉMON EM DESTAQUE</span>
          <div className="hero-circulo" />
          <span className="hero-estrela estrela-um">✦</span>
          <span className="hero-estrela estrela-dois">✧</span>

          <img
            src={imagemDoPokemon({ id: 25 })}
            alt="Pikachu"
            className="hero-pokemon"
          />

          <div className="hero-legenda">
            <span className="hero-ponto" />
            <div>
              <strong>Pikachu</strong>
              <span>Pokémon elétrico · #025</span>
            </div>
          </div>
        </div>
      </section>

      <section className="secao-pokemon" id="pokedex">
        <div className="cabecalho-secao">
          <div>
            <span className="sobretitulo">
              EXPLORE E DESCUBRA
            </span>
            <h2>
              Pokédex <span>({pokemonFiltrados.length})</span>
            </h2>
            <p>
              Todos os seus Pokémon favoritos em um só lugar.
            </p>
          </div>
        </div>

        <div className="controles">
          <label className="campo-busca">
            <span className="icone-busca">⌕</span>
            <input
              type="search"
              placeholder="Buscar Pokémon por nome, número ou tipo..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
            {busca && (
              <button
                type="button"
                className="limpar-busca"
                onClick={() => setBusca("")}
                aria-label="Limpar busca"
              >
                ×
              </button>
            )}
          </label>

          <select
            value={tipoSelecionado}
            onChange={(event) =>
              setTipoSelecionado(event.target.value)
            }
            aria-label="Filtrar por tipo"
          >
            <option value="Todos">Todos os tipos</option>

            {tipos.map((tipo) => (
              <option key={tipo.id} value={tipo.name}>
                {tipo.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grade-pokemon">
          {pokemonFiltrados.map((p) => {
            const tiposPokemon = obterTipos(p);

            return (
              <article className="pokemon-card" key={p.id}>
                <div
                  className="pokemon-imagem"
                  style={{
                    "--cor-tipo": corDoTipo(
                      tiposPokemon[0] || "normal"
                    ),
                  }}
                >
                  <span className="pokemon-id">
                    #{String(p.id).padStart(3, "0")}
                  </span>

                  <div className="imagem-circulo" />

                  <img
                    src={imagemDoPokemon(p)}
                    alt={p.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />

                  <span className="card-brilho">✦</span>
                </div>

                <div className="pokemon-info">
                  <span className="pokemon-categoria">
                    POKÉMON
                  </span>

                  <h3>{p.name}</h3>

                  <div className="lista-tipos">
                    {tiposPokemon.length > 0 ? (
                      tiposPokemon.map((tipo, index) => (
                        <span
                          key={`${tipo}-${index}`}
                          className="tipo-badge"
                          style={{
                            "--cor-tipo": corDoTipo(tipo),
                          }}
                        >
                          {tipo}
                        </span>
                      ))
                    ) : (
                      <span className="tipo-desconhecido">
                        Tipo não informado
                      </span>
                    )}
                  </div>

                  <div className="atributos-resumo">
                    <div>
                      <span>HP</span>
                      <strong>{p.stats.hp}</strong>
                    </div>
                    <div>
                      <span>Ataque</span>
                      <strong>{p.stats.attack}</strong>
                    </div>
                    <div>
                      <span>Defesa</span>
                      <strong>{p.stats.defense}</strong>
                    </div>
                    <div>
                      <span>Total</span>
                      <strong>{p.totalAtributos}</strong>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {pokemonFiltrados.length === 0 && (
          <div className="vazio">
            <span>🔎</span>
            <h3>Nenhum Pokémon encontrado</h3>
            <p>
              Tente outro nome ou selecione um tipo diferente.
            </p>

            <button
              onClick={() => {
                setBusca("");
                setTipoSelecionado("Todos");
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      <section className="secao-extra" id="tipos">
        <div className="cabecalho-secao">
          <div>
            <span className="sobretitulo">
              ESCOLHA SUA ESTRATÉGIA
            </span>
            <h2>Tipos Pokémon</h2>
            <p>
              Selecione um tipo para encontrar Pokémon da mesma categoria.
            </p>
          </div>
        </div>

        <div className="grade-tipos">
          {tipos.map((tipo) => (
            <button
              type="button"
              key={tipo.id}
              className={`tipo-card ${
                normalizar(tipoSelecionado) ===
                normalizar(tipo.name)
                  ? "tipo-ativo"
                  : ""
              }`}
              style={{
                "--cor-tipo": corDoTipo(tipo.name),
              }}
              onClick={() => {
                setTipoSelecionado((atual) =>
                  normalizar(atual) === normalizar(tipo.name)
                    ? "Todos"
                    : tipo.name
                );
                document
                  .getElementById("pokedex")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="tipo-orbe">✦</span>
              <span>{tipo.name}</span>
              <span className="tipo-seta">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="secao-extra" id="treinadores">
        <div className="cabecalho-secao">
          <div>
            <span className="sobretitulo">
              SEUS PARCEIROS DE AVENTURA
            </span>
            <h2>Treinadores</h2>
            <p>Conheça os treinadores cadastrados na sua Pokédex.</p>
          </div>
        </div>

        {treinadores.length > 0 ? (
          <div className="grade-treinadores">
            {treinadores.map((treinador) => (
              <article
                className="treinador-card"
                key={treinador.id}
              >
                <div className="avatar-treinador">
                  {String(treinador.name || "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="treinador-info">
                  <h3>{treinador.name}</h3>

                  <span className="insignias">
                    ★ {treinador.badges} insígnias
                  </span>

                  <p>
                    Pokémon:{" "}
                    {treinador.pokemon
                      .map((parceiro) => parceiro.name)
                      .join(", ") || "Nenhum Pokémon associado"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mensagem-vazia">
            Nenhum treinador cadastrado.
          </p>
        )}
      </section>

      <footer className="rodape">
        <a href="#inicio" className="marca">
          <span className="marca-icone">
            <span />
          </span>
          <span>
            Poké<span className="marca-vermelho">Dex</span>
          </span>
        </a>

        <p>
          Feito para quem sonha em ser um Mestre Pokémon.
        </p>

        <a href="#inicio">Voltar ao topo ↑</a>
      </footer>
    </main>
  );
}

export default App;
