
import Pokemon from "../model/Pokemon";

const CAMINHO_JSON = `${import.meta.env.BASE_URL}data/pokedex-data.json`;

let promessaDados = null;
let pokemon = [];
let tipos = [];
let treinadores = [];

export async function carregarCsv() {
  if (!promessaDados) {
    promessaDados = fetch(CAMINHO_JSON)
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error(
            `Erro ao carregar o JSON: ${resposta.status}`
          );
        }

        return resposta.json();
      })
      .then((dados) => {
        tipos = dados.types ?? [];

        pokemon = (dados.pokemon ?? []).map(
          (item) =>
            new Pokemon({
              id: item.id,
              name: item.name,
              stats: item.stats,
              types: item.types ?? [],
            })
        );

        treinadores = (dados.trainers ?? []).map((treinador) => ({
          ...treinador,
          pokemon: (treinador.pokemonIds ?? [])
            .map((id) =>
              pokemon.find((p) => Number(p.id) === Number(id))
            )
            .filter(Boolean),
        }));

        console.log("Pokémon carregados:", pokemon.length);
        console.log("Tipos carregados:", tipos.length);
        console.log("Treinadores carregados:", treinadores.length);

        // ESTA É A CORREÇÃO PRINCIPAL
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
    resultado = resultado.filter((p) =>
      p.name.toLocaleLowerCase("pt-BR").includes(nome)
    );
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
      (t) => t.name.toLocaleLowerCase("pt-BR") === treinador
    );

    const ids = new Set(
      selecionado?.pokemonIds?.map(Number) ?? []
    );

    resultado = resultado.filter((p) => ids.has(Number(p.id)));
  }

  return resultado;
}
