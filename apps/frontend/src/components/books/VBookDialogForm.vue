<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { vAutoAnimate } from '@formkit/auto-animate/vue';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Pencil } from 'lucide-vue-next';
import { ref } from 'vue';

const props = defineProps({
  bookId: { type: String, required: true },
  initialTitle: { type: String, required: true },
  initialAuthor: { type: String, required: true },
  initialBlurb: { type: String, required: true },
  initialCount: { type: Number, required: true },
});

const emits = defineEmits(['submit', 'back']);

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(2).max(50),
    author: z.string().min(2).max(50),
    blurb: z.string().max(250),
    count: z.number(),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const open = ref(false);

const onSubmit = form.handleSubmit(values => {
  open.value = false;
  emits('submit', { ...values, bookId: props.bookId });
});

const initaliseForm = () => {
  form.setValues({
    title: props.initialTitle,
    author: props.initialAuthor,
    blurb: props.initialBlurb,
    count: props.initialCount,
  });
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger>
      <Button
        size="icon"
        aria-label="Edit Book"
        @click="initaliseForm"
      >
        <Pencil stroke-width="3" />
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-md">
      <form @submit="onSubmit">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>Make changes to the book</DialogDescription>
        </DialogHeader>
        <div class="flex flex-col items-start gap-4">
          <FormField
            v-slot="{ componentField }"
            name="title"
          >
            <FormItem class="w-full">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Book Title"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="author"
          >
            <FormItem class="w-full">
              <FormLabel>Author</FormLabel>
              <FormControl v-auto-animate>
                <Input
                  type="text"
                  placeholder="Jane Doe"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="count"
          >
            <FormItem class="w-full">
              <FormLabel>Copies Available</FormLabel>
              <FormControl v-auto-animate>
                <Input
                  type="number"
                  placeholder="0"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="blurb"
          >
            <FormItem class="w-full">
              <FormLabel>Blurb</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  rows="5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <DialogFooter class="sm:justify-end gap-2 pt-4">
          <DialogClose as-child>
            <Button
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit"> Submit </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
