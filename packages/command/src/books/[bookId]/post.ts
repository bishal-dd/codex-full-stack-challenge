import type { Book } from '@verso/entity/books/entity.js';
import createHttpError from 'http-errors';
import type { UpdateBook } from '../service.js';

export const buildRequestHandler = ({ updateBook }: { updateBook: UpdateBook }) => {
  return async (book: Book): Promise<Book> => {
    const response = await updateBook(book);

    if (!response) {
      throw createHttpError.NotFound(JSON.stringify({ message: 'Book not found' }));
    }

    return response;
  };
};
