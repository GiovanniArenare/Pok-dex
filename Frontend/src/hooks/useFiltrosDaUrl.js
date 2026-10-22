import { useCallback, useEffect, useState } from "react";

const FILTROS_INICIAIS = {
  nome: "",
  tipo: "",
  treinador: "",
};

function lerFiltrosDaUrl() {
  const parametros = new URLSearchParams(window.location.search);

  return {
    nome: parametros.get("nome") ?? "",
    tipo: parametros.get("tipo") ?? "",
    treinador: parametros.get("treinador") ?? "",
  };
}

export default function useFiltrosDaUrl() {
  const [filtros, setFiltros] = useState(lerFiltrosDaUrl);

  useEffect(() => {
    function atualizarFiltros() {
      setFiltros(lerFiltrosDaUrl());
    }

    window.addEventListener("popstate", atualizarFiltros);

    return () => {
      window.removeEventListener("popstate", atualizarFiltros);
    };
  }, []);

  const aplicarFiltros = useCallback((novosFiltros) => {
    const filtrosAtualizados = {
      ...FILTROS_INICIAIS,
      ...novosFiltros,
    };

    const parametros = new URLSearchParams();

    Object.entries(filtrosAtualizados).forEach(([chave, valor]) => {
      if (String(valor ?? "").trim()) {
        parametros.set(chave, String(valor).trim());
      }
    });

    const query = parametros.toString();
    const novaUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;

    window.history.pushState({}, "", novaUrl);
    setFiltros(filtrosAtualizados);
  }, []);

  const limparFiltros = useCallback(() => {
    window.history.pushState({}, "", window.location.pathname);
    setFiltros({ ...FILTROS_INICIAIS });
  }, []);

  return {
    filtros,
    aplicarFiltros,
    limparFiltros,
  };
}