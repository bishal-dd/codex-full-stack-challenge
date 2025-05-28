import { middyHandler } from '@/middy.js';
import { Static, Type } from '@sinclair/typebox';
import { buildRequestHandler } from '@verso/command/books/[bookId]/post.js';
import { Book } from '@verso/entity/books/entity.js';
import { updateBook } from '@verso/infra/books/service.js';

const eventSchema = Type.Object({
  httpMethod: Type.Literal('POST'),
  pathParameters: Type.Object({ bookId: Type.String() }),
  body: Type.Omit(Book, ['bookId']),
});

const responseSchema = Book;
const requestHandler = buildRequestHandler({ updateBook });

export const handler = middyHandler({
  eventSchema,
  responseSchema,
}).handler<Static<typeof eventSchema>, Static<typeof responseSchema>>(async event => {
  const response = await requestHandler({ ...event.body, bookId: event.pathParameters.bookId });

  return response;
});
