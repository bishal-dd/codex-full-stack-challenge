<script setup lang="ts">
import VBookDialogForm from '@/components/books/VBookDialogForm.vue';
import { useCurrentBook } from '@/hooks/useCurrentBook';
import { useUpdateBook } from '@/hooks/useUpdateBook';
import { useBorrowBook } from '@/hooks/useBorrowBook';
import { useReturnBook } from '@/hooks/useReturnBook';
import type { Book } from '@verso/entity/books/entity.js';
import { useAuth } from '@/hooks/useAuth';
import { computed } from 'vue';

const { book, isLoading } = useCurrentBook();
const { mutate } = useUpdateBook();
const { isAdmin, userId } = useAuth();
const { mutate: borrow, isPending: isBorrowing } = useBorrowBook();
const { mutate: returnBook, isPending: isReturning } = useReturnBook();

const hasBorrowed = computed(() => {
  if (!userId) return false;
  return book.value?.borrowers?.includes(userId) ?? false;
});

const canBorrow = computed(() => {
  if (!userId) return false;
  if (!book.value) return false;
  return !isAdmin && book.value?.count > 0 && !book.value?.borrowers?.includes(userId);
});

const handleBorrow = () => {
  if (book.value && userId && !book.value.borrowers?.includes(userId)) {
    borrow({ book: book.value, userId });
  }
};

const handleReturn = () => {
  if (book.value && userId && book.value.borrowers?.includes(userId)) {
    returnBook({ book: book.value, userId });
  }
};

const onSubmit = (data: Book) => {
  mutate(data);
};
</script>

<template>
  <p v-if="isLoading">Loading...</p>
  <template v-else-if="book">
    <div class="flex space-x-4 items-center justify-between">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight">
        {{ book.title }}
      </h1>
      <div v-if="isAdmin">
        <VBookDialogForm
          :initial-title="book.title"
          :initial-author="book.author"
          :initial-blurb="book.blurb"
          :initial-count="book.count"
          :book-id="book.bookId"
          @submit="onSubmit"
        />
      </div>
    </div>

    <h2 class="pl-8 text-m font-bold">{{ book.author }}</h2>
    <h2 class="pl-8 text-m font-bold">{{ book.count }} Copies Available</h2>
    <p class="pt-4">{{ book.blurb }}</p>

    <!-- Borrow Button -->
    <div
      v-if="!isAdmin && book.count > 0 && !book.borrowers?.includes(userId!)"
      class="mt-6 pl-8"
    >
      <button
        @click="handleBorrow"
        :disabled="isBorrowing"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
      >
        <span v-if="isBorrowing">Borrowing...</span>
        <span v-else>Borrow this Book</span>
      </button>
    </div>

    <!-- Return Button -->
    <div
      v-if="!isAdmin && hasBorrowed"
      class="mt-6 pl-8"
    >
      <button
        @click="handleReturn"
        :disabled="isReturning"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
      >
        <span v-if="isReturning">Returning...</span>
        <span v-else>Return this Book</span>
      </button>
    </div>
  </template>
</template>
