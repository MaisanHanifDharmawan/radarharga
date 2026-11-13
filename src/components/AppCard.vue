<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
    <div v-if="$slots.header" class="px-4 py-3 border-b border-slate-100">
      <slot name="header" />
    </div>
    <div class="p-4">
      <slot />
    </div>
  </div>
</template>
