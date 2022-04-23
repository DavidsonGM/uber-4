// O objetivo desta classe eh fornecer uma estrutura capaz de:
// 1. Registrar todas as estatísticas de pickUp e Delivery do usuário

export default class Statistics {
    static userTimeToPickUp = []
    static userTimeToDelivery = []
  
    static registerUserTimeToPickUp(timeToPickUp) {
      this.userTimeToPickUp.push(timeToPickUp);
      this.#raiseEvent('userTimeToPickUpListener', this.userTimeToPickUp)
    }
  
    static registerUserTimeToDelivery(timeToDelivery) {
      this.userTimeToDelivery.push(timeToDelivery);
      this.#raiseEvent('userTimeToDeliveryListener', this.userTimeToDelivery)
    }
  
    get() {
      return {
          userTimeToPickUp: this.userTimeToPickUp,
          pickedUpAt: this.pickedUpAt,
          deliveredAt: this.deliveredAt
      }
    }
  
    clear() {
      this.createdAt = null;
      this.pickedUpAt = null;
      this.deliveredAt = null;
    }
  
    static listeners = { userTimeToPickUpListener: [],  userTimeToDeliveryListener: [] }
  
    // Permite observar eventos
    static addEventListener(type, callback) {
      if (this.listeners[type] == undefined)
        throw new Error(
          `A classe IO nao fornece um eventListener do tipo "${type}"`
        )
      this.listeners[type].push(callback)
    }
  
    // Permite levantar eventos
    static #raiseEvent(type, payload) {
      if (this.listeners[type] == undefined)
        throw new Error(
          `Tentativa em IO de levantar evento de tipo inexistente "${type}"`
        )
  
      for (const listener of this.listeners[type]) listener(payload)
    }
  }
  