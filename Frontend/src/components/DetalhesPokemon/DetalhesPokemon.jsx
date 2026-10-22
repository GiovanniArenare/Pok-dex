
import { useEffect } from "react";
import "./DetalhesPokemon.css";

const URL_IMAGEM =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

const MAX_ATRIBUTO = 255;

const ATRIBUTOS = [
  { nome: "HP", chave: "hp", cor: "hp" },
  { nome: "Ataque", chave: "attack", cor: "ataque" },
  { nome: "Defesa", chave: "defense", cor: "defesa" },
  { nome: "Atq. especial", chave: "specialAttack", cor: "especial" },
  { nome: "Def. especial", chave: "specialDefense", cor: "resistencia" },
  { nome: "Velocidade", chave: "speed", cor: "velocidade" },
];

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

  const totalCalculado = ATRIBUTOS.reduce(
    (total, atributo) => total + (Number(pokemon.stats?.[atributo.chave]) || 0),
    0
  );

  const total = pokemon.totalAtributos ?? totalCalculado;

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
          autoFocus
        >
          ×
        </button>

        <header className="detalhes-pokemon-cabecalho">
          <div className="detalhes-pokemon-identificacao">
            <span className="detalhes-pokemon-etiqueta">
              POKÉDEX NACIONAL
            </span>

            <span className="detalhes-pokemon-numero">
              #{String(pokemon.id).padStart(3, "0")}
            </span>
          </div>

          <div className="detalhes-pokemon-ilustracao">
            <span
              className="detalhes-pokemon-brilho"
              aria-hidden="true"
            >
              ✦
            </span>

            <img
              className="detalhes-pokemon-imagem"
              src={`${URL_IMAGEM}/${pokemon.id}.png`}
              alt={pokemon.name}
              onError={(evento) => {
                evento.currentTarget.style.visibility = "hidden";
              }}
            />

            <span
              className="detalhes-pokemon-brilho detalhes-pokemon-brilho-secundario"
              aria-hidden="true"
            >
              ✦
            </span>
          </div>

          <h2 id="detalhes-pokemon-titulo">{pokemon.name}</h2>

          <div
            className="detalhes-pokemon-tipos"
            aria-label="Tipos do Pokémon"
          >
            {(pokemon.types ?? []).map((tipo) => (
              <span
                className={`detalhes-pokemon-tipo tipo-${String(
                  tipo.name
                ).toLowerCase()}`}
                key={tipo.id ?? tipo.name}
              >
                {tipo.name}
              </span>
            ))}
          </div>
        </header>

        <section
          className="detalhes-pokemon-secao"
          aria-labelledby="detalhes-pokemon-atributos-titulo"
        >
          <div className="detalhes-pokemon-titulo-secao">
            <div>
              <span className="detalhes-pokemon-sobretitulo">
                STATUS
              </span>
              <h3 id="detalhes-pokemon-atributos-titulo">
                Atributos básicos
              </h3>
            </div>

            <span className="detalhes-pokemon-escala">
              Máx. {MAX_ATRIBUTO}
            </span>
          </div>

          <div className="detalhes-pokemon-atributos">
            {ATRIBUTOS.map(({ nome, chave, cor }) => {
              const valor =
                Number(pokemon.stats?.[chave]) || 0;

              const progresso = Math.min(
                (valor / MAX_ATRIBUTO) * 100,
                100
              );

              return (
                <div
                  className={`detalhes-pokemon-atributo atributo-${cor}`}
                  key={chave}
                >
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
            <div className="detalhes-pokemon-total-icone" aria-hidden="true">
              ★
            </div>

            <div className="detalhes-pokemon-total-texto">
              <span>Total de atributos</span>
              <small>Soma de todos os status básicos</small>
            </div>

            <strong>{total}</strong>
          </div>
        </section>

        <footer className="detalhes-pokemon-rodape">
          <span className="detalhes-pokemon-ponto" />
          Dados do Pokémon #{String(pokemon.id).padStart(3, "0")}
        </footer>
      </section>
    </div>
  );
}

export default DetalhesPokemon;
