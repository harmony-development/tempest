import { reactive } from '@nuxtjs/composition-api'

export abstract class Store<T extends Object> {
  state: T

  constructor(data: T) {
    this.state = reactive(data) as T
  }
}
