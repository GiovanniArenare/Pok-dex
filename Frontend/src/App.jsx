
import { useMemo, useState } from "react";
import "./App.css";

import usePokemon from "./hooks/usePokemon";
import useFiltrosDaUrl from "./hooks/useFiltrosDaUrl";

import {
  filtrar,
  cadastrarPokemon,
  editarPokemon,
  excluirPokemon,
} from "./services/pokedexService";

import Pokemon from "./model/Pokemon";
import CardPokemon from "./components/CardPokemon/CardPokemon";
import PainelFiltros from "./components/PainelFiltros/PainelFiltros";
import DetalhesPokemon from "./components/DetalhesPokemon/DetalhesPokemon";
import PainelTreinador from "./components/PainelTreinador/PainelTreinador";
import FormularioPokemon from "./components/FormularioPokemon/FormularioPokemon";

function App() {
  const {
    pokemon,
    tipos,
    treinadores,
    carregando,
    erro,
  } = usePokemon();

  const { filtros, aplicarFiltros, limparFiltros } = useFiltrosDaUrl();

  const [pokemonSelecionado, setPokemonSelecionado] = useState(null);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [pokemonEdicao, setPokemonEdicao] = useState(null);
  const [pokemonAlterados, setPokemonAlterados] = useState({});
  const [pokemonExcluidos, setPokemonExcluidos] = useState([]);
  const [mensagemSucesso, setMensagemSucesso] = useState("");


  const listaPokemon = useMemo(() => {
    const lista = new Map(
      pokemon.map((item) => [String(item.id), item])
    );

    Object.values(pokemonAlterados).forEach((item) => {
      lista.set(String(item.id), item);
    });

    pokemonExcluidos.forEach((id) => {
      lista.delete(String(id));
    });

    return Array.from(lista.values()).sort(
      (a, b) => Number(a.id) - Number(b.id)
    );
  }, [pokemon, pokemonAlterados, pokemonExcluidos]);


  const pokemonFiltrados = useMemo(
    () => filtrar(listaPokemon, filtros, treinadores),
    [listaPokemon, filtros, treinadores]
  );

  const treinadorSelecionado = useMemo(
    () =>
      treinadores.find(
        (treinador) =>
          String(treinador.name).toLocaleLowerCase("pt-BR") ===
          String(filtros.treinador).toLocaleLowerCase("pt-BR")
      ),
    [treinadores, filtros.treinador]
  );

  const pokemonDoTreinador = useMemo(() => {
    if (!treinadorSelecionado) {
      return [];
    }

    return (treinadorSelecionado.pokemonIds ?? [])
      .map((id) =>
        listaPokemon.find(
          (item) => Number(item.id) === Number(id)
        )
      )
      .filter(Boolean);
  }, [treinadorSelecionado, listaPokemon]);

  function converterPokemon(dados) {
    return new Pokemon({
      id: dados.id,
      name: dados.name,
      types: dados.types,
      stats: dados.stats,
    });
  }

  function fecharFormulario() {
    setFormularioAberto(false);
    setPokemonEdicao(null);
  }

  function abrirFormularioCadastro() {
    setMensagemSucesso("");
    setPokemonEdicao(null);
    setFormularioAberto(true);
  }

  function abrirFormularioEdicao(item) {
    setMensagemSucesso("");
    setPokemonSelecionado(null);
    setPokemonEdicao(item);
    setFormularioAberto(true);
  }

  async function handleCadastrarPokemon(novoPokemon) {
    const cadastrado = await cadastrarPokemon(novoPokemon);
    const pokemonCriado = converterPokemon(cadastrado);

    setPokemonAlterados((anteriores) => ({
      ...anteriores,
      [String(pokemonCriado.id)]: pokemonCriado,
    }));

    fecharFormulario();

    setMensagemSucesso(
      `${pokemonCriado.name} foi cadastrado com sucesso!`
    );
  }

  async function handleEditarPokemon(id, dadosAtualizados) {
    const atualizado = await editarPokemon(id, dadosAtualizados);
    const pokemonAtualizado = converterPokemon(atualizado);

    setPokemonAlterados((anteriores) => ({
      ...anteriores,
      [String(pokemonAtualizado.id)]: pokemonAtualizado,
    }));

    fecharFormulario();

    setMensagemSucesso(
      `${pokemonAtualizado.name} foi atualizado com sucesso!`
    );
  }

  async function handleExcluirPokemon(item) {
    const confirmado = window.confirm(
      `Tem certeza que deseja excluir ${item.name} (#${item.id})?\n\nEssa ação não poderá ser desfeita.`
    );

    if (!confirmado) {
      return;
    }

    try {
      await excluirPokemon(item.id);

      setPokemonExcluidos((anteriores) => [
        ...anteriores,
        String(item.id),
      ]);

      setPokemonSelecionado(null);

      setMensagemSucesso(
        `${item.name} foi excluído com sucesso!`
      );
    } catch (error) {
      window.alert(
        error.message || "Não foi possível excluir o Pokémon."
      );
    }
  }


  return (
    <main className="app">
      <header className="cabecalho-pokedex">
        <p className="subtitulo-pokedex">
          EXPLORE O MUNDO POKÉMON
        </p>

        <h1>
          Poké<span>dex</span>
        </h1>

        <p className="descricao-pokedex">
          Descubra Pokémon, consulte seus atributos e explore os tipos.
        </p>

        <div
          className="pokebola-decorativa"
          aria-hidden="true"
        />
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
              Verifique se a API Spring Boot está funcionando em{" "}
              <code>http://localhost:8080</code>.
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
              <div>
                <h2>Pokémon</h2>
                <span>
                  {pokemonFiltrados.length} resultado(s)
                </span>
              </div>

              <button
                type="button"
                className="botao-cadastrar-pokemon"
                onClick={abrirFormularioCadastro}
              >
                + Cadastrar Pokémon
              </button>
            </div>

            {mensagemSucesso && (
              <div
                className="mensagem-sucesso-pokemon"
                role="status"
              >
                {mensagemSucesso}
              </div>
            )}

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
          onEditar={abrirFormularioEdicao}
          onExcluir={handleExcluirPokemon}
        />
      )}

      {formularioAberto && (
        <div
          className="modal-pokemon-overlay"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              fecharFormulario();
            }
          }}
        >
          <div
            className="modal-pokemon-conteudo"
            role="dialog"
            aria-modal="true"
            aria-label={
              pokemonEdicao
                ? "Editar Pokémon"
                : "Cadastrar Pokémon"
            }
          >
            <button
              type="button"
              className="modal-pokemon-fechar"
              onClick={fecharFormulario}
              aria-label="Fechar formulário"
            >
              ×
            </button>

            <FormularioPokemon
              key={pokemonEdicao?.id ?? "cadastro"}
              tipos={tipos}
              pokemonEdicao={pokemonEdicao}
              onCadastrar={handleCadastrarPokemon}
              onEditar={handleEditarPokemon}
              onCancelar={fecharFormulario}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
