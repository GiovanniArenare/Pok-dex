import { useMemo, useState } from "react";
import "./App.css";

import usePokemon from "./hooks/usePokemon";
import useFiltrosDaUrl from "./hooks/useFiltrosDaUrl";
import { filtrar } from "./services/pokedexService";
import CardPokemon from "./components/CardPokemon/CardPokemon";
import PainelFiltros from "./components/PainelFiltros/PainelFiltros";
import DetalhesPokemon from "./components/DetalhesPokemon/DetalhesPokemon";
import PainelTreinador from "./components/PainelTreinador/PainelTreinador";

function App() {
  const { pokemon, tipos, treinadores, carregando, erro } = usePokemon();
  const { filtros, aplicarFiltros, limparFiltros } = useFiltrosDaUrl();
  const [pokemonSelecionado, setPokemonSelecionado] = useState(null);

  const pokemonFiltrados = useMemo(
    () => filtrar(pokemon, filtros, treinadores),
    [pokemon, filtros, treinadores]
  );

  const treinadorSelecionado = useMemo(
    () => treinadores.find(
      (treinador) =>
        String(treinador.name).toLocaleLowerCase("pt-BR") ===
        String(filtros.treinador).toLocaleLowerCase("pt-BR")
    ),
    [treinadores, filtros.treinador]
  );

const pokemonDoTreinador = treinadorSelecionado?.pokemon ?? [];

  return (
    <main className="app">
      <header className="cabecalho-pokedex">
        <p className="subtitulo-pokedex">EXPLORE O MUNDO POKÉMON</p>
        <h1>Poké<span>dex</span></h1>
        <p className="descricao-pokedex">
          Descubra Pokémon, consulte seus atributos e explore os tipos.
        </p>
        <div className="pokebola-decorativa" aria-hidden="true" />
      </header>

      <section className="secao-pokedex">
        <PainelFiltros
          filtros={filtros}
          tipos={tipos}
          treinadores={treinadores}
          onFiltrar={aplicarFiltros}
          onLimpar={limparFiltros}
        />

        {carregando && <p className="mensagem-status">Carregando Pokémon...</p>}

        {!carregando && erro && (
          <div className="mensagem-erro">
            <p>Não foi possível carregar a Pokédex.</p>
            <p>{erro}</p>
            <p>
              Confira se o arquivo está em{" "}
              <code>public/data/pokedex-data.json</code>.
            </p>
          </div>
        )}

        {!carregando && !erro && (
          <>
            {treinadorSelecionado && (
              <PainelTreinador
                treinador={treinadorSelecionado}
                pokemon={pokemonDoTreinador}
              />
            )}

            <div className="resultado-pokedex">
              <h2>Pokémon</h2>
              <span>{pokemonFiltrados.length} resultado(s)</span>
            </div>

            {pokemonFiltrados.length > 0 ? (
              <div className="grade-pokemon">
                {pokemonFiltrados.map((item) => (
                  <CardPokemon
                    key={item.id}
                    pokemon={item}
                    onSelecionar={setPokemonSelecionado}
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

      {pokemonSelecionado && (
        <DetalhesPokemon
          pokemon={pokemonSelecionado}
          onFechar={() => setPokemonSelecionado(null)}
        />
      )}
    </main>
  );
}

export default App;
