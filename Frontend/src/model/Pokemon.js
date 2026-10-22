
/**
 * Representa um Pokémon lido do CSV.
 *
 * Campos mapeados:
 * - __id -> id
 * - __name -> name
 * - __stats__hp -> stats.hp
 * - __stats__attack -> stats.attack
 * - __stats__defense -> stats.defense
 * - __stats__specialAttack -> stats.specialAttack
 * - __stats__specialDefense -> stats.specialDefense
 * - __stats__speed -> stats.speed
 * - __types__id / __types__name -> types
 *
 * Os Pokémon podem possuir um ou dois tipos.
 */

export default class Pokemon {
  id = "";
  name = "";

  types = [];

  stats = {
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  };

  /**
   * Constrói um Pokémon a partir de seus dados.
   */
  constructor(dados = {}) {
    this.id = Number(dados.id) || "";
    this.name = dados.name ?? "";

    this.types = Array.isArray(dados.types)
      ? dados.types.map((tipo) => ({
          id: Number(tipo.id) || 0,
          name: tipo.name ?? "",
        }))
      : [];

    this.stats = {
      hp: this.converterAtributo(dados.stats?.hp),
      attack: this.converterAtributo(dados.stats?.attack),
      defense: this.converterAtributo(dados.stats?.defense),
      specialAttack: this.converterAtributo(
        dados.stats?.specialAttack
      ),
      specialDefense: this.converterAtributo(
        dados.stats?.specialDefense
      ),
      speed: this.converterAtributo(dados.stats?.speed),
    };
  }

  /**
   * Converte um atributo para número.
   * Valores ausentes ou inválidos são tratados como zero.
   */
  converterAtributo(valor) {
    const numero = Number(valor);
    return valor !== "" && valor != null && Number.isFinite(numero)
      ? numero
      : 0;
  }

  /**
   * Retorna os nomes dos tipos do Pokémon.
   * Ex.: ["Grass", "Poison"].
   */
  get nomesTipos() {
    return this.types.map((tipo) => tipo.name);
  }

  /**
   * Retorna os nomes dos tipos em uma única string.
   * Ex.: "Grass / Poison".
   */
  get tiposFormatados() {
    return this.nomesTipos.join(" / ");
  }

  /**
   * Calcula a soma dos seis atributos básicos.
   */
  get totalAtributos() {
    return (
      this.stats.hp +
      this.stats.attack +
      this.stats.defense +
      this.stats.specialAttack +
      this.stats.specialDefense +
      this.stats.speed
    );
  }
}
