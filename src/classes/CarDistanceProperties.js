// O objetivo desta classe eh fornecer uma estrutura capaz de:
// 1. Registrar novas instancias de um objeto especifico
// 2. A cada instancia registrada, de acordo com sua configuracao, le as propriedades da instancia e as adiciona a heaps
// 3. Fornece um vetor ordenado de cada uma dessas propriedades lidas

export default class CarDistanceProperties {
    // Guarda os heaps das propriedades ordenadas
    carDistances = {}
  
    // Registra as propriedades desta instancia nas lsitas ordenadas
    registerDistance(carId, distance) {
      this.carDistances[carId].push(distance) 
    }
  
  
    registerCreateCarDistance(carId) {
      if (!this.carDistances[carId]) {
        this.carDistances[carId] = []
      }
    }
  
    // Retorna a lista ordenada desta propriedade
    get() {
      return this.carDistances;
    }
  
    // Apaga tudo
    clear() {
      this.carDistances = {}
    }
  }
  