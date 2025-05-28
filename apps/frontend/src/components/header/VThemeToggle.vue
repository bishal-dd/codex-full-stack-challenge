<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-vue-next';
import { useColorMode } from '@vueuse/core';

// Pass { disableTransition: false } to enable transitions
const mode = useColorMode();
function setMode(newMode: 'light' | 'dark' | 'auto') {
  mode.value = newMode;
}
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    aria-label="Toggle theme"
    @click="setMode(mode === 'light' ? 'dark' : 'light')"
  >
    <Moon v-show="mode === 'dark'" />
    <Sun v-show="mode === 'light'" />
  </Button>
</template>
