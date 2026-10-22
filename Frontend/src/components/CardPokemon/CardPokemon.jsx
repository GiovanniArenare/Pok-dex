import "./CardPokemon.css";

const URL_IMAGEM =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

function CardPokemon({ pokemon }) {
  const imagem = `${URL_IMAGEM}/${pokemon.id}.png`;

  const atributos = [
    ["HP", pokemon.stats.hp],
    ["Ataque", pokemon.stats.attack],
    ["Defesa", pokemon.stats.defense],
    ["Atq. especial", pokemon.stats.specialAttack],
    ["Def. especial", pokemon.stats.specialDefense],
    ["Velocidade", pokemon.stats.speed],
  ];

  return (
    <article className="card-pokemon">
      <div className="pokemon-ilustracao">
        <span className="pokemon-numero">
          #{String(pokemon.id).padStart(3, "0")}
        </span>

        <img
          className="pokemon-imagem"
          src={imagem}
          alt={pokemon.name}
          loading="lazy"
          onError={(evento) => {
            evento.currentTarget.style.visibility = "hidden";
          }}
        />
      </div>

      <div className="pokemon-conteudo">
        <h2 className="pokemon-nome">{pokemon.name}</h2>

        <div className="pokemon-tipos">
          {pokemon.types.map((tipo) => (
            <span
              className="pokemon-tipo"
              key={tipo.id}
            >
              {tipo.name}
            </span>
          ))}
        </div>

        <div className="pokemon-atributos">
          {atributos.map(([nome, valor]) => (
            <div className="pokemon-atributo" key={nome}>
              <span>{nome}</span>
              <strong>{valor}</strong>
            </div>
          ))}
        </div>

        <div className="pokemon-total">
          <span>Total de atributos</span>
          <strong>{pokemon.totalAtributos}</strong>
        </div>
      </div>
    </article>
  );
}

export default CardPokemon;