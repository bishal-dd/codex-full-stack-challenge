import { middyHandler } from '@/middy.js';
import { buildRequestHandler } from '@verso/command/books/[bookId]/get.js';
import { Book } from '@verso/entity/books/entity.js';
import { getBook } from '@verso/infra/books/service.js';
import { Static, Type } from '@sinclair/typebox';

const eventSchema = Type.Object({
  httpMethod: Type.Literal('GET'),
  pathParameters: Type.Object({ bookId: Type.String() }),
});
const responseSchema = Book;
const requestHandler = buildRequestHandler({ getBook });

export const handler = middyHandler({
  eventSchema,
  responseSchema,
}).handler<Static<typeof eventSchema>, Static<typeof responseSchema>>(async event => {
  const response = await requestHandler(event.pathParameters);
  return response;
});
