import { useBookId } from './useBookId';
import { useFetchBook } from './useFetchBook';

export function useCurrentBook() {
  const bookId = useBookId();

  return useFetchBook(bookId);
}
