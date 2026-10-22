import { useMemo } from "react";
import "./app.css";

import usePokemon from "./hooks/usePokemon";
import useFiltrosDaUrl from "./hooks/useFiltrosDaUrl";

import { filtrar } from "./services/pokedexService";

import CardPokemon from "./components/CardPokemon/CardPokemon";
import PainelFiltros from "./components/PainelFiltros/PainelFiltros";

function App() {
  const {
    pokemon,
    tipos,
    treinadores,
    carregando,
    erro,
  } = usePokemon();

  const {
    filtros,
    aplicarFiltros,
    limparFiltros,
  } = useFiltrosDaUrl();

  const pokemonFiltrados = useMemo(
    () => filtrar(pokemon, filtros, treinadores),
    [pokemon, filtros, treinadores]
  );
  console.log("Total de Pokémon carregados:", pokemon.length);
console.log("Pokémon carregados:", pokemon.map((p) => p.name));
console.log("Tipos carregados:", tipos);

  return (
    <main className="app">
      <header className="cabecalho-pokedex">
        <p className="subtitulo-pokedex">EXPLORE O MUNDO POKÉMON</p>
        <h1>
          Poké<span>dex</span>
        </h1>
        <p className="descricao-pokedex">
          Descubra Pokémon, consulte seus atributos e explore os tipos.
        </p>
      </header>

      <section className="secao-pokedex">
        <PainelFiltros
          filtros={filtros}
          tipos={tipos}
          treinadores={treinadores}
          onFiltrar={aplicarFiltros}
          onLimpar={limparFiltros}
        />

        {carregando && (
          <p className="mensagem-status">
            Carregando Pokémon...
          </p>
        )}

        {!carregando && erro && (
          <div className="mensagem-erro">
            <p>Não foi possível carregar a Pokédex.</p>
            <p>{erro}</p>
            <p>
              Confira se o arquivo está em{" "}
              <code>public/data/pokedex-data.csv</code>.
            </p>
          </div>
        )}

        {!carregando && !erro && (
          <>
            <div className="resultado-pokedex">
              <h2>Pokémon</h2>
              <span>
                {pokemonFiltrados.length} resultado(s)
              </span>
            </div>

            {pokemonFiltrados.length > 0 ? (
              <div className="grade-pokemon">
                {pokemonFiltrados.map((item) => (
                  <CardPokemon
                    key={item.id}
                    pokemon={item}
                  />
                ))}
              </div>
            ) : (
              <p className="mensagem-status">
                Nenhum Pokémon encontrado com esses filtros.
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default App;