import { middyHandler } from '@/middy.js';
import { buildRequestHandler } from '@verso/command/books/get.js';
import { Book } from '@verso/entity/books/entity.js';
import { listBooks } from '@verso/infra/books/service.js';
import { Static, Type } from '@sinclair/typebox';

const eventSchema = Type.Object({
  httpMethod: Type.Literal('GET'),
});
const responseSchema = Type.Array(Book);
const requestHandler = buildRequestHandler({ listBooks });

export const handler = middyHandler({
  eventSchema,
  responseSchema,
}).handler<Static<typeof eventSchema>, Static<typeof responseSchema>>(async () => {
  const response = await requestHandler();
  return response;
});
