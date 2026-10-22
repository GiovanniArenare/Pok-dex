
import "./CardPokemon.css";

const URL_IMAGEM =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

function CardPokemon({ pokemon, onSelecionar }) {
  const imagem = `${URL_IMAGEM}/${pokemon.id}.png`;

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
            <span className="pokemon-tipo" key={tipo.id}>
              {tipo.name}
            </span>
          ))}
        </div>

        <button
          className="botao-detalhes-pokemon"
          type="button"
          onClick={() => onSelecionar?.(pokemon)}
          aria-label={`Ver detalhes de ${pokemon.name}`}
        >
          Ver detalhes
        </button>
      </div>
    </article>
  );
}

export default CardPokemon;
