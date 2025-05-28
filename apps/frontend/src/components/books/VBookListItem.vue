<script setup lang="ts">
import { Card, CardTitle } from '@/components/ui/card';
import CardHeader from '../ui/card/CardHeader.vue';
import CardContent from '../ui/card/CardContent.vue';
import CardDescription from '../ui/card/CardDescription.vue';
import router from '@/router';

const props = defineProps({
  bookId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
});

const onClick = () => {
  router.push({ name: 'book', params: { bookId: props.bookId } });
};
</script>

<template>
  <Card
    class="hover:bg-secondary cursor-pointer"
    @click="onClick"
  >
    <CardHeader>
      <CardTitle>
        {{ props.title }}
      </CardTitle>
      <CardDescription> {{ props.author }} </CardDescription>
    </CardHeader>

    <CardContent />
  </Card>
</template>
