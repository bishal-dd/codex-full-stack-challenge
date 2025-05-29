<script setup lang="ts">
import type { Book } from '@verso/entity/books/entity.js';
import VBookListItem from './VBookListItem.vue';

defineProps<{
  books: Book[];
}>();
</script>

<template>
  <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
    <template
      v-for="book in books"
      :key="book.bookId"
    >
      <VBookListItem
        :book-id="book.bookId"
        :title="book.title"
        :author="book.author"
        :blurb="book.blurb"
        :count="book.count"
      />
    </template>
  </div>
</template>
