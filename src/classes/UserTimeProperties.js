// O objetivo desta classe eh fornecer uma estrutura capaz de:
// 1. Registrar os tempos dos usuários

import Simulation from "./Simulation";
import Statistics from "./Statistics";

export default class UserTimeProperties {
  userTimes = {}

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

  get() {
    return this.userTimes;
  }

  // Apaga tudo
  clear() {
    this.userTimes = {}
  }
}
