
import { useState } from "react";
import "./FormularioPokemon.css";

const camposAtributos = [
  { nome: "HP", chave: "hp" },
  { nome: "Ataque", chave: "attack" },
  { nome: "Defesa", chave: "defense" },
  { nome: "Ataque especial", chave: "specialAttack" },
  { nome: "Defesa especial", chave: "specialDefense" },
  { nome: "Velocidade", chave: "speed" },
];

const estadoInicial = {
  name: "",
  tipo1: "",
  tipo2: "",
  hp: "",
  attack: "",
  defense: "",
  specialAttack: "",
  specialDefense: "",
  speed: "",
};

function criarEstadoInicial(pokemon) {
  if (!pokemon) {
    return { ...estadoInicial };
  }

  return {
    name: pokemon.name ?? "",
    tipo1: String(pokemon.types?.[0]?.id ?? ""),
    tipo2: String(pokemon.types?.[1]?.id ?? ""),
    hp: String(pokemon.stats?.hp ?? ""),
    attack: String(pokemon.stats?.attack ?? ""),
    defense: String(pokemon.stats?.defense ?? ""),
    specialAttack: String(pokemon.stats?.specialAttack ?? ""),
    specialDefense: String(pokemon.stats?.specialDefense ?? ""),
    speed: String(pokemon.stats?.speed ?? ""),
  };
}

function FormularioPokemon({
  tipos,
  pokemonEdicao = null,
  onCadastrar,
  onEditar,
  onCancelar,
}) {
  const modoEdicao = pokemonEdicao !== null;

  const [formulario, setFormulario] = useState(() =>
    criarEstadoInicial(pokemonEdicao)
  );

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  function atualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();
    setErro("");

    const tiposSelecionados = [
      formulario.tipo1,
      formulario.tipo2,
    ].filter(Boolean);

    if (tiposSelecionados.length === 0) {
      setErro("Selecione pelo menos um tipo.");
      return;
    }

    if (
      new Set(tiposSelecionados).size !==
      tiposSelecionados.length
    ) {
      setErro("Selecione tipos diferentes.");
      return;
    }

    const pokemon = {
      name: formulario.name.trim(),
      types: tipos
        .filter((tipo) =>
          tiposSelecionados.includes(String(tipo.id))
        )
        .map((tipo) => ({
          id: tipo.id,
          name: tipo.name,
        })),
      stats: Object.fromEntries(
        camposAtributos.map(({ chave }) => [
          chave,
          Number(formulario[chave]),
        ])
      ),
    };

    try {
      setSalvando(true);

      if (modoEdicao) {
        await onEditar(pokemonEdicao.id, pokemon);
      } else {
        await onCadastrar(pokemon);
      }

      setFormulario({ ...estadoInicial });
    } catch (error) {
      setErro(
        error.message ||
          (modoEdicao
            ? "Erro ao editar Pokémon."
            : "Erro ao cadastrar Pokémon.")
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form
      className="formulario-pokemon"
      onSubmit={enviarFormulario}
    >
      <h2>
        {modoEdicao
          ? `Editar ${pokemonEdicao.name}`
          : "Cadastrar Pokémon"}
      </h2>

      <p>
        {modoEdicao
          ? `Altere as informações do Pokémon #${String(
              pokemonEdicao.id
            ).padStart(3, "0")}.`
          : "Preencha as informações do novo Pokémon."}
      </p>

      {erro && (
        <p
          className="formulario-pokemon-erro"
          role="alert"
        >
          {erro}
        </p>
      )}

      <div className="formulario-pokemon-campos">
        <label>
          Nome
          <input
            type="text"
            name="name"
            maxLength="100"
            required
            value={formulario.name}
            onChange={atualizarCampo}
          />
        </label>

        <label>
          Tipo principal
          <select
            name="tipo1"
            required
            value={formulario.tipo1}
            onChange={atualizarCampo}
          >
            <option value="">
              Selecione um tipo
            </option>

            {tipos.map((tipo) => (
              <option
                key={tipo.id}
                value={tipo.id}
              >
                {tipo.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tipo secundário (opcional)
          <select
            name="tipo2"
            value={formulario.tipo2}
            onChange={atualizarCampo}
          >
            <option value="">Nenhum</option>

            {tipos.map((tipo) => (
              <option
                key={tipo.id}
                value={tipo.id}
              >
                {tipo.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <h3>Atributos</h3>

      <div className="formulario-pokemon-atributos">
        {camposAtributos.map(({ nome, chave }) => (
          <label key={chave}>
            {nome}
            <input
              type="number"
              name={chave}
              min="0"
              max="255"
              step="1"
              required
              value={formulario[chave]}
              onChange={atualizarCampo}
            />
          </label>
        ))}
      </div>

      <div className="formulario-pokemon-acoes">
        <button
          type="button"
          onClick={onCancelar}
          disabled={salvando}
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={salvando}
        >
          {salvando
            ? modoEdicao
              ? "Salvando..."
              : "Cadastrando..."
            : modoEdicao
              ? "Salvar alterações"
              : "Cadastrar Pokémon"}
        </button>
      </div>
    </form>
  );
}

export default FormularioPokemon;
