import "./PainelTreinador.css";

function contarInsignias(insignias) {
  if (Array.isArray(insignias)) return insignias.length;
  if (typeof insignias === "number") return insignias;
  if (typeof insignias === "string" && insignias.trim() !== "") {
    const numero = Number(insignias);
    if (Number.isFinite(numero)) return numero;
    return insignias.split(",").filter(Boolean).length;
  }
  return 0;
}

function PainelTreinador({ treinador, pokemon }) {
  const quantidadeInsignias = contarInsignias(treinador.badges);

  return (
    <section className="painel-treinador" aria-labelledby="painel-treinador-titulo">
      <div className="painel-treinador-cabecalho">
        <div>
          <p className="painel-treinador-sobretitulo">PERFIL DO TREINADOR</p>
          <h2 id="painel-treinador-titulo">{treinador.name}</h2>
        </div>
        <div className="painel-treinador-insignias">
          <span aria-hidden="true">🏅</span>
          <div>
            <strong>{quantidadeInsignias}</strong>
            <small>{quantidadeInsignias === 1 ? "insígnia" : "insígnias"}</small>
          </div>
        </div>
      </div>

      <div className="painel-treinador-equipe">
        <h3>Pokémon relacionados</h3>
        {pokemon.length > 0 ? (
          <div className="painel-treinador-lista">
            {pokemon.map((item) => (
              <div className="painel-treinador-pokemon" key={item.id}>
                <span>#{String(item.id).padStart(3, "0")}</span>
                <strong>{item.name}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p>Não há Pokémon relacionados a este treinador nos dados carregados.</p>
        )}
      </div>
    </section>
  );
}

export default PainelTreinador;
