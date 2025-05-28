<script setup lang="ts">
import VBookDialogForm from '@/components/books/VBookDialogForm.vue';
import { useCurrentBook } from '@/hooks/useCurrentBook';
import { useUpdateBook } from '@/hooks/useUpdateBook';
import type { Book } from '@verso/entity/books/entity.js';

const { book, isLoading } = useCurrentBook();
const { mutate } = useUpdateBook();

const onSubmit = (data: Book) => {
  mutate(data);
};
</script>

<template>
  <p v-if="isLoading">
    Loading...
  </p>
  <template v-else-if="book">
    <div class="flex space-x-4 items-center justify-between">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight">
        {{ book.title }}
      </h1>

      <VBookDialogForm
        :initial-title="book.title"
        :initial-author="book.author"
        :initial-blurb="book.blurb"
        :book-id="book.bookId"
        @submit="onSubmit"
      />
    </div>
    <h2 class="pl-8 text-m font-bold">
      {{ book.author }}
    </h2>
    <p class="pt-4">
      {{ book.blurb }}
    </p>
  </template>
</template>
