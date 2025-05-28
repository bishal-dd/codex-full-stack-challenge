import middy from '@middy/core';
import { Static, TSchema } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import createHttpError from 'http-errors';

export const validator = <E extends TSchema, R extends TSchema>({
  eventSchema,
  responseSchema,
}: {
  eventSchema: E;
  responseSchema: R;
}): middy.MiddlewareObj<Static<E>, Static<R>> => {
  const compiledEventSchema = TypeCompiler.Compile(eventSchema);
  const compiledResponseSchema = TypeCompiler.Compile(responseSchema);

  const before: middy.MiddlewareFn<unknown, Static<E>> = async (request): Promise<Static<E>> => {
    const errors = Array.from(compiledEventSchema.Errors(request.event));
    if (errors.length) {
      throw createHttpError.BadRequest(JSON.stringify({ message: 'Invalid request shape', errors }));
    }

    return Promise.resolve();
  };

  const after: middy.MiddlewareFn<unknown, Static<E>> = async (request): Promise<Static<E>> => {
    const errors = Array.from(compiledResponseSchema.Errors(request.response));
    if (errors.length) {
      throw createHttpError.InternalServerError(JSON.stringify({ message: 'Unexpected response shape', errors }));
    }

    return Promise.resolve();
  };

  return {
    name: 'validator',
    before,
    after,
  };
};
