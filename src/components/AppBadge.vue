<script setup lang="ts">
defineProps<{ tone?: 'slate'|'green'|'red'|'amber'|'blue' }>()
</script>
<template>
  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border"
    :class="{
      'bg-slate-100 border-slate-200 text-slate-700': !tone || tone==='slate',
      'bg-green-50 border-green-200 text-green-700': tone==='green',
      'bg-red-50 border-red-200 text-red-700': tone==='red',
      'bg-amber-50 border-amber-200 text-amber-700': tone==='amber',
      'bg-blue-50 border-blue-200 text-blue-700': tone==='blue',
    }">
    <slot />
  </span>
</template>
