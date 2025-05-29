import { fetcher, parser } from '@/api';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { Book } from '@verso/entity/books/entity.js';

const createBook = async (input: Omit<Book, 'bookId'>) => {
  const book = {
    bookId: crypto.randomUUID(),
    ...input,
  };
  const response = await fetcher(`books`, {
    method: 'POST',
    body: JSON.stringify(book),
  });

  return await parser(response, Book); // Expect server to return the full Book with bookId
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBook,
    onMutate: async _newBookInput => {
      await queryClient.cancelQueries({ queryKey: ['books'], exact: true });

      const previousBooks = Value.Parse(
        Type.Union([Type.Array(Book), Type.Undefined()]),
        queryClient.getQueryData(['books']),
      );

      return { previousBooks };
    },
    onError: (err, _newBook, context) => {
      console.error('createBook error', err, context);
      queryClient.setQueryData(['books'], context?.previousBooks);
    },
    onSuccess: newBook => {
      const existing = Value.Parse(
        Type.Union([Type.Array(Book), Type.Undefined()]),
        queryClient.getQueryData(['books']),
      );
      if (Array.isArray(existing)) {
        queryClient.setQueryData(['books'], [...existing, newBook]);
      } else {
        queryClient.setQueryData(['books'], [newBook]);
      }

      queryClient.setQueryData(['books', newBook.bookId], newBook);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['books'], exact: true });
    },
  });

  return mutation;
};
