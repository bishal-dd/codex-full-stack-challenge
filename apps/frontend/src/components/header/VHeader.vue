<script setup lang="ts">
import { Book } from 'lucide-vue-next';
import VThemeToggle from './VThemeToggle.vue';
</script>

<template>
  <header class="sticky w-full top-0 h-12 z-40 backdrop-blur border-solid border-b-2">
    <div class="max-w-7xl m-auto flex justify-between items-center h-full">
      <RouterLink :to="{ name: 'books' }">
        <div class="flex space-x-2 items-center ml-2">
          <Book style="color: hsl(var(--primary))" /><span class="text-lg font-semi-bold">verso</span>
        </div>
      </RouterLink>

      <VThemeToggle class="mr-2" />
    </div>
  </header>
</template>
