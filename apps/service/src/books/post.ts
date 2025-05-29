import { middyHandler } from '@/middy.js';
import { Static, Type } from '@sinclair/typebox';
import { buildRequestHandler } from '@verso/command/books/post.js';
import { Book } from '@verso/entity/books/entity.js';
import { createBook } from '@verso/infra/books/service.js';

const eventSchema = Type.Object({
  httpMethod: Type.Literal('POST'),
  body: Type.Omit(Book, ['bookId']),
});
const responseSchema = Book;
const requestHandler = buildRequestHandler({ createBook });

export const handler = middyHandler({
  eventSchema,
  responseSchema,
}).handler<Static<typeof eventSchema>, Static<typeof responseSchema>>(async event => {
  const response = await requestHandler(event.body);
  return response;
});
