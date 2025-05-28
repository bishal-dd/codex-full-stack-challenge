<script setup lang="ts">
import { RouterView } from 'vue-router';
import { VHeader } from '@/components/header';
import { useAuth } from '@/hooks/useAuth';

useAuth();
</script>

<template>
  <VHeader />
  <div class="overflow-hidden flex flex-col items-center">
    <main class="flex-grow p-8 max-w-4xl w-full">
      <RouterView />
    </main>
  </div>
</template>
