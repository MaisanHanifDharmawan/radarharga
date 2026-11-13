<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'primary'|'secondary'|'ghost'; type?: 'button'|'submit'; disabled?: boolean; loading?: boolean }>(), {
  variant: 'primary', type: 'button', disabled: false, loading: false,
})
</script>
<template>
  <button :type="type" :disabled="disabled || loading" class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition disabled:opacity-50"
    :class="variant==='primary' ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800' : variant==='secondary' ? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800' : 'border-transparent hover:bg-slate-100 text-slate-700'">
    <span v-if="loading" class="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
    <slot />
  </button>
</template>
