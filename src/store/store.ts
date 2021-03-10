import { reactive } from "vue";

export abstract class Store<T extends Object> {
  protected state: T;

  constructor(data: T) {
    this.state = reactive(data) as T;
  }
}
