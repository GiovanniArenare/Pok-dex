
import { useCallback, useEffect, useState } from "react";

/**
 * Mantém os filtros da Pokédex sincronizados com a URL.
 *
 * Exemplo:
 * /?nome=Pikachu&tipo=Electric&treinador=Ash
 *
 * Funcionalidades:
 * - Lê os filtros da URL ao abrir a página.
 * - Atualiza a URL ao aplicar filtros.
 * - Restaura os filtros ao navegar pelo histórico.
 * - Permite limpar todos os filtros.
 */

export default function useFiltrosDaUrl(nomes) {
  const nomesChave = nomes.join("|");

  const lerDaUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);

    return Object.fromEntries(
      nomesChave
        .split("|")
        .filter(Boolean)
        .map((nome) => [nome, params.get(nome) ?? ""])
    );
  }, [nomesChave]);

  const [filtros, setFiltros] = useState(lerDaUrl);

  useEffect(() => {
    const aoNavegar = () => {
      setFiltros(lerDaUrl());
    };

    window.addEventListener("popstate", aoNavegar);

    return () => {
      window.removeEventListener("popstate", aoNavegar);
    };
  }, [lerDaUrl]);

  /**
   * Aplica os filtros e atualiza a URL.
   */
  const aplicarFiltros = useCallback(
    (novos = {}) => {
      const params = new URLSearchParams();

      for (const nome of nomesChave.split("|").filter(Boolean)) {
        const valor = String(novos[nome] ?? "").trim();

        if (valor) {
          params.set(nome, valor);
        }
      }

      const query = params.toString();

      const novaUrl = query
        ? `${window.location.pathname}?${query}${window.location.hash}`
        : `${window.location.pathname}${window.location.hash}`;

      window.history.pushState(null, "", novaUrl);

      setFiltros(lerDaUrl());
    },
    [nomesChave, lerDaUrl]
  );

  /**
   * Limpa os filtros e remove seus parâmetros da URL.
   */
  const limparFiltros = useCallback(() => {
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}${window.location.hash}`
    );

    setFiltros(lerDaUrl());
  }, [lerDaUrl]);

  return {
    filtros,
    aplicarFiltros,
    limparFiltros,
  };
}
