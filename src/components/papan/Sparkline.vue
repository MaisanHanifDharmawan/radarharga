<script setup lang="ts">
const props = withDefaults(defineProps<{ seri: number[]; lebar?: number; tinggi?: number }>(), { lebar: 96, tinggi: 28 })

function points(): string {
  const s = props.seri
  const min = Math.min(...s), max = Math.max(...s)
  const range = max - min || 1
  const stepX = props.lebar / (s.length - 1 || 1)
  return s.map((v, i) => `${(i * stepX).toFixed(1)},${((1 - (v - min) / range) * (props.tinggi - 4) + 2).toFixed(1)}`).join(' ')
}
const last = () => points().split(' ').pop() ?? ''
const arahTerakhir = () => (props.seri[props.seri.length - 1] >= props.seri[0] ? 'naik' : 'turun')
</script>

<template>
  <svg :viewBox="`0 0 ${lebar} ${tinggi}`" :width="lebar" :height="tinggi" aria-hidden="true" class="block">
    <polyline :points="points()" fill="none" stroke="#12233B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <circle :cx="last().split(',')[0]" :cy="last().split(',')[1]" r="2.5" :fill="arahTerakhir() === 'naik' ? '#C4122F' : '#12703F'" />
  </svg>
</template>
