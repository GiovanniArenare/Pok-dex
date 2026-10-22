
import { useEffect, useState } from "react";
import { carregarCsv } from "../services/pokedexService";

/**
 * Hook responsável por carregar e disponibilizar os dados
 * da Pokédex para os componentes React.
 *
 * Retorna:
 * - pokemon: lista de Pokémon.
 * - tipos: tipos disponíveis.
 * - treinadores: treinadores cadastrados.
 * - carregando: estado do carregamento.
 * - erro: mensagem de erro, se houver.
 */
export default function usePokemon() {
  const [pokemon, setPokemon] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [treinadores, setTreinadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      setCarregando(true);
      setErro(null);

      try {
        const dados = await carregarCsv();

        if (!ativo) return;

        setPokemon(dados.pokemon ?? []);
        setTipos(dados.tipos ?? []);
        setTreinadores(dados.treinadores ?? []);
      } catch (error) {
        if (!ativo) return;

        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar os dados da Pokédex."
        );

        setPokemon([]);
        setTipos([]);
        setTreinadores([]);
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
