import { useEffect, useState } from "react";
import "./PainelFiltros.css";

function PainelFiltros({
  filtros,
  tipos,
  treinadores,
  onFiltrar,
  onLimpar,
}) {
  const [formulario, setFormulario] = useState(filtros);

  useEffect(() => {
    setFormulario(filtros);
  }, [filtros]);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((atual) => ({
      ...atual,
      [name]: value,
    }));
  }

  function enviarFormulario(evento) {
    evento.preventDefault();
    onFiltrar(formulario);
  }

  function limpar() {
    setFormulario({
      nome: "",
      tipo: "",
      treinador: "",
    });

    onLimpar();
  }

  return (
    <form className="painel-filtros" onSubmit={enviarFormulario}>
      <div className="campo-filtro">
        <label htmlFor="filtro-nome">Nome do Pokémon</label>
        <input
          id="filtro-nome"
          name="nome"
          type="search"
          placeholder="Ex.: Pikachu"
          value={formulario.nome}
          onChange={atualizarCampo}
        />
      </div>

      <div className="campo-filtro">
        <label htmlFor="filtro-tipo">Tipo</label>
        <select
          id="filtro-tipo"
          name="tipo"
          value={formulario.tipo}
          onChange={atualizarCampo}
        >
          <option value="">Todos os tipos</option>

          {tipos.map((tipo) => (
            <option key={tipo.id} value={tipo.name}>
              {tipo.name}
            </option>
          ))}
        </select>
      </div>

      <div className="campo-filtro">
        <label htmlFor="filtro-treinador">Treinador</label>
        <select
          id="filtro-treinador"
          name="treinador"
          value={formulario.treinador}
          onChange={atualizarCampo}
        >
          <option value="">Todos os treinadores</option>

          {treinadores.map((treinador) => (
            <option key={treinador.id} value={treinador.name}>
              {treinador.name}
            </option>
          ))}
        </select>
      </div>

      <div className="botoes-filtros">
        <button className="botao-filtrar" type="submit">
          Buscar
        </button>

        <button
          className="botao-limpar"
          type="button"
          onClick={limpar}
        >
          Limpar
        </button>
      </div>
    </form>
  );
}

export default PainelFiltros;