// O objetivo desta classe eh fornecer uma estrutura capaz de:
// 1. Registrar novas instancias de um objeto especifico
// 2. A cada instancia registrada, de acordo com sua configuracao, le as propriedades da instancia e as adiciona a heaps
// 3. Fornece um vetor ordenado de cada uma dessas propriedades lidas

export default class Statistics {
    // Guarda os heaps das propriedades ordenadas
    static userTimeToPickUp = []
    static userTimeToDelivery = []
  
    // Essa configuracao eh um objeto que deve seguir a seguinte sintaxe:
    // Cada chave deste objeto deve ser o nome de uma das propriedades que vao ser lidas das instancias registradas
    // As chaves devem apontar para um metodo que descreve como ordenar seus valores (eh exatamente o metodo que vai ser passado como parametro para o Heap)
  
    // Registra as propriedades desta instancia nas lsitas ordenadas
    static registerUserTimeToPickUp(timeToPickUp) {
      this.userTimeToPickUp.push(timeToPickUp);
      this.#raiseEvent('userTimeToPickUpListener', this.userTimeToPickUp)
    }
  
    static registerUserTimeToDelivery(timeToDelivery) {
      this.userTimeToDelivery.push(timeToDelivery);
      this.#raiseEvent('userTimeToDeliveryListener', this.userTimeToDelivery)
    }
  
    // Retorna a lista ordenada desta propriedade
    get() {
      return {
          userTimeToPickUp: this.userTimeToPickUp,
          pickedUpAt: this.pickedUpAt,
          deliveredAt: this.deliveredAt
      }
    }
  
    // Apaga tudo
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
  