import type { Book } from '@verso/entity/books/entity.js';
import type { CreateBook } from './service.js';

export const buildRequestHandler = ({ createBook }: { createBook: CreateBook }) => {
  return async (book: Omit<Book, 'bookId'>): Promise<Book> => {
    const books = await createBook(book);

    return books;
  };
};
