export type Defined<T> = Exclude<T, undefined>;

export type Oneof = { oneofKind: string | undefined };

export type OneofHandler<T extends Oneof> = {
  [key in Defined<T["oneofKind"]>]?: (
    host: string,
    ev: T & { oneofKind: key }
  ) => any;
};

export class Handler<T extends Oneof> {
  handlers: OneofHandler<T>;

  constructor(handlers: OneofHandler<T>) {
    this.handlers = handlers;
  }

  handle(host: string, input: T) {
    if (!input.oneofKind) return;
    const h = this.handlers[input.oneofKind as keyof typeof this.handlers];
    h?.(host, input as any);
  }
}
