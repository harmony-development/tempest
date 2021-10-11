export class AsyncLock {
  private lock: Set<string>;

  constructor() {
    this.lock = new Set();
  }

  private join(path: string[]) {
    return path.join(`/`);
  }

  has(...path: string[]) {
    return this.lock.has(this.join(path));
  }

  add(...path: string[]) {
    return this.lock.add(this.join(path));
  }

  delete(...path: string[]) {
    return this.lock.delete(this.join(path));
  }

  async run<T>(fn: () => Promise<T>, path: string[]) {
    if (this.has(...path)) {
      console.log(
        `%cpath ${this.join(path)} already exists, no need to fetch`,
        "color: green"
      );
      return;
    }
    console.log(
      `%cpath ${this.join(path)} does not exist, fetching...`,
      "color: yellow;"
    );
    this.add(...path);
    const res = await fn();
    return res;
  }
}
