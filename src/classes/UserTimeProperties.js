// O objetivo desta classe eh fornecer uma estrutura capaz de:
// 1. Registrar novas instancias de um objeto especifico
// 2. A cada instancia registrada, de acordo com sua configuracao, le as propriedades da instancia e as adiciona a heaps
// 3. Fornece um vetor ordenado de cada uma dessas propriedades lidas

import Simulation from "./Simulation";
import Statistics from "./Statistics";

export default class UserTimeProperties {
  // Guarda os heaps das propriedades ordenadas
  userTimes = {}

  // Registra as propriedades desta instancia nas lsitas ordenadas
  registerDeliveryAt(clientId) {
    if (this.userTimes[clientId].pickedUpAt && !this.userTimes[clientId].deliveredAt) {
      this.userTimes[clientId].deliveredAt = Simulation.time;
      Statistics.registerUserTimeToDelivery(this.userTimes[clientId].deliveredAt - this.userTimes[clientId].pickedUpAt)
    }
  }

  registerPickedUpAt(clientId) {
    if (!this.userTimes[clientId].pickedUpAt) {
      this.userTimes[clientId].pickedUpAt = Simulation.time;
      Statistics.registerUserTimeToPickUp(this.userTimes[clientId].pickedUpAt - this.userTimes[clientId].createdAt);
    }
  }

  registerCreatedAt(clientId) {
    if (!this.userTimes[clientId]) {
      const params = {
        createdAt: Simulation.time,
        pickedUpAt: null, 
        deliveredAt: null
      }
      this.userTimes[clientId] = {...params}
    }
  }

  // Retorna a lista ordenada desta propriedade
  get() {
    return this.userTimes;
  }

  // Apaga tudo
  clear() {
    this.userTimes = {}
  }
}
