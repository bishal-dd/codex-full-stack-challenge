import { Static, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { Book } from '@verso/entity/books/entity.js';

export const BookRecord = Type.Object({
  PK: Type.String(), // B#bookId
  SK: Type.String(), // B#bookId
  GSI1PK: Type.Literal('BOOK'),
  GSI1SK: Type.Literal('BOOK'),
  book: Book,
});

export type BookRecord = Static<typeof BookRecord>;

export function toBookRecord(book: Book) {
  return {
    ...toBookRecordKey(book),
    ...toBookRecordGsi1Key(book),
    book: Value.Parse(Book, book),
  };
}

export function toBookRecordKey({ bookId }: { bookId: string }) {
  return {
    PK: `B#${bookId}`,
    SK: `B#${bookId}`,
  };
}

export function toBookRecordGsi1Key(_: object) {
  return {
    GSI1PK: 'BOOK',
    GSI1SK: 'BOOK',
  };
}
