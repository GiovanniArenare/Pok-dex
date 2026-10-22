
import { useEffect } from "react";
import "./DetalhesPokemon.css";

const URL_IMAGEM =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

const MAX_ATRIBUTO = 255;

function DetalhesPokemon({ pokemon, onFechar }) {
  useEffect(() => {
    function fecharComEsc(evento) {
      if (evento.key === "Escape") {
        onFechar();
      }
    }

    window.addEventListener("keydown", fecharComEsc);

    return () => {
      window.removeEventListener("keydown", fecharComEsc);
    };
  }, [onFechar]);

  const atributos = [
    { nome: "HP", chave: "hp" },
    { nome: "Ataque", chave: "attack" },
    { nome: "Defesa", chave: "defense" },
    { nome: "Atq. especial", chave: "specialAttack" },
    { nome: "Def. especial", chave: "specialDefense" },
    { nome: "Velocidade", chave: "speed" },
  ];

  return (
    <div
      className="detalhes-pokemon-fundo"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) {
          onFechar();
        }
      }}
    >
      <section
        className="detalhes-pokemon-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalhes-pokemon-titulo"
      >
        <button
          className="detalhes-pokemon-fechar"
          type="button"
          onClick={onFechar}
          aria-label="Fechar detalhes"
        >
          ×
        </button>

        <header className="detalhes-pokemon-cabecalho">
          <p className="detalhes-pokemon-numero">
            POKÉDEX · #{String(pokemon.id).padStart(3, "0")}
          </p>

          <img
            className="detalhes-pokemon-imagem"
            src={`${URL_IMAGEM}/${pokemon.id}.png`}
            alt={pokemon.name}
            onError={(evento) => {
              evento.currentTarget.style.visibility = "hidden";
            }}
          />

          <h2 id="detalhes-pokemon-titulo">{pokemon.name}</h2>

          <div className="detalhes-pokemon-tipos">
            {pokemon.types.map((tipo) => (
              <span key={tipo.id}>{tipo.name}</span>
            ))}
          </div>
        </header>

        <section
          className="detalhes-pokemon-secao"
          aria-labelledby="detalhes-pokemon-atributos-titulo"
        >
          <div className="detalhes-pokemon-titulo-secao">
            <h3 id="detalhes-pokemon-atributos-titulo">
              Atributos básicos
            </h3>
            <span>Base: 0–255</span>
          </div>

          <div className="detalhes-pokemon-atributos">
            {atributos.map(({ nome, chave }) => {
              const valor = pokemon.stats[chave] ?? 0;
              const progresso = Math.min(
                (valor / MAX_ATRIBUTO) * 100,
                100
              );

              return (
                <div className="detalhes-pokemon-atributo" key={chave}>
                  <div className="detalhes-pokemon-atributo-info">
                    <span>{nome}</span>
                    <strong>{valor}</strong>
                  </div>

                  <div
                    className="detalhes-pokemon-barra"
                    role="progressbar"
                    aria-label={nome}
                    aria-valuemin={0}
                    aria-valuemax={MAX_ATRIBUTO}
                    aria-valuenow={valor}
                  >
                    <div
                      className="detalhes-pokemon-barra-valor"
                      style={{ width: `${progresso}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="detalhes-pokemon-total">
            <span>Total de atributos</span>
            <strong>{pokemon.totalAtributos}</strong>
          </div>
        </section>
      </section>
    </div>
  );
}

export default DetalhesPokemon;
