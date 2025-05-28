import { fetcher, parser } from '@/api';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { Book } from '@verso/entity/books/entity.js';

const postBook = async (book: Book) => {
  const { bookId, ...rest } = book;

  const response = await fetcher(`books/${bookId}`, {
    method: 'POST',
    body: JSON.stringify(rest),
  });

  return await parser(response, Book);
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postBook,
    onMutate: async newBook => {
      await queryClient.cancelQueries({ queryKey: ['books', newBook.bookId] });
      await queryClient.cancelQueries({ queryKey: ['books'], exact: true });

      const previousBook = queryClient.getQueryData(['books', newBook.bookId]);
      queryClient.setQueryData(['books', newBook.bookId], newBook);

      const previousBooks = Value.Parse(
        Type.Union([Type.Array(Book), Type.Undefined()]),
        queryClient.getQueryData(['books']),
      );
      if (previousBooks) {
        queryClient.setQueryData(
          ['books'],
          previousBooks.map(b => (b.bookId !== newBook.bookId ? b : newBook)),
        );
      }

      return { previousBook, newBook, previousBooks };
    },
    onError: (err, newBook, context) => {
      console.error('error', err, newBook, context);
      queryClient.setQueryData(['books', newBook.bookId], context?.previousBook);
      queryClient.setQueryData(['books'], context?.previousBooks);
    },
    onSettled: async (_res, _err, context) => {
      await queryClient.invalidateQueries({ queryKey: ['books', context.bookId] });
      await queryClient.invalidateQueries({ queryKey: ['books'], exact: true });
    },
  });

  return mutation;
};
