<script setup lang="ts">
import VBookList from '@/components/books/VBookList.vue';
import { useFetchBooks } from '@/hooks/useFetchBooks';
import VBookCreateDialogForm from '@/components/books/VBookCreateDialogForm.vue';
import { useAuth } from '@/hooks/useAuth';
import { useCreateBook } from '@/hooks/useCreateBook';
import type { Book } from '@verso/entity/books/entity.js';

const { books, isLoading } = useFetchBooks();
const { isAdmin } = useAuth();
const { mutate } = useCreateBook();

const onSubmit = (data: Omit<Book, 'bookId'>) => {
  mutate(data);
};
</script>

<template>
  <div class="flex space-x-4 items-start">
    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight">Books</h1>
    <div v-if="isAdmin">
      <VBookCreateDialogForm @submit="onSubmit" />
    </div>
  </div>
  <p v-if="isLoading">Loading...</p>
  <VBookList
    v-else-if="books"
    class="pt-8"
    :books="books"
  />
</template>
