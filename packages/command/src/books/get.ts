import type { Book } from '@verso/entity/books/entity.js';
import type { ListBooks } from './service.js';

export const buildRequestHandler = ({ listBooks }: { listBooks: ListBooks }) => {
  return async (): Promise<Book[]> => {
    const books = await listBooks();

    return books;
  };
};
