
import Papa from "papaparse";
import Pokemon from "../model/Pokemon";

/**
 * Serviço responsável pela leitura e consulta da Pokédex.
 *
 * Arquivo: public/data/pokedex-data.csv
 *
 * Grupos:
 * - types
 * - pokemon
 * - trainers
 */

const CAMINHO_CSV = `${import.meta.env.BASE_URL}data/pokedex-data.csv`;

let pokemon = [];
let tipos = [];
let treinadores = [];
let carregamento = null;

function texto(valor) {
  return valor == null ? "" : String(valor).trim();
}

function normalizar(valor) {
  return texto(valor)
    .replace(/^\uFEFF/, "")
    .toLocaleLowerCase("pt-BR");
}

function numero(valor) {
  if (valor == null || texto(valor) === "") {
    return null;
  }

  const resultado = Number(valor);
  return Number.isFinite(resultado) ? resultado : null;
}

/**
 * Normaliza cabeçalhos, removendo BOM, espaços e prefixos.
 */
function normalizarCabecalho(header) {
  return texto(header)
    .replace(/^\uFEFF/, "")
    .replace(/^\|+/, "")
    .replace(/^__/, "");
}

/**
 * Encontra uma propriedade mesmo quando o cabeçalho
 * contém caracteres extras ou diferenças de formatação.
 */
function obterCampo(linha, nomes) {
  for (const nome of nomes) {
    if (linha[nome] != null) {
      return linha[nome];
    }
  }

  const chaves = Object.keys(linha);

  for (const nome of nomes) {
    const chave = chaves.find(
      (item) => normalizarCabecalho(item) === nome
    );

    if (chave != null) {
      return linha[chave];
    }
  }

  return "";
}

/**
 * Obtém o grupo da linha.
 */
function grupoDaLinha(linha) {
  const grupo = obterCampo(linha, ["", "|", "﻿|", "grupo", "group"]);
  return normalizar(grupo).replace(/^_+|_+$/g, "");
}

/**
 * Carrega o CSV uma única vez.
 * Em caso de falha, permite tentar novamente.
 */
export function carregarCsv() {
  if (!carregamento) {
    carregamento = lerCsv().catch((erro) => {
      carregamento = null;
      throw erro;
    });
  }

  return carregamento;
}

/**
 * Lê o CSV e cria os objetos da aplicação.
 */
async function lerCsv() {
  const resposta = await fetch(CAMINHO_CSV);

  if (!resposta.ok) {
    throw new Error(
      `Erro ao ler o CSV: ${CAMINHO_CSV} (HTTP ${resposta.status}).`
    );
  }

  const textoCsv = await resposta.text();

  if (!textoCsv.trim()) {
    throw new Error("O arquivo CSV está vazio.");
  }

  const resultado = Papa.parse(textoCsv, {
    header: true,
    skipEmptyLines: true,
    delimiter: ",",
    quoteChar: '"',
    transformHeader: normalizarCabecalho,
  });

  if (resultado.errors.length > 0) {
    console.warn("Avisos ao interpretar o CSV:", resultado.errors);
  }

  const linhas = resultado.data;

  console.log("Cabeçalhos do CSV:", resultado.meta.fields);
  console.log("Primeira linha do CSV:", linhas[0]);

  tipos = lerTipos(linhas);
  pokemon = lerPokemon(linhas, tipos);
  treinadores = lerTreinadores(linhas, pokemon);

  console.info("Pokédex carregada:", {
    tipos: tipos.length,
    pokemon: pokemon.length,
    treinadores: treinadores.length,
  });

  if (tipos.length === 0 || pokemon.length === 0) {
    throw new Error(
      "Não foi possível identificar tipos ou Pokémon no CSV. " +
        "Confira a primeira coluna, os cabeçalhos e o formato do arquivo."
    );
  }

  return { pokemon, tipos, treinadores };
}

/**
 * Lê os tipos disponíveis.
 */
function lerTipos(linhas) {
  const mapa = new Map();

  for (const linha of linhas) {
    if (grupoDaLinha(linha) !== "types") continue;

    const id = numero(obterCampo(linha, ["id"]));
    const name = texto(obterCampo(linha, ["name"]));

    if (id == null || !name) continue;

    mapa.set(id, { id, name });
  }

  return [...mapa.values()].sort((a, b) => a.id - b.id);
}

/**
 * Lê e agrupa os Pokémon por ID, incluindo seus tipos.
 */
