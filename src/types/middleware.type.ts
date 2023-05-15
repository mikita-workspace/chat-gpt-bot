export type GrammyMiddlewareFn<Context> = (
  ctx: Context,
  next: () => Promise<void>,
) => Promise<void>;
