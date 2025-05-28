<script setup lang="ts">
import VBookList from '@/components/books/VBookList.vue';
import { Plus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { useFetchBooks } from '@/hooks/useFetchBooks';

const { books, isLoading } = useFetchBooks();
</script>

<template>
  <div class="flex space-x-4 items-center items-start">
    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight">
      Books
    </h1>
    <Button
      size="icon"
      aria-label="New Book"
    >
      <Plus stroke-width="3" />
    </Button>
  </div>
  <p v-if="isLoading">
    Loading...
  </p>
  <VBookList
    v-else-if="books"
    class="pt-8"
    :books="books"
  />
</template>
