<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>
<template>
  <div class="text-center py-10 px-4">
    <p class="font-medium text-slate-900">{{ title }}</p>
    <p v-if="description" class="text-sm text-slate-500 mt-1 max-w-md mx-auto">{{ description }}</p>
    <div class="mt-4"><slot /></div>
  </div>
</template>
