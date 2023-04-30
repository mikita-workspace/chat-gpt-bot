export type TelegrafMiddlewareFn<Context> = (
  ctx: Context,
  next: () => Promise<void>,
) => Promise<void>;
