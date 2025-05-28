import type { Book } from '@verso/entity/books/entity.js';

export type ListBooks = () => Promise<Book[]>;
export type CreateBook = (book: Omit<Book, 'bookId'>) => Promise<Book>;
export type UpdateBook = (book: Book) => Promise<Book | undefined>;
export type GetBook = (params: Pick<Book, 'bookId'>) => Promise<Book | undefined>;
