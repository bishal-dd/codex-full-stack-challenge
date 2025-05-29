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
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';

const emits = defineEmits(['submit', 'back']);

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(2).max(50),
    author: z.string().min(2).max(50),
    blurb: z.string().max(250).optional(),
    count: z.number().min(0),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const open = ref(false);

const onSubmit = form.handleSubmit(values => {
  open.value = false;
  emits('submit', values);
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger>
      <Button
        size="icon"
        aria-label="Add Book"
      >
        <Plus stroke-width="3" />
      </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-md">
      <form @submit="onSubmit">
        <DialogHeader>
          <DialogTitle>Add Book</DialogTitle>
          <DialogDescription>Fill out the details to create a new book</DialogDescription>
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
              >Cancel</Button
            >
          </DialogClose>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
