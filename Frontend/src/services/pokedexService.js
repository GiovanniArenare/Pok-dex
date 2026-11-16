
import Pokemon from "../model/Pokemon";

const API_URL = "http://localhost:8080/api";

let promessaDados = null;
let pokemon = [];
let tipos = [];
let treinadores = [];

async function buscarAPI(endpoint) {
  const resposta = await fetch(`${API_URL}${endpoint}`);

  if (!resposta.ok) {
    throw new Error(
      `Erro ao consultar ${endpoint}: ${resposta.status}`
    );
  }

  return resposta.json();
}

export async function carregarDados() {
  if (!promessaDados) {
    promessaDados = Promise.all([
      buscarAPI("/pokemons"),
      buscarAPI("/types"),
      buscarAPI("/trainers"),
    ])
      .then(([dadosPokemon, dadosTipos, dadosTreinadores]) => {
        tipos = dadosTipos;

        pokemon = dadosPokemon.map(
          (item) =>
            new Pokemon({
              id: item.id,
              name: item.name,
              stats: item.stats,
              types: item.types ?? [],
            })
        );

        treinadores = dadosTreinadores.map((treinador) => ({
          ...treinador,
          pokemon: (treinador.pokemonIds ?? [])
            .map((id) =>
              pokemon.find(
                (p) => Number(p.id) === Number(id)
              )
            )
            .filter(Boolean),
        }));

        console.log("Pokémon carregados:", pokemon.length);
        console.log("Tipos carregados:", tipos.length);
        console.log("Treinadores carregados:", treinadores.length);

        return {
          pokemon,
          tipos,
          treinadores,
        };
      })
      .catch((erro) => {
        promessaDados = null;
        throw erro;
      });
  }

  return promessaDados;
}

export function listarTodos() {
  return pokemon;
}

export function listarTipos() {
  return tipos;
}

export function listarTreinadores() {
  return treinadores;
}

export function filtrar(lista, filtros = {}) {
  const nome = String(filtros.nome ?? "")
    .trim()
    .toLocaleLowerCase("pt-BR");

  const tipo = String(filtros.tipo ?? "")
    .trim()
    .toLocaleLowerCase("pt-BR");

  const treinador = String(filtros.treinador ?? "")
    .trim()
    .toLocaleLowerCase("pt-BR");

  let resultado = lista;

  if (nome) {
    resultado = resultado.filter((p) => {
      const nomePokemon = p.name.toLocaleLowerCase("pt-BR");
      const idPokemon = String(p.id);

      return (
        nomePokemon.includes(nome) ||
        idPokemon === nome
      );
    });
  }

  if (tipo) {
    resultado = resultado.filter((p) =>
      p.types.some(
        (t) => t.name.toLocaleLowerCase("pt-BR") === tipo
      )
    );
  }

  if (treinador) {
    const selecionado = treinadores.find(
      (t) =>
        t.name.toLocaleLowerCase("pt-BR") === treinador
    );

    const ids = new Set(
      selecionado?.pokemon.map((p) => String(p.id)) ?? []
    );

    resultado = resultado.filter((p) =>
      ids.has(String(p.id))
    );
  }

  return resultado;
}
