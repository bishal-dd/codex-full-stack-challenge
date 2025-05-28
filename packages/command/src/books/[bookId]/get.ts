import type { Book } from '@verso/entity/books/entity.js';
import createHttpError from 'http-errors';
import type { GetBook } from '../service.js';

export const buildRequestHandler = ({ getBook }: { getBook: GetBook }) => {
  return async (params: Pick<Book, 'bookId'>): Promise<Book> => {
    const book = await getBook(params);

    if (!book) {
      throw createHttpError.NotFound(JSON.stringify({ message: 'Book not found' }));
    }

    return book;
  };
};