function lerPokemon(linhas, listaTipos) {
  const mapa = new Map();
  const tiposPorId = new Map(
    listaTipos.map((tipo) => [tipo.id, tipo])
  );

  for (const linha of linhas) {
    if (grupoDaLinha(linha) !== "pokemon") continue;

    const id = numero(obterCampo(linha, ["id"]));
    const name = texto(obterCampo(linha, ["name"]));

    if (id == null || !name) continue;

    if (!mapa.has(id)) {
      mapa.set(
        id,
        new Pokemon({
          id,
          name,
          types: [],
          stats: {
            hp: numero(obterCampo(linha, ["stats__hp"])) ?? 0,
            attack:
              numero(obterCampo(linha, ["stats__attack"])) ?? 0,
            defense:
              numero(obterCampo(linha, ["stats__defense"])) ?? 0,
            specialAttack:
              numero(
                obterCampo(linha, ["stats__specialAttack"])
              ) ?? 0,
            specialDefense:
              numero(
                obterCampo(linha, ["stats__specialDefense"])
              ) ?? 0,
            speed:
              numero(obterCampo(linha, ["stats__speed"])) ?? 0,
          },
        })
      );
    }

    const tipoId = numero(
      obterCampo(linha, ["types__id"])
    );

    const tipo = tipoId == null ? null : tiposPorId.get(tipoId);
    const atual = mapa.get(id);

    if (
      tipo &&
      !atual.types.some((item) => item.id === tipo.id)
    ) {
      atual.types.push(tipo);
    }
  }

  return [...mapa.values()].sort((a, b) => a.id - b.id);
}

/**
 * Lê treinadores e relaciona seus Pokémon.
 */
function lerTreinadores(linhas, listaPokemon) {
  const pokemonPorId = new Map(
    listaPokemon.map((p) => [p.id, p])
  );

  const resultado = [];

  for (const linha of linhas) {
    if (grupoDaLinha(linha) !== "trainers") continue;

    const id = numero(obterCampo(linha, ["id"]));
    const name = texto(obterCampo(linha, ["name"]));

    if (id == null || !name) continue;

    const idsPokemon = [
      "pokemonIds__001",
      "pokemonIds__002",
      "pokemonIds__003",
      "pokemonIds__004",
      "pokemonIds__005",
      "pokemonIds__006",
    ]
      .map((coluna) => numero(obterCampo(linha, [coluna])))
      .filter((pokemonId) => pokemonId != null);

    resultado.push({
      id,
      name,
      badges: numero(obterCampo(linha, ["badges"])) ?? 0,
      pokemonIds: idsPokemon,
      pokemon: idsPokemon
        .map((pokemonId) => pokemonPorId.get(pokemonId))
        .filter(Boolean),
    });
  }

  return resultado.sort((a, b) => a.id - b.id);
}

/**
 * Lista todos os Pokémon.
 */
export function listarTodos() {
  return pokemon;
}

/**
 * Busca um Pokémon pelo ID.
 */
export function buscarPorId(id) {
  return pokemon.find((p) => p.id === Number(id)) ?? null;
}

/**
 * Busca Pokémon pelo nome.
 */
export function buscarPorNome(nome) {
  const busca = normalizar(nome);

  if (!busca) return pokemon;

  return pokemon.filter((p) =>
    normalizar(p.name).includes(busca)
  );
}

/**
 * Filtra Pokémon por tipo, nome e treinador.
 */
export function filtrar(tipo = "", nome = "", treinador = "") {
  const buscaNome = normalizar(nome);
  const buscaTipo = normalizar(tipo);
  const buscaTreinador = normalizar(treinador);

  let idsDoTreinador = null;

  if (buscaTreinador) {
    const selecionado = treinadores.find(
      (t) => normalizar(t.name) === buscaTreinador
    );

    idsDoTreinador = new Set(
      selecionado?.pokemonIds ?? []
    );
  }

  return pokemon.filter((p) => {
    const correspondeNome =
      !buscaNome || normalizar(p.name).includes(buscaNome);

    const correspondeTipo =
      !buscaTipo ||
      p.types.some(
        (t) => normalizar(t.name) === buscaTipo
      );

    const correspondeTreinador =
      !idsDoTreinador || idsDoTreinador.has(p.id);

    return (
      correspondeNome &&
      correspondeTipo &&
      correspondeTreinador
    );
  });
}

/**
 * Filtra Pokémon por atributo e intervalo.
 */
export function filtrarPorAtributo(
  atributo,
  valorMin = null,
  valorMax = null
) {
  const atributosValidos = [
    "hp",
    "attack",
    "defense",
    "specialAttack",
    "specialDefense",
    "speed",
  ];

  if (!atributosValidos.includes(atributo)) return [];

  return pokemon.filter((p) => {
    const valor = p.stats[atributo];

    return (
      (valorMin == null || valor >= valorMin) &&
      (valorMax == null || valor <= valorMax)
    );
  });
}

/**
 * Lista os tipos.
 */
export function listarTipos() {
  return tipos;
}

/**
 * Lista os treinadores.
 */
export function listarTreinadores() {
  return treinadores;
}

/**
 * Busca um treinador pelo ID.
 */
export function buscarTreinadorPorId(id) {
  return treinadores.find((t) => t.id === Number(id)) ?? null;
}

/**
 * Lista os Pokémon de um treinador.
 */
export function listarPokemonDoTreinador(id) {
  const treinador = buscarTreinadorPorId(id);
  return treinador ? treinador.pokemon : [];
}
