import { fetcher, parser } from '@/api';
import { Type } from '@sinclair/typebox';
import { useQuery, type QueryFunction } from '@tanstack/vue-query';
import { Book } from '@verso/entity/books/entity.js';
import type { MaybeRefDeep } from 'node_modules/@tanstack/vue-query/build/modern/types';
import { computed } from 'vue';
import { useAuth } from './useAuth';

type QueryKey = ['books'];

const fetchBooks: QueryFunction<Book[] | undefined, QueryKey> = async () => {
  const response = await fetcher('books', {
    method: 'GET',
  });

  return await parser(response, Type.Array(Book));
};

export const useFetchBooks = () => {
  const { isAuthenticated } = useAuth();
  const queryKey: MaybeRefDeep<QueryKey> = ['books'];
  const { data: books, ...rest } = useQuery({
    queryKey,
    queryFn: fetchBooks,
    enabled: computed(() => !!isAuthenticated()),
  });

  return {
    books,
    ...rest,
  };
};
