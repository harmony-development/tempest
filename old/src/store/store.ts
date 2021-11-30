import { reactive } from "vue";

export abstract class Store<T extends Object> {
  state: T;

  constructor(data: T) {
    this.state = reactive(data) as T;
  }
}
