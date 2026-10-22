
export default class Pokemon {
  constructor({
    id,
    name,
    types = [],
    stats = {},
  }) {
    this.id = String(id ?? "");
    this.name = name ?? "Desconhecido";
    this.types = types;

    this.stats = {
      hp: Number(stats.hp) || 0,
      attack: Number(stats.attack) || 0,
      defense: Number(stats.defense) || 0,
      specialAttack: Number(stats.specialAttack) || 0,
      specialDefense: Number(stats.specialDefense) || 0,
      speed: Number(stats.speed) || 0,
    };
  }

  get nomesTipos() {
    return this.types.map((tipo) => tipo.name);
  }

  get tiposFormatados() {
    return this.nomesTipos.join(", ");
  }

  get totalAtributos() {
    return Object.values(this.stats).reduce(
      (total, valor) => total + valor,
      0
    );
  }
}
