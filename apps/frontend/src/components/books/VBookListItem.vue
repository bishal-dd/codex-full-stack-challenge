<script setup lang="ts">
import { Card, CardTitle } from '@/components/ui/card';
import CardHeader from '../ui/card/CardHeader.vue';
import CardDescription from '../ui/card/CardDescription.vue';
import router from '@/router';

const props = defineProps({
  bookId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  count: { type: Number, required: true },
});

const onClick = () => {
  router.push({ name: 'book', params: { bookId: props.bookId } });
};
</script>

<template>
  <Card
    class="hover:bg-muted transition-all duration-200 cursor-pointer shadow-sm rounded-xl border border-border p-4"
    @click="onClick"
  >
    <CardHeader class="p-0">
      <div class="flex flex-col gap-1">
        <CardTitle class="text-lg font-semibold text-foreground">
          {{ props.title }}
        </CardTitle>
        <CardDescription class="text-sm text-muted-foreground"> by {{ props.author }} </CardDescription>
        <CardDescription class="text-sm text-muted-foreground"> {{ props.count }} Copies Available </CardDescription>
      </div>
    </CardHeader>
  </Card>
</template>
