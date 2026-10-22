import { useEffect, useState } from "react";
import { carregarCsv } from "../services/pokedexService";

export default function usePokemon() {
  const [pokemon, setPokemon] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [treinadores, setTreinadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        setCarregando(true);
        setErro("");

        const dados = await carregarCsv();

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

    carregarDados();

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