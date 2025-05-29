import { Static, Type } from '@sinclair/typebox';

export const Book = Type.Object({
  bookId: Type.String(),
  title: Type.String(),
  author: Type.String(),
  blurb: Type.String(),
  count: Type.Number(),
});

export type Book = Static<typeof Book>;
