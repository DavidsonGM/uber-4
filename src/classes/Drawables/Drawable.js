import { getDistance } from '../../helpers/vectorDistance'
import IO from '../IO'
import theme from '../../configuration/theme'
import appConfig from '../../configuration/appConfig'
import seedGraph from '../../helpers/seedGraph'

const { generalAnimationSpeed } = theme
const { maxFramesPerSecond } = appConfig

// Classe que define uma entidade capaz de ser desenhada em tela
export default class Drawable {
  // Um objeto que vai guardar referencia para todas as instancias de drawable
  // A chave eh uma string com o nome de uma subclasse de drawable (como Edge, etc), os valores sao outro objeto
  // Esse outro objeto tem como chave o id de cada instancia, e aponta para a instancia correspondente
  static drawableInstances = {}

  static listeners = { resetMap: [] }

  // Quais animacoes estao sendo executadas neste drawable
  animations = []

  // Callbacks para executar no momento da destruicao deste objeto
  onDestroy = []

  static createOrGet(id, ...rawProperties) {
    const properties = this.nameProperties(...rawProperties)

    // Verifica se ja exist euma instancia com o id fornecido
    if (id && this.instances[id] != undefined) {
      const existingDrawable = this.instances[id]

      // Compara a instancia existente com as propriedades fornecidas
      const result = existingDrawable.compareTo(properties)

      if (result === true) return existingDrawable

      throw new Error(
        `Tentativa de inserir nova instancia de "${
          this.name
        }" com id repetido, mas o campo "${result}" difere.\nValor preexistente: ${JSON.stringify(
          existingDrawable[result]
        )}. Valor novo ${JSON.stringify(properties[result])}`
      )
    }

    return new this(id, ...rawProperties)
  }

  // Caso esteja apagando tudo, sera true
  static isErasing = false

  constructor(id, properties) {
    // Keep the properties
    this.id = id ?? Drawable.generateId(this)
    Object.assign(this, properties)

    // Registrar drawable
    this.constructor.instances[this.id] = this
  }

  // Retorna o objeto que armazena todas as instancias da classe de this
  static get instances() {
    if (Drawable.drawableInstances[this.name] == undefined)
      Drawable.drawableInstances[this.name] = {}

    return Drawable.drawableInstances[this.name]
  }

  static set instances(value) {
    Drawable.drawableInstances[this.name] = value
  }

  // Permite saber a distancia do cursor ate este drawable
  get distanceFromMouse() {
    // Deve possuir coordenadas x e y
    if (this.x == undefined || this.y == undefined)
      throw new Error(
        `Impossivel determinar distancia do cursor para Drawable de classe "${this.constructor.name}", que nao possui coordenadas x e y`
      )

    return getDistance(this, IO.mouse.mapCoords)
  }

  // Permite alterar o valor de uma propriedade do drawable ao longo de multiplos frames, dada uma condicao
  animate({ property, min, max, condition, speed = generalAnimationSpeed }) {
    // Descobre o quato alterar a cada frame
    const frameAlteration = (max - min) / speed / maxFramesPerSecond

    this.animations.push(() => {
      if (condition()) {
        // Soma o alteration
        if (this[property] != max)
          this[property] = Math.min(max, this[property] + frameAlteration)
      } else {
        // Subtrai o alteration
        if (this[property] != min)
          this[property] = Math.max(min, this[property] - frameAlteration)
      }
    })
  }

  // Compara this com o objeto fornecido, e retorna true se todas suas propriedades coincidirem
  // Se alguma for diferente, retorna o seu nome
  compareTo(otherObject) {
    for (const property in otherObject) {
      if (property != 'id' && this[property] != otherObject[property])
        return property
    }

    return true
  }

  // Abstract
  // Permite desenhar na tela
  draw(drawer) {
    throw new Error('Este método deve ser implementado por uma classe filho')
  }

  // Permite agir dentro da simulacao
  simulationStep(deltaTime) {}

  destroy() {
    // Limpa as referencias deste objeto
    this.onDestroy.forEach((callback) => callback())

    // Remove a referencia principal
    delete Drawable.drawableInstances[this.constructor.name][this.id]

    // Destroi as propriedades
    Object.keys(this).forEach((property) => delete this[property])
  }

  static eraseAllInstances() {
    this.isErasing = true

    this.raiseEvent('resetMap')

    // Avisa cada classe que vai apagar
    for (const drawableClassInstances of Object.values(
      this.drawableInstances
    )) {
      const drawableClass = Object.values(drawableClassInstances)[0]
        ?.constructor

      if (drawableClass?.resetMap != undefined) drawableClass.resetMap()
    }

    this.isErasing = false
  }

  static generateNewMap() {
    this.eraseAllInstances()

    seedGraph()
  }

  // Permite observar eventos
  static addEventListener(type, callback) {
    if (this.listeners[type] == undefined)
      throw new Error(
        `A classe ${this.name} nao fornece um eventListener do tipo "${type}"`
      )

    this.listeners[type].push(callback)
  }

  // Permite levantar eventos
  static raiseEvent(type, payload) {
    if (this.listeners[type] == undefined)
      throw new Error(
        `Tentativa em ${this.name} de levantar evento de tipo inexistente "${type}"`
      )

    for (const listener of this.listeners[type]) listener(payload)
  }

  // Permite observar eventos
  static removeEventListener(type, callback) {
    if (this.listeners[type] == undefined)
      throw new Error(
        `A classe ${this.name} nao fornece um eventListener do tipo "${type}"`
      )

    const index = this.listeners[type].indexOf(callback)

    if (index == -1) return

    this.listeners[type].splice(index, 1)
  }

  // Gera um id valido para uma nova instancia desta clase
  static generateId(callingInstance) {
    const callingClass = callingInstance?.constructor ?? this

    let newId

    const instanceArray = Drawable.drawableInstances[callingClass.name]

    do {
      newId = Math.round(Math.random() * 99999)
    } while (instanceArray && instanceArray[newId] != undefined)

    return newId
  }
}
