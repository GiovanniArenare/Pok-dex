
import { useEffect, useState } from "react";
import "./PainelFiltros.css";

function PainelFiltros({
  filtros = {},
  tipos = [],
  treinadores = [],
  onFiltrar,
  onLimpar,
}) {
  const [form, setForm] = useState({
    nome: "",
    tipo: "",
    treinador: "",
    ...filtros,
  });

  useEffect(() => {
    setForm({
      nome: "",
      tipo: "",
      treinador: "",
      ...filtros,
    });
  }, [filtros]);

  const alterar = (e) => {
    const { name, value } = e.target;

    setForm((atual) => ({
      ...atual,
      [name]: value,
    }));
  };

  const enviar = (e) => {
    e.preventDefault();
    onFiltrar?.(form);
  };

  const limpar = () => {
    const filtrosVazios = {
      nome: "",
      tipo: "",
      treinador: "",
    };

    setForm(filtrosVazios);
    onLimpar?.();
  };

  return (
    <aside className="painel-filtros">
      <div className="filtros-cabecalho">
        <div className="filtros-icone">☷</div>

        <div>
          <h2>Filtros</h2>
          <p>Encontre seu Pokémon</p>
        </div>
      </div>

      <form onSubmit={enviar}>
        <div className="grupo">
          <label htmlFor="filtro-nome">
            Nome do Pokémon
          </label>

          <div className="filtro-input-wrapper">
            <span className="filtro-input-icone">⌕</span>

            <input
              id="filtro-nome"
              type="search"
              name="nome"
              placeholder="Ex.: Pikachu"
              value={form.nome ?? ""}
              onChange={alterar}
            />
          </div>
        </div>

        <div className="grupo">
          <label htmlFor="filtro-tipo">Tipo</label>

          <select
            id="filtro-tipo"
            name="tipo"
            value={form.tipo ?? ""}
            onChange={alterar}
          >
            <option value="">Todos os tipos</option>

            {tipos.map((tipo) => (
              <option key={tipo.id} value={tipo.name}>
                {tipo.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grupo">
          <label htmlFor="filtro-treinador">
            Treinador
          </label>

          <select
            id="filtro-treinador"
            name="treinador"
            value={form.treinador ?? ""}
            onChange={alterar}
          >
            <option value="">Todos os treinadores</option>

            {treinadores.map((treinador) => (
              <option
                key={treinador.id}
                value={treinador.name}
              >
                {treinador.name}
              </option>
            ))}
          </select>
        </div>

        <div className="botoes">
          <button type="submit" className="botao-filtrar">
            <span>⌕</span>
            Aplicar filtros
          </button>

          <button
            type="button"
            className="botao-limpar"
            onClick={limpar}
          >
            Limpar filtros
          </button>
        </div>
      </form>

      <div className="filtros-dica">
        <span>💡</span>
        <p>
          Dica: combine nome, tipo e treinador para encontrar
          exatamente quem procura.
        </p>
      </div>
    </aside>
  );
}

export default PainelFiltros;
