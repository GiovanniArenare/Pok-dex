
import "./CardPokemon.css";

const CORES_TIPOS = {
  normal: "#A8A77A",
  fire: "#EE8130",
  fogo: "#EE8130",
  water: "#6390F0",
  agua: "#6390F0",
  electric: "#F7D02C",
  eletrico: "#F7D02C",
  grass: "#7AC74C",
  grama: "#7AC74C",
  ice: "#96D9D6",
  gelo: "#96D9D6",
  fighting: "#C22E28",
  lutador: "#C22E28",
  poison: "#A33EA1",
  veneno: "#A33EA1",
  ground: "#E2BF65",
  terra: "#E2BF65",
  flying: "#A98FF3",
  voador: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

function normalizar(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function obterImagem(id) {
  const numero = Number(id);

  if (!Number.isFinite(numero) || numero <= 0) {
    return "";
  }

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numero}.png`;
}

function CardPokemon({ pokemon }) {
  const p = pokemon;

  const atributos = [
    { nome: "HP", valor: p.stats.hp, cor: "#F87171" },
    { nome: "Ataque", valor: p.stats.attack, cor: "#FB923C" },
    { nome: "Defesa", valor: p.stats.defense, cor: "#FACC15" },
    {
      nome: "At. especial",
      valor: p.stats.specialAttack,
      cor: "#60A5FA",
    },
    {
      nome: "Def. especial",
      valor: p.stats.specialDefense,
      cor: "#34D399",
    },
    {
      nome: "Velocidade",
      valor: p.stats.speed,
      cor: "#C084FC",
    },
  ];

  const tipoPrincipal = p.types?.[0]?.name ?? "normal";
  const corPrincipal =
    CORES_TIPOS[normalizar(tipoPrincipal)] ?? "#94A3B8";

  return (
    <article
      className="card-pokemon"
      style={{ "--cor-principal": corPrincipal }}
    >
      <div className="pokemon-ilustracao">
        <span className="pokemon-numero">
          #{String(p.id).padStart(3, "0")}
        </span>

        <div className="pokemon-circulo" />

        <img
          className="pokemon-imagem"
          src={obterImagem(p.id)}
          alt={p.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

        <span className="pokemon-brilho">✦</span>
      </div>

      <div className="pokemon-conteudo">
        <div className="pokemon-cabecalho">
          <div>
            <span className="pokemon-legenda">POKÉMON</span>
            <h2>{p.name}</h2>
          </div>

          <span className="pokemon-total-mini">
            {p.totalAtributos}
            <small>TOTAL</small>
          </span>
        </div>

        <div className="pokemon-tipos">
          {p.types?.map((tipo) => (
            <span
              key={tipo.id}
              className="tipo"
              style={{
                "--cor-tipo":
                  CORES_TIPOS[normalizar(tipo.name)] ?? "#94A3B8",
              }}
            >
              {tipo.name}
            </span>
          ))}
        </div>

        <div className="pokemon-atributos">
          <div className="atributos-titulo">
            <h3>Atributos</h3>
            <span>BASE STATS</span>
          </div>

          {atributos.map((atributo) => (
            <div className="atributo" key={atributo.nome}>
              <span className="atributo-nome">
                {atributo.nome}
              </span>

              <div
                className="atributo-barra"
                role="progressbar"
                aria-label={atributo.nome}
                aria-valuenow={atributo.valor}
                aria-valuemin={0}
                aria-valuemax={255}
              >
                <div
                  className="atributo-progresso"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, (atributo.valor / 255) * 100)
                    )}%`,
                    backgroundColor: atributo.cor,
                  }}
                />
              </div>

              <span className="atributo-valor">
                {atributo.valor}
              </span>
            </div>
          ))}
        </div>

        <div className="pokemon-total">
          <span>Total de atributos</span>
          <strong>{p.totalAtributos}</strong>
        </div>
      </div>
    </article>
  );
}

export default CardPokemon;
