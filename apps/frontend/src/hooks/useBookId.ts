import { computed } from 'vue';

import { useRoute } from 'vue-router';

export const useBookId = () => {
  const route = useRoute();

  return computed(() => {
    return route.params.bookId as string;
  });
};
