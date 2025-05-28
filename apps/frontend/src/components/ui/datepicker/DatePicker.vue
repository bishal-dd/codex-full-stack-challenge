<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils';
import { DateFormatter, type DateValue, getLocalTimeZone, parseDate } from '@internationalized/date';
import { useVModel } from '@vueuse/core';
import { Calendar as CalendarIcon } from 'lucide-vue-next';
import { parseStringToDateValue } from 'radix-vue/date';
import { computed, ref, type HTMLAttributes } from 'vue';

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
});

const props = defineProps<{
  defaultValue?: string;
  modelValue?: string;
  class?: HTMLAttributes['class'];
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
  defaultValue: props.defaultValue,
});

const dateValue = computed({
  get: () => {
    return modelValue.value ? parseStringToDateValue(modelValue.value, parseDate('2024-12-02')) : undefined;
  },
  set: dateValue => {
    modelValue.value = dateValue
      ? `${dateValue.year}-${padNumber(dateValue.month)}-${padNumber(dateValue.day)}`
      : undefined;
  },
});

function padNumber(value: number) {
  return String(value).padStart(2, '0');
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn('w-[280px] justify-start text-left font-normal', !modelValue && 'text-muted-foreground')"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ modelValue ? df.format(new Date(modelValue)) : 'Pick a date' }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar
        v-model="dateValue"
        initial-focus
      />
    </PopoverContent>
  </Popover>
</template>
