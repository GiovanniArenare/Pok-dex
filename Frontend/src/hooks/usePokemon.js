
import { useEffect, useState } from "react";
import { carregarDados } from "../services/pokedexService";

export default function usePokemon() {
  const [pokemon, setPokemon] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [treinadores, setTreinadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function buscarDados() {
      try {
        setCarregando(true);
        setErro("");

        const dados = await carregarDados();

        if (!ativo) return;

        setPokemon(dados.pokemon);
        setTipos(dados.tipos);
        setTreinadores(dados.treinadores);
      } catch (error) {
        console.error("Erro ao carregar a Pokédex:", error);

        if (ativo) {
          setErro(
            error.message || "Não foi possível carregar os Pokémon."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    buscarDados();

    return () => {
      ativo = false;
    };
  }, []);

  return {
    pokemon,
    tipos,
    treinadores,
    carregando,
    erro,
  };
}
