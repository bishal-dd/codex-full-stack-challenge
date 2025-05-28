import { fetcher, parser } from '@/api';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { useQuery, useQueryClient, type QueryFunction } from '@tanstack/vue-query';
import { Book } from '@verso/entity/books/entity.js';
import type { MaybeRefDeep } from 'node_modules/@tanstack/vue-query/build/modern/types';
import { computed, type ComputedRef } from 'vue';
import { useAuth } from './useAuth';

type QueryKey = ['books', string | undefined];

const fetchBook: QueryFunction<Book | undefined, QueryKey> = async ({ queryKey }) => {
  const bookId = queryKey[1];

  const response = await fetcher(`books/${bookId}`, {
    method: 'GET',
  });

  return await parser(response, Book);
};

export const useFetchBook = (bookId: ComputedRef<string | undefined>) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const books = Value.Parse(Type.Union([Type.Array(Book), Type.Undefined()]), queryClient.getQueryData(['books']));
  const existingBook = books?.find(book => book.bookId === bookId.value);

  if (existingBook) {
    queryClient.setQueryData(['books', bookId.value], existingBook);
  }

  const queryKey: MaybeRefDeep<QueryKey> = ['books', bookId];
  const { data: book, ...rest } = useQuery({
    queryKey,
    queryFn: fetchBook,
    enabled: computed(() => !!bookId.value && !!isAuthenticated()),
  });

  return {
    book,
    ...rest,
  };
};
