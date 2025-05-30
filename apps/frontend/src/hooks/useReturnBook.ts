import { fetcher, parser } from '@/api';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { Book } from '@verso/entity/books/entity.js';

type ReturnPayload = {
  userId: string;
  book: Book;
};

const returnBook = async ({ book, userId }: ReturnPayload): Promise<Book> => {
  const borrowers = book.borrowers ?? [];

  if (!borrowers.includes(userId)) {
    throw new Error('User has not borrowed this book');
  }

  const updatedBook: Book = {
    ...book,
    borrowers: borrowers.filter(b => b !== userId),
    count: book.count + 1,
  };

  const response = await fetcher(`books/${book.bookId}`, {
    method: 'POST',
    body: JSON.stringify(updatedBook),
  });

  return await parser(response, Book);
};

export const useReturnBook = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: returnBook,
    onMutate: async ({ book }) => {
      await queryClient.cancelQueries({ queryKey: ['books', book.bookId] });
      await queryClient.cancelQueries({ queryKey: ['books'], exact: true });

      const previousBook = queryClient.getQueryData(['books', book.bookId]);
      const previousBooks = Value.Parse(
        Type.Union([Type.Array(Book), Type.Undefined()]),
        queryClient.getQueryData(['books']),
      );

      return { previousBook, previousBooks, bookId: book.bookId };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousBook) {
        queryClient.setQueryData(['books', context.bookId], context.previousBook);
      }
      if (context?.previousBooks) {
        queryClient.setQueryData(['books'], context.previousBooks);
      }
    },
    onSuccess: updatedBook => {
      queryClient.setQueryData(['books', updatedBook.bookId], updatedBook);

      const existingBooks = Value.Parse(
        Type.Union([Type.Array(Book), Type.Undefined()]),
        queryClient.getQueryData(['books']),
      );

      if (existingBooks) {
        queryClient.setQueryData(
          ['books'],
          existingBooks.map(b => (b.bookId === updatedBook.bookId ? updatedBook : b)),
        );
      }
    },
    onSettled: async (_data, _error, _variables, context) => {
      if (context?.bookId) {
        await queryClient.invalidateQueries({ queryKey: ['books', context.bookId] });
      }
      await queryClient.invalidateQueries({ queryKey: ['books'], exact: true });
    },
  });

  return mutation;
};
