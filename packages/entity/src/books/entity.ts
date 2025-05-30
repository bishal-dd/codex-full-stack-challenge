import { Static, Type } from '@sinclair/typebox';

export const Book = Type.Object({
  bookId: Type.String(),
  title: Type.String(),
  author: Type.String(),
  blurb: Type.String(),
  count: Type.Number(),
  borrowers: Type.Optional(Type.Array(Type.String())),
});

export type Book = Static<typeof Book>;
